import React from 'react';
import {
  FileCheck2,
  Clock,
  Activity,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Share2,
  Bookmark,
  Palette,
  FileText,
  ShieldCheck,
  TrendingUp,
  Layers
} from 'lucide-react';
import {
  RegistrationOpportunity,
  GovernmentSystem,
  GuildNewsItem,
  UserCafeSettings
} from '../types';
import { formatJalaliFull, getDeadlineStatus, toPersianDigits } from '../utils/dateUtils';
import { NavTabId } from '../components/Sidebar';

interface DashboardViewProps {
  registrations: RegistrationOpportunity[];
  systems: GovernmentSystem[];
  news: GuildNewsItem[];
  settings: UserCafeSettings;
  onNavigate: (tab: NavTabId) => void;
  onSelectRegistration: (reg: RegistrationOpportunity) => void;
  onQuickGenerateContent: (reg: RegistrationOpportunity) => void;
  onQuickCreatePoster: (reg: RegistrationOpportunity) => void;
  onToggleBookmark: (regId: string) => void;
  onProbeSystem: (sys: GovernmentSystem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  registrations,
  systems,
  news,
  settings,
  onNavigate,
  onSelectRegistration,
  onQuickGenerateContent,
  onQuickCreatePoster,
  onToggleBookmark,
  onProbeSystem,
}) => {
  // Statistics calculations
  const activeCount = registrations.filter((r) => {
    const s = getDeadlineStatus(r.deadlineAt).status;
    return s === 'active' || s === 'ending_soon' || s === 'no_deadline';
  }).length;

  const endingSoonCount = registrations.filter(
    (r) => getDeadlineStatus(r.deadlineAt).status === 'ending_soon'
  ).length;

  const upSystemsCount = systems.filter((s) => s.status === 'up').length;
  const degradedSystemsCount = systems.filter((s) => s.status === 'degraded').length;
  const downSystemsCount = systems.filter((s) => s.status === 'down').length;

  const urgentRegistrations = registrations
    .filter((r) => getDeadlineStatus(r.deadlineAt).status !== 'expired')
    .slice(0, 4);

  const pinnedSystems = systems.filter((s) => s.isPinned).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner & Fast Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-slate-900 via-emerald-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-emerald-900/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            داشبورد عملیاتی {settings.cafeName}
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">
            سامانه هوشمند ثبت‌نام‌های کشوری و پایش سامانه‌ها
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            دسترسی سریع به ثبت‌نام‌های تأیید شده ۲۰ روز اخیر، بررسی سلامت پورتال‌های دولتی بدون قطعی و ابزارهای تولید محتوا برای جذب مشتریان.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('registrations')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md transition-all transform active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              مشاهده ثبت‌نام‌های فعال
            </button>
            <button
              onClick={() => onNavigate('studio')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold backdrop-blur-xs border border-white/15 transition-all"
            >
              <Palette className="w-4 h-4 text-emerald-400" />
              استودیو ساخت پوستر
            </button>
            <button
              onClick={() => onNavigate('content')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold backdrop-blur-xs border border-white/15 transition-all"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              تولید متن تلگرام و اینستاگرام
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. Key Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Registrations */}
        <div
          onClick={() => onNavigate('registrations')}
          className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ثبت‌نام‌های فعال</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(activeCount)}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">مورد در ۲۰ روز گذشته</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">همراه با اعتبارسنجی منبع رسمی</p>
        </div>

        {/* Metric 2: Ending Soon */}
        <div
          onClick={() => onNavigate('registrations')}
          className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">نزدیک به پایان (فوری)</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {toPersianDigits(endingSoonCount)}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">فرصت طلایی کافی‌نت</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">کمتر از ۳ روز تا انقضای مهلت</p>
        </div>

        {/* Metric 3: Portals Online */}
        <div
          onClick={() => onNavigate('systems')}
          className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">وضعیت پورتال‌های دولتی</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(upSystemsCount)}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              از {toPersianDigits(systems.length)} آنلاین
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            {degradedSystemsCount > 0 && (
              <span className="text-amber-600 font-semibold">{toPersianDigits(degradedSystemsCount)} کند</span>
            )}
            {downSystemsCount > 0 && (
              <span className="text-rose-600 font-bold">{toPersianDigits(downSystemsCount)} قطع</span>
            )}
            {degradedSystemsCount === 0 && downSystemsCount === 0 && (
              <span className="text-slate-400">کل سامانه‌ها پایدار</span>
            )}
          </div>
        </div>

        {/* Metric 4: Latest News & Circulars */}
        <div
          onClick={() => onNavigate('news')}
          className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">بخشنامه‌ها و نرخ‌نامه</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(news.length)}
            </span>
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">اطلاعیه صنفی</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">تعرفه‌ها، هشدارها و مصوبات اتحادیه</p>
        </div>
      </div>

      {/* 3. Pinned Systems Status Widget (Fast Access) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              دسترسی سریع و سلامت سامانه‌های پرکاربرد
            </h2>
          </div>
          <button
            onClick={() => onNavigate('systems')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            مشاهده همه سامانه‌ها ({toPersianDigits(systems.length)})
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pinnedSystems.map((sys) => {
            const isUp = sys.status === 'up';
            const isDegraded = sys.status === 'degraded';
            const isDown = sys.status === 'down';

            return (
              <div
                key={sys.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  {/* Status Indicator Dot */}
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      isUp
                        ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                        : isDegraded
                        ? 'bg-amber-500 ring-2 ring-amber-500/20'
                        : isDown
                        ? 'bg-rose-500 ring-2 ring-rose-500/20 animate-pulse'
                        : 'bg-slate-400'
                    }`}
                    title={
                      isUp ? 'در دسترس' : isDegraded ? 'دارای کندی' : isDown ? 'قطعی' : 'نیازمند بررسی'
                    }
                  />

                  <div className="truncate">
                    <a
                      href={sys.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-xs text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 truncate flex items-center gap-1"
                    >
                      {sys.name}
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {sys.latencyMs ? `${toPersianDigits(sys.latencyMs)} میلی‌ثانیه` : sys.organization}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onProbeSystem(sys)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                  title="تست پینگ مجدد سامانه"
                >
                  بررسی
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Latest Urgent Registrations */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              جدیدترین ثبت‌نام‌های کشوری (۲۰ روز اخیر)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('registrations')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            مشاهده کامل فهرست
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {urgentRegistrations.map((reg) => {
            const dl = getDeadlineStatus(reg.deadlineAt);
            const isEndingSoon = dl.status === 'ending_soon';

            return (
              <div
                key={reg.id}
                className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-emerald-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {reg.organization}
                    </span>

                    {/* Deadline status badge */}
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isEndingSoon
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {dl.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-2">
                    {reg.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {reg.summary}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onQuickCreatePoster(reg)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                      title="ساخت پوستر اینستاگرام برای این ثبت‌نام"
                    >
                      <Palette className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onQuickGenerateContent(reg)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors"
                      title="تولید کپشن و متن تلگرام برای این ثبت‌نام"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleBookmark(reg.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        reg.isBookmarked
                          ? 'text-amber-500 bg-amber-50 dark:bg-slate-700'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={reg.isBookmarked ? 'حذف از نشان‌شده‌ها' : 'نشان کردن'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <a
                    href={reg.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>ورود به سامانه</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Guild Circulars & Rate Card Snapshot */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              آخرین اطلاعیه‌های رسمی صنف کافی‌نت و پیشخوان
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            مشاهده نرخ‌نامه و بخشنامه‌ها
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {news.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {item.isUrgent && (
                    <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      فوری
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">{item.sourceName}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.summary}
                </p>
              </div>

              <span className="text-[11px] text-slate-400 shrink-0">
                {formatJalaliFull(item.publishedAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
