"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, ShoppingCart, Phone, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items, total } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 font-sans">
      {/* TOP ROW: Logo, Search, Cart, Mobile Toggle */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* 1. Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
               <Image 
                 src="/images/logo.svg" 
                 alt="Logo" 
                 fill
                 className="object-contain"
               />
            </div>
            <span className="font-bold text-lg sm:text-xl leading-none text-primary">EZBOILER</span>
          </Link>
          <div className="hidden sm:flex flex-col border-l border-gray-300 pl-3 ml-1">
            <a href="https://yandex.com.tr/maps/-/CLcf7W3G" target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs text-gray-500 hover:text-primary transition-colors">
              г. Владимир, ул. Дзержинского, 9
            </a>
          </div>
        </div>

        {/* 2. Search (Hidden on small mobile, visible on tablet+) */}
        <div className="hidden md:block flex-grow max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="Поиск по каталогу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
            />
            <button type="submit" className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* 3. Right Actions */}
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          
          {/* Contacts Icons (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-3">
             <a href="https://wa.me/79913210733" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
               <Image src="/images/whatsapp.svg" alt="WA" width={24} height={24} />
             </a>
             <a href="https://t.me/boilervladimir" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
               <Image src="/images/telegram.svg" alt="TG" width={24} height={24} />
             </a>
             <a href="mailto:vladimir@boil-r.ru" className="hover:scale-110 transition-transform">
               <Image src="/images/mail.svg" alt="Email" width={24} height={24} />
             </a>
          </div>

          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-primary group transition-all shadow-sm hover:shadow-md">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">{cartCount}</span>
              )}
            </div>
            <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors hidden sm:block">
              {total.toLocaleString('ru-RU')} ₽
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* BOTTOM ROW (Desktop Only): Nav Links & Call Button */}
      <div className="hidden lg:block border-t border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
           <nav className="flex gap-6">
              <Link href="/catalog" className="text-sm font-medium text-gray-700 hover:text-primary transition">Каталог</Link>
              <Link href="/flushing" className="text-sm font-medium text-gray-700 hover:text-primary transition">Промывка систем</Link>
              <Link href="/remote-control" className="text-sm font-medium text-gray-700 hover:text-primary transition">Удаленное управление</Link>
           </nav>
           <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full hover:bg-orange-600 transition-colors shadow-sm text-sm font-medium">
              <Phone className="h-3 w-3" />
              <span>Заказать звонок</span>
           </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4">
           {/* Mobile Search */}
           <form onSubmit={handleSearch} className="relative md:hidden">
            <input
              type="text"
              placeholder="Поиск по каталогу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary"
            />
            <button type="submit" className="absolute left-3 top-3.5 h-5 w-5 text-gray-400">
              <Search className="h-5 w-5" />
            </button>
          </form>

          <nav className="flex flex-col gap-2">
            <Link href="/catalog" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-800">Каталог</Link>
            <Link href="/flushing" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-800">Промывка систем</Link>
            <Link href="/remote-control" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-800">Удаленное управление</Link>
          </nav>

          <div className="border-t border-gray-100 pt-4">
             <div className="flex flex-col gap-3">
               <a href="tel:+79913210733" className="text-lg font-bold text-gray-900">+7 (991) 321-07-33</a>
               <div className="flex gap-4">
                  <a href="https://wa.me/79913210733" target="_blank" rel="noopener noreferrer">
                    <Image src="/images/whatsapp.svg" alt="WA" width={24} height={24} />
                  </a>
                  <a href="https://t.me/boilervladimir" target="_blank" rel="noopener noreferrer">
                    <Image src="/images/telegram.svg" alt="TG" width={24} height={24} />
                  </a>
                  <a href="mailto:vladimir@boil-r.ru">
                    <Image src="/images/mail.svg" alt="Email" width={24} height={24} />
                  </a>
               </div>
               <button className="w-full mt-2 py-3 bg-primary text-white rounded-xl font-bold shadow-md">
                 Заказать звонок
               </button>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
