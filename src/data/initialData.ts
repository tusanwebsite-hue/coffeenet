import {
  RegistrationOpportunity,
  GovernmentSystem,
  GuildNewsItem,
  SystemLinkBankItem,
  UserCafeSettings,
} from '../types';

// Helper to generate ISO dates relative to now
const relativeDate = (daysDiff: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysDiff);
  return d.toISOString();
};

export const INITIAL_REGISTRATIONS: RegistrationOpportunity[] = [
  {
    id: 'reg-medu-1',
    title: 'آزمون استخدامی مشاغل کیفیت‌بخشی و آموزگاری آموزش و پرورش (ماده ۲۸)',
    organization: 'وزارت آموزش و پرورش و سازمان سنجش آموزش کشور',
    category: 'exam',
    summary: 'فراخوان جذب معلمان، مربیان امور تربیتی، مشاوره و بهداشت برای مدارس سراسر کشور. ثبت‌نام از طریق درگاه رسمی سنجش با استعلام خودکار کد ملی و تاییدیه تحصیلی.',
    requirements: [
      'دارا بودن مدرک کارشناسی یا بالاتر در رشته‌های اعلام شده در دفترچه آزمون',
      'کارت پایان خدمت یا معافیت دائم پزشکی یا غیرپزشکی برای آقایان',
      'حداکثر سن ۴۰ سال تمام در زمان ثبت‌نام (برای کارشناسی ارشد و دکتری با سوابق)',
      'فایل اسکن شده عکس پرسنلی ۴×۳ جدید با مشخصات استاندارد سنجش'
    ],
    publishedAt: relativeDate(-2), // 2 days ago
    deadlineAt: relativeDate(7), // 7 days remaining
    officialUrl: 'https://sanjesh.org',
    sourceName: 'سازمان سنجش و پورتال ایران استخدام',
    sourceUrl: 'https://sanjesh.org',
    isVerified: true,
    isBookmarked: false,
    feeEstimated: '۲۳۰,۰۰۰ تومان (خرید سریال کارت اعتباری)',
    tags: ['آموزش و پرورش', 'استخدامی', 'سنجش', 'ایران استخدام', 'ماده ۲۸']
  },
  {
    id: 'reg-cbi-loan',
    title: 'سامانه ثبت‌نام و نوبت‌دهی وام قرض‌الحسنه ازدواج و فرزندآوری',
    organization: 'بانک مرکزی جمهوری اسلامی ایران',
    category: 'loan',
    summary: 'ثبت‌نام اینترنتی و رزرو نوبت متقاضیان تسهیلات قرض‌الحسنه ازدواج (تا سقف ۳۵۰ میلیون تومان به ازای هر زوج) و فرزندآوری بدون پیش‌پرداخت.',
    requirements: [
      'سند رسمی ازدواج با تاریخ وقوع عقد بعد از ۱ فروردین ۱۴۰۰',
      'کارت ملی هوشمند، شناسنامه و شماره شبای بانکی معتبر متقاضی',
      'کد پستی ۱۰ رقمی ثبت شده در سامانه ملی املاک و اسکان',
      'سیم‌کارت فعال به نام متقاضی جهت دریافت کد تأیید پیامکی'
    ],
    publishedAt: relativeDate(-3),
    deadlineAt: null, // مهلت رسمی مشخص نشده است (سامانه در طول سال فعال است)
    officialUrl: 'https://ve.cbi.ir',
    sourceName: 'سامانه رسمی تسهیلات قرض‌الحسنه بانک مرکزی',
    sourceUrl: 'https://ve.cbi.ir',
    isVerified: true,
    isBookmarked: true,
    feeEstimated: 'طبق تعرفه خدمات کافی‌نت و ثبت‌نام اینترنتی',
    tags: ['وام ازدواج', 'فرزندآوری', 'بانک مرکزی', 'سیگنال', 'تسهیلات']
  },
  {
    id: 'reg-auto-ikco',
    title: 'طرح جدید پیش‌فروش و فروش فوق‌العاده محصولات ایران‌خودرو و سامانه اتونوین',
    organization: 'گروه صنعتی ایران خودرو و سامانه اتونوین',
    category: 'auto',
    summary: 'آغاز مرحله جدید ثبت درخواست خرید خودروهای پژو ۲۰۷، تارا، ری‌را و هایما برای متقاضیان عادی، طرح جوانی جمعیت و جایگزینی خودروهای فرسوده با افتتاح حساب وکالتی.',
    requirements: [
      'افتتاح حساب وکالتی در بانک‌های عامل منتخب با مسدودی وجه مصوب',
      'دارا بودن گواهینامه رانندگی پایه سوم دارای اعتبار',
      'نداشتن پلاک انتظامی فعال و عدم خرید خودرو طی ۴۸ ماه گذشته',
      'ثبت کد پستی و مشخصات در سامانه ملی املاک و اسکان'
    ],
    publishedAt: relativeDate(-1), // 1 day ago
    deadlineAt: relativeDate(4), // 4 days remaining -> Ending Soon
    officialUrl: 'https://esale.ikco.ir',
    sourceName: 'پورتال رسمی ایران خودرو و سامانه اتونوین',
    sourceUrl: 'https://esale.ikco.ir',
    isVerified: true,
    isBookmarked: true,
    feeEstimated: 'تعرفه فرم ثبت مشخصات و رزرو نوبت کافی‌نت',
    tags: ['ایران خودرو', 'اتونوین', 'حساب وکالتی', 'فروش خودرو', 'سایپا']
  },
  {
    id: 'reg-hrtc-exam',
    title: 'دوازدهمین آزمون استخدامی فراگیر دستگاه‌های اجرایی کشور',
    organization: 'سازمان اداری و استخدامی و مرکز آزمون جهاد دانشگاهی',
    category: 'exam',
    summary: 'فراخوان جذب نیروی پیمانی و رسمی در وزارت جهاد کشاورزی، وزارت اقتصاد، شیلات، گمرک جمهوری اسلامی و ۱۸ سازمان دولتی دیگر از طریق جهاد دانشگاهی.',
    requirements: [
      'مدرک تحصیلی مرتبط در مقاطع کاردانی، کارشناسی یا ارشد',
      'کارت پایان خدمت یا کارت معافیت دائم قانونی برای برادران',
      'پذیرش شرایط بومی‌گزینی و سلامت جسمی و روانی'
    ],
    publishedAt: relativeDate(-4),
    deadlineAt: relativeDate(6),
    officialUrl: 'https://hrtc.ir',
    sourceName: 'مرکز آزمون جهاد دانشگاهی و ایران استخدام',
    sourceUrl: 'https://hrtc.ir',
    isVerified: true,
    isBookmarked: false,
    feeEstimated: '۳۷۰,۰۰۰ تومان (خرید توکن آزمون جهاد دانشگاهی)',
    tags: ['جهاد دانشگاهی', 'دستگاه‌های اجرایی', 'ایران استخدام', 'استخدام دولتی']
  },
  {
    id: 'reg-uni-free',
    title: 'ثبت‌نام پذیرش دانشجو صرفاً بر اساس سوابق تحصیلی دانشگاه‌های سراسری و پیام نور',
    organization: 'سازمان سنجش آموزش کشور',
    category: 'university',
    summary: 'ثبت‌نام بدون کنکور و پذیرش دانشجو در مقاطع کاردانی و کارشناسی پیوسته و ناپیوسته بر اساس معدل کتبی دیپلم برای نوبت جدید.',
    requirements: [
      'مدرک دیپلم نظام جدید ۶-۳-۳ یا دیپلم نظام قدیم و پیش‌دانشگاهی',
      'کد ۱۹ رقمی سابقه تحصیلی از درگاه مای‌مدیو (my.medu.ir)',
      'عکس اسکن شده جدید متقاضی با رزولوشن استاندارد'
    ],
    publishedAt: relativeDate(-5),
    deadlineAt: relativeDate(11),
    officialUrl: 'https://sanjesh.org',
    sourceName: 'سازمان سنجش آموزش کشور و گروه مشاوره هیوا',
    sourceUrl: 'https://sanjesh.org',
    isVerified: true,
    isBookmarked: false,
    feeEstimated: '۲۱۰,۰۰۰ تومان',
    tags: ['سوابق تحصیلی', 'بدون کنکور', 'هیوا', 'سنجش', 'پیام نور']
  },
  {
    id: 'reg-amlak-eskan',
    title: 'الزام قانونی ثبت مشخصات ملکی و اقامتگاهی در سامانه ملی املاک و اسکان',
    organization: 'وزارت راه و شهرسازی',
    category: 'identity',
    summary: 'ثبت اقامتگاه اصلی و فرعی سرپرستان خانوار و مستأجران جهت جلوگیری از مسدودی حساب‌های بانکی، خدمات گذرنامه و صدور کد رهگیری رایگان اجاره مسکن.',
    requirements: [
      'کد ملی و شماره موبایل به نام شخص سرپرست خانوار',
      'کد پستی ۱۰ رقمی معتبر اقامتگاه',
      'شناسه قبض برق یا شماره سریال سند مالکیت / اجاره‌نامه'
    ],
    publishedAt: relativeDate(-8),
    deadlineAt: null, // مهلت رسمی مشخص نشده است
    officialUrl: 'https://amlak.mrud.ir',
    sourceName: 'پایگاه اطلاع‌رسانی دولت و وزارت راه و شهرسازی',
    sourceUrl: 'https://amlak.mrud.ir',
    isVerified: true,
    isBookmarked: false,
    feeEstimated: 'تعرفه استعلام اقامتگاه و دریافت کد رهگیری',
    tags: ['املاک و اسکان', 'مسکن', 'پیشخوان دولت', 'کد رهگیری']
  },
  {
    id: 'reg-tamin-records',
    title: 'سامانه غیرحضوری سوابق بیمه و احکام متناسب‌سازی بازنشستگان تأمین اجتماعی',
    organization: 'سازمان تأمین اجتماعی',
    category: 'social_security',
    summary: 'امکان مشاهده سوابق تلفیقی، صدور فیش و احکام جدید متناسب‌سازی حقوق بازنشستگان و مستمری‌بگیران و ارسال اینترنتی لیست حق بیمه کارفرمایان.',
    requirements: [
      'کد ملی و شماره تلفن همراه به نام بیمه‌شده',
      'رمز عبور سامانه تأمین اجتماعی (یا ثبت‌نام جدید حساب کاربری)'
    ],
    publishedAt: relativeDate(-3),
    deadlineAt: null,
    officialUrl: 'https://eservices.tamin.ir',
    sourceName: 'پورتال خدمات الکترونیک تأمین اجتماعی و اخبار کافی‌نت',
    sourceUrl: 'https://eservices.tamin.ir',
    isVerified: true,
    isBookmarked: true,
    feeEstimated: 'تعرفه استعلام و پرینت سوابق بیمه‌ای',
    tags: ['تأمین اجتماعی', 'سوابق بیمه', 'بازنشستگان', 'فیش حقوقی']
  },
  {
    id: 'reg-tek-employment',
    title: 'تسهیلات اشتغال‌زایی تبصره ۲ و سامانه تک (طرح‌های مشاغل خانگی)',
    organization: 'وزارت تعاون، کار و رفاه اجتماعی',
    category: 'loan',
    summary: 'ثبت‌نام وام کم‌بهره ۴ درصدی اشتغال کارآفرینی و مشاغل خانگی با ارائه مجوز معتبر درگاه ملی مجوزها و معرفی به بانک‌های عامل.',
    requirements: [
      'شناسه یکتای مجوز کسب‌وکار از درگاه ملی مجوزها (mojavez.ir)',
      'طرح توجیهی اشتغال‌زایی',
      'نداشتن بیمه اجباری کارگری در زمان ثبت درخواست'
    ],
    publishedAt: relativeDate(-6),
    deadlineAt: relativeDate(15),
    officialUrl: 'https://mcls.gov.ir',
    sourceName: 'پورتال وزارت کار و سامانه تک اشتغال',
    sourceUrl: 'https://mcls.gov.ir',
    isVerified: true,
    isBookmarked: false,
    feeEstimated: 'تعرفه ثبت فرم طرح کسب‌وکار',
    tags: ['وام اشتغال', 'مشاغل خانگی', 'وزارت کار', 'سامانه تک']
  }
];

