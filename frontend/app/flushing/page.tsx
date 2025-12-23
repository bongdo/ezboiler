import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Промывка системы отопления – Котельная Просто',
  description: 'Профессиональная промывка систем отопления во Владимире и области. Комплексная, химическая и профилактическая промывка. Доступные цены, гарантия качества.',
};

export default function FlushingPage() {
  return (
    <div className="bg-white text-slate-900 font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-white z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-primary text-sm font-semibold tracking-wide uppercase">
            Профессиональный сервис
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-slate-900 tracking-tight leading-tight">
            Промывка системы <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">отопления</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Верните тепло и уют в ваш дом. Оставьте заявку на гидропневматическую промывку, и наш специалист свяжется с вами!
          </p>
          <Link
            href="https://wa.me/79913210733"
            target="_blank"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-primary to-orange-500 rounded-full hover:from-orange-600 hover:to-orange-500 hover:shadow-2xl hover:shadow-orange-500/30 transform hover:-translate-y-1"
          >
            Оставить заявку
          </Link>
        </div>
      </section>

      {/* Prices Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="mb-16 text-center">
            <h3 className="text-4xl font-bold mb-6 text-slate-900">Стоимость услуг</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Прозрачное ценообразование. В выходные и праздничные дни стоимость выездных работ увеличивается на 20%.
            </p>
          </div>

          <div className="overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 ring-1 ring-slate-900/5">
            <div className="p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <h4 className="text-2xl font-bold text-slate-800">Прайс-лист</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-100">
                    <th className="p-6 font-semibold">Вид промывки</th>
                    <th className="p-6 font-semibold text-center">Ед. изм.</th>
                    <th className="p-6 font-semibold text-right">Цена</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-orange-50/30 transition-colors duration-200 group">
                    <td className="p-6 text-slate-800 font-semibold text-lg group-hover:text-primary transition-colors">Комплексная</td>
                    <td className="p-6 text-center text-slate-500">м²</td>
                    <td className="p-6 text-right text-slate-900 font-bold text-xl">300₽</td>
                  </tr>
                  <tr className="hover:bg-orange-50/30 transition-colors duration-200 group">
                    <td className="p-6 text-slate-800 font-semibold text-lg group-hover:text-primary transition-colors">Профилактическая</td>
                    <td className="p-6 text-center text-slate-500">м²</td>
                    <td className="p-6 text-right text-slate-900 font-bold text-xl">300₽</td>
                  </tr>
                  <tr className="hover:bg-orange-50/30 transition-colors duration-200 group">
                    <td className="p-6 text-slate-800 font-semibold text-lg group-hover:text-primary transition-colors">Химическая</td>
                    <td className="p-6 text-center text-slate-500">м²</td>
                    <td className="p-6 text-right text-slate-900 font-bold text-xl">500₽</td>
                  </tr>
                  <tr className="hover:bg-orange-50/30 transition-colors duration-200 group">
                    <td className="p-6 text-slate-800 font-semibold text-lg group-hover:text-primary transition-colors">Химическая с заменой теплоносителя</td>
                    <td className="p-6 text-center text-slate-500">м²</td>
                    <td className="p-6 text-right text-slate-900 font-bold text-xl">300₽</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <h3 className="text-4xl font-bold mb-16 text-center text-slate-900">Почему выбирают нас?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                id: '01',
                title: '7 Лет Опыта',
                desc: 'Профессиональная установка, ремонт и обслуживание котлов любой сложности.',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                )
              },
              {
                id: '02',
                title: 'Быстрый Выезд',
                desc: 'Выезжаем в день обращения или записываем на удобное для вас время.',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                )
              },
              {
                id: '03',
                title: 'Честная Гарантия',
                desc: 'Предоставляем гарантию на все выполненные работы и установленные запчасти.',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                )
              },
              {
                id: '04',
                title: 'Доступные Цены',
                desc: 'Широкий спектр услуг по ценам, которые вас приятно удивят.',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                )
              },
            ].map((item) => (
              <div key={item.id} className="group bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      {React.cloneElement(item.icon, { className: "w-7 h-7 transition-colors duration-300 group-hover:text-white text-primary" })}
                    </div>
                    <span className="text-5xl font-bold text-slate-100 absolute right-4 top-4 select-none pointer-events-none group-hover:text-orange-50 transition-colors">{item.id}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-700"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">Готовы промыть систему?</h3>
          <p className="text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
            Оставьте заявку прямо сейчас, и мы свяжемся с вами для уточнения деталей.
          </p>
          <Link
            href="https://wa.me/79913210733"
            target="_blank"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-primary transition-all duration-300 bg-white rounded-full hover:bg-orange-50 hover:shadow-2xl hover:shadow-black/20 transform hover:-translate-y-1"
          >
            Оставить заявку
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">Информация</h3>
          
          <div className="mb-12">
            <h4 className="text-2xl font-bold text-slate-800 mb-4">Промывка системы отопления</h4>
            <p className="text-slate-600 mb-6">
              В наш сервисный центр часто обращаются с вопросами, касающимися внутреннего состояния труб и отопительных приборов. Цена промывки отопления в Московской области существенна для большинства домовладельцев. При этом на сайтах фирм предлагающих эту услугу можно найти рекомендации промывать систему чуть ли не два раза в год! Так ли это? Попробуем ответить.
            </p>
            <p className="text-slate-600 mb-6">
              Отопительную систему загородного дома можно условно разделить на две основные части. Одна часть отвечает за генерацию тепла посредством сжигания топлива или преобразования электрической энергии, это котел и все что обеспечивает его работу (автоматика, группа безопасности). Другая часть отвечает за распределение тепла по помещениям. Сюда относятся радиаторы (батареи), конвекторы, теплые полы и трубопроводы которые соединяют отопительные приборы с теплогенератором. Так же можно выделить горячее водоснабжение и подогрев бассейна.
            </p>
            <p className="text-slate-600 mb-6">
              За перенос тепла в системе отвечает жидкий теплоноситель – вода, подготовленная вода или антифриз. Нагреваясь в котле, он движется по трубам до отопительных приборов, которые являются теплообменники. Радиатор передает тепло от теплоносителя воздуху в комнате. Змеевик бойлера косвенного нагрева – воде ГВС и т. д.
            </p>
            <p className="text-slate-600">
              Замкнутый маршрут из трубопроводов и отопительных приборов называется отопительным контуром. В простейшем случае в системе один контур, состоящий из труб и группы радиаторов. Обычно их как минимум два: отопление и бойлер ГВС.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="text-2xl font-bold text-slate-800 mb-4">Как засоряется система?</h4>
            <p className="text-slate-600 mb-4">
              Казалось бы, откуда в замкнутом контуре взяться загрязнениям? Тем не менее, они появляются. Виды и количество загрязнений зависит от типа труб и батарей, вида и температуры теплоносителя, общего качества проектирования системы.
            </p>
            <ul className="list-none space-y-4 pl-0">
              {[
                "шлам, ржавчина образуется преимущественно в контурах из черного металла и чугунных радиаторах. С ходом теплоносителя может попасть в теплообменник котла, вывести из строя циркуляционные насосы",
                "отложения солей, накипь образуются при использовании в качестве теплоносителя жесткой воды или разбавления такой водой антифриза. Такого рода отложения в основном образуются в местах сильного нагрева, таких как теплообменники",
                "продукты высокотемпературного разложения антифриза. Производители заявляют, что их теплоноситель на 100% защищает систему от всего на свете. Но на практике встречаются очень устойчивые отложения специфические для систем, заполненных антифризом",
                "разнообразная органика, бактерии, грибок. В системах с закрытой циркуляцией встречается редко. Подходящие условия для развития грибка и бактерий могут быть в бойлере ГВС и расширительных баках"
              ].map((item, idx) => (
                 <li key={idx} className="flex gap-3 text-slate-600">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-primary flex items-center justify-center text-sm font-bold mt-0.5">{idx + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 mt-4">
              Так же промывка системы может потребоваться после выполнения, каких либо монтажных работ. В трубы может попадать флюс, окалина, металлическая стружка и другие твердые частицы.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="text-2xl font-bold text-slate-800 mb-4">Как понять, что требуется промывка?</h4>
            <p className="text-slate-600 mb-4">
              Как мы уже упоминали, стоимость промывки системы отопления частного дома довольно значительна. Это связанно с трудоемкостью процесса. Как правило, на средний коттедж уходит день работы двух специалистов. Поэтому выполнять очистку каждый год мы не советуем, в этом нет никакого смысла. При нормальных условиях эксплуатации промывку выполняют раз в 3-6 лет или если в работе системы наблюдаются неполадки и диагностика показала что дело в отложениях. Какие признаки могут указывать на то, что система забилась?
            </p>
            <ul className="list-none space-y-3 pl-0">
              {[
                "повышенный расход топлива",
                "перестают греть отдельные контуры или их части, например теплый пол",
                "грязевики постоянно забиваются",
                "котел перегревается, а радиаторы или конвекторы холодные или слегка теплые",
                "неприятный запах от воды ГВС",
                "при работе котел издает шум (хлопки, гул)"
              ].map((item, idx) => (
                 <li key={idx} className="flex gap-3 text-slate-600">
                   <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 mt-4">
              Нужно отметить, что перечисленные симптомы обычно не появляются внезапно, а нарастают постепенно, по мере «Зарастания» системы. Многие домовладельцы не замечают их, пока не выйдет из строя котел, насос или другое оборудование. Если вам кажется что с отоплением что, то не так вызовите мастера для диагностики или попросите оценить состояние системы при проведении ежегодного ТО.
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-slate-800 mb-4">Преимущества</h4>
            <p className="text-slate-600">
               Чистая система отопления это низкий расход топлива и надежная работа оборудования, а значит комфортное проживание в загородном доме коттедже или даче. При этом мы рекомендуем нашим клиентам выполнять данный вид обслуживания только после тщательной диагностики системы при реальной необходимости. Непрофессиональная промывка может привести к ухудшению ситуации, например, осадок из труб может забить теплообменник котла (особенно актуально для конденсационных моделей) и другим нежелательным последствиям. Проконсультироваться с инженером и рассчитать какая будет цена на промывку системы отопления в Москве или МО можно по телефону сервисной службы <a href="tel:+74922552288" className="text-primary hover:text-orange-700 font-medium">+7 (4922) 55-22-88</a> или оставив заявку на нашем сайте.
            </p>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section className="py-16 px-4 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold mb-12 text-center text-slate-900">Контактная информация</h3>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 h-full">
                <h4 className="text-lg font-bold text-slate-900 mb-3">Контакты</h4>
                
                <div className="mb-6">
                  <h5 className="font-semibold text-slate-700 mb-1">Адрес</h5>
                  <p className="text-slate-600">
                    Владимир, ул. Дзержинского д. 9<br />
                    ТЦ Унистрой (цокольный этаж)
                  </p>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold text-slate-700 mb-1">Телефон</h5>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+74922552288" className="text-primary hover:text-orange-700 font-medium transition-colors">
                      +7 (4922) 55-22-88
                    </a>
                    <a href="tel:+79913210733" className="text-primary hover:text-orange-700 font-medium transition-colors">
                      +7 991 321-07-33
                    </a>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-700 mb-1">E-mail</h5>
                  <a href="mailto:vladimir@boil-r.ru" className="text-primary hover:text-orange-700 font-medium transition-colors">
                    vladimir@boil-r.ru
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 h-full min-h-[362px]">
                <iframe 
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3Af819308349926d7d79125bd711915055ca38dd7ca45fa1c5f55babf4a9f5c1e8&amp;source=constructor" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0"
                  className="w-full h-full min-h-[362px]"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
