'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
        <p className="text-gray-600 mb-8">Вы еще ничего не добавили в корзину.</p>
        <Link href="/catalog" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-rose-700 transition">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items List */}
        <div className="flex-grow space-y-4">
          {items.map((item) => (
            <div key={item.vendor_code} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                )}
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <Link href={`/product/${item.vendor_code}`} className="font-bold text-lg hover:text-primary transition">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">Артикул: {item.vendor_code}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-medium">{item.quantity} шт.</span>
                <span className="font-bold text-lg whitespace-nowrap">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                <button 
                  onClick={() => removeItem(item.vendor_code)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-right">
            <button 
              onClick={clearCart}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Очистить корзину
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
            <h3 className="text-xl font-bold mb-4">Итого</h3>
            <div className="flex justify-between mb-2">
              <span>Товары ({items.length})</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="border-t my-4 pt-4 flex justify-between font-bold text-xl">
              <span>К оплате</span>
              <span className="text-primary">{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            
            <button className="w-full bg-primary hover:bg-rose-700 text-white font-bold py-3 rounded-full transition mb-4">
              Оформить заказ
            </button>
            <p className="text-xs text-gray-500 text-center">
              Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
