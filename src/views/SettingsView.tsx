import React, { useState } from 'react';
import {
  Settings,
  Store,
  Palette,
  Key,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Save,
  Check,
  Smartphone,
  MapPin,
  Mail,
  Lock,
  ExternalLink,
  Info,
  Server,
  Globe
} from 'lucide-react';
import { UserCafeSettings } from '../types';

interface SettingsViewProps {
  settings: UserCafeSettings;
  onUpdateSettings: (newSettings: Partial<UserCafeSettings>) => void;
}

const COLOR_PALETTES = [
  { name: 'زمردی (پیش‌فرض)', hex: '#059669' },
  { name: 'آبی درباری', hex: '#2563eb' },
  { name: 'فیروزه‌ای', hex: '#0d9488' },
  { name: 'یاقوتی', hex: '#e11d48' },
  { name: 'بنفش سلطنتی', hex: '#7c3aed' },
  { name: 'کهربایی', hex: '#d97706' },
  { name: 'طوسی تیره کلاسیک', hex: '#334155' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState({
    cafeName: settings.cafeName,
    ownerName: settings.ownerName,
    phone: settings.phone,
    address: settings.address,
    primaryColor: settings.primaryColor,
    useGeminiAi: settings.useGeminiAi,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1">
          تنظیمات حساب، برند اختصاصی و هوش مصنوعی
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          سفارشی‌سازی نام کافی‌نت، شماره تماس، آدرس در واترمارک‌ها، پالت رنگی و پیکربندی موتورهای پردازش هوشمند
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Cafe Branding Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Store className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              اطلاعات برند و تابلو دفتر پیشخوان / کافی‌نت
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                نام کسب‌وکار (نمایش در هدر و واترمارک پوسترها):
              </label>
              <input
                type="text"
                value={formData.cafeName}
                onChange={(e) => setFormData({ ...formData, cafeName: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="مثال: کافی‌نت عصر ارتباطات"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                نام مدیریت یا متصدی:
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="مثال: علی رضایی"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                شماره تماس و پیام‌رسان‌ها:
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="مثال: ۰۲۱۸۸۸۸۴۳۲۱"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                آدرس فیزیکی دفتر (جهت درج در آگهی‌ها):
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="مثال: خیابان اصلی، پلاک ۴۰"
              />
            </div>
          </div>

          {/* Color Palettes */}
          <div className="pt-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              رنگ اصلی قالب برنامه:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PALETTES.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setFormData({ ...formData, primaryColor: color.hex })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    formData.primaryColor === color.hex
                      ? 'border-slate-900 dark:border-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Google Account & Auth Information */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <UserCheck className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              حساب کاربری و وضعیت ورود با گوگل (Google OAuth 2.0)
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                G
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {settings.userEmail}
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    متصل به حساب گوگل
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  پروتکل احراز هویت: Google OpenID Connect / OAuth 2.0
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              نقش: <span className="font-bold text-slate-700 dark:text-slate-200">مدیر سیستم</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <strong>نکته مهم احراز هویت:</strong> اطلاعات پروژه‌ها، علاقه‌مندی‌ها و پیش‌نویس‌های شما با شناسه کاربری ایمیل به صورت امن همگام‌سازی می‌گردند. در استقرار نهایی روی هاست یا دامنه‌های اختصاصی، Redirect URI با دامنه پروژه ثبت می‌شود.
            </div>
          </div>
        </div>

        {/* 3. Gemini AI Configuration */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              تنظیمات هوش مصنوعی و مدل Google Gemini
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                فعال‌سازی سرویس ابری Gemini در بخش تولید محتوا
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                مدل پردازشی فعال: <span className="font-mono font-bold text-emerald-600">gemini-3.8-flash</span> از طریق سرور امن
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.useGeminiAi}
                onChange={(e) => setFormData({ ...formData, useGeminiAi: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              قوانین امنیت کلیدها و اعتبار:
            </div>
            <p>
              کلیدهای محرمانه API هرگز در کد سمت کلاینت یا مرورگر کاربر قرار نمی‌گیرند و منحصراً در مسیر سرور (<code className="text-emerald-600">/api/gemini/generate</code>) پردازش می‌گردند. در صورتی که به هر دلیلی ارتباط با هوش مصنوعی در دسترس نباشد، سامانه بلافاصله به موتور تولید محتوای آفلاین و قالب‌های فارسی سوئیچ می‌کند تا کار متوقف نشود.
            </p>
          </div>
        </div>

        {/* 4. Deployment Guide Card (cPanel & Lovable) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                راهنمای نصب و استقرار روی سرور (cPanel و Lovable)
              </h2>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              DEPLOYMENT_GUIDE.md
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs sm:text-sm">
                <Globe className="w-4 h-4 text-emerald-500" />
                روش ۱: استقرار آسان روی هاست‌های اشتراکی cPanel (بدون نیاز به سرور Node.js)
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                ۱. دستور <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">npm run build</code> را اجرا فرمایید تا پوشه <code className="text-emerald-600 font-bold">dist</code> ساخته شود.
                <br />
                ۲. محتویات داخل پوشه <code className="font-mono">dist</code> را در پوشه <code className="font-mono text-emerald-600">public_html</code> هاست آپلود و اکسترکت فرمایید.
                <br />
                ۳. یک فایل با نام <code className="font-mono text-emerald-600">.htaccess</code> در <code className="font-mono">public_html</code> ایجاد کرده و متن ریدایرکت SPA (موجود در راهنمای فایل DEPLOYMENT_GUIDE.md) را در آن قرار دهید تا رفرش صفحات بدون خطای ۴۰۴ انجام شود.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-purple-500" />
                روش ۲: استقرار روی پلتفرم لاوابل (Lovable) یا پلتفرم‌های ابری
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                ۱. مخزن GitHub پروژه را به حساب کاربری خود در <strong className="text-purple-600">Lovable.dev</strong> متصل کنید.
                <br />
                ۲. دستور Build Command را روی <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">npm run build</code> و Output Directory را روی <code className="font-mono text-emerald-600">dist</code> قرار دهید.
                <br />
                ۳. در بخش متغیرهای محیطی Lovable، در صورت تمایل متغیر <code className="font-mono">GEMINI_API_KEY</code> را وارد و دکمه Deploy را بزنید.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              تغییرات با موفقیت ذخیره شد
            </span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            ذخیره تنظیمات کافی‌نت
          </button>
        </div>
      </form>
    </div>
  );
};
