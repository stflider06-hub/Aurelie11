/* =========================================================
   AURELIE BEAUTY STUDIO — SCRIPT
   Vanilla JS only. No dependencies, no backend.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADING SCREEN ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 400);
  });
  // Fallback in case 'load' already fired or is slow
  setTimeout(() => loader && loader.classList.add('is-hidden'), 2500);

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive:true });

  /* ---------- STICKY HEADER ---------- */
  const header = document.getElementById('header');
  function updateHeader(){
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  }
  document.addEventListener('scroll', updateHeader, { passive:true });
  updateHeader();

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop){
    function updateBackToTop(){
      backToTop.classList.toggle('is-visible', window.scrollY > 600);
    }
    document.addEventListener('scroll', updateBackToTop, { passive:true });
    backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  }

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav){
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('is-visible'), (i % 4) * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- HERO PARALLAX ---------- */
  const parallaxEl = document.querySelector('[data-parallax]');
  if (parallaxEl){
    document.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.25;
      parallaxEl.style.transform = `translateY(${offset}px)`;
    }, { passive:true });
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat__num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1600;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = decimals ? value.toFixed(decimals) : Math.floor(value);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = decimals ? target.toFixed(decimals) : target;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- BUTTON RIPPLE ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      this.style.setProperty('--rx', (e.clientX - rect.left) + 'px');
      this.style.setProperty('--ry', (e.clientY - rect.top) + 'px');
      this.classList.remove('rippling');
      void this.offsetWidth;
      this.classList.add('rippling');
    });
  });

  /* ---------- DARK / LIGHT MODE (segmented sun/moon switch) ---------- */
  const themeSwitch = document.getElementById('themeSwitch');
  const root = document.documentElement;
  const savedTheme = localStorageSafeGet('aurelie-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);

  if (themeSwitch){
    const themeBtns = themeSwitch.querySelectorAll('.theme-switch__btn');
    function updateThemeButtons(){
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      themeBtns.forEach(btn => btn.classList.toggle('is-active', btn.dataset.themeChoice === current));
    }
    updateThemeButtons();
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.themeChoice;
        root.setAttribute('data-theme', choice);
        localStorageSafeSet('aurelie-theme', choice);
        updateThemeButtons();
      });
    });
  }
  // Safe localStorage wrapper (works in normal browser use; artifacts environments may restrict it)
  function localStorageSafeGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
  function localStorageSafeSet(key, val){ try { localStorage.setItem(key, val); } catch(e){ /* ignore */ } }

  /* ---------- LANGUAGE SWITCHER (EN / RU) ---------- */
  const translations = {
    ru: {
      nav_home:"Главная", nav_about:"О нас", nav_services:"Услуги", nav_gallery:"Галерея",
      nav_team:"Команда", nav_reviews:"Отзывы", nav_faq:"Вопросы", nav_contact:"Контакты", nav_book:"Записаться",
      hero_eyebrow:"— С 2014 года · Студия в центре города",
      hero_title_1:"Красота, продуманная", hero_title_2:"до мельчайших деталей.",
      hero_subtitle:"Частная студия для волос, кожи, ногтей и спа-ритуалов — created сертифицированными специалистами.",
      hero_cta_book:"Записаться", hero_cta_call:"Позвонить",
      badge_certified:"Сертифицированные мастера", badge_premium:"Премиум-косметика", badge_sterile:"Стерильные инструменты",
      stat_years:"лет опыта", stat_clients:"довольных клиентов", stat_rating:"средний рейтинг", stat_procedures:"процедур выполнено",
      about_eyebrow:"— Наша история", about_title:"Студия, построенная на тихой уверенности",
      about_text:"Aurelie началась в 2014 году с двух кресел и простой идеи: уход за собой должен ощущаться как ритуал, а не как транзакция.",
      about_quote:"«Мы не гонимся за трендами. Мы подчёркиваем то, что уже вам идёт»",
      about_quote_author:"— Камилла Лоран, основательница",
      about_val_1:"Индивидуальная консультация перед каждой процедурой",
      about_val_2:"Только профессиональная, без тестирования на животных косметика",
      about_val_3:"Постоянное обучение современным техникам",
      tl_1_title:"2014 — Первое кресло", tl_1_text:"Открыли первую студию на два кресла в центре.",
      tl_2_title:"2018 — Полноценная студия", tl_2_text:"Расширились до волос, ногтей, кожи и спа.",
      tl_3_title:"2026 — 5000+ клиентов", tl_3_text:"Команда из двенадцати специалистов.",
      why_eyebrow:"— Почему Aurelie", why_title:"Детали, которые имеют значение",
      why_1_t:"Сертифицированные мастера", why_1_p:"Каждый стилист имеет международную лицензию.",
      why_2_t:"Премиум-косметика", why_2_p:"Используем только профессиональные линии.",
      why_3_t:"Стерильные инструменты", why_3_p:"Стерилизация госпитального уровня.",
      why_4_t:"Комфортная атмосфера", why_4_p:"Тихое, приватное пространство для отдыха.",
      why_5_t:"Честные цены", why_5_p:"Прозрачные тарифы без скрытых доплат.",
      why_6_t:"Современные техники", why_6_p:"Постоянное обучение новым методам.",
      why_7_t:"Быстрая запись", why_7_p:"Забронируйте время онлайн за минуту.",
      why_8_t:"Индивидуальный подход", why_8_p:"План процедур строится вокруг вас.",
      services_eyebrow:"— Что мы предлагаем", services_title:"Фирменные услуги",
      services_sub:"От точной стрижки до целого спа-дня — каждая услуга бронируется как приватный визит.",
      srv_1_t:"Фирменная стрижка", srv_1_p:"Точная стрижка с укладкой и консультацией.",
      srv_2_t:"Окрашивание волос", srv_2_p:"Полное окрашивание, балаяж или коррекция корней.",
      srv_3_t:"Укладка волос", srv_3_p:"Укладки и причёски для мероприятий.",
      srv_4_t:"Маникюр", srv_4_p:"Классический, гель-лак или русский маникюр.",
      srv_5_t:"Педикюр", srv_5_p:"Спа-педикюр с парафиновой обработкой.",
      srv_6_t:"Коррекция бровей", srv_6_p:"Форма, тонирование и ламинирование.",
      srv_7_t:"Наращивание ресниц", srv_7_p:"Классика, гибрид или объёмные ресницы.",
      srv_8_t:"Уход за кожей", srv_8_p:"Глубокое очищение под тип кожи.",
      srv_9_t:"Расслабляющий массаж", srv_9_p:"Массаж всего тела для снятия напряжения.",
      srv_10_t:"SPA-ритуал", srv_10_p:"Двухчасовой спа-отдых для всего тела.",
      srv_11_t:"Макияж", srv_11_p:"Дневной, вечерний или свадебный макияж.",
      srv_12_t:"Лазерная эпиляция", srv_12_p:"Диодный лазер для всех типов кожи.",
      btn_book:"Записаться",
      offers_eyebrow:"— Ограниченное предложение", offers_title:"Специальные предложения",
      offer_1_tag:"Летнее сияние", offer_1_title:"Скидка 20% на все процедуры для лица",
      offer_1_text:"Действует весь июль для новых и постоянных клиентов.", btn_claim:"Получить скидку",
      offer_2_title:"Подарочные сертификаты", offer_2_text:"Идеальный подарок — любая услуга, любая сумма.", btn_learn:"Подробнее",
      offer_3_title:"Скидка на первый визит", offer_3_text:"Новые клиенты экономят 15% на первом визите.",
      pricing_eyebrow:"— Прозрачные тарифы", pricing_title:"Прайс-лист",
      pt_service:"Услуга", pt_duration:"Длительность", pt_price:"Цена",
      gallery_eyebrow:"— Портфолио", gallery_title:"Наши работы",
      filter_all:"Все", filter_hair:"Волосы", filter_nails:"Ногти", filter_skin:"Кожа", filter_makeup:"Макияж",
      ba_eyebrow:"— Трансформация", ba_title:"До и после", ba_before:"До", ba_after:"После",
      team_eyebrow:"— Наша команда", team_title:"Ваши специалисты",
      team_1_role:"Основательница и топ-стилист", team_2_role:"Старший колорист",
      team_3_role:"Мастер ногтевого сервиса", team_4_role:"Специалист по коже и спа",
      team_1_exp:"12 лет опыта", team_2_exp:"9 лет опыта", team_3_exp:"7 лет опыта", team_4_exp:"8 лет опыта",
      reviews_eyebrow:"— Отзывы", reviews_title:"Что говорят наши клиенты",
      rev_1_text:"«Самый расслабляющий опыт в салоне. Колорист действительно слушал меня, результат — именно то, что хотела».",
      rev_2_text:"«Безупречное внимание к деталям. Студия ощущается спокойной и по-настоящему премиальной».",
      rev_3_text:"«Забронировала спа-день на день рождения. Ушла полностью обновлённой. Уже записалась снова».",
      video_eyebrow:"— Внутри Aurelie", video_title:"Короткий тур по студии",
      video_modal_note:"Вставьте сюда промо-видео (YouTube / Vimeo iframe).",
      faq_eyebrow:"— Полезно знать", faq_title:"Частые вопросы",
      faq_sub:"Не нашли ответ? Напишите нам, и мы ответим в течение дня.", btn_contact_us:"Связаться с нами",
      faq_1_q:"Нужно ли записываться заранее?", faq_1_a:"Рекомендуем бронировать за 2-3 дня, особенно на выходные.",
      faq_2_q:"Какая политика отмены?", faq_2_a:"Бесплатная отмена за 24 часа. Позднее — небольшая комиссия.",
      faq_3_q:"Проводите ли вы консультации?", faq_3_a:"Да — каждая первая процедура окрашивания или ухода начинается с бесплатной консультации.",
      faq_4_q:"Ваша косметика без тестов на животных?", faq_4_a:"Все линии, которые мы используем, cruelty-free и профессионального уровня.",
      faq_5_q:"Принимаете ли вы без записи?", faq_5_a:"Да, при наличии свободного времени.",
      faq_6_q:"Какие способы оплаты вы принимаете?", faq_6_a:"Наличные, карты и мобильные платежи, включая Apple Pay.",
      faq_7_q:"Можно ли прийти с сопровождающим?", faq_7_a:"Конечно — у нас удобная зона ожидания для гостей.",
      faq_8_q:"Есть ли подарочные сертификаты?", faq_8_a:"Да, на любую сумму, действуют один год.",
      faq_9_q:"Есть ли парковка?", faq_9_a:"Бесплатная парковка прямо за зданием студии.",
      faq_10_q:"Работаете ли вы с детьми?", faq_10_a:"Принимаем детей от 10 лет на стрижки в сопровождении взрослого.",
      booking_eyebrow:"— Забронируйте время", booking_title:"Запись на приём",
      booking_sub:"Заполните форму, и мы подтвердим ваше время в течение нескольких часов.",
      booking_perk_1:"Предоплата не требуется", booking_perk_2:"Бесплатный перенос за 24 часа",
      booking_perk_3:"Мгновенное подтверждение по SMS",
      form_name:"Имя и фамилия", form_phone:"Номер телефона", form_service:"Услуга",
      form_service_ph:"Выберите услугу", form_date:"Желаемая дата", form_time:"Желаемое время",
      form_comment:"Комментарий (необязательно)", form_submit:"Подтвердить запись",
      form_err_name:"Пожалуйста, введите имя.", form_err_phone:"Введите корректный номер телефона.",
      form_err_service:"Пожалуйста, выберите услугу.", form_err_date:"Пожалуйста, выберите дату.", form_err_time:"Пожалуйста, выберите время.",
      success_title:"Спасибо!", success_text:"Ваша заявка принята. Мы подтвердим запись по телефону или SMS.", success_close:"Закрыть",
      contact_eyebrow:"— Свяжитесь с нами", contact_title:"Приходите или напишите",
      contact_address_l:"Адрес", contact_phone_l:"Телефон", contact_email_l:"Email", contact_hours_l:"Часы работы",
      contact_hours_v:"Пн–Сб: 9:00–20:00, Вс: 10:00–18:00",
      map_placeholder:"Google Карта — вставьте адрес здесь",
      footer_tagline:"Частная студия для волос, кожи, ногтей и спа — с 2014 года.",
      footer_links:"Быстрые ссылки", footer_services:"Услуги", footer_contacts:"Контакты",
      footer_rights:"Все права защищены.", footer_privacy:"Политика конфиденциальности",

      back_to_menu:"Меню", about_page_title:"О нас", services_page_title:"Выберите услугу",
      specialists_page_title:"Выберите специалиста",
      menu_tag:"Волосы · Ногти · Кожа · Спа",
      menu_btn_service_t:"Выбрать услугу", menu_btn_service_p:"Посмотреть весь список услуг",
      menu_btn_specialist_t:"Выбрать специалиста", menu_btn_specialist_p:"Выберите любимого мастера",
      menu_btn_about_t:"О нас", menu_btn_about_p:"Наша история, команда, работы и контакты",
      search_ph:"Поиск по названию",
      filter_brows:"Брови и ресницы",
      group_hair:"Волосы", group_nails:"Ногти", group_brows:"Брови и ресницы",
      group_skin:"Кожа и спа", group_makeup:"Макияж",
      selected_label:"выбрано", continue_btn:"Продолжить",
      any_specialist_t:"Любой специалист", any_specialist_p:"Подберём лучшего свободного мастера",
      finish_btn:"Отправить в WhatsApp",
      nav_specialists:"Специалисты",
      choose_btn:"Выбрать", review_btn:"Проверить запись",
      review_page_title:"Проверьте данные", review_details_title:"Детали записи",
      review_services_title:"Услуги", review_total:"Итого", review_form_title:"Заполните ваши данные",
      review_comment_ph:"Введите комментарий (необязательно)",
    },

    kk: {
      nav_home:"Басты бет", nav_about:"Біз туралы", nav_services:"Қызметтер", nav_gallery:"Галерея",
      nav_team:"Команда", nav_reviews:"Пікірлер", nav_faq:"Сұрақтар", nav_contact:"Байланыс", nav_book:"Жазылу",
      hero_eyebrow:"— 2014 жылдан бері · Орталықтағы студия",
      hero_title_1:"Әрбір ұсақ-түйекке дейін", hero_title_2:"ойластырылған сұлулық.",
      hero_subtitle:"Шаш, тері, тырнақ және спа-рәсімдеріне арналған жеке студия — сертификатталған мамандар қолымен.",
      hero_cta_book:"Жазылу", hero_cta_call:"Қоңырау шалу",
      badge_certified:"Сертификатталған мамандар", badge_premium:"Премиум косметика", badge_sterile:"Стерильді құралдар",
      stat_years:"жыл тәжірибе", stat_clients:"риза клиент", stat_rating:"орташа рейтинг", stat_procedures:"орындалған рәсім",
      about_eyebrow:"— Біздің тарих", about_title:"Тыныш сенімділікке негізделген студия",
      about_text:"Aurelie 2014 жылы екі креслодан басталды: күтім — мәміле емес, рәсім болуы керек деген қарапайым идеямен.",
      about_quote:"«Біз трендтерге қумаймыз. Сізге лайық нәрсені ғана баса көрсетеміз»",
      about_quote_author:"— Камилла Лоран, негізін салушы",
      about_val_1:"Әр рәсім алдында жеке кеңес беру",
      about_val_2:"Тек кәсіби, жануарларда сыналмаған косметика",
      about_val_3:"Заманауи әдістерге үздіксіз оқыту",
      tl_1_title:"2014 — Алғашқы кресло", tl_1_text:"Орталықта екі креслолық алғашқы студияны аштық.",
      tl_2_title:"2018 — Толыққанды студия", tl_2_text:"Шаш, тырнақ, тері және спаға дейін кеңейдік.",
      tl_3_title:"2026 — 5000+ клиент", tl_3_text:"Он екі маманнан тұратын команда.",
      why_eyebrow:"— Неге Aurelie", why_title:"Маңызды бөлшектер",
      why_1_t:"Сертификатталған мамандар", why_1_p:"Әр стилист халықаралық лицензияға ие.",
      why_2_t:"Премиум косметика", why_2_p:"Тек кәсіби желілерді қолданамыз.",
      why_3_t:"Стерильді құралдар", why_3_p:"Госпитальдық деңгейдегі стерилизация.",
      why_4_t:"Жайлы атмосфера", why_4_p:"Демалу үшін тыныш, жеке кеңістік.",
      why_5_t:"Әділ бағалар", why_5_p:"Жасырын төлемдерсіз ашық тарифтер.",
      why_6_t:"Заманауи әдістер", why_6_p:"Жаңа әдістерге үздіксіз оқыту.",
      why_7_t:"Жылдам жазылу", why_7_p:"Уақытты бір минутта онлайн брондаңыз.",
      why_8_t:"Жеке көзқарас", why_8_p:"Әр рәсім жоспары сізге арналған.",
      services_eyebrow:"— Біз ұсынамыз", services_title:"Фирмалық қызметтер",
      services_sub:"Дәл шаш қиюдан толық спа-күніне дейін — әр қызмет жеке кездесу ретінде брондалады.",
      srv_1_t:"Фирмалық шаш қию", srv_1_p:"Жуу және кеңес берумен дәл шаш қию.",
      srv_2_t:"Шашты бояу", srv_2_p:"Толық бояу, балаяж немесе тамырды жаңарту.",
      srv_3_t:"Шаш сәндеу", srv_3_p:"Іс-шараларға арналған сәндеу мен себелер.",
      srv_4_t:"Маникюр", srv_4_p:"Классикалық, гель-лак немесе орыс маникюрі.",
      srv_5_t:"Педикюр", srv_5_p:"Парафин процедурасы бар спа-педикюр.",
      srv_6_t:"Қас түзету", srv_6_p:"Пішін беру, бояу және ламинирлеу.",
      srv_7_t:"Кірпік ұзарту", srv_7_p:"Классикалық, гибридті немесе көлемді жиынтықтар.",
      srv_8_t:"Тері күтімі", srv_8_p:"Тері түріне сай терең тазарту.",
      srv_9_t:"Демалдыратын массаж", srv_9_p:"Кернеуді басатын дене массажы.",
      srv_10_t:"SPA-рәсімі", srv_10_p:"Екі сағаттық толық дене спа-демалысы.",
      srv_11_t:"Макияж", srv_11_p:"Күндізгі, кешкі немесе үйлену тойы макияжы.",
      srv_12_t:"Лазерлік эпиляция", srv_12_p:"Кез келген тері түріне диодты лазер.",
      btn_book:"Жазылу",
      offers_eyebrow:"— Шектеулі уақыт", offers_title:"Арнайы ұсыныстар",
      offer_1_tag:"Жазғы жарқырау", offer_1_title:"Барлық бет күтіміне 20% жеңілдік",
      offer_1_text:"Шілде бойы жаңа және тұрақты клиенттерге қолданылады.", btn_claim:"Жеңілдік алу",
      offer_2_title:"Сыйлық сертификаттары", offer_2_text:"Тамаша сыйлық — кез келген қызмет, кез келген сома.", btn_learn:"Толығырақ",
      offer_3_title:"Бірінші келуге жеңілдік", offer_3_text:"Жаңа клиенттер бірінші келгенде 15% үнемдейді.",
      pricing_eyebrow:"— Ашық бағалар", pricing_title:"Баға тізімі",
      pt_service:"Қызмет", pt_duration:"Ұзақтығы", pt_price:"Бағасы",
      gallery_eyebrow:"— Портфолио", gallery_title:"Соңғы жұмыстар",
      filter_all:"Барлығы", filter_hair:"Шаш", filter_nails:"Тырнақ", filter_skin:"Тері", filter_makeup:"Макияж",
      ba_eyebrow:"— Өзгеріс", ba_title:"Дейін және кейін", ba_before:"Дейін", ba_after:"Кейін",
      team_eyebrow:"— Біздің команда", team_title:"Сіздің мамандарыңыз",
      team_1_role:"Негізін салушы және бас стилист", team_2_role:"Аға колорист",
      team_3_role:"Тырнақ және кірпік шебері", team_4_role:"Тері және спа маманы",
      team_1_exp:"12 жыл тәжірибе", team_2_exp:"9 жыл тәжірибе", team_3_exp:"7 жыл тәжірибе", team_4_exp:"8 жыл тәжірибе",
      reviews_eyebrow:"— Пікірлер", reviews_title:"Клиенттеріміз не дейді",
      rev_1_text:"«Салондағы ең тыныштандыратын тәжірибе. Колорист мені шынымен тыңдады, нәтиже дәл қалағанымдай болды».",
      rev_2_text:"«Егжей-тегжейге мінсіз көңіл бөлінеді. Студия тыныш әрі шынымен премиум сезіледі».",
      rev_3_text:"«Туған күніме спа-күнін брондадым. Толық жаңарып кеттім. Келесі кезекке қазірден жаздым».",
      video_eyebrow:"— Aurelie ішінде", video_title:"Студияға қысқаша тур",
      video_modal_note:"Мұнда промо-бейнені орналастырыңыз (YouTube / Vimeo iframe).",
      faq_eyebrow:"— Білгеніңіз жөн", faq_title:"Жиі қойылатын сұрақтар",
      faq_sub:"Жауап таппадыңыз ба? Бізге жазыңыз, бір күн ішінде жауап береміз.", btn_contact_us:"Бізбен байланысу",
      faq_1_q:"Алдын ала жазылу керек пе?", faq_1_a:"Әсіресе демалыс күндеріне 2-3 күн бұрын брондауды ұсынамыз.",
      faq_2_q:"Болдырмау саясаты қандай?", faq_2_a:"Кездесуге дейін 24 сағат бұрын тегін болдырмауға болады. Кеш болдырмаса, шағын комиссия алынады.",
      faq_3_q:"Кеңес бересіздер ме?", faq_3_a:"Иә — әр алғашқы бояу немесе күтім рәсімі тегін кеңестен басталады.",
      faq_4_q:"Косметикаңыз жануарларда сыналмаған ба?", faq_4_a:"Біз қолданатын барлық желілер cruelty-free және кәсіби деңгейде.",
      faq_5_q:"Жазылусыз қабылдайсыздар ма?", faq_5_a:"Иә, бос уақыт болған жағдайда.",
      faq_6_q:"Қандай төлем әдістерін қабылдайсыздар?", faq_6_a:"Қолма-қол ақша, барлық негізгі карталар және Apple Pay сияқты мобильді төлемдер.",
      faq_7_q:"Серіктеспен келуге бола ма?", faq_7_a:"Әрине — қонақтарға арналған ыңғайлы күту аймағы бар.",
      faq_8_q:"Сыйлық сертификаттары бар ма?", faq_8_a:"Иә, кез келген сомаға, сатып алған күннен бастап бір жыл жарамды.",
      faq_9_q:"Тұрақ бар ма?", faq_9_a:"Студия ғимаратының артында тегін тұрақ бар.",
      faq_10_q:"Балалармен жұмыс істейсіздер ме?", faq_10_a:"Ересек адаммен бірге келген 10 жастан асқан балаларды шаш қиюға қабылдаймыз.",
      booking_eyebrow:"— Уақытыңызды брондаңыз", booking_title:"Қабылдауға жазылу",
      booking_sub:"Форманы толтырыңыз, біз бірнеше сағат ішінде уақытыңызды растаймыз.",
      booking_perk_1:"Алдын ала төлем қажет емес", booking_perk_2:"24 сағат бұрын тегін ауыстыру",
      booking_perk_3:"SMS арқылы жедел растау",
      form_name:"Аты-жөні", form_phone:"Телефон нөірі", form_service:"Қызмет",
      form_service_ph:"Қызметті таңдаңыз", form_date:"Қалаған күн", form_time:"Қалаған уақыт",
      form_comment:"Пікір (міндетті емес)", form_submit:"Жазылуды растау",
      form_err_name:"Атыңызды енгізіңіз.", form_err_phone:"Дұрыс телефон нөірін енгізіңіз.",
      form_err_service:"Қызметті таңдаңыз.", form_err_date:"Күнді таңдаңыз.", form_err_time:"Уақытты таңдаңыз.",
      success_title:"Рахмет!", success_text:"Сұранысыңыз қабылданды. Жазылуыңызды телефон немесе SMS арқылы растаймыз.", success_close:"Жабу",
      contact_eyebrow:"— Бізбен байланысыңыз", contact_title:"Келіңіз немесе жазыңыз",
      contact_address_l:"Мекенжай", contact_phone_l:"Телефон", contact_email_l:"Email", contact_hours_l:"Жұмыс уақыты",
      contact_hours_v:"Дс–Сб: 9:00–20:00, Жс: 10:00–18:00",
      map_placeholder:"Google карта — мекенжайды осында қойыңыз",
      footer_tagline:"Шаш, тері, тырнақ және спаға арналған жеке студия — 2014 жылдан бері.",
      footer_links:"Жылдам сілтемелер", footer_services:"Қызметтер", footer_contacts:"Байланыс",
      footer_rights:"Барлық құқықтар қорғалған.", footer_privacy:"Құпиялылық саясаты",

      back_to_menu:"Мәзір", about_page_title:"Біз туралы", services_page_title:"Қызметті таңдаңыз",
      specialists_page_title:"Маманды таңдаңыз",
      menu_tag:"Шаш · Тырнақ · Тері · Спа",
      menu_btn_service_t:"Қызметті таңдау", menu_btn_service_p:"Толық қызмет тізімін қарау",
      menu_btn_specialist_t:"Маманды таңдау", menu_btn_specialist_p:"Сүйікті шеберіңізді таңдаңыз",
      menu_btn_about_t:"Біз туралы", menu_btn_about_p:"Тарихымыз, команда, жұмыстар және байланыстар",
      search_ph:"Атауы бойынша іздеу",
      filter_brows:"Қас пен кірпік",
      group_hair:"Шаш", group_nails:"Тырнақ", group_brows:"Қас пен кірпік",
      group_skin:"Тері мен спа", group_makeup:"Макияж",
      selected_label:"таңдалды", continue_btn:"Жалғастыру",
      any_specialist_t:"Кез келген маман", any_specialist_p:"Ең жақсы бос маманды таңдаймыз",
      finish_btn:"WhatsApp-қа жіберу",
      nav_specialists:"Мамандар",
      choose_btn:"Таңдау", review_btn:"Жазылуды тексеру",
      review_page_title:"Деректерді тексеріңіз", review_details_title:"Жазылу мәліметтері",
      review_services_title:"Қызметтер", review_total:"Барлығы", review_form_title:"Деректеріңізді толтырыңыз",
      review_comment_ph:"Пікір қалдырыңыз (міндетті емес)",
    },

    ky: {
      nav_home:"Башкы бет", nav_about:"Биз жөнүндө", nav_services:"Кызматтар", nav_gallery:"Галерея",
      nav_team:"Команда", nav_reviews:"Пикирлер", nav_faq:"Суроолор", nav_contact:"Байланыш", nav_book:"Жазылуу",
      hero_eyebrow:"— 2014-жылдан бери · Борбордогу студия",
      hero_title_1:"Ар бир майда-чүйдөгө чейин", hero_title_2:"ойлонулган сулуулук.",
      hero_subtitle:"Чач, тери, тырмак жана спа-ырым-жырымдары үчүн жеке студия — сертификатталган адистер тарабынан.",
      hero_cta_book:"Жазылуу", hero_cta_call:"Чалуу",
      badge_certified:"Сертификатталган адистер", badge_premium:"Премиум косметика", badge_sterile:"Стерилдүү аспаптар",
      stat_years:"жыл тажрыйба", stat_clients:"ыраазы кардар", stat_rating:"орточо рейтинг", stat_procedures:"аткарылган жол-жобо",
      about_eyebrow:"— Биздин тарых", about_title:"Тынч ишенимге негизделген студия",
      about_text:"Aurelie 2014-жылы эки орундук студия катары башталган: кам көрүү — бүтүм эмес, ырым-жырым сыяктуу сезилиши керек деген жөнөкөй идея менен.",
      about_quote:"«Биз тренддерге кубалабайбыз. Сизге деле жарашкан нерсени эле баса белгилейбиз»",
      about_quote_author:"— Камилла Лоран, негиздөөчү",
      about_val_1:"Ар бир жол-жобо алдында жеке консультация",
      about_val_2:"Жаныбарларда сыналбаган кесипкөй косметика гана",
      about_val_3:"Заманбап ыкмаларга үзгүлтүксүз окутуу",
      tl_1_title:"2014 — Биринчи орун", tl_1_text:"Борбордо эки орундук биринчи студияны ачтык.",
      tl_2_title:"2018 — Толук кандуу студия", tl_2_text:"Чач, тырмак, тери жана спага чейин кеңейдик.",
      tl_3_title:"2026 — 5000+ кардар", tl_3_text:"Он эки адистен турган команда.",
      why_eyebrow:"— Эмне үчүн Aurelie", why_title:"Маанилүү майда-чүйдөлөр",
      why_1_t:"Сертификатталган адистер", why_1_p:"Ар бир стилист эл аралык лицензияга ээ.",
      why_2_t:"Премиум косметика", why_2_p:"Биз кесипкөй линияларды гана колдонобуз.",
      why_3_t:"Стерилдүү аспаптар", why_3_p:"Госпиталдык деңгээлдеги стерилизация.",
      why_4_t:"Ыңгайлуу атмосфера", why_4_p:"Эс алуу үчүн тынч, жеке мейкиндик.",
      why_5_t:"Адилет баалар", why_5_p:"Жашыруун төлөмдөрсүз ачык тарифтер.",
      why_6_t:"Заманбап ыкмалар", why_6_p:"Жаңы методдорго үзгүлтүксүз окутуу.",
      why_7_t:"Тез жазылуу", why_7_p:"Убакытты бир мүнөттө онлайн бронддоңуз.",
      why_8_t:"Жеке мамиле", why_8_p:"Ар бир жол-жобо планы сизге ылайыкталган.",
      services_eyebrow:"— Биз сунуштайбыз", services_title:"Фирмалык кызматтар",
      services_sub:"Так чач тартымынан толук спа-күнгө чейин — ар бир кызмат жеке жолугушуу катары бронддолот.",
      srv_1_t:"Фирмалык чач тартуу", srv_1_p:"Жуу жана консультация менен так чач тартуу.",
      srv_2_t:"Чач боёо", srv_2_p:"Толук боёо, балаяж же тамырды жаңыртуу.",
      srv_3_t:"Чач жасалгалоо", srv_3_p:"Иш-чаралар үчүн жасалгалар жана чач үлгүлөрү.",
      srv_4_t:"Маникюр", srv_4_p:"Классикалык, гель-лак же орус маникюру.",
      srv_5_t:"Педикюр", srv_5_p:"Парафин процедурасы менен спа-педикюр.",
      srv_6_t:"Каш оңдоо", srv_6_p:"Форма берүү, боёо жана ламинирлөө.",
      srv_7_t:"Кирпик узартуу", srv_7_p:"Классикалык, гибрид же көлөмдүү топтомдор.",
      srv_8_t:"Тери күтүмү", srv_8_p:"Тери түрүнө жараша терең тазалоо.",
      srv_9_t:"Эс алдыруучу массаж", srv_9_p:"Керилүүнү басаңдаткан дене массажы.",
      srv_10_t:"SPA-ырымы", srv_10_p:"Эки сааттык толук дене спа эс алуусу.",
      srv_11_t:"Макияж", srv_11_p:"Күндүзгү, кечки же үйлөнүү тою макияжы.",
      srv_12_t:"Лазердик эпиляция", srv_12_p:"Каалагаh тери түрүнө диоддук лазер.",
      btn_book:"Жазылуу",
      offers_eyebrow:"— Чектелген убакыт", offers_title:"Атайын сунуштар",
      offer_1_tag:"Жайкы жаркыроо", offer_1_title:"Бардык бет күтүмүнө 20% арзандатуу",
      offer_1_text:"Июль бою жаңы жана туруктуу кардарлар үчүн колдонулат.", btn_claim:"Арзандатууну алуу",
      offer_2_title:"Белек сертификаттары", offer_2_text:"Мыкты белек — каалаган кызмат, каалаган сумма.", btn_learn:"Кеңири маалымат",
      offer_3_title:"Биринчи жолугууга арзандатуу", offer_3_text:"Жаңы кардарлар биринчи жолугууда 15% үнөмдөйт.",
      pricing_eyebrow:"— Ачык баалар", pricing_title:"Баа тизмеси",
      pt_service:"Кызмат", pt_duration:"Узактыгы", pt_price:"Баасы",
      gallery_eyebrow:"— Портфолио", gallery_title:"Акыркы иштер",
      filter_all:"Баары", filter_hair:"Чач", filter_nails:"Тырмак", filter_skin:"Тери", filter_makeup:"Макияж",
      ba_eyebrow:"— Өзгөрүү", ba_title:"Мурун жана кийин", ba_before:"Мурун", ba_after:"Кийин",
      team_eyebrow:"— Биздин команда", team_title:"Сиздин адистериңиз",
      team_1_role:"Негиздөөчү жана башкы стилист", team_2_role:"Улук колорист",
      team_3_role:"Тырмак жана кирпик устасы", team_4_role:"Тери жана спа адиси",
      team_1_exp:"12 жыл тажрыйба", team_2_exp:"9 жыл тажрыйба", team_3_exp:"7 жыл тажрыйба", team_4_exp:"8 жыл тажрыйба",
      reviews_eyebrow:"— Пикирлер", reviews_title:"Кардарларыбыз эмне дешет",
      rev_1_text:"«Салондо болгон эң тынчтандыруучу тажрыйба. Колорист мени чын эле уктуп, натыйжа так каалагандай болду».",
      rev_2_text:"«Майда-чүйдөгө чейин мыкты көңүл бурулат. Студия тынч жана чындап премиум сезилет».",
      rev_3_text:"«Туулган күнүмө спа-күндү брондодум. Толугу менен жаңырып чыктым. Кийинки жолугууга азыртан жаздым».",
      video_eyebrow:"— Aurelie ичинде", video_title:"Студияга кыскача тур",
      video_modal_note:"Бул жерге промо-видеону коюңуз (YouTube / Vimeo iframe).",
      faq_eyebrow:"— Билгениңиз жакшы", faq_title:"Көп берилүүчү суроолор",
      faq_sub:"Жоопту таппадыңызбы? Бизге жазыңыз, бир күндүн ичинде жооп беребиз.", btn_contact_us:"Биз менен байланышуу",
      faq_1_q:"Алдын ала жазылуу керекпи?", faq_1_a:"Айрыкча дем алыш күндөрүнө 2-3 күн мурун бронддоону сунуштайбыз.",
      faq_2_q:"Жокко чыгаруу саясаты кандай?", faq_2_a:"Жолугууга чейин 24 саат мурун бекер жокко чыгарууга болот. Кечиктирилсе, кичине комиссия алынат.",
      faq_3_q:"Консультация бересиздерби?", faq_3_a:"Ооба — ар бир биринчи боёо же күтүм жол-жобосу бекер консультациядан башталат.",
      faq_4_q:"Косметикаңыз жаныбарларда сыналбайбы?", faq_4_a:"Биз колдонгон бардык линиялар cruelty-free жана кесипкөй деңгээлде.",
      faq_5_q:"Жазылуусуз кабыл аласыздарбы?", faq_5_a:"Ооба, бош убакыт болгон учурда.",
      faq_6_q:"Кандай төлөм ыкмаларын кабыл аласыздар?", faq_6_a:"Накталай акча, бардык негизги карталар жана Apple Pay сыяктуу мобилдик төлөмдөр.",
      faq_7_q:"Коштоочу менен келсе болобу?", faq_7_a:"Албетте — конокдор үчүн ыңгайлуу күтүү аймагы бар.",
      faq_8_q:"Белек сертификаттары барбы?", faq_8_a:"Ооба, каалаган суммага, сатып алган күндөн тартып бир жыл жарактуу.",
      faq_9_q:"Токтотуучу жай барбы?", faq_9_a:"Студия имаратынын артында бекер токтотуучу жай бар.",
      faq_10_q:"Балдар менен иштейсиздерби?", faq_10_a:"Чоң кишиси менен келген 10 жаштан жогорку балдарды чач тартууга кабыл алабыз.",
      booking_eyebrow:"— Убактыңызды бронддоңуз", booking_title:"Кабылдоого жазылуу",
      booking_sub:"Форманы толтуруңуз, биз бир нече сааттын ичинде убактыңызды тастыктайбыз.",
      booking_perk_1:"Алдын ала төлөм талап кылынбайт", booking_perk_2:"24 сааттан мурун бекер которуу",
      booking_perk_3:"SMS аркылуу тез тастыктоо",
      form_name:"Аты-жөнү", form_phone:"Телефон номери", form_service:"Кызмат",
      form_service_ph:"Кызматты тандаңыз", form_date:"Каалаган күн", form_time:"Каалаган убакыт",
      form_comment:"Пикир (милдеттүү эмес)", form_submit:"Жазылууну тастыктоо",
      form_err_name:"Атыңызды киргизиңиз.", form_err_phone:"Туура телефон номерин киргизиңиз.",
      form_err_service:"Кызматты тандаңыз.", form_err_date:"Күндү тандаңыз.", form_err_time:"Убакытты тандаңыз.",
      success_title:"Рахмат!", success_text:"Өтүнүчүңүз кабыл алынды. Жазылууну телефон же SMS аркылуу тастыктайбыз.", success_close:"Жабуу",
      contact_eyebrow:"— Биз менен байланышыңыз", contact_title:"Келиңиз же жазыңыз",
      contact_address_l:"Дареги", contact_phone_l:"Телефон", contact_email_l:"Email", contact_hours_l:"Жумуш убактысы",
      contact_hours_v:"Дүй–Ишм: 9:00–20:00, Жек: 10:00–18:00",
      map_placeholder:"Google картасы — даректи бул жерге коюңуз",
      footer_tagline:"Чач, тери, тырмак жана спа үчүн жеке студия — 2014-жылдан бери.",
      footer_links:"Тез шилтемелер", footer_services:"Кызматтар", footer_contacts:"Байланыш",
      footer_rights:"Бардык укуктар корголгон.", footer_privacy:"Купуялык саясаты",

      back_to_menu:"Меню", about_page_title:"Биз жөнүндө", services_page_title:"Кызматты тандаңыз",
      specialists_page_title:"Маманды тандаңыз",
      menu_tag:"Чач · Тырмак · Тери · Спа",
      menu_btn_service_t:"Кызматты тандоо", menu_btn_service_p:"Толук кызмат тизмесин көрүү",
      menu_btn_specialist_t:"Маманды тандоо", menu_btn_specialist_p:"Сүйүктүү устаңызды тандаңыз",
      menu_btn_about_t:"Биз жөнүндө", menu_btn_about_p:"Тарыхыбыз, команда, иштер жана байланыштар",
      search_ph:"Аты боюнча издөө",
      filter_brows:"Каш жана кирпик",
      group_hair:"Чач", group_nails:"Тырмак", group_brows:"Каш жана кирпик",
      group_skin:"Тери жана спа", group_makeup:"Макияж",
      selected_label:"тандалды", continue_btn:"Улантуу",
      any_specialist_t:"Каалаган адис", any_specialist_p:"Эң мыкты бош устаны тандайбыз",
      finish_btn:"WhatsApp'ка жөнөтүү",
      nav_specialists:"Адистер",
      choose_btn:"Тандоо", review_btn:"Жазылууну текшерүү",
      review_page_title:"Маалыматты текшериңиз", review_details_title:"Жазылуу маалыматы",
      review_services_title:"Кызматтар", review_total:"Жалпысы", review_form_title:"Маалыматыңызды толтуруңуз",
      review_comment_ph:"Пикир калтырыңыз (милдеттүү эмес)",
    },

    uz: {
      nav_home:"Bosh sahifa", nav_about:"Biz haqimizda", nav_services:"Xizmatlar", nav_gallery:"Galereya",
      nav_team:"Jamoa", nav_reviews:"Sharhlar", nav_faq:"Savollar", nav_contact:"Aloqa", nav_book:"Yozilish",
      hero_eyebrow:"— 2014-yildan buyon · Markazdagi studiya",
      hero_title_1:"Har bir mayda tafsilotgacha", hero_title_2:"o'ylab ishlangan go'zallik.",
      hero_subtitle:"Soch, teri, tirnoq va spa-marosimlari uchun xususiy studiya — sertifikatlangan mutaxassislar bilan.",
      hero_cta_book:"Yozilish", hero_cta_call:"Qo'ng'iroq qilish",
      badge_certified:"Sertifikatlangan mutaxassislar", badge_premium:"Premium kosmetika", badge_sterile:"Steril asboblar",
      stat_years:"yillik tajriba", stat_clients:"mamnun mijoz", stat_rating:"o'rtacha reyting", stat_procedures:"bajarilgan protsedura",
      about_eyebrow:"— Bizning tariximiz", about_title:"Sokin ishonchga asoslangan studiya",
      about_text:"Aurelie 2014-yilda ikki kreslodan boshlangan: parvarish — bitim emas, marosim bo'lishi kerak degan oddiy g'oya bilan.",
      about_quote:"«Biz trendlarga quvmaymiz. Sizga allaqachon mos keladigan narsani ta'kidlaymiz»",
      about_quote_author:"— Kamil Loran, asoschisi",
      about_val_1:"Har bir protseduradan oldin yakka konsultatsiya",
      about_val_2:"Faqat professional, hayvonlarda sinalmagan kosmetika",
      about_val_3:"Zamonaviy usullarga doimiy o'qitish",
      tl_1_title:"2014 — Birinchi kreslo", tl_1_text:"Markazda ikki kreslolik birinchi studiyani ochdik.",
      tl_2_title:"2018 — To'liq studiya", tl_2_text:"Soch, tirnoq, teri va spagacha kengaydik.",
      tl_3_title:"2026 — 5000+ mijoz", tl_3_text:"O'n ikki mutaxassisdan iborat jamoa.",
      why_eyebrow:"— Nega Aurelie", why_title:"Muhim tafsilotlar",
      why_1_t:"Sertifikatlangan mutaxassislar", why_1_p:"Har bir stilist xalqaro litsenziyaga ega.",
      why_2_t:"Premium kosmetika", why_2_p:"Faqat professional liniyalardan foydalanamiz.",
      why_3_t:"Steril asboblar", why_3_p:"Gospital darajasidagi sterilizatsiya.",
      why_4_t:"Qulay muhit", why_4_p:"Dam olish uchun tinch, xususiy makon.",
      why_5_t:"Adolatli narxlar", why_5_p:"Yashirin to'lovlarsiz shaffof tariflar.",
      why_6_t:"Zamonaviy usullar", why_6_p:"Yangi metodlarga doimiy o'qitish.",
      why_7_t:"Tezkor yozilish", why_7_p:"Vaqtni bir daqiqada onlayn bron qiling.",
      why_8_t:"Individual yondashuv", why_8_p:"Har bir protsedura rejasi siz uchun tuziladi.",
      services_eyebrow:"— Biz taklif qilamiz", services_title:"Firma xizmatlari",
      services_sub:"Aniq soch olishdan to'liq spa-kunigacha — har bir xizmat xususiy uchrashuv sifatida bron qilinadi.",
      srv_1_t:"Firma soch olish", srv_1_p:"Yuvish va konsultatsiya bilan aniq soch olish.",
      srv_2_t:"Sochni bo'yash", srv_2_p:"To'liq bo'yash, balayaj yoki ildizni yangilash.",
      srv_3_t:"Soch turmagi", srv_3_p:"Tadbirlar uchun turmaklar va soch turishlari.",
      srv_4_t:"Manikyur", srv_4_p:"Klassik, gel-lak yoki rus manikyuri.",
      srv_5_t:"Pedikyur", srv_5_p:"Parafin protsedurasi bilan spa-pedikyur.",
      srv_6_t:"Qosh korreksiyasi", srv_6_p:"Shakl berish, bo'yash va laminatsiya.",
      srv_7_t:"Kiprik uzaytirish", srv_7_p:"Klassik, gibrid yoki hajmli to'plamlar.",
      srv_8_t:"Teri parvarishi", srv_8_p:"Teri turiga mos chuqur tozalash.",
      srv_9_t:"Dam beruvchi massaj", srv_9_p:"Zo'riqishni yo'qotuvchi tana massaji.",
      srv_10_t:"SPA-marosimi", srv_10_p:"Ikki soatlik to'liq tana spa-dam olishi.",
      srv_11_t:"Makiyaj", srv_11_p:"Kunduzgi, kechki yoki nikoh makiyaji.",
      srv_12_t:"Lazer epilyatsiyasi", srv_12_p:"Har qanday teri turi uchun diodli lazer.",
      btn_book:"Yozilish",
      offers_eyebrow:"— Cheklangan vaqt", offers_title:"Maxsus takliflar",
      offer_1_tag:"Yozgi porlash", offer_1_title:"Barcha yuz parvarishiga 20% chegirma",
      offer_1_text:"Iyul oyi davomida yangi va doimiy mijozlar uchun amal qiladi.", btn_claim:"Chegirmani olish",
      offer_2_title:"Sovg'a sertifikatlari", offer_2_text:"Ajoyib sovg'a — istalgan xizmat, istalgan summa.", btn_learn:"Batafsil",
      offer_3_title:"Birinchi tashrifga chegirma", offer_3_text:"Yangi mijozlar birinchi tashrifda 15% tejaydi.",
      pricing_eyebrow:"— Shaffof narxlar", pricing_title:"Narxlar ro'yxati",
      pt_service:"Xizmat", pt_duration:"Davomiyligi", pt_price:"Narxi",
      gallery_eyebrow:"— Portfolio", gallery_title:"So'nggi ishlar",
      filter_all:"Barchasi", filter_hair:"Soch", filter_nails:"Tirnoq", filter_skin:"Teri", filter_makeup:"Makiyaj",
      ba_eyebrow:"— O'zgarish", ba_title:"Oldin va keyin", ba_before:"Oldin", ba_after:"Keyin",
      team_eyebrow:"— Bizning jamoa", team_title:"Sizning mutaxassislaringiz",
      team_1_role:"Asoschi va bosh stilist", team_2_role:"Katta kolorist",
      team_3_role:"Tirnoq va kiprik ustasi", team_4_role:"Teri va spa mutaxassisi",
      team_1_exp:"12 yillik tajriba", team_2_exp:"9 yillik tajriba", team_3_exp:"7 yillik tajriba", team_4_exp:"8 yillik tajriba",
      reviews_eyebrow:"— Sharhlar", reviews_title:"Mijozlarimiz nima deydi",
      rev_1_text:"«Salondagi eng tinchlantiruvchi tajriba. Kolorist meni chindan tingladi, natija aynan xohlaganimdek bo'ldi».",
      rev_2_text:"«Mayda tafsilotlarga benuqson e'tibor. Studiya tinch va chinakam premium his qilinadi».",
      rev_3_text:"«Tug'ilgan kunimga spa-kunini bron qildim. To'liq yangilangan holda ketdim. Keyingi tashrifga allaqachon yozildim».",
      video_eyebrow:"— Aurelie ichida", video_title:"Studiyaga qisqacha tur",
      video_modal_note:"Bu yerga promo-videoni joylashtiring (YouTube / Vimeo iframe).",
      faq_eyebrow:"— Bilib qo'yish foydali", faq_title:"Ko'p so'raladigan savollar",
      faq_sub:"Javob topmadingizmi? Bizga yozing, bir kun ichida javob beramiz.", btn_contact_us:"Biz bilan bog'lanish",
      faq_1_q:"Oldindan yozilish kerakmi?", faq_1_a:"Ayniqsa dam olish kunlariga 2-3 kun oldin bron qilishni tavsiya qilamiz.",
      faq_2_q:"Bekor qilish siyosati qanday?", faq_2_a:"Uchrashuvdan 24 soat oldin bepul bekor qilish mumkin. Kech bo'lsa, kichik komissiya olinadi.",
      faq_3_q:"Konsultatsiya berasizlarmi?", faq_3_a:"Ha — har bir birinchi bo'yash yoki parvarish protsedurasi bepul konsultatsiyadan boshlanadi.",
      faq_4_q:"Kosmetikangiz hayvonlarda sinalmaganmi?", faq_4_a:"Biz ishlatadigan barcha liniyalar cruelty-free va professional darajada.",
      faq_5_q:"Yozilmasdan qabul qilasizlarmi?", faq_5_a:"Ha, bo'sh vaqt bo'lganda.",
      faq_6_q:"Qanday to'lov usullarini qabul qilasiz?", faq_6_a:"Naqd pul, barcha asosiy kartalar va Apple Pay kabi mobil to'lovlar.",
      faq_7_q:"Hamroh bilan kelsa bo'ladimi?", faq_7_a:"Albatta — mehmonlar uchun qulay kutish zonasi bor.",
      faq_8_q:"Sovg'a sertifikatlari bormi?", faq_8_a:"Ha, istalgan summaga, sotib olingan kundan bir yil amal qiladi.",
      faq_9_q:"Avtoturargoh bormi?", faq_9_a:"Studiya binosi orqasida bepul avtoturargoh bor.",
      faq_10_q:"Bolalar bilan ishlaysizlarmi?", faq_10_a:"Kattalar hamrohligida kelgan 10 yoshdan oshgan bolalarni soch olishga qabul qilamiz.",
      booking_eyebrow:"— Vaqtingizni bron qiling", booking_title:"Qabulga yozilish",
      booking_sub:"Formani to'ldiring, biz bir necha soat ichida vaqtingizni tasdiqlaymiz.",
      booking_perk_1:"Oldindan to'lov talab qilinmaydi", booking_perk_2:"24 soat oldin bepul ko'chirish",
      booking_perk_3:"SMS orqali tezkor tasdiqlash",
      form_name:"Ism-familiya", form_phone:"Telefon raqami", form_service:"Xizmat",
      form_service_ph:"Xizmatni tanlang", form_date:"Kerakli sana", form_time:"Kerakli vaqt",
      form_comment:"Izoh (ixtiyoriy)", form_submit:"Yozilishni tasdiqlash",
      form_err_name:"Ismingizni kiriting.", form_err_phone:"To'g'ri telefon raqamini kiriting.",
      form_err_service:"Xizmatni tanlang.", form_err_date:"Sanani tanlang.", form_err_time:"Vaqtni tanlang.",
      success_title:"Rahmat!", success_text:"So'rovingiz qabul qilindi. Yozilishni telefon yoki SMS orqali tasdiqlaymiz.", success_close:"Yopish",
      contact_eyebrow:"— Biz bilan bog'laning", contact_title:"Keling yoki yozing",
      contact_address_l:"Manzil", contact_phone_l:"Telefon", contact_email_l:"Email", contact_hours_l:"Ish vaqti",
      contact_hours_v:"Du–Sh: 9:00–20:00, Ya: 10:00–18:00",
      map_placeholder:"Google xarita — manzilni bu yerga joylashtiring",
      footer_tagline:"Soch, teri, tirnoq va spa uchun xususiy studiya — 2014-yildan buyon.",
      footer_links:"Tezkor havolalar", footer_services:"Xizmatlar", footer_contacts:"Aloqa",
      footer_rights:"Barcha huquqlar himoyalangan.", footer_privacy:"Maxfiylik siyosati",

      back_to_menu:"Menyu", about_page_title:"Biz haqimizda", services_page_title:"Xizmatni tanlang",
      specialists_page_title:"Mutaxassisni tanlang",
      menu_tag:"Soch · Tirnoq · Teri · Spa",
      menu_btn_service_t:"Xizmatni tanlash", menu_btn_service_p:"To'liq xizmatlar ro'yxatini ko'rish",
      menu_btn_specialist_t:"Mutaxassisni tanlash", menu_btn_specialist_p:"Sevimli ustangizni tanlang",
      menu_btn_about_t:"Biz haqimizda", menu_btn_about_p:"Tariximiz, jamoa, ishlar va aloqalar",
      search_ph:"Nomi bo'yicha qidirish",
      filter_brows:"Qosh va kiprik",
      group_hair:"Soch", group_nails:"Tirnoq", group_brows:"Qosh va kiprik",
      group_skin:"Teri va spa", group_makeup:"Makiyaj",
      selected_label:"tanlandi", continue_btn:"Davom etish",
      any_specialist_t:"Istalgan mutaxassis", any_specialist_p:"Eng yaxshi bo'sh ustani tanlaymiz",
      finish_btn:"WhatsApp'ga yuborish",
      nav_specialists:"Mutaxassislar",
      choose_btn:"Tanlash", review_btn:"Bronni tekshirish",
      review_page_title:"Ma'lumotlarni tekshiring", review_details_title:"Bron tafsilotlari",
      review_services_title:"Xizmatlar", review_total:"Jami", review_form_title:"Ma'lumotlaringizni to'ldiring",
      review_comment_ph:"Izoh qoldiring (ixtiyoriy)",
    }
  };

  const langSelect = document.getElementById('langSelect');
  let currentLang = localStorageSafeGet('aurelie-lang') || 'en';
  if (langSelect) langSelect.value = currentLang;
  applyLang(currentLang);

  if (langSelect){
    langSelect.addEventListener('change', () => {
      currentLang = langSelect.value;
      localStorageSafeSet('aurelie-lang', currentLang);
      applyLang(currentLang);
    });
  }

  function applyLang(lang){
    document.documentElement.lang = lang;
    if (lang === 'en'){
      // restore original English text saved on first load
      document.querySelectorAll('[data-i18n]').forEach(el => {
        if (el.dataset.enOriginal) el.textContent = el.dataset.enOriginal;
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        if (el.dataset.enPhOriginal) el.setAttribute('placeholder', el.dataset.enPhOriginal);
      });
      return;
    }
    const dict = translations[lang];
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (!el.dataset.enOriginal) el.dataset.enOriginal = el.textContent;
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      if (!el.dataset.enPhOriginal) el.dataset.enPhOriginal = el.getAttribute('placeholder') || '';
      const key = el.dataset.i18nPh;
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
  }

  /* ---------- ANIMATED MOBILE NAV LINKS (smooth scroll handled natively via CSS scroll-behavior) ---------- */

  /* ---------- GALLERY FILTER ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry__item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      masonryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxClose && lightboxImg){
    document.querySelectorAll('.masonry__item').forEach(item => {
      const zoomBtn = item.querySelector('.masonry__zoom');
      const photo = item.querySelector('.gallery-img');
      if (!zoomBtn) return;
      zoomBtn.addEventListener('click', () => {
        if (photo && photo.tagName === 'IMG'){
          lightboxImg.src = photo.src;
          lightboxImg.alt = photo.alt;
        }
        lightbox.classList.add('is-open');
      });
    });
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('is-open'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('is-open'); });
  }

  /* ---------- VIDEO MODAL ---------- */
  const videoModal = document.getElementById('videoModal');
  const videoPlay = document.getElementById('videoPlay');
  const videoModalClose = document.getElementById('videoModalClose');
  if (videoModal && videoPlay && videoModalClose){
    videoPlay.addEventListener('click', () => videoModal.classList.add('is-open'));
    videoModalClose.addEventListener('click', () => videoModal.classList.remove('is-open'));
    videoModal.addEventListener('click', (e) => { if (e.target === videoModal) videoModal.classList.remove('is-open'); });
  }

  /* ---------- BEFORE / AFTER SLIDER ---------- */
  const baRange = document.getElementById('baRange');
  const baBefore = document.getElementById('baBefore');
  const baHandle = document.getElementById('baHandle');
  if (baRange){
    baRange.addEventListener('input', () => {
      const val = baRange.value;
      baBefore.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
      baHandle.style.left = val + '%';
    });
  }

  /* ---------- TESTIMONIAL SLIDER ---------- */
  const reviewCards = document.querySelectorAll('.review-card');
  const dotsWrap = document.getElementById('reviewsDots');
  let activeReview = 0;
  if (dotsWrap && reviewCards.length){
    reviewCards.forEach((card, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show review ' + (i + 1));
      if (i === 0){ dot.classList.add('is-active'); card.classList.add('is-active'); }
      dot.addEventListener('click', () => goToReview(i));
      dotsWrap.appendChild(dot);
    });
  }
  function goToReview(index){
    if (!dotsWrap || !reviewCards.length) return;
    reviewCards[activeReview].classList.remove('is-active');
    dotsWrap.children[activeReview].classList.remove('is-active');
    activeReview = index;
    reviewCards[activeReview].classList.add('is-active');
    dotsWrap.children[activeReview].classList.add('is-active');
  }
  if (dotsWrap && reviewCards.length > 1){
    setInterval(() => {
      goToReview((activeReview + 1) % reviewCards.length);
    }, 5500);
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.accordion__head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.parentElement;
      const wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ---------- BOOKING FORM VALIDATION ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const successClose = document.getElementById('successClose');

  if (bookingForm && bookingSuccess && successClose){
    // Prevent booking a date in the past
    const dateInput = document.getElementById('fdate');
    if (dateInput){
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('fname');
      const phone = document.getElementById('fphone');
      const service = document.getElementById('fservice');
      const date = document.getElementById('fdate');
      const time = document.getElementById('ftime');

      valid = validateField(name, name.value.trim().length >= 2) && valid;
      valid = validateField(phone, /^[0-9+\-\s()]{7,}$/.test(phone.value.trim())) && valid;
      valid = validateField(service, service.value !== '') && valid;
      valid = validateField(date, date.value !== '') && valid;
      valid = validateField(time, time.value !== '') && valid;

      if (valid){
        bookingForm.reset();
        bookingSuccess.classList.add('is-visible');
      }
    });

    successClose.addEventListener('click', () => bookingSuccess.classList.remove('is-visible'));
  }

  function validateField(field, condition){
    const group = field.closest('.form-group');
    group.classList.toggle('has-error', !condition);
    return condition;
  }

  /* ---------- SHARED BOOKING STATE ---------- */
  const SPECIALISTS_DATA = {
    'Any specialist': { photo: null, role: '', experience: '' },
    'Camille Laurent': { photo: 'https://images.pexels.com/photos/3992872/pexels-photo-3992872.jpeg?auto=compress&cs=tinysrgb&w=150', role: 'Founder & Master Stylist', experience: '12 years experience' },
    'Elena Moreau': { photo: 'https://images.pexels.com/photos/3992866/pexels-photo-3992866.jpeg?auto=compress&cs=tinysrgb&w=150', role: 'Senior Colorist', experience: '9 years experience' },
    'Sofia Marchetti': { photo: 'https://images.pexels.com/photos/6187850/pexels-photo-6187850.jpeg?auto=compress&cs=tinysrgb&w=150', role: 'Nail & Lash Artist', experience: '7 years experience' },
    'Daniel Reyes': { photo: 'https://images.pexels.com/photos/6186761/pexels-photo-6186761.jpeg?auto=compress&cs=tinysrgb&w=150', role: 'Skin & Spa Therapist', experience: '8 years experience' }
  };

  const I18N_CALENDAR = {
    en: { weekdays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], months:['January','February','March','April','May','June','July','August','September','October','November','December'], today:'Today', tomorrow:'Tomorrow' },
    ru: { weekdays:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'], months:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], today:'Сегодня', tomorrow:'Завтра' },
    kk: { weekdays:['Жс','Дс','Сс','Ср','Бс','Жм','Сб'], months:['Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'], today:'Бүгін', tomorrow:'Ертең' },
    ky: { weekdays:['Жк','Дш','Ше','Шр','Бш','Жм','Иш'], months:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], today:'Бүгүн', tomorrow:'Эртең' },
    uz: { weekdays:['Ya','Du','Se','Ch','Pa','Ju','Sh'], months:['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'], today:'Bugun', tomorrow:'Ertaga' }
  };

  function getSelectedServices(){
    try { return JSON.parse(localStorageSafeGet('aurelie_selected_services') || '[]'); }
    catch(e){ return []; }
  }
  function saveSelectedServices(list){ localStorageSafeSet('aurelie_selected_services', JSON.stringify(list)); }
  function getChosenSpecialist(){ return localStorageSafeGet('aurelie_selected_specialist'); }
  function saveChosenSpecialist(name){ localStorageSafeSet('aurelie_selected_specialist', name); }
  function getChosenDateTime(){
    return {
      date: localStorageSafeGet('aurelie_selected_date') || '',
      dateLabel: localStorageSafeGet('aurelie_selected_date_label') || '',
      time: localStorageSafeGet('aurelie_selected_time') || ''
    };
  }
  function saveChosenDateTime(date, dateLabel, time){
    localStorageSafeSet('aurelie_selected_date', date);
    localStorageSafeSet('aurelie_selected_date_label', dateLabel);
    localStorageSafeSet('aurelie_selected_time', time);
  }
  function getServicesTotals(){
    const services = getSelectedServices();
    let price = 0, minutes = 0;
    services.forEach(s => {
      price += parseFloat(s.price || 0);
      minutes += parseInt(s.duration || 0, 10);
    });
    return { price, minutes, count: services.length };
  }
  function formatDuration(minutes){
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h && m) return `${h}h ${m}min`;
    if (h) return `${h}h`;
    return `${m}min`;
  }
  function t(key, fallback){ return (translations[currentLang] && translations[currentLang][key]) || fallback; }

  function sendBookingToWhatsapp(name, phone, comment){
    const services = getSelectedServices();
    const specialist = getChosenSpecialist() || 'Any specialist';
    const dt = getChosenDateTime();
    const totals = getServicesTotals();
    const serviceText = services.length
      ? services.map(s => `${s.name} — $${s.price}`).join('\n')
      : 'not specified';
    let message = `Hello! I'd like to book an appointment.\n\n`;
    message += `Specialist: ${specialist}\n`;
    if (dt.dateLabel && dt.time) message += `Date & time: ${dt.dateLabel}, ${dt.time}\n`;
    message += `\nServices:\n${serviceText}\n\nTotal: $${totals.price} (${formatDuration(totals.minutes)})\n`;
    if (name) message += `\nName: ${name}`;
    if (phone) message += `\nPhone: ${phone}`;
    if (comment) message += `\nComment: ${comment}`;
    const url = 'https://wa.me/15551234567?text=' + encodeURIComponent(message);
    window.open(url, '_blank');
  }

  /* ---------- SERVICE SELECTION PAGE (services.html) ---------- */
  const serviceRows = document.querySelectorAll('.service-row');
  const servicesSummary = document.getElementById('servicesSummary');
  const summaryCount = document.getElementById('summaryCount');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryList = document.getElementById('summaryList');
  const continueBtn = document.getElementById('continueBtn');

  if (serviceRows.length){
    let selected = getSelectedServices();

    function refreshServiceUI(){
      let totalMinutes = 0;
      serviceRows.forEach(row => {
        const isSel = selected.some(s => s.name === row.dataset.name);
        row.classList.toggle('is-selected', isSel);
        const check = row.querySelector('.service-row__check i');
        if (check) check.style.display = isSel ? 'block' : 'none';
      });
      selected.forEach(s => totalMinutes += parseInt(s.duration || 0, 10));

      if (summaryCount) summaryCount.innerHTML = selected.length + ' <span data-i18n="selected_label">' + t('selected_label','selected') + '</span>';
      if (summaryDuration) summaryDuration.textContent = selected.length ? formatDuration(totalMinutes) : '';
      if (summaryList){
        summaryList.innerHTML = selected.map(s => `
          <div class="summary-row" data-name="${s.name}">
            <span class="summary-row__name">${s.name}</span>
            <span class="summary-row__price">$${s.price}</span>
            <button class="summary-row__remove" aria-label="Remove"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `).join('');
        summaryList.querySelectorAll('.summary-row__remove').forEach(btn => {
          btn.addEventListener('click', () => {
            const name = btn.closest('.summary-row').dataset.name;
            selected = selected.filter(s => s.name !== name);
            saveSelectedServices(selected);
            refreshServiceUI();
          });
        });
      }
      if (servicesSummary) servicesSummary.classList.toggle('is-visible', selected.length > 0);
      if (continueBtn){
        if (getChosenSpecialist() && getChosenDateTime().time){
          continueBtn.textContent = t('review_btn', 'Review booking');
          continueBtn.setAttribute('href', 'review.html');
        } else {
          continueBtn.textContent = t('choose_btn', 'Choose');
          continueBtn.setAttribute('href', 'specialists.html');
        }
      }
    }

    serviceRows.forEach(row => {
      row.addEventListener('click', () => {
        const name = row.dataset.name;
        const idx = selected.findIndex(s => s.name === name);
        if (idx > -1){ selected.splice(idx, 1); }
        else {
          const img = row.querySelector('.service-row__img');
          selected.push({ name, price: row.dataset.price, duration: row.dataset.duration, photo: img ? img.src : '' });
        }
        saveSelectedServices(selected);
        refreshServiceUI();
      });
    });
    refreshServiceUI();

    // Category tabs
    document.querySelectorAll('#categoryTabs .filter-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#categoryTabs .filter-btn').forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const cat = tab.dataset.cat;
        document.querySelectorAll('.service-group').forEach(group => {
          group.style.display = (cat === 'all' || group.dataset.cat === cat) ? '' : 'none';
        });
      });
    });

    // Live search
    const searchInput = document.getElementById('serviceSearch');
    if (searchInput){
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        serviceRows.forEach(row => {
          const match = row.dataset.name.toLowerCase().includes(q);
          row.style.display = match ? '' : 'none';
        });
      });
    }
  }

  /* ---------- SPECIALIST + DATE/TIME SELECTION PAGE (specialists.html) ---------- */
  const specialistBlocks = document.querySelectorAll('.specialist-block');
  const summaryBar = document.getElementById('summaryBar');

  if (specialistBlocks.length){
    const TIME_SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];

    function selectSpecialistSlot(block, dateChip, time){
      specialistBlocks.forEach(b => b.classList.remove('has-selection'));
      block.classList.add('has-selection');
      const name = block.dataset.name;
      saveChosenSpecialist(name);
      saveChosenDateTime(dateChip.dataset.iso, dateChip.dataset.display, time);
      updateSummaryBar();
    }

    function updateSummaryBar(){
      const name = getChosenSpecialist();
      if (!name || !summaryBar) return;
      const data = SPECIALISTS_DATA[name] || {};
      const dt = getChosenDateTime();
      const totals = getServicesTotals();

      const avatarEl = document.getElementById('summaryAvatar');
      const nameEl = document.getElementById('summaryName');
      const datetimeEl = document.getElementById('summaryDatetime');
      const metaEl = document.getElementById('summaryMeta');
      const totalEl = document.getElementById('summaryTotal');

      if (avatarEl){
        if (data.photo){ avatarEl.src = data.photo; avatarEl.style.display = ''; }
        else { avatarEl.style.display = 'none'; }
      }
      if (nameEl) nameEl.textContent = name;
      if (datetimeEl) datetimeEl.textContent = dt.dateLabel && dt.time ? `${dt.dateLabel} · ${dt.time}` : '';
      if (metaEl) metaEl.textContent = totals.count + ' · ' + formatDuration(totals.minutes);
      if (totalEl) totalEl.textContent = '$' + totals.price;

      summaryBar.classList.add('is-visible');
    }

    specialistBlocks.forEach(block => {
      const wrap = block.querySelector('.date-strip-wrap');
      const monthLabel = wrap.querySelector('.date-strip-month');
      const stripEl = wrap.querySelector('.date-strip');
      const gridEl = wrap.querySelector('.time-grid');
      let weekOffset = 0;

      function renderWeek(){
        const cal = I18N_CALENDAR[currentLang] || I18N_CALENDAR.en;
        const today = new Date();
        stripEl.innerHTML = '';
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() + weekOffset * 7);
        monthLabel.textContent = cal.months[firstDay.getMonth()] + ' ' + firstDay.getFullYear();

        for (let i = 0; i < 7; i++){
          const d = new Date(firstDay);
          d.setDate(firstDay.getDate() + i);
          const isToday = d.toDateString() === today.toDateString();
          const tmr = new Date(today); tmr.setDate(today.getDate() + 1);
          const isTomorrow = d.toDateString() === tmr.toDateString();

          const chip = document.createElement('div');
          chip.className = 'date-chip' + (isToday ? ' is-today' : '');
          let label = cal.weekdays[d.getDay()];
          if (isToday) label = cal.today;
          else if (isTomorrow) label = cal.tomorrow;
          chip.innerHTML = `<span class="date-chip__label">${label}</span><span class="date-chip__num">${d.getDate()}</span>`;
          chip.dataset.iso = d.toISOString().split('T')[0];
          chip.dataset.display = d.getDate() + ' ' + cal.months[d.getMonth()] + ' ' + d.getFullYear();
          if (weekOffset === 0 && i === 0) chip.classList.add('is-active');
          chip.addEventListener('click', () => {
            stripEl.querySelectorAll('.date-chip').forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');
            gridEl.querySelectorAll('.time-chip').forEach(c => c.classList.remove('is-active'));
          });
          stripEl.appendChild(chip);
        }
      }

      function renderTimes(){
        gridEl.innerHTML = '';
        TIME_SLOTS.forEach(time => {
          const chip = document.createElement('div');
          chip.className = 'time-chip';
          chip.textContent = time;
          chip.addEventListener('click', () => {
            gridEl.querySelectorAll('.time-chip').forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');
            const activeDateChip = stripEl.querySelector('.date-chip.is-active');
            selectSpecialistSlot(block, activeDateChip, time);
          });
          gridEl.appendChild(chip);
        });
      }

      wrap.querySelectorAll('.date-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          weekOffset += parseInt(btn.dataset.dir, 10);
          if (weekOffset < 0) weekOffset = 0;
          renderWeek();
        });
      });

      renderWeek();
      renderTimes();
    });

    // If a specialist/date/time were already chosen before (coming back to this page), reflect it
    if (getChosenSpecialist() && getChosenDateTime().time) updateSummaryBar();
  }

  /* ---------- REVIEW PAGE (review.html) ---------- */
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm){
    const name = getChosenSpecialist() || 'Any specialist';
    const data = SPECIALISTS_DATA[name] || {};
    const dt = getChosenDateTime();
    const services = getSelectedServices();
    const totals = getServicesTotals();

    const imgEl = document.getElementById('reviewSpecialistImg');
    const iconEl = document.getElementById('reviewSpecialistIcon');
    const nameEl = document.getElementById('reviewSpecialistName');
    const roleEl = document.getElementById('reviewSpecialistRole');
    const dateEl = document.getElementById('reviewDate');
    const timeEl = document.getElementById('reviewTime');
    const durationEl = document.getElementById('reviewServicesDuration');
    const listEl = document.getElementById('reviewServicesList');
    const totalEl = document.getElementById('reviewTotal');

    if (data.photo){ if (imgEl){ imgEl.src = data.photo; imgEl.style.display = ''; } }
    else if (iconEl){ iconEl.style.display = ''; }
    if (nameEl) nameEl.textContent = name;
    if (roleEl) roleEl.textContent = [data.role, data.experience].filter(Boolean).join(' · ');
    if (dateEl) dateEl.textContent = dt.dateLabel || '—';
    if (timeEl) timeEl.textContent = dt.time || '';
    if (durationEl) durationEl.textContent = formatDuration(totals.minutes);
    if (listEl){
      listEl.innerHTML = services.map(s => `
        <div class="review-service-item">
          ${s.photo ? `<img src="${s.photo}" alt="${s.name}">` : ''}
          <div class="review-service-item__body">
            <strong>${s.name}</strong>
            <span>${formatDuration(parseInt(s.duration||0,10))}</span>
          </div>
          <span class="review-service-item__price">$${s.price}</span>
        </div>
      `).join('');
    }
    if (totalEl) totalEl.textContent = '$' + totals.price;

    // Live validation: enable submit only once name + phone are filled
    const nameInput = document.getElementById('rName');
    const phoneInput = document.getElementById('rPhone');
    const commentInput = document.getElementById('rComment');
    const commentCount = document.getElementById('rCommentCount');
    const submitBtn = document.getElementById('reviewSubmit');

    function checkReady(){
      const ready = nameInput.value.trim().length >= 2 && phoneInput.value.trim().length >= 6;
      submitBtn.classList.toggle('is-ready', ready);
    }
    nameInput.addEventListener('input', checkReady);
    phoneInput.addEventListener('input', checkReady);
    if (commentInput && commentCount){
      commentInput.addEventListener('input', () => {
        commentCount.textContent = commentInput.value.length;
      });
    }

    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!submitBtn.classList.contains('is-ready')) return;
      sendBookingToWhatsapp(nameInput.value.trim(), phoneInput.value.trim(), commentInput.value.trim());
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