export const INITIAL_SYSTEMS: GovernmentSystem[] = [
  {
    id: 'sys-sanjesh',
    name: 'سازمان سنجش آموزش کشور',
    organization: 'وزارت علوم، تحقیقات و فناوری',
    category: 'آموزش و آزمون',
    url: 'https://sanjesh.org',
    status: 'up',
    latencyMs: 380,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'درگاه آزمون‌های سراسری، کارشناسی ارشد، دکتری و آزمون استخدامی دستگاه‌های اجرایی.',
    message: 'صفحه اصلی و زیرسامانه‌های ثبت‌نام آزمون‌ها فعال هستند.',
    userReports: 'کافی‌نت‌ها پایداری سرعت در ساعات آغازین صبح را گزارش کرده‌اند؛ در ساعات پایانی مهلت احتمال ترافیک سنگین وجود دارد.',
    ssoStatus: 'active',
    reliabilityScore: 94,
    isPinned: true
  },
  {
    id: 'sys-cbi-loan',
    name: 'سامانه تسهیلات وام ازدواج و فرزندآوری بانک مرکزی',
    organization: 'بانک مرکزی جمهوری اسلامی ایران',
    category: 'بانک و تسهیلات',
    url: 'https://ve.cbi.ir',
    status: 'up',
    latencyMs: 460,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'درگاه رسمی نوبت‌دهی و ثبت‌نام وام ازدواج و فرزندآوری در کلیه استان‌ها.',
    message: 'سامانه آنلاین است؛ سهمیه شعب بانکی در استان‌ها مرحله‌ای باز می‌شود.',
    userReports: 'کاربران گزارش داده‌اند سهمیه بانک‌های ملی و ملت در ابتدای هر هفته ساعت ۸:۰۰ صبح باز و در دقایق نخست پر می‌شود.',
    ssoStatus: 'active',
    reliabilityScore: 88,
    isPinned: true
  },
  {
    id: 'sys-auto-ikco',
    name: 'سامانه فروش اینترنتی ایران خودرو و سامانه اتونوین',
    organization: 'گروه صنعتی ایران خودرو / اتونوین',
    category: 'خودرو',
    url: 'https://esale.ikco.ir',
    status: 'degraded',
    latencyMs: 3400,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'درگاه ثبت‌نام خودرو، استعلام حساب وکالتی و نتایج قرعه‌کشی و اولویت‌بندی.',
    message: 'پاسخ دریافت می‌شود اما زمان انتظار در صف ورود بالا است.',
    userReports: 'گزارش‌های متعدد دفاتر پیشخوان حاکی از اختلال در احراز هویت پیامکی در ساعات اولیه طرح فروش است.',
    ssoStatus: 'degraded',
    reliabilityScore: 68,
    isPinned: true
  },
  {
    id: 'sys-auto-saipa',
    name: 'سامانه فروش اینترنتی سایپا',
    organization: 'گروه خودروسازی سایپا',
    category: 'خودرو',
    url: 'https://saipa.iranecar.com',
    status: 'up',
    latencyMs: 690,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'پورتال رسمی پیش‌فروش و فروش فوری محصولات سایپا و زامیاد.',
    message: 'درگاه در دسترس و ثبت اطلاعات مشتریان برقرار است.',
    userReports: 'پایداری مناسب؛ تسویه‌حساب درگاه بانکی در مرحله آخر تایید می‌شود.',
    ssoStatus: 'active',
    reliabilityScore: 82,
    isPinned: false
  },
  {
    id: 'sys-tamin',
    name: 'سامانه خدمات غیرحضوری تأمین اجتماعی',
    organization: 'سازمان تأمین اجتماعی کشور',
    category: 'بیمه و بازنشستگی',
    url: 'https://eservices.tamin.ir',
    status: 'up',
    latencyMs: 510,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'سوابق تلفیقی، فیش حقوقی، استحقاق درمان، هدیه ازدواج و ارسال لیست کارفرمایان.',
    message: 'ورود به سامانه با رمز عبور و تأیید هویت پیامکی فعال است.',
    userReports: 'پایداری عالی در تمام ساعات روز؛ استعلام سریع سوابق و نسخه الکترونیک بدون قطعی کار می‌کند.',
    ssoStatus: 'active',
    reliabilityScore: 96,
    isPinned: true
  },
  {
    id: 'sys-mygov',
    name: 'پنجره ملی خدمات دولت هوشمند',
    organization: 'سازمان فناوری اطلاعات ایران',
    category: 'درگاه جامع دولتی',
    url: 'https://my.gov.ir',
    status: 'up',
    latencyMs: 410,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'درگاه ورود یکپارچه SSO به بیش از ۱۰۰ سامانه دولتی و وزارتخانه‌ای کشور.',
    message: 'سرویس احراز هویت مرکزی و ارسال کد پیامکی پایدار است.',
    userReports: 'سرعت لاگین مناسب است؛ اتصال به سامانه‌های ثبت احوال و ثبت اسناد برقرار می‌باشد.',
    ssoStatus: 'active',
    reliabilityScore: 95,
    isPinned: true
  },
  {
    id: 'sys-adliran-eblagh',
    name: 'سامانه عدل ایران و ابلاغ الکترونیک قضایی (ثنا)',
    organization: 'مرکز آمار و فناوری اطلاعات قوه قضائیه',
    category: 'قضایی و ثنا',
    url: 'https://eblagh.adliran.ir',
    status: 'needs_check',
    latencyMs: 1650,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'مشاهده ابلاغیه‌های دادگستری، ثبت شکواییه، گواهی عدم سوء پیشینه و نوبت‌دهی دادگاه.',
    message: 'به دلیل تمهیدات ضد حملات سایبری ممکن است نیازمند آی‌پی ایران و بررسی مجدد باشد.',
    userReports: 'ورود کاربران با آی‌پی‌های بدون DNS داخلی با کندی یا خطای دسترسی روبرو می‌شود؛ توصیه به استفاده از اینترنت ملی.',
    ssoStatus: 'degraded',
    reliabilityScore: 75,
    isPinned: true
  },
  {
    id: 'sys-hrtc',
    name: 'مرکز آزمون جهاد دانشگاهی (HRTC)',
    organization: 'جهاد دانشگاهی کشور',
    category: 'آموزش و آزمون',
    url: 'https://hrtc.ir',
    status: 'up',
    latencyMs: 490,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'سامانه ثبت‌نام آزمون‌های استخدامی کشوری، آزمون مشاغل قضایی و دستگاه‌های دولتی.',
    message: 'سامانه خرید توکن و بارگذاری مدارک بدون اختلال فعال است.',
    userReports: 'پایداری عالی در ثبت‌نام‌ها و دریافت کارت ورود به جلسه آزمون‌های فراگیر.',
    ssoStatus: 'active',
    reliabilityScore: 93,
    isPinned: true
  },
  {
    id: 'sys-amlak',
    name: 'سامانه ملی املاک و اسکان کشور',
    organization: 'وزارت راه و شهرسازی',
    category: 'مسکن و مستغلات',
    url: 'https://amlak.mrud.ir',
    status: 'up',
    latencyMs: 720,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'ثبت اقامتگاه، تایید کد پستی، صدور رایگان کد رهگیری قراردادهای اجاره مسکونی.',
    message: 'سرویس استعلام کد پستی شرکت پست متصل و فعال است.',
    userReports: 'ثبت قرارداد رایگان اجاره برقرار است؛ تأیید پیامکی موجر و مستأجر بدون تاخیر ارسال می‌شود.',
    ssoStatus: 'active',
    reliabilityScore: 91,
    isPinned: false
  },
  {
    id: 'sys-tax',
    name: 'درگاه ملی خدمات الکترونیک سازمان امور مالیاتی',
    organization: 'سازمان امور مالیاتی کشور',
    category: 'مالیات و مودیان',
    url: 'https://my.tax.gov.ir',
    status: 'up',
    latencyMs: 580,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'تسلیم اظهارنامه عملکرد، تبصره ۱۰۰ مشاغل، استعلام بدهی مالیاتی و صدور قبض مالیات.',
    message: 'سامانه مودیان و کارپوشه فعال است.',
    userReports: 'کافی‌نت‌ها عملکرد صدور قبوض مالیاتی و استعلام پرونده را بدون خطا تأیید کرده‌اند.',
    ssoStatus: 'active',
    reliabilityScore: 92,
    isPinned: false
  },
  {
    id: 'sys-sakha',
    name: 'پنجره خدمات الکترونیک انتظامی سخا (فراجا)',
    organization: 'فرماندهی انتظامی جمهوری اسلامی ایران',
    category: 'انتظامی و گذرنامه',
    url: 'https://sakha.epolice.ir',
    status: 'up',
    latencyMs: 650,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'صدور و تعویض اینترنتی گذرنامه، استعلام خلافی خودرو، وضعیت نظام وظیفه و گواهینامه.',
    message: 'درگاه احراز هویت فراجا آنلاین و صدور گذرنامه زیارتی برقرار است.',
    userReports: 'در ساعات عصرگاهی بارگذاری عکس بیومتریک ممکن است نیازمند چند بار تلاش باشد.',
    ssoStatus: 'active',
    reliabilityScore: 89,
    isPinned: true
  },
  {
    id: 'sys-mojavez',
    name: 'درگاه ملی مجوزهای کشور (G4B)',
    organization: 'وزارت امور اقتصادی و دارایی',
    category: 'مجوزها و اصناف',
    url: 'https://mojavez.ir',
    status: 'up',
    latencyMs: 610,
    statusCode: 200,
    lastChecked: relativeDate(0),
    description: 'سامانه ثبت درخواست و صدور پروانه کسب صنفی، مشاغل خانگی و شناسه یکتا.',
    message: 'صدور آنی شناسه یکتا برای پروانه‌های قدیمی فعال است.',
    userReports: 'اتصال بدون قطعی به سامانه‌های اتاق اصناف و دریافت پاسخ‌های استعلامی ثبت‌احوال.',
    ssoStatus: 'active',
    reliabilityScore: 94,
    isPinned: false
  }
];

