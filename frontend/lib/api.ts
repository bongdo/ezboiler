
import { db, auth } from './firebase';
import { ref, get, child } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';

const DB_REF = ref(db);

export interface Product {
    vendor_code: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    part_type: string;
    original_brand_id?: number;
    original_brand?: string;
    in_price_list: number;
    compatible_boilers?: string[];
}

export interface Filters {
    part_types: { id: number; name: string }[];
    brands: { id: number; name: string }[];
    boilers: { id: number; brand_id: number; name: string }[];
}


// Helper to convert Firebase object/array to array
function toArray<T>(data: any): T[] {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter(item => item != null);
    return Object.values(data);
}

// Helper to get fallback data
async function getFallbackData() {
    console.warn("Using fallback data from products.json");
    if (typeof window === 'undefined') {
        try {
            const fs = await import('fs/promises');
            const path = await import('path');
            const filePath = path.join(process.cwd(), 'public', 'products.json');
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            console.error("Server fallback error", e);
            throw e;
        }
    } else {
        try {
            const res = await fetch('/products.json');
            if (!res.ok) throw new Error("Fallback fetch failed");
            return res.json();
        } catch (e) {
            console.error("Client fallback error", e);
            throw e;
        }
    }
}

// Fetch all necessary data at once (caching strategy could be added later)
async function fetchFullData() {
    try {
        if (!auth.currentUser) {
           await signInAnonymously(auth);
        }

        const [productsSnap, partTypesSnap, brandsSnap, boilersSnap, partsBoilersSnap] = await Promise.all([
            get(child(DB_REF, 'parts')), 
            get(child(DB_REF, 'part_types')),
            get(child(DB_REF, 'brands')),
            get(child(DB_REF, 'boilers')),
            get(child(DB_REF, 'parts_boilers'))
        ]);

        const productsRaw = toArray<any>(productsSnap.val());
        const partTypes = toArray<{id: number, name: string}>(partTypesSnap.val());
        const brands = toArray<{id: number, name: string}>(brandsSnap.val());
        const boilers = toArray<{id: number, brand_id: number, name: string}>(boilersSnap.val());
        const partsBoilers = toArray<{part_code: string, boiler_id: number}>(partsBoilersSnap.val());

        // Create Lookups
        const partTypeMap = new Map(partTypes.map(pt => [pt.id, pt.name]));
        const brandMap = new Map(brands.map(b => [b.id, b.name]));
        const boilerMap = new Map(boilers.map(b => [b.id, b]));

        // Join Data
        const boilerNamesByPart = new Map<string, string[]>();
        const boilerIdsByPart = new Map<string, Set<number>>();

        partsBoilers.forEach(pb => {
            if (!boilerIdsByPart.has(pb.part_code)) boilerIdsByPart.set(pb.part_code, new Set());
            boilerIdsByPart.get(pb.part_code)?.add(pb.boiler_id);
            
            const b = boilerMap.get(pb.boiler_id);
            if (b) {
                if (!boilerNamesByPart.has(pb.part_code)) boilerNamesByPart.set(pb.part_code, []);
                boilerNamesByPart.get(pb.part_code)?.push(b.name);
            }
        });

        const products: Product[] = productsRaw.map(p => {
            return {
                vendor_code: p.vendor_code,
                name: p.name,
                description: p.description,
                price: p.price,
                quantity: p.quantity,
                image: p.image, 
                part_type: partTypeMap.get(p.part_type_id) || '',
                original_brand_id: p.original_brand_id,
                original_brand: p.original_brand_id ? brandMap.get(p.original_brand_id) : undefined,
                in_price_list: p.in_price_list,
                compatible_boilers: boilerNamesByPart.get(p.vendor_code) || [],
                _boiler_ids: boilerIdsByPart.get(p.vendor_code) || new Set(),
                _part_type_id: p.part_type_id,
                _is_used: p.is_used === 1,
                _is_original: !!p.original_brand_id 
            } as Product & { _boiler_ids: Set<number>, _part_type_id: number, _is_used: boolean, _is_original: boolean };
        });

        return { products, filters: { part_types: partTypes, brands, boilers } };

    } catch (e) {
        console.error("Firebase fetch error, retrying with fallback...", e);
        const fallback = await getFallbackData();
        
        // Re-process fallback data if needed?
        // Fallback JSON is already formatted as { products, filters } from python export.
        // But the python export outputted `_boiler_ids` as arrays (JSON).
        // We need to convert `_boiler_ids` to Set for filtering logic in `getProducts`.
        
        const rawProducts: any[] = fallback.products;
        const processedProducts: Product[] = rawProducts.map((p: any) => ({
            ...p,
            _boiler_ids: new Set(p._boiler_ids || [])
        })) as unknown as Product[];
        
        return { 
            products: processedProducts, 
            filters: fallback.filters as Filters
        };
    }
}

export async function getProducts(params?: { q?: string; type_id?: number; boiler_id?: number; is_used?: boolean; is_original?: boolean; limit?: number; offset?: number }) {
    try {
        const { products } = await fetchFullData();
        
        // Filter
        let result = products;

        if (params) {
            if (params.q) {
                const q = params.q.toLowerCase();
                result = result.filter((p: Product) => 
                    p.name.toLowerCase().includes(q) || 
                    p.vendor_code.toLowerCase().includes(q) ||
                    (p.original_brand && p.original_brand.toLowerCase().includes(q))
                );
            }
            if (params.type_id) {
                result = result.filter((p: Product) => (p as any)._part_type_id === params.type_id);
            }
            if (params.boiler_id) {
                result = result.filter((p: Product) => (p as any)._boiler_ids.has(params.boiler_id!));
            }
            if (params.is_used !== undefined) {
                result = result.filter((p: Product) => (p as any)._is_used === params.is_used);
            }
            if (params.is_original !== undefined) {
                // If is_original is true, we want original_brand_id key present?
                // The previous logic for is_original depends on definition.
                // Migration script: original_brand_id IS NOT NULL -> original.
                // There is no explicit is_original column in parts table except implicit
                // but let's assume existence of original_brand_id means original.
                // Wait, params.is_original logic in `convert_xml_to_sqlite.py`:
                // "Determine original_brand_id ... if found ... break"
                // It doesn't set a is_original boolean column.
                // So checking original_brand_id is correct.
                if (params.is_original) {
                   result = result.filter((p: Product) => !!p.original_brand_id);
                } else {
                   // If is_original is false, it means "Analog"
                   result = result.filter((p: Product) => !p.original_brand_id); 
                }
            }
        }

        // Pagination
        // Since we did full fetch, we simulate pagination
        const limit = params?.limit || 50;
        const offset = params?.offset || 0;
        
        return result.slice(offset, offset + limit);

    } catch (e) {
        console.error("Error fetching products", e);
        return [];
    }
}

export async function getProduct(id: string) {
    try {
        // Use fetchFullData to utilize fallback logic if Firebase fails
        const { products } = await fetchFullData();
        return products.find(p => p.vendor_code === id) || null;
    } catch (e) {
        console.error("Error fetching product", e);
        return null;
    }
}

export async function getFilters() {
    try {
        const { filters } = await fetchFullData();
        return filters;
    } catch (e) {
        console.error(e);
        return { part_types: [], brands: [], boilers: [] };
    }
}
