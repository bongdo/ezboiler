
import AddToCartButton from '@/components/AddToCartButton';
import { getProduct, getProducts, Product } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  // Fetch ALL products to generate paths
  const products = await getProducts();
  return products.map((product: Product) => ({
    slug: product.vendor_code.split('/'), // Handle slashes in vendor_code
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const vendorCode = slug.map(s => decodeURIComponent(s)).join('/');
  
  const product = await getProduct(vendorCode);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-4 rounded-lg border">
           {product.image ? (
             <img
               src={product.image}
               alt={product.name}
               className="w-full h-auto rounded"
             />
           ) : (
             <div className="h-96 bg-gray-100 flex items-center justify-center">No Image</div>
           )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">Артикул: {product.vendor_code}</p>
          
          <p className="text-2xl font-bold text-primary mb-6">
            {product.price.toLocaleString('ru-RU')} ₽
          </p>
          
          <div className="mb-8">
            <AddToCartButton product={product} />
          </div>

          <div className="prose max-w-none mb-8">
            <h3 className="font-bold text-lg mb-2">Описание</h3>
            <p>{product.description}</p>
          </div>

          {product.compatible_boilers && product.compatible_boilers.length > 0 && (
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-2">Совместимость</h3>
              <ul className="list-disc pl-5">
                {product.compatible_boilers.map((boiler: string, idx: number) => (
                  <li key={idx}>{boiler}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