export const INITIAL_NEWS: GuildNewsItem[] = [
  {
    id: 'news-nerkh-1',
    title: 'ابلاغیه رسمی جدول نرخ‌نامه مصوب خدمات رایانه‌ای و اینترنتی صنف کافی‌نت',
    category: 'rates',
    publishedAt: relativeDate(-1),
    sourceName: 'کمیسیون نظارت بر سازمان‌های صنفی و اتحادیه فناوران رایانه',
    summary: 'نرخ‌نامه جدید خدمات صنف کافی‌نت و خدمات الکترونیک ابلاغ گردید. کلیه دفاتر موظفند جدول تعرفه را در محل دید مشتریان نصب نمایند. اخذ هرگونه مبلغ مازاد بر تعرفه مصوب تخلف صنفی محسوب می‌شود.',
    isUrgent: true,
    isVerified: true
  },
  {
    id: 'news-cafenet-2',
    title: 'دستورالعمل اجرایی نحوه ثبت‌نام اینترنتی متقاضیان وام ازدواج و فرزندآوری در کافی‌نت‌ها',
    category: 'circular',
    publishedAt: relativeDate(-2),
    sourceName: 'کارگروه تسهیلات الکترونیک و امور بانکی اصناف',
    summary: 'پیرو سوالات همکاران در خصوص زمان باز شدن ظرفیت شعب بانکی، شعب بر اساس سهمیه‌بندی اعتباری بانک مرکزی در روزهای شنبه تا دوشنبه در ساعات ۸ الی ۱۰ صبح نسبت به شارژ سهمیه اقدام می‌نمایند. ثبت نام دقیق و تحویل کد رهگیری به متقاضی الزامی است.',
    isUrgent: false,
    isVerified: true
  },
  {
    id: 'news-fata-3',
    title: 'هشدار امنیتی مهم: ممنوعیت ذخیره‌سازی اطلاعات کارت‌های بانکی و کلمات عبور مشتریان',
    category: 'circular',
    publishedAt: relativeDate(-3),
    sourceName: 'پلیس فتا و بازرسی اصناف کشور',
    summary: 'همکاران گرامی صنف کافی‌نت و پیشخوان توجه داشته باشند: پاک‌سازی تاریخچه و کوکی‌های مرورگر پس از اتمام کار هر مشتری و عدم یادداشت شماره کارت، CVV2 و رمزهای دوم اکیداً الزامی است.',
    isUrgent: true,
    isVerified: true
  },
  {
    id: 'news-tax-4',
    title: 'نکات کلیدی ثبت فرم تبصره ماده ۱۰۰ مشاغل و سقف گردش پوزهای کافی‌نت‌ها',
    category: 'tax',
    publishedAt: relativeDate(-4),
    sourceName: 'سازمان امور مالیاتی کشور',
    summary: 'شرایط بهره‌مندی از مالیات مقطوع عملکرد، نحوه تفکیک تراکنش‌های واریزی به حساب و ثبت درست دستگاه‌های کارتخوان فعال متصل به پرونده مالیاتی تشریح گردید.',
    isUrgent: false,
    isVerified: true
  },
  {
    id: 'news-tech-5',
    title: 'توضیحات فنی درباره راهکار رفع کندی ورود به سامانه عدل ایران و سخا',
    category: 'technical',
    publishedAt: relativeDate(-5),
    sourceName: 'پشتیبانی فنی درگاه‌های خدمات الکترونیک',
    summary: 'با توجه به تدابیر امنیتی درگاه‌های قوه قضائیه و انتظامی، در صورت استفاده از سیستم‌های مجهز به VPN یا پروکسی خارجی، اتصال به سرورهای داخلی دچار اختلال می‌گردد. استفاده از مرورگر اختصاصی بدون افزونه‌های جانبی توصیه می‌شود.',
    isUrgent: false,
    isVerified: true
  }
];

