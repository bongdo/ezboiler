'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/api';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button 
      onClick={() => addItem(product)}
      className="bg-primary hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-full transition w-full md:w-auto"
    >
      Добавить в корзину
    </button>
  );
}
