import React from 'react';
import {
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  Menu,
  Activity,
  Sparkles,
  ExternalLink,
  Store
} from 'lucide-react';
import { GuildNewsItem, UserCafeSettings, GovernmentSystem } from '../types';

interface HeaderProps {
  news: GuildNewsItem[];
  settings: UserCafeSettings;
  systems: GovernmentSystem[];
  onToggleTheme: () => void;
  onToggleMobileMenu: () => void;
  onOpenSettings: () => void;
  onSelectSystemStatus: () => void;
  onSelectNews: (news: GuildNewsItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  news,
  settings,
  systems,
  onToggleTheme,
  onToggleMobileMenu,
  onOpenSettings,
  onSelectSystemStatus,
  onSelectNews,
}) => {
  // Count systems status
  const downCount = systems.filter((s) => s.status === 'down').length;
  const degradedCount = systems.filter((s) => s.status === 'degraded').length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* 1. News Ticker - Strictly Left to Right (LTR) movement as specified in requirements */}
      <div
        className="w-full bg-slate-900 text-slate-100 text-xs py-1.5 px-3 overflow-hidden border-b border-slate-800 ticker-container relative select-none"
        dir="ltr"
        tabIndex={0}
        aria-label="نوار اخبار فوری صنف کافی‌نت و پیشخوان"
      >
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-0.5 rounded font-bold text-[11px] shrink-0 tracking-wide z-10 shadow-sm" dir="rtl">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            اخبار فوری صنف
          </div>

          {/* LTR Ticker Content */}
          <div className="relative overflow-hidden w-full h-5 flex items-center">
            <div className="animate-ticker-ltr flex items-center gap-12 font-medium" dir="rtl">
              {news.length > 0 ? (
                <>
                  {news.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectNews(item)}
                      className="inline-flex items-center gap-2 hover:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors text-right cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                      <span className="font-semibold text-slate-200">{item.title}</span>
                      <span className="text-slate-400 text-[10px]">({item.sourceName})</span>
                    </button>
                  ))}
                  {/* Duplicate set for seamless continuous marquee loop */}
                  {news.map((item) => (
                    <button
                      key={`dup-${item.id}`}
                      onClick={() => onSelectNews(item)}
                      className="inline-flex items-center gap-2 hover:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors text-right cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                      <span className="font-semibold text-slate-200">{item.title}</span>
                      <span className="text-slate-400 text-[10px]">({item.sourceName})</span>
                    </button>
                  ))}
                </>
              ) : (
                <span className="text-slate-400">خبر جدیدی برای نمایش وجود ندارد.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2" dir="rtl">
        {/* Left: Mobile Menu button + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="باز کردن منو"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shadow-md font-black text-lg sm:text-xl shrink-0"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-xl text-slate-900 dark:text-white tracking-tight truncate max-w-[130px] sm:max-w-none">
                  {settings.cafeName}
                </span>
                <span className="hidden sm:inline-block bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  نسخه صنفی
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                سامانه هوشمند مدیریت ثبت‌نام‌ها و پیشخوان
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right: System Health indicator badge + Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* System status pill */}
          <button
            onClick={onSelectSystemStatus}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200/80 dark:border-slate-700 shrink-0"
            title="مشاهده وضعیت زنده سامانه‌های دولتی"
          >
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
            <span className="hidden md:inline">سامانه‌ها:</span>
            {downCount > 0 ? (
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                {downCount} قطع
              </span>
            ) : degradedCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {degradedCount} کند
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="hidden sm:inline">پایدار</span>
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            aria-label="تغییر حالت شب و روز"
            title="تغییر تم"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            )}
          </button>

          {/* Profile & Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
            title="تنظیمات حساب کاربری و هوش مصنوعی"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
              {settings.ownerName ? settings.ownerName.charAt(0) : 'ک'}
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {settings.ownerName || 'مدیریت کافی‌نت'}
              </div>
              <div className="text-[10px] text-slate-400">
                {settings.userRole === 'admin' ? 'مدیر سیستم' : 'کاربر پیشخوان'}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
