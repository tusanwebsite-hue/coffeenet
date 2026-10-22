# راهنمای جامع استقرار و نصب سامانه «کافی‌نت پلاس»
## استقرار روی هاست‌های سی‌پنل (cPanel) و پلتفرم لاوابل (Lovable)

این مستندات به زبان فارسی و گام‌به‌گام برای مدیران کافی‌نت‌ها، دفاتر پیشخوان دولت و برنامه‌نویسان تهیه شده تا بتوانند سامانه «کافی‌نت پلاس» را به راحتی روی هاست‌های لینوکسی اشتراکی (cPanel) و پلتفرم‌های ابری نسل جدید مثل Lovable یا سرورهای اختصاصی مستقر کنند.

---

## فهرست سرفصل‌ها
1. [معماری و ساختار فنی برنامه](#۱-معماری-فنی-برنامه)
2. [روش ۱: استقرار کامل روی سی‌پنل با Node.js Selector (پیشنهادی سرور کامل)](#روش-۱-استقرار-روی-cpanel-با-استفاده-از-setup-nodejs-app)
3. [روش ۲: استقرار سریع کلاینت (Static SPA) روی هاست معمولی cPanel](#روش-۲-استقرار-به-صورت-استاتیک-static-spa-روی-هاست-معمولی-cpanel)
4. [روش ۳: استقرار یکپارچه روی لاوابل (Lovable) و پلتفرم‌های گیت‌محور](#روش-۳-استقرار-روی-پلتفرم-لاوابل-lovable)
5. [پیکربندی هوش مصنوعی Gemini و متغیرهای محیطی](#پیکربندی-متغیرهای-محیطی-و-کلیدهای-امن)
6. [عیب‌یابی خطاهای رایج](#عیب‌یابی-و-حل-خطاهای-رایج)

---

## ۱. معماری فنی برنامه

- **فرانت‌اند:** React 19 + TypeScript + Vite 8 + Tailwind CSS
- **بک‌اند پروکسی و وضعیت:** Express (Node.js) برای پروکسی امن فراخوانی‌های سروری Gemini و پایش وضعیت سامانه‌های دولتی بدون خطای CORS
- **پایگاه داده لوکال و پایداری:** LocalStorage ایزوله مرورگر برای تنظیمات برند، واترمارک‌ها، سامانه‌های منتخب و پیش‌نویس‌های ذخیره‌شده
- **پورت پیش‌فرض محلی:** ۳۰۰۰

---

## روش ۱: استقرار روی cPanel با استفاده از Setup Node.js App

اگر هاست شما در cPanel ماژول **Setup Node.js App** (پشتیبانی‌شده توسط CloudLinux و Phusion Passenger) را دارد، این روش بهترین بازدهی را دارد:

### گام اول: ایجاد اپلیکیشن در cPanel
1. وارد کنترل‌پنل **cPanel** خود شوید.
2. از بخش **Software**، روی گزینه **Setup Node.js App** کلیک کنید.
3. روی دکمه **Create Application** کلیک کنید:
   - **Node.js version:** نسخه `20.x` یا `22.x` (LTS) را انتخاب کنید.
   - **Application mode:** روی **Production** قرار دهید.
   - **Application root:** نام پوشه‌ای که فایل‌های پروژه در آن قرار می‌گیرد را وارد کنید (مثلاً: `coffeenet-plus`).
   - **Application URL:** دامنه یا ساب‌دامین مورد نظر خود را انتخاب کنید (مثلاً: `panel.yourcafenet.ir`).
   - **Application startup file:** عبارت `server.js` را وارد کنید.
4. روی دکمه **Create** در گوشه بالا کلیک کنید.

### گام دوم: آماده‌سازی و بیلد فایل‌ها در سیستم محلی
روی سیستم شخصی خود (یا از طریق Terminal در cPanel) دستورات زیر را اجرا کنید:

```bash
# نصب پکیج‌ها
npm install

# ساخت نسخه پروداکشن
npm run build
```

یک پوشه به نام `dist` ساخته می‌شود که حاوی کدهای بهینه‌شده و فشرده است.

### گام سوم: آماده‌سازی فایل استارت سرور پروداکشن
یک فایل با نام `server.js` در ریشه پروژه بسازید با این محتوا:

```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// سرو فایل‌های بیلد شده فرانت‌اند
app.use(express.static(path.join(__dirname, 'dist')));

// مسیرهای API پروکسی و بررسی سرور
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// هدایت تمام روت‌ها به index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Coffeenet Plus is running on port ${PORT}`);
});
```

### گام چهارم: آپلود فایل‌ها به سرور cPanel
از طریق **File Manager** در cPanel، فایل‌های زیر را داخل پوشه `Application root` (همان پوشه‌ای که در گام اول تعریف کردید) آپلود کنید:
- پوشه `dist/`
- فایل `package.json`
- فایل `server.js`
- فایل `.env` (تنظیم‌شده بر اساس `.env.example`)

### گام پنجم: نصب پکیج‌ها و فعال‌سازی در cPanel
1. به صفحه **Setup Node.js App** برگردید و برنامه ساخته‌شده را باز کنید.
2. روی دکمه **Run NPM Install** کلیک کنید تا تمام ماژول‌ها نصب شوند.
3. در کادر متغیرهای محیطی (**Environment variables**)، متغیرهای زیر را ثبت کنید:
   - `NODE_ENV` = `production`
   - `GEMINI_API_KEY` = `کلید_شما_از_گوگل`
   - `PORT` = پورت اختصاص‌یافته توسط سرور
4. روی دکمه **Restart** کلیک کنید تا سامانه راه‌اندازی شود.

---

## روش ۲: استقرار به صورت استاتیک (Static SPA) روی هاست معمولی cPanel

اگر هاست لینوکسی شما ماژول Node.js ندارد و فقط یک هاست ابری/اشتراکی معمولی وب است:

### گام ۱: دریافت بیلد استاتیک
روی کامپیوتر خود دستور زیر را اجرا کنید:
```bash
npm run build
```
پوشه‌ای به نام `dist` تولید می‌شود.

### گام ۲: ایجاد فایل `.htaccess` برای پشتیبانی از مسیریابی React
در داخل پوشه `dist` یک فایل متنی با نام `.htaccess` بسازید و کدهای زیر را دقیقاً در آن ذخیره کنید:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# فشرده‌سازی GZIP برای لود فوق‌سریع در کافی‌نت
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# کشینگ فایل‌های فونت وزیرمتن و آیکون‌ها
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
```

### گام ۳: آپلود به پوشه `public_html`
1. وارد **cPanel -> File Manager** شوید.
2. وارد پوشه `public_html` شوید (یا پوشه ساب‌دامین اختصاصی‌تان).
3. تمام فایل‌های داخل پوشه `dist` (شامل `index.html`، پوشه `assets/` و فایل `.htaccess`) را آپلود و استخراج (Extract) فرمایید.
4. اکنون با باز کردن آدرس دامنه خود در مرورگر، نرم‌افزار بدون مشکل اجرا می‌شود!

> **نکته:** در روش استاتیک، موتور تولید محتوای آفلاین و تمام امکانات طراحی پوستر، ریلز متحرک، بانک لینک‌ها و وضعیت سامانه‌ها بدون نیاز به سرور Node.js به‌صورت ۱۰۰٪ آفلاین و درون مرورگر کار می‌کنند.

---

## روش ۳: استقرار روی پلتفرم لاوابل (Lovable)

پلتفرم **Lovable** یک محیط ابری فوق‌العاده سریع و استاندارد برای اپلیکیشن‌های مدرن React و Vite است. برای قرار دادن این پروژه روی Lovable:

### گام ۱: انتقال سورس کد به گیت‌هاب (GitHub)
اگر پروژه را در یک مخزن GitHub قرار داده‌اید:
1. مخزن شما باید شامل فایل‌های ریشه پروژه (`package.json`, `vite.config.ts`, `src/`, `index.html`) باشد.
2. مطمئن شوید فایل `package.json` دارای اسکریپت `"build": "vite build"` است.

### گام ۲: ایمپورت به Lovable
1. وارد حساب کاربری خود در پلتفرم **Lovable.dev** شوید.
2. روی **New Project** یا **Import Repository** کلیک کنید.
3. مخزن GitHub پروژه «کافی‌نت پلاس» را انتخاب فرمایید.
4. تنظیمات ساخت خودکار به شرح زیر است:
   - **Framework Preset:** `Vite` یا `React`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### گام ۳: تنظیم متغیرهای محیطی در Lovable
1. به تب **Settings** و بخش **Environment Variables** در پروژه خود بروید.
2. متغیرهای زیر را ثبت فرمایید:
   - `VITE_APP_NAME`: `کافی‌نت پلاس`
   - `GEMINI_API_KEY`: کلید API گوگل استودیو (در صورت نیاز به قابلیت هوش مصنوعی ابری)
3. دکمه **Deploy** را بزنید. سامانه ظرف کمتر از ۱ دقیقه مستقر شده و یک آدرس اختصاصی امن با پروتکل HTTPS به شما ارائه می‌دهد.

---

## پیکربندی متغیرهای محیطی و کلیدهای امن

نمونه فایل پیکربندی `.env` که در کنار پروژه قرار دارد:

```env
# کلید API جمینای برای تولید متن با هوش مصنوعی (اختیاری)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# آدرس سرور اصلی برای حل مسائل امنیتی
APP_URL="https://panel.yourcafenet.ir"

# پورت اجرا در حالت Node.js
PORT=3000
```

---

## عیب‌یابی و حل خطاهای رایج

### ۱. خطای ۴۰۴ هنگام رفرش در صفحات داخلی روی cPanel
- **علت:** سرور وب آپاچی به دنبال فایلی فیزیکی با نام آن روت می‌گردد.
- **راهکار:** مطمئن شوید فایل `.htaccess` که در بخش روش ۲ توضیح داده شد در پوشه اصلی وبسایت بارگذاری شده است.

### ۲. فونت وزیرمتن لود نمی‌شود یا حروف انگلیسی جدا نمایش داده می‌شوند
- **راهکار:** فایل‌های فونت داخل پوشه `public/fonts/` به همراه بیلد منتقل می‌شوند. همچنین فایل استایل اصلی با نام فونت محلی استاندارد و وب‌فونت CDN پشتیبان تنظیم شده است تا حتی هنگام قطعی اینترنت بین‌الملل نیز فونت‌های فارسی بدون نقص رندر شوند.

### ۳. ضبط ویدئو در استودیو کار نمی‌کند
- **راهکار:** سیستم تولید موشن و ویدیو ریلز از استاندارد `MediaRecorder` و استاندارد HTML5 Canvas استفاده می‌کند. نیاز به هیچ پلاگین خارجی ندارد و در تمام مرورگرهای استاندارد کروم، فایرفاکس و اج با وضوح بالا کار می‌کند. برای دانلود بهتر، سایت حتماً باید دارای گواهی SSL معتبر (`https://`) باشد.
