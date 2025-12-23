import Link from 'next/link';
import { Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  // Image path
  const imagePath = product.image || null;

  const isOriginal = !!product.original_brand;
  
  let stockStatus = { text: 'В наличии', color: 'text-green-600 border-green-600' };
  if (product.quantity <= 0) {
    if (product.in_price_list === 1) {
      stockStatus = { text: 'Под заказ (7 дней)', color: 'text-yellow-600 border-yellow-600' };
    } else {
      stockStatus = { text: 'Под заказ', color: 'text-red-600 border-red-600' };
    }
  }

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border flex flex-col h-full relative">
      <Link href={`/product/${product.vendor_code}`} className="block flex-grow">
        <div className="aspect-square relative bg-gray-100">
          {imagePath ? (
             <img
               src={imagePath}
               alt={product.name}
               className="object-cover w-full h-full group-hover:scale-105 transition"
             />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              No Image
            </div>
          )}
          
          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border bg-white ${isOriginal ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-gray-400'}`}>
              {isOriginal ? 'Оригинал' : 'Аналог'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border bg-white ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
        </div>
        
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition text-sm h-10">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500">Арт: {product.vendor_code}</p>
          <p className="text-lg font-bold text-primary">
            {product.price.toLocaleString('ru-RU')} ₽
          </p>
        </div>
      </Link>

      {/* Add to Cart Button on Card */}
      <div className="px-4 pb-4 mt-auto">
        <button 
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 py-2 rounded-lg transition text-sm font-medium"
        >
          <ShoppingCart className="w-4 h-4" />
          В корзину
        </button>
      </div>
    </div>
  );
}