export const INITIAL_LINKS: SystemLinkBankItem[] = [
  // ۱. آموزش، کنکور و آزمون‌ها
  {
    id: 'link-sanjesh-main',
    title: 'درگاه اصلی سازمان سنجش آموزش کشور',
    organization: 'سازمان سنجش',
    category: 'آموزش و آزمون',
    subCategory: 'سنجش و کنکور',
    url: 'https://sanjesh.org',
    description: 'ثبت‌نام و اعلام نتایج کنکور سراسری، کارشناسی ارشد، دکتری و آزمون‌های استخدامی کشوری',
    shortcutCode: 'SANJESH',
    isFavorite: true
  },
  {
    id: 'link-hrtc',
    title: 'مرکز آزمون جهاد دانشگاهی (HRTC)',
    organization: 'جهاد دانشگاهی',
    category: 'آموزش و آزمون',
    subCategory: 'آزمون‌های استخدامی',
    url: 'https://hrtc.ir',
    description: 'ثبت‌نام آزمون‌های استخدامی دستگاه‌های اجرایی، بانک‌ها و سازمان‌های دولتی',
    shortcutCode: 'HRTC',
    isFavorite: true
  },
  {
    id: 'link-azmoon-iau',
    title: 'مرکز سنجش، پذیرش و امور فارغ‌التحصیلی دانشگاه آزاد',
    organization: 'دانشگاه آزاد اسلامی',
    category: 'آموزش و آزمون',
    subCategory: 'دانشگاه آزاد',
    url: 'https://azmoon.org',
    description: 'ثبت‌نام بدون کنکور و با آزمون دانشگاه آزاد، انتخاب رشته و نتایج پذیرش',
    shortcutCode: 'AZMOON-IAU',
    isFavorite: true
  },
  {
    id: 'link-amozeshyar',
    title: 'سامانه آموزشیار دانشگاه آزاد اسلامی',
    organization: 'دانشگاه آزاد اسلامی',
    category: 'آموزش و آزمون',
    subCategory: 'دانشگاه آزاد',
    url: 'https://amozeshyar.iau.ir',
    description: 'انتخاب واحد، پرداخت شهریه، کارنامه تحصیلی و امور دانشجویی دانشگاه آزاد',
    shortcutCode: 'AMOZESHYAR',
    isFavorite: false
  },
  {
    id: 'link-mymedu',
    title: 'پنجره واحد خدمات الکترونیک وزارت آموزش و پرورش (مای‌مدیو)',
    organization: 'وزارت آموزش و پرورش',
    category: 'آموزش و آزمون',
    subCategory: 'آموزش و پرورش',
    url: 'https://my.medu.ir',
    description: 'سوابق تحصیلی کنکور، دریافت کارنامه نهایی، ثبت‌نام کتب درسی و هدایت تحصیلی',
    shortcutCode: 'MY-MEDU',
    isFavorite: true
  },
  {
    id: 'link-dipcode',
    title: 'سامانه استعلام تاییدیه تحصیلی دیپلم و پیش‌دانشگاهی',
    organization: 'آموزش و پرورش',
    category: 'آموزش و آزمون',
    subCategory: 'آموزش و پرورش',
    url: 'https://emtiaz.medu.ir',
    description: 'صدور تاییدیه تحصیلی مدرک دیپلم جهت ارائه به دانشگاه‌ها و استخدامی‌ها',
    shortcutCode: 'DIPCODE',
    isFavorite: true
  },
  {
    id: 'link-saorg',
    title: 'سامانه سجاد وزارت علوم (امور دانشجویان)',
    organization: 'وزارت علوم، تحقیقات و فناوری',
    category: 'آموزش و آزمون',
    subCategory: 'وزارت علوم',
    url: 'https://portal.saorg.ir',
    description: 'تاییدیه مدارک تحصیلی دانشگاهی، لغو تعهد رایگان، ارزشیابی مدارک خارجی و امور بورس',
    shortcutCode: 'SAJAD',
    isFavorite: false
  },
  {
    id: 'link-pnu',
    title: 'سامانه جامع گلستان دانشگاه پیام نور و دانشگاه‌های دولتی',
    organization: 'دانشگاه پیام نور',
    category: 'آموزش و آزمون',
    subCategory: 'دانشگاه دولتی و پیام نور',
    url: 'https://reg.pnu.ac.ir',
    description: 'پورتال انتخاب واحد، پرداخت شهریه، آزمون‌های مجازی و نمرات دانشجویان',
    shortcutCode: 'GOLESTAN',
    isFavorite: false
  },

  // ۲. خدمات قضایی، عدل ایران و ثنا
  {
    id: 'link-eblagh-adliran',
    title: 'سامانه ابلاغ الکترونیک قضایی (ابلاغیه دادگستری)',
    organization: 'قوه قضائیه',
    category: 'قضایی و ثنا',
    subCategory: 'عدل ایران',
    url: 'https://eblagh.adliran.ir',
    description: 'مشاهده و چاپ ابلاغیه‌های دادگاه‌ها، دادسراها و شورای حل اختلاف',
    shortcutCode: 'EBLAGH',
    isFavorite: true
  },
  {
    id: 'link-sana-reg',
    title: 'سامانه ثبت‌نام ثنا (احراز هویت الکترونیک قضایی)',
    organization: 'قوه قضائیه',
    category: 'قضایی و ثنا',
    subCategory: 'ثنا',
    url: 'https://sana.adliran.ir',
    description: 'ثبت‌نام اولیه شخص حقیقی و حقوقی، احراز هویت غیرحضوری و تغییر کلمه عبور ثنا',
    shortcutCode: 'SANA',
    isFavorite: true
  },
  {
    id: 'link-adliran-main',
    title: 'درگاه ملی خدمات الکترونیک قضایی (عدل ایران)',
    organization: 'قوه قضائیه',
    category: 'قضایی و ثنا',
    subCategory: 'عدل ایران',
    url: 'https://adliran.ir',
    description: 'اطلاع‌رسانی پرونده‌های قضایی با شماره پرونده و رمز، ثبت دادخواست و لایحه',
    shortcutCode: 'ADLIRAN',
    isFavorite: true
  },
  {
    id: 'link-nobat-adliran',
    title: 'سامانه نوبت‌دهی قضایی دادگاه‌ها و شعب اجرای احکام',
    organization: 'قوه قضائیه',
    category: 'قضایی و ثنا',
    subCategory: 'نوبت‌دهی قضایی',
    url: 'https://nobat.adliran.ir',
    description: 'رزرو نوبت مراجعه حضوری به شعب دادگاه، اجرای احکام مدنی و کیفری',
    shortcutCode: 'NOBAT-ADL',
    isFavorite: false
  },
  {
    id: 'link-ssaa',
    title: 'سازمان ثبت اسناد و املاک کشور (سامانه ثبت من)',
    organization: 'ثبت اسناد و املاک',
    category: 'قضایی و ثنا',
    subCategory: 'ثبت اسناد',
    url: 'https://ssaa.ir',
    description: 'استعلام اسناد مالکیت، استعلام شناسه شرکت‌ها، تصدیق اصالت سند و اثر انگشت دفاتر اسناد',
    shortcutCode: 'SSAA',
    isFavorite: false
  },

  // ۳. امور مالیاتی و مودیان
  {
    id: 'link-my-tax',
    title: 'درگاه ملی خدمات الکترونیک سازمان امور مالیاتی',
    organization: 'سازمان امور مالیاتی',
    category: 'مالیات و مودیان',
    subCategory: 'سامانه مودیان',
    url: 'https://my.tax.gov.ir',
    description: 'تسلیم اظهارنامه اشخاص حقیقی و حقوقی، فرم تبصره ۱۰۰ مشاغل، استعلام بدهی و پرداخت قبوض',
    shortcutCode: 'MY-TAX',
    isFavorite: true
  },
  {
    id: 'link-register-tax',
    title: 'سامانه ثبت‌نام الکترونیک و تخصیص کد اقتصادی',
    organization: 'امور مالیاتی',
    category: 'مالیات و مودیان',
    subCategory: 'کد اقتصادی',
    url: 'https://register.tax.gov.ir',
    description: 'پیش‌ثبت‌نام و تکمیل ثبت‌نام شماره اقتصادی، ویرایش اطلاعات کسب‌وکار و حساب‌های بانکی',
    shortcutCode: 'REG-TAX',
    isFavorite: true
  },
  {
    id: 'link-tp-tax',
    title: 'سامانه مودیان و کارپوشه پایانه‌های فروشگاهی',
    organization: 'امور مالیاتی',
    category: 'مالیات و مودیان',
    subCategory: 'پایانه‌های فروشگاهی',
    url: 'https://tp.tax.gov.ir',
    description: 'مدیریت صورت‌حساب‌های الکترونیک، اتصال پوزهای فروشگاهی و کلیدهای سامانه مودیان',
    shortcutCode: 'TP-TAX',
    isFavorite: false
  },

  // ۴. تأمین اجتماعی و بازنشستگی
  {
    id: 'link-eservices-tamin',
    title: 'سامانه خدمات غیرحضوری تأمین اجتماعی (سوابق و فیش)',
    organization: 'سازمان تأمین اجتماعی',
    category: 'تأمین اجتماعی و بیمه',
    subCategory: 'سوابق و خدمات بیمه',
    url: 'https://eservices.tamin.ir',
    description: 'مشاهده سوابق بیمه تلفیقی، فیش حقوقی، استعلام استحقاق درمان و کمک‌هزینه ازدواج و بارداری',
    shortcutCode: 'TAMIN-SV',
    isFavorite: true
  },
  {
    id: 'link-list-tamin',
    title: 'سامانه ارسال اینترنتی لیست حق بیمه کارفرمایان',
    organization: 'سازمان تأمین اجتماعی',
    category: 'تأمین اجتماعی و بیمه',
    subCategory: 'کارفرمایان',
    url: 'https://tamin.ir',
    description: 'بارگذاری فایل‌های DSK و دریافت برگ پرداخت حق بیمه ماهانه پرسنل کارگاه‌ها',
    shortcutCode: 'LIST-TAMIN',
    isFavorite: true
  },
  {
    id: 'link-ihio',
    title: 'سامانه شهروندی بیمه سلامت ایرانیان',
    organization: 'بیمه سلامت ایران',
    category: 'تأمین اجتماعی و بیمه',
    subCategory: 'بیمه سلامت',
    url: 'https://ihio.gov.ir',
    description: 'ثبت‌نام بیمه سلامت همگانی رایگان، استعلام تاریخ اعتبار و تمدید دفترچه الکترونیک',
    shortcutCode: 'IHIO',
    isFavorite: false
  },

  // ۵. خودرو، نوبت‌دهی و پلاک
  {
    id: 'link-iranecar',
    title: 'سامانه یکپارچه تخصیص خودروهای داخلی و وارداتی',
    organization: 'وزارت صمت',
    category: 'خودرو و پلاک',
    subCategory: 'سامانه یکپارچه',
    url: 'https://iranecar.com',
    description: 'ثبت اولویت خودروهای داخلی و وارداتی، مشاهده نوبت تحویل و حساب‌های وکالتی',
    shortcutCode: 'IRANECAR',
    isFavorite: true
  },
  {
    id: 'link-autonovin',
    title: 'سامانه تخصصی خودرو اتونوین (AutoNovin)',
    organization: 'سامانه اتونوین',
    category: 'خودرو و پلاک',
    subCategory: 'اتونوین',
    url: 'https://autonovin.com',
    description: 'استعلام بخشنامه‌ها، ثبت درخواست‌های خودرویی، حساب‌های وکالتی و اولویت‌بندی',
    shortcutCode: 'AUTONOVIN',
    isFavorite: true
  },
  {
    id: 'link-esale-ikco',
    title: 'پورتال فروش اینترنتی ایران خودرو',
    organization: 'ایران خودرو',
    category: 'خودرو و پلاک',
    subCategory: 'ایران خودرو',
    url: 'https://esale.ikco.ir',
    description: 'ثبت‌نام مستقیم طرح‌های فروش فوق‌العاده و پیش‌فروش ایران خودرو',
    shortcutCode: 'ESALE-IKCO',
    isFavorite: true
  },
  {
    id: 'link-saipa-esale',
    title: 'پورتال فروش اینترنتی گروه خودروسازی سایپا',
    organization: 'سایپا',
    category: 'خودرو و پلاک',
    subCategory: 'سایپا',
    url: 'https://saipa.iranecar.com',
    description: 'ثبت‌نام محصولات سایپا، زامیاد و پارس‌خودرو',
    shortcutCode: 'ESALE-SAIPA',
    isFavorite: true
  },
  {
    id: 'link-nobat-pelak',
    title: 'سامانه نوبت‌دهی اینترنتی مراکز تعویض پلاک فراجا',
    organization: 'پلیس راهور فراجا',
    category: 'خودرو و پلاک',
    subCategory: 'پلیس راهور',
    url: 'https://nobatdehi.epolice.ir',
    description: 'رزرو نوبت تعویض پلاک، نقل و انتقال خودرو و موتورسیکلت در کلیه استان‌ها',
    shortcutCode: 'PELAK',
    isFavorite: true
  },

  // ۶. درگاه‌های جامع دولتی، مسکن و هویتی
  {
    id: 'link-mygov-main',
    title: 'پنجره ملی خدمات دولت هوشمند (My.Gov.ir)',
    organization: 'سازمان فناوری اطلاعات ایران',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'دولت هوشمند',
    url: 'https://my.gov.ir',
    description: 'درگاه جامع ورود به کلیه سامانه‌ها، خدمات هویتی، یارانه‌ها و استعلامات الکترونیک',
    shortcutCode: 'MYGOV',
    isFavorite: true
  },
  {
    id: 'link-mojavez-g4b',
    title: 'درگاه ملی مجوزهای کشور (G4B)',
    organization: 'وزارت امور اقتصادی و دارایی',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'پروانه کسب و اصناف',
    url: 'https://mojavez.ir',
    description: 'صدور الکترونیکی پروانه کسب، مجوزهای صنفی، مشاغل خانگی و تبدیل به شناسه یکتا',
    shortcutCode: 'MOJAVEZ',
    isFavorite: true
  },
  {
    id: 'link-amlak-mrud',
    title: 'سامانه ملی املاک و اسکان کشور',
    organization: 'وزارت راه و شهرسازی',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'مسکن و اسکان',
    url: 'https://amlak.mrud.ir',
    description: 'ثبت اقامتگاه، استعلام کد پستی و صدور قراردادهای رایگان اجاره مسکونی',
    shortcutCode: 'AMLAK',
    isFavorite: true
  },
  {
    id: 'link-saman-mrud',
    title: 'سامانه طرح‌های حمایتی مسکن (نهضت ملی مسکن و وام ودیعه)',
    organization: 'وزارت راه و شهرسازی',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'مسکن و اسکان',
    url: 'https://saman.mrud.ir',
    description: 'ثبت‌نام نهضت ملی مسکن، وام ودیعه مسکن مستأجران و پیگیری تاییدیه شعب بانک',
    shortcutCode: 'SAMAN-MASKAN',
    isFavorite: true
  },
  {
    id: 'link-sakha-epolice',
    title: 'پنجره واحد خدمات الکترونیک انتظامی سخا (فراجا)',
    organization: 'پلیس فراجا',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'پلیس و گذرنامه',
    url: 'https://sakha.epolice.ir',
    description: 'گذرنامه بین‌المللی و زیارتی، نظام وظیفه، خلافی، تاییدیه گواهینامه و خدمات خودرو',
    shortcutCode: 'SAKHA',
    isFavorite: true
  },
  {
    id: 'link-ncr-hoda',
    title: 'سامانه هویتی هدا و پیگیری کارت ملی هوشمند',
    organization: 'سازمان ثبت احوال کشور',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'ثبت احوال',
    url: 'https://ncr.ir',
    description: 'پیگیری آخرین وضعیت صدور کارت ملی هوشمند، ثبت تغییر نشانی و استعلام شماره ملی',
    shortcutCode: 'NCR-HODA',
    isFavorite: false
  },
  {
    id: 'link-cbi-ve',
    title: 'سامانه تسهیلات قرض‌الحسنه ازدواج و فرزند بانک مرکزی',
    organization: 'بانک مرکزی',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'بانک و وام',
    url: 'https://ve.cbi.ir',
    description: 'ثبت‌نام وام قرض‌الحسنه ازدواج و فرزندآوری، پیگیری کد رهگیری و نوبت شعب',
    shortcutCode: 'VE-CBI',
    isFavorite: true
  },
  {
    id: 'link-ntsw',
    title: 'سامانه جامع تجارت ایران (NTSW)',
    organization: 'وزارت صنعت، معدن و تجارت',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'بازرگانی و تجارت',
    url: 'https://ntsw.ir',
    description: 'ثبت سفارش کالا، سامانه انبارها، سامانه جامع گارانتی و شناسنامه کالا',
    shortcutCode: 'NTSW',
    isFavorite: false
  },
  {
    id: 'link-sejam',
    title: 'سامانه جامع اطلاعات مشتریان بازار سرمایه (سجام)',
    organization: 'شرکت سپرده‌گذاری مرکزی',
    category: 'درگاه‌های جامع دولتی',
    subCategory: 'بورس و سهام',
    url: 'https://sejam.ir',
    description: 'احراز هویت سجام، دریافت کد بورسی، استعلام سود سهام عدالت و تغییر کارگزار ناظر',
    shortcutCode: 'SEJAM',
    isFavorite: false
  }
];

export const INITIAL_USER_SETTINGS: UserCafeSettings = {
  cafeName: 'کافی‌نت پلاس',
  ownerName: 'مدیر محترم کافی‌نت',
  phone: '۰۲۱-۸۸۸۸۴۳۲۱',
  address: 'تهران، میدان انقلاب، روبروی دانشگاه، پلاک ۱۲',
  primaryColor: '#059669', // Emerald
  theme: 'light',
  isLoggedIn: true,
  userEmail: 'tusanwebsite@gmail.com',
  userRole: 'admin',
  useGeminiAi: true,
};
