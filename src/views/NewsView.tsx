import React, { useState } from 'react';
import {
  Newspaper,
  ShieldAlert,
  FileSpreadsheet,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Building,
  Printer
} from 'lucide-react';
import { GuildNewsItem } from '../types';
import { formatJalaliFull, toPersianDigits } from '../utils/dateUtils';

interface NewsViewProps {
  news: GuildNewsItem[];
}

interface RateItem {
  id: string;
  category: string;
  title: string;
  rateApproved: string;
  notes?: string;
}

const TARIFF_RATES: RateItem[] = [
  { id: '1', category: 'ثبت‌نام‌های آزمون و کنکور', title: 'ثبت‌نام کنکور سراسری، ارشد و دکتری (خرید سریال + تکمیل فرم)', rateApproved: '۱۵۰,۰۰۰ تومان', notes: 'هزینه خرید کارت آزمون جداگانه است' },
  { id: '2', category: 'ثبت‌نام‌های آزمون و کنکور', title: 'ثبت‌نام آزمون‌های استخدامی و فراگیر دستگاه‌های اجرایی', rateApproved: '۱۸۰,۰۰۰ تومان', notes: 'شامل اسکن مدارک و تایید نهایی' },
  { id: '3', category: 'تسهیلات و وام', title: 'ثبت‌نام وام ازدواج و فرزندآوری در سامانه بانک مرکزی', rateApproved: '۲۰۰,۰۰۰ تومان', notes: 'شامل تعیین شعبه و دریافت کد رهگیری' },
  { id: '4', category: 'خدمات خودرو', title: 'ثبت‌نام و رزرو اولویت در سامانه یکپارچه خودرو', rateApproved: '۲۵۰,۰۰۰ تومان', notes: 'نیازمند حساب وکالتی تایید شده' },
  { id: '5', category: 'خدمات قضایی و ثنا', title: 'ثبت‌نام اولیه سامانه ثنا و احراز هویت الکترونیک', rateApproved: '۱۰۰,۰۰۰ تومان', notes: 'شامل دریافت کد ثنا' },
  { id: '6', category: 'خدمات قضایی و ثنا', title: 'مشاهده و چاپ ابلاغیه الکترونیک قضایی', rateApproved: '۴۰,۰۰۰ تومان', notes: 'به ازای هر ابلاغیه' },
  { id: '7', category: 'تأمین اجتماعی', title: 'استعلام و چاپ سوابق بیمه تأمین اجتماعی', rateApproved: '۵۰,۰۰۰ تومان', notes: 'شامل پرینت کلیه سال‌ها' },
  { id: '8', category: 'تأمین اجتماعی', title: 'مشاهده و صدور فیش حقوقی و حکم بازنشستگان', rateApproved: '۴۰,۰۰۰ تومان', notes: 'پرینت تک برگ' },
  { id: '9', category: 'مسکن و مستغلات', title: 'ثبت ملک و سکونتگاه در سامانه ملی املاک و اسکان', rateApproved: '۱۲۰,۰۰۰ تومان', notes: 'کد رهگیری قانونی' },
  { id: '10', category: 'پلیس و انتظامی', title: 'درخواست صدور یا تمدید گذرنامه در سامانه سخا', rateApproved: '۱۵۰,۰۰۰ تومان', notes: 'بارگذاری تصویر و مشخصات' },
  { id: '11', category: 'مالیات و اصناف', title: 'ارسال فرم تبصره ماده ۱۰۰ مشاغل و اظهارنامه مالیاتی', rateApproved: '۳۵۰,۰۰۰ الی ۷۰۰,۰۰۰ تومان', notes: 'بسته به گردش حساب و پرونده' },
  { id: '12', category: 'خدمات عمومی', title: 'اسکن مدارک، پرینت سیاه و سفید و تایپ متن', rateApproved: 'طبق تعرفه برگی مصوب', notes: 'بر اساس حجم صفحات' },
];

export const NewsView: React.FC<NewsViewProps> = ({ news }) => {
  const [activeTab, setActiveTab] = useState<'news' | 'rates'>('news');
  const [selectedRateCat, setSelectedRateCat] = useState('all');

  const rateCategories = ['all', ...Array.from(new Set(TARIFF_RATES.map((r) => r.category)))];

  const filteredRates = TARIFF_RATES.filter((r) => {
    if (selectedRateCat !== 'all' && r.category !== selectedRateCat) return false;
    return true;
  });

  const handlePrintTariff = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Switcher */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1">
            اخبار، بخشنامه‌ها و نرخ‌نامه صنف کافی‌نت
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            اطلاعیه‌های رسمی اتحادیه صنف رایانه و پیشخوان، هشدارهای پلیس فتا و جدول تعرفه خدمات مصوب سال جاری
          </p>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'news'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Newspaper className="w-4 h-4 text-purple-500" />
            اخبار و بخشنامه‌ها
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rates'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            نرخ‌نامه مصوب خدمات
          </button>
        </div>
      </div>

      {activeTab === 'news' ? (
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {item.isUrgent && (
                    <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      فوری و مهم
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {item.sourceName}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatJalaliFull(item.publishedAt)}</span>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* Tariff Table */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white mb-0.5">
                جدول تعرفه و نرخ‌نامه مصوب خدمات رایانه‌ای و اینترنتی
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                بر اساس آخرین ابلاغیه کمیسیون نظارت و اتحادیه صنف فناوران رایانه
              </p>
            </div>

            <button
              onClick={handlePrintTariff}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-500" />
              چاپ نرخ‌نامه جهت نصب در دید مشتریان
            </button>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {rateCategories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedRateCat(c)}
                className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                  selectedRateCat === c
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {c === 'all' ? 'همه خدمات' : c}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                  <th className="py-3 px-4">ردیف</th>
                  <th className="py-3 px-4">عنوان خدمت</th>
                  <th className="py-3 px-4">دسته‌بندی</th>
                  <th className="py-3 px-4 text-emerald-600 dark:text-emerald-400">نرخ مصوب اتحادیه</th>
                  <th className="py-3 px-4 text-slate-400">توضیحات و شرایط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredRates.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">{toPersianDigits(idx + 1)}</td>
                    <td className="py-3.5 px-4 font-bold">{item.title}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.category}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">{item.rateApproved}</td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-400">{item.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
