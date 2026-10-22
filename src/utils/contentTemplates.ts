/**
 * Offline / Zero-AI Content Generation Engine
 * Provides rich, tested templates for Telegram, Instagram, SMS, and Blog announcements
 */

export interface ContentTemplateVariables {
  title: string;
  org: string;
  deadline?: string;
  category?: string;
  url?: string;
  phone?: string;
  cafeName?: string;
  address?: string;
  requirements?: string;
  fee?: string;
}

export interface ContentTypeOption {
  id: string;
  name: string;
  channel: 'telegram' | 'instagram' | 'notice' | 'sms' | 'story';
  tone: 'formal' | 'friendly' | 'promotional' | 'urgent';
  template: (v: ContentTemplateVariables) => string;
}

export const OFFLINE_CONTENT_TEMPLATES: ContentTypeOption[] = [
  {
    id: 'telegram_notice',
    name: 'اطلاعیه رسمی ثبت‌نام (کانال تلگرام)',
    channel: 'telegram',
    tone: 'formal',
    template: (v) => `📢 **اطلاعیه فوری ثبت‌نام: ${v.title}**

🔹 **سازمان مجری:** ${v.org || 'مربوطه'}
🗓 **مهلت ثبت‌نام:** ${v.deadline || 'مهلت رسمی مشخص نشده است'}
📌 **دسته خدمت:** ${v.category || 'خدمات الکترونیک دولت'}

📝 **مدارک و شرایط لازم:**
${v.requirements || '• مدارک هویتی (کارت ملی و شناسنامه)\n• عکس پرسنلی جدید\n• اطلاعات تماس و کد پستی'}

${v.fee ? `💳 **هزینه تعرفه مصوب:** ${v.fee}\n` : ''}
⚠️ با توجه به احتمال کندی سامانه در ساعات پایانی، توصیه می‌شود ثبت‌نام خود را به روزهای آخر موکول نفرمایید.

📍 **ثبت‌نام سریع، دقیق و با اطمینان در ${v.cafeName || 'کافی‌نت پلاس'}**
${v.address ? `🏢 آدرس: ${v.address}\n` : ''}${v.phone ? `📞 تماس و مشاوره: ${v.phone}\n` : ''}
🔗 درگاه رسمی: ${v.url || 'سامانه رسمی کشور'}

#${(v.org || 'اطلاعیه').replace(/\s+/g, '_')} #ثبت_نام #${(v.cafeName || 'کافی_نت').replace(/\s+/g, '_')}`,
  },
  {
    id: 'instagram_caption',
    name: 'کپشن اینستاگرام با هشتگ‌گذاری',
    channel: 'instagram',
    tone: 'friendly',
    template: (v) => `✨ ثبت‌نام «${v.title}» آغاز شد! ✨

اگر قصد شرکت در این طرح رو دارید، همین الان جزئیاتش رو ذخیره کنید 📲

🔻 مشخصات مهم:
🏛 متولی: ${v.org || 'سازمان مربوطه'}
⏳ مهلت انجام: ${v.deadline || 'مهلت رسمی مشخص نشده است'}

💡 مدارک لازم رو آماده کنید تا بدون معطلی و در سریع‌ترین زمان ثبت‌نام شما رو با تضمین ثبت نهایی انجام بدیم.

📍 مراجعه حضوری: ${v.cafeName || 'دفتر خدمات الکترونیک'}
${v.address ? `📌 نشانی: ${v.address}\n` : ''}
${v.phone ? `☎️ تلفن هماهنگی: ${v.phone}\n` : ''}

برای دوستانتون که به این ثبت‌نام نیاز دارند بفرستید! 🚀

.
.
#کافی_نت #پیشخوان_دولت #ثبت_نام_${(v.title || '').replace(/\s+/g, '_').slice(0, 20)} #خدمات_اینترنتی #استخدامی`,
  },
  {
    id: 'story_snippet',
    name: 'متن کوتاه استوری اینستاگرام و وضعیت ایتا',
    channel: 'story',
    tone: 'urgent',
    template: (v) => `🔴 فوری / آغاز ثبت‌نام:
«${v.title}»

🗓 آخرین مهلت: ${v.deadline || 'ظرفیت محدود'}
🏛 سازمان: ${v.org}

🏃‍♂️ جهت انجام فوری و تضمینی ثبت‌نام پیام بدید یا حضوری مراجعه کنید.
📞 ${v.phone || 'تماس با ما'}`,
  },
  {
    id: 'sms_alert',
    name: 'پیامک اطلاع‌رسانی به مشتریان (SMS)',
    channel: 'sms',
    tone: 'promotional',
    template: (v) => `مشتری گرامی،
ثبت نام "${v.title}" فعال شد.
مهلت: ${v.deadline || 'محدود'}
جهت ثبت نام بدون معطلی به ${v.cafeName || 'کافی نت'} مراجعه نمایید.
تلفن: ${v.phone || ''}
لغو 11`,
  },
  {
    id: 'employment_notice',
    name: 'خبر استخدامی و آزمون (وبلاگ / پیام‌رسان)',
    channel: 'notice',
    tone: 'formal',
    template: (v) => `📋 **فراخوان استخدام و جذب نیرو: ${v.title}**

اطلاعیه استخدامی جدید توسط ${v.org} منتشر شد. متقاضیان گرامی می‌توانند با مطالعه شرایط ذیل جهت ثبت‌نام اقدام نمایند:

📌 **عنوان فرصت:** ${v.title}
⏳ **بازه ثبت‌نام:** تا مورخ ${v.deadline || 'اطلاع ثانوی'}
🔗 **لینک ورود به سامانه:** ${v.url || 'سامانه سنجش و آزمون کشور'}

🔍 **شرایط عمومی:**
${v.requirements || '• داشتن مدرک تحصیلی مرتبط\n• کارت پایان خدمت یا معافیت برای آقایان\n• دارا بودن شرایط سنی اعلام شده در دفترچه'}

خدمات ثبت‌نام و دریافت کد رهگیری در دفتر ${v.cafeName || 'پیشخوان'} آماده ارائه به همشهریان محترم می‌باشد.`,
  },
];

/**
 * Generates offline content by ID and variables
 */
export function generateOfflineContent(templateId: string, vars: ContentTemplateVariables): string {
  const tpl = OFFLINE_CONTENT_TEMPLATES.find((t) => t.id === templateId) || OFFLINE_CONTENT_TEMPLATES[0];
  return tpl.template(vars);
}
