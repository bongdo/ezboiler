import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Contacts */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-primary">Контакты</h3>
            <div className="space-y-4 text-gray-300">
              <p className="flex flex-col">
                <a href="tel:+74922552288" className="hover:text-white transition">+7 (4922) 55-22-88</a>
                <a href="tel:+79913210733" className="hover:text-white transition">+7 (991) 321-07-33</a>
              </p>
              <p>
                г. Владимир,<br />
                ул. Дзержинского, 9
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-4">
                <a href="https://wa.me/79913210733" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                  <Image src="/images/whatsapp.svg" alt="WhatsApp" width={24} height={24} className="invert" />
                </a>
                <a href="https://t.me/boilervladimir" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                  <Image src="/images/telegram.svg" alt="Telegram" width={24} height={24} className="invert" />
                </a>
                <a href="mailto:vladimir@boil-r.ru" className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                  <Image src="/images/mail.svg" alt="Email" width={24} height={24} className="invert" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Information */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-primary">Информация</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/delivery" className="hover:text-white transition">Условия доставки</Link></li>
              <li><Link href="/ordering" className="hover:text-white transition">Правила оформления</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Возврат</Link></li>
              <li><Link href="/contacts" className="hover:text-white transition">Контакты</Link></li>
            </ul>
          </div>

          {/* Column 3: Catalog (Optional, keeping it simple or empty as per request focus) */}
           <div>
            <h3 className="text-xl font-bold mb-6 text-primary">Каталог</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/parts" className="hover:text-white transition">Запчасти для котлов</Link></li>
              <li><Link href="/flushing" className="hover:text-white transition">Промывка систем</Link></li>
              <li><Link href="/remote-control" className="hover:text-white transition">Удаленное управление</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            © КотельнаяПросто, 2022 - {new Date().getFullYear()}. Все права защищены.
          </div>
          <Link href="/privacy" className="hover:text-gray-300 transition">
            Обработка персональных данных
          </Link>
        </div>
      </div>
    </footer>
  );
}
