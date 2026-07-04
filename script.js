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
  function updateBackToTop(){
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  document.addEventListener('scroll', updateBackToTop, { passive:true });
  backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
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

  /* ---------- DARK / LIGHT MODE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorageSafeGet('aurelie-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorageSafeSet('aurelie-theme', next);
    updateThemeIcon();
  });
  function updateThemeIcon(){
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>';
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
    }
  };

  const langToggle = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');
  let currentLang = localStorageSafeGet('aurelie-lang') || 'en';
  applyLang(currentLang);

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ru' : 'en';
    localStorageSafeSet('aurelie-lang', currentLang);
    applyLang(currentLang);
  });

  function applyLang(lang){
    langLabel.textContent = lang.toUpperCase();
    document.documentElement.lang = lang;
    if (lang === 'en'){
      // restore original English text saved on first load
      document.querySelectorAll('[data-i18n]').forEach(el => {
        if (el.dataset.enOriginal) el.textContent = el.dataset.enOriginal;
      });
      return;
    }
    const dict = translations.ru;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (!el.dataset.enOriginal) el.dataset.enOriginal = el.textContent;
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
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
  document.querySelectorAll('.masonry__item').forEach(item => {
    const zoomBtn = item.querySelector('.masonry__zoom');
    const photo = item.querySelector('.gallery-img');
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

  /* ---------- VIDEO MODAL ---------- */
  const videoModal = document.getElementById('videoModal');
  const videoPlay = document.getElementById('videoPlay');
  const videoModalClose = document.getElementById('videoModalClose');
  videoPlay.addEventListener('click', () => videoModal.classList.add('is-open'));
  videoModalClose.addEventListener('click', () => videoModal.classList.remove('is-open'));
  videoModal.addEventListener('click', (e) => { if (e.target === videoModal) videoModal.classList.remove('is-open'); });

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
  reviewCards.forEach((card, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Show review ' + (i + 1));
    if (i === 0){ dot.classList.add('is-active'); card.classList.add('is-active'); }
    dot.addEventListener('click', () => goToReview(i));
    dotsWrap.appendChild(dot);
  });
  function goToReview(index){
    reviewCards[activeReview].classList.remove('is-active');
    dotsWrap.children[activeReview].classList.remove('is-active');
    activeReview = index;
    reviewCards[activeReview].classList.add('is-active');
    dotsWrap.children[activeReview].classList.add('is-active');
  }
  setInterval(() => {
    goToReview((activeReview + 1) % reviewCards.length);
  }, 5500);

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

  function validateField(field, condition){
    const group = field.closest('.form-group');
    group.classList.toggle('has-error', !condition);
    return condition;
  }

  successClose.addEventListener('click', () => bookingSuccess.classList.remove('is-visible'));

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
