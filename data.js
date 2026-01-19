var DATA = {
  brands: [
    {
      name: "BAXI",
      models: [
        "BAXI ECO Four",
        "BAXI MAIN FOUR",
        "BAXI LUNA-3",
        "BAXI LUNA-3 COMFORT",
        "BAXI MAIN",
        "BAXI ECO Classic",
        "BAXI ECO Compact",
        "BAXI ECO Home",
        "BAXI ECO Nova",
        "BAXI ECO-4s",
        "BAXI ECO-5 Compact",
        "BAXI FOURTECH",
        "BAXI MAIN DIGIT",
        "BAXI MAIN-5",
        "BAXI SLIM (напольные котлы)",
      ],
    },
    {
      name: "NAVIEN",
      models: ["NAVIEN ACE / DELUXE", "NAVIEN C / E", "NAVIEN S / ONE"],
    },
    {
      name: "ZONT",
      models: ["ZONT Системы удаленного контроля и регулирования"],
    },
    {
      name: "VAILLANT",
      models: [
        "VAILLANT atmoMAX plus / turboMAX plus /2-5",
        "VAILLANT atmoMAX pro / turboMAX pro /2-3",
        "VAILLANT atmoTEC plus / turboTEC plus /3-5",
        "VAILLANT atmoTEC plus / turboTEC plus /5-5",
        "VAILLANT atmoTEC pro / turboTEC pro /3-3",
        "VAILLANT atmoTEC pro / turboTEC pro /5-3",
        "VAILLANT turboFIT",
      ],
    },
    {
      name: "PROTHERM",
      models: [
        "PROTHERM LYNX HK",
        "PROTHERM ГЕПАРД",
        "PROTHERM ПАНТЕРА",
        "PROTHERM ЯГУАР JTV",
        "PROTHERM ЛЕОПАРД (вер. 17)",
        "PROTHERM РЫСЬ 23 BTVE/BOVE RD",
        "PROTHERM МЕДВЕДЬ KLO",
        "PROTHERM МЕДВЕДЬ KLOM",
        "PROTHERM МЕДВЕДЬ KLZ",
        "PROTHERM МЕДВЕДЬ PLO",
        "PROTHERM МЕДВЕДЬ TLO",
        "PROTHERM СКАТ",
      ],
    },
    {
      name: "VIESSMANN",
      models: [
        "VIESSMANN VITOPEND 100-W (тип A1JB, 2017)",
        "VIESSMANN VITOPEND 100-W (тип WH1D)",
      ],
    },
    {
      name: "BUDERUS",
      models: [
        "BUDERUS LOGAMAX U072",
        "BUDERUS LOGAMAX U012 / U014",
        "BUDERUS LOGAMAX U022 / U024",
        "BUDERUS LOGAMAX U032 / U034",
        "BUDERUS LOGAMAX U042 / U044",
        "BUDERUS LOGAMAX U052 / U054",
        "BUDERUS LOGAMAX U052 / U054 T",
      ],
    },
    {
      name: "CELTIC",
      models: ["CELTIC-DS PLATINUM"],
    },
    {
      name: "ARDERIA",
      models: ["ARDERIA ESR", "ARDERIA серия B", "ARDERIA серия D"],
    },
    {
      name: "DAESUNG",
      models: ["DAESUNG"],
    },
    {
      name: "IMMERGAS",
      models: [
        "IMMERGAS NIKE MYTHOS",
        "IMMERGAS MAJOR",
        "IMMERGAS MINI",
        "IMMERGAS STAR",
      ],
    },
    {
      name: "JUNKERS",
      models: ["JUNKERS BOSCH EUROLINE ZS / ZW"],
    },
    {
      name: "KITURAMI",
      models: [
        "KITURAMI Twin Alpha",
        "KITURAMI World 3000",
        "KITURAMI World 5000",
        "KITURAMI KSG",
        "KITURAMI STSG",
        "KITURAMI TGB 30",
        "KITURAMI World Plus",
      ],
    },
    {
      name: "KOREASTAR",
      models: [
        "KOREASTAR PREMIUM E (Turbo C)",
        "KOREASTAR ACE A/K",
        "KOREASTAR BRAVO E",
        "KOREASTAR BRAVO K",
        "KOREASTAR BURAN",
        "KOREASTAR PREMIUM A/E (Латунная гидрогруппа)",
        "KOREASTAR PREMIUM ES",
        "KOREASTAR PRESIDENT",
        "KOREASTAR SENATOR D",
        "KOREASTAR SENATOR T, TP",
      ],
    },
    {
      name: "MASTER",
      models: ["MASTER GAS SEOUL"],
    },
  ],
  partTypes: [
    "ZONT",
    "Насосы циркуляционные",
    "Первичные теплообменники",
    "Пластинчатые теплообменники для ГВС",
    "Вентиляторы",
    "Клапаны трехходового",
    "Расширительные баки",
    "Сервоприводы трехходового",
    "Датчики протока и расходомеры",
    "Датчики температуры",
    "Прессостаты",
    "Краны подпитки",
    "Реле и датчики давления",
    "Газовые клапаны",
    "Сбросные клапаны",
    "Манометры",
    "Уплотнители и прокладки",
    "Прочее",
  ],
  services: {
    flushing: {
      title: "Промывка систем отопления",
      description: `
                <p>Регулярная промывка системы отопления — залог её долговечности и эффективности. Со временем в трубах и радиаторах накапливаются отложения, которые снижают теплоотдачу и увеличивают расход газа.</p>
                <p>Мы используем профессиональное оборудование и сертифицированные реагенты для бережной и эффективной очистки вашей системы.</p>
                <h3>Преимущества:</h3>
                <ul>
                    <li>Снижение расходов на отопление до 20%</li>
                    <li>Увеличение срока службы котла и насосов</li>
                    <li>Равномерный прогрев радиаторов</li>
                </ul>
            `,
      prices: [
        { name: "Промывка радиатора (за шт.)", price: 1500 },
        { name: "Промывка контура теплого пола (за контур)", price: 2000 },
        { name: "Химическая промывка теплообменника котла", price: 4500 },
        {
          name: "Гидропневматическая промывка системы (до 100 м²)",
          price: 15000,
        },
        { name: "Опрессовка системы", price: 3000 },
      ],
    },
    remote: {
      title: "Удаленное управление отоплением",
      description: `
                <p>Контролируйте климат в вашем доме из любой точки мира с помощью смартфона. Системы удаленного управления позволяют не только видеть текущую температуру, но и менять режимы работы котла, получать уведомления об ошибках и экономить энергоресурсы.</p>
                <p>Мы являемся официальными партнерами ZONT и предлагаем полный комплекс услуг по установке и настройке.</p>
                 <h3>Возможности:</h3>
                <ul>
                    <li>Управление температурой по расписанию</li>
                    <li>Оповещение об отключении электричества</li>
                    <li>Контроль протечек воды</li>
                    <li>Экономия газа до 30%</li>
                </ul>
            `,
      prices: [
        { name: "Монтаж термостата ZONT", price: 5000 },
        { name: "Подключение и настройка Wi-Fi модуля", price: 3000 },
        { name: "Установка датчиков температуры (проводные)", price: 1000 },
        { name: "Установка радиодатчиков", price: 1500 },
        { name: "Настройка сценариев автоматизации", price: 4000 },
        { name: "Комплексный монтаж 'под ключ'", price: 12000 },
      ],
    },
  },
};
