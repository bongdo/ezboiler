'use client';

import { getProducts, getFilters, Product, Filters } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Params
  const q = searchParams.get('q') || '';
  const typeId = searchParams.get('type_id');
  const boilerId = searchParams.get('boiler_id');
  const isUsed = searchParams.get('is_used');
  const isOriginal = searchParams.get('is_original');

  // Main Page Params (brand/model) -> We need to map these to boiler_id if possible
  // However, the backend expects boiler_id. 
  // If the main page sends brand/model names, we need to find the boiler_id.
  // Since we don't have a "getBoilerIdByName" API yet, we might need to rely on the user selecting from the filter
  // OR we update the backend to filter by boiler name.
  // For now, let's assume the main page needs to be updated to send boiler_id, OR we try to match it here.
  // Actually, the main page sends `?brand=...&model=...`.
  // Let's check if we can filter by name in the backend? No, `GetParts` uses IDs.
  // Let's fetch all boilers and find the ID matching the model name.
  const brandParam = searchParams.get('brand');
  const modelParam = searchParams.get('model');

  useEffect(() => {
    // Reset products when filters change (except offset)
    setProducts([]);
    setOffset(0);
    setHasMore(true);
    setLoading(true);
  }, [q, typeId, boilerId, isUsed, isOriginal, brandParam, modelParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Filters first if not loaded
        let currentFilters = filters;
        if (!currentFilters) {
          currentFilters = await getFilters();
          setFilters(currentFilters);
        }

        // 2. Resolve Boiler ID from Model Name if needed
        let resolvedBoilerId = boilerId ? Number(boilerId) : undefined;
        if (!resolvedBoilerId && modelParam && currentFilters) {
          const found = currentFilters.boilers.find(b => b.name === modelParam);
          if (found) resolvedBoilerId = found.id;
        }

        // 3. Fetch Products
        const limit = 50;
        const newProducts = await getProducts({
          q,
          type_id: typeId ? Number(typeId) : undefined,
          boiler_id: resolvedBoilerId,
          is_used: isUsed === 'true' ? true : (isUsed === 'false' ? false : undefined),
          is_original: isOriginal === 'true' ? true : (isOriginal === 'false' ? false : undefined),
          limit,
          offset
        });

        if (newProducts.length < limit) {
          setHasMore(false);
        }

        setProducts(prev => offset === 0 ? newProducts : [...prev, ...newProducts]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, typeId, boilerId, isUsed, isOriginal, brandParam, modelParam, offset]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset offset on filter change
    params.delete('offset');
    router.push(`/catalog?${params.toString()}`);
  };

  const loadMore = () => {
    setOffset(prev => prev + 50);
  };

  // Resolve Boiler Name for Title
  const boilerName = filters?.boilers.find(b => b.id === Number(boilerId))?.name;
  const title = boilerName ? `Каталог запчастей для ${boilerName}` : 'Каталог запчастей';

  if (loading && products.length === 0) return <div className="container mx-auto p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          
          {/* Part Type */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold mb-3">Тип запчасти</h3>
            <select 
              className="w-full p-2 border rounded"
              value={typeId || ''}
              onChange={(e) => handleFilterChange('type_id', e.target.value)}
            >
              <option value="">Все типы</option>
              {filters?.part_types.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Boiler */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold mb-3">Совместимость с котлом</h3>
            <select 
              className="w-full p-2 border rounded"
              value={boilerId || ''}
              onChange={(e) => handleFilterChange('boiler_id', e.target.value)}
            >
              <option value="">Все модели</option>
              {filters?.boilers.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold mb-3">Состояние</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="is_used" 
                  checked={!isUsed}
                  onChange={() => handleFilterChange('is_used', '')}
                />
                <span>Любое</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="is_used" 
                  checked={isUsed === 'false'}
                  onChange={() => handleFilterChange('is_used', 'false')}
                />
                <span>Новое</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="is_used" 
                  checked={isUsed === 'true'}
                  onChange={() => handleFilterChange('is_used', 'true')}
                />
                <span>Б/У</span>
              </label>
            </div>
          </div>

          {/* Origin */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold mb-3">Происхождение</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="is_original" 
                  checked={!isOriginal}
                  onChange={() => handleFilterChange('is_original', '')}
                />
                <span>Любое</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="is_original" 
                  checked={isOriginal === 'true'}
                  onChange={() => handleFilterChange('is_original', 'true')}
                />
                <span>Оригинал</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="is_original" 
                  checked={isOriginal === 'false'}
                  onChange={() => handleFilterChange('is_original', 'false')}
                />
                <span>Аналог</span>
              </label>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Товары не найдены</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((p) => (
                  <ProductCard key={p.vendor_code} product={p} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center">
                  <button 
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-full transition"
                  >
                    {loading ? 'Загрузка...' : 'Загрузить еще'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-8">Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
