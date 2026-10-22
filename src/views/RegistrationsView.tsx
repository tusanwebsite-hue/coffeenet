import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bookmark,
  Share2,
  Palette,
  FileText,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Building,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { RegistrationOpportunity, RegistrationCategory } from '../types';
import {
  formatJalaliDate,
  formatJalaliFull,
  isWithinLast20Days,
  getDeadlineStatus,
  toPersianDigits
} from '../utils/dateUtils';

interface RegistrationsViewProps {
  registrations: RegistrationOpportunity[];
  onToggleBookmark: (id: string) => void;
  onQuickGenerateContent: (reg: RegistrationOpportunity) => void;
  onQuickCreatePoster: (reg: RegistrationOpportunity) => void;
  onAddNewRegistration?: () => void;
}

const CATEGORY_TABS: { id: string; label: string; cat?: RegistrationCategory }[] = [
  { id: 'all', label: 'همه دسته‌ها' },
  { id: 'exam', label: 'آزمون‌ها و کنکور', cat: 'exam' },
  { id: 'employment', label: 'استخدامی', cat: 'employment' },
  { id: 'loan', label: 'وام و تسهیلات', cat: 'loan' },
  { id: 'auto', label: 'خودرو و فروش', cat: 'auto' },
  { id: 'university', label: 'دانشگاه و پذیرش', cat: 'university' },
  { id: 'identity', label: 'هویتی و مسکن', cat: 'identity' },
  { id: 'social_support', label: 'حمایتی و رفاهی', cat: 'social_support' },
];

export const RegistrationsView: React.FC<RegistrationsViewProps> = ({
  registrations,
  onToggleBookmark,
  onQuickGenerateContent,
  onQuickCreatePoster,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Apply strict 20-day rule to all items:
  // Must be verified and published within the last 20 days!
  const validRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      // 1. Strict 20-day rule
      const within20 = isWithinLast20Days(item.publishedAt);
      if (!within20) return false;

      // 2. Verified check
      if (!item.isVerified) return false;

      return true;
    });
  }, [registrations]);

  // Filter based on UI controls
  const filteredRegistrations = useMemo(() => {
    return validRegistrations.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catDef = CATEGORY_TABS.find((c) => c.id === selectedCategory);
        if (catDef?.cat && item.category !== catDef.cat) {
          // If searching for exam, also allow konkur and university
          if (selectedCategory === 'exam' && (item.category === 'konkur' || item.category === 'university')) {
            // match
          } else {
            return false;
          }
        }
      }

      // Status filter
      const dl = getDeadlineStatus(item.deadlineAt);
      if (statusFilter !== 'all') {
        if (statusFilter === 'active' && dl.status !== 'active') return false;
        if (statusFilter === 'ending_soon' && dl.status !== 'ending_soon') return false;
        if (statusFilter === 'no_deadline' && dl.status !== 'no_deadline') return false;
        if (statusFilter === 'expired' && dl.status !== 'expired') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesOrg = item.organization.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesOrg && !matchesSummary && !matchesTags) return false;
      }

      return true;
    });
  }, [validRegistrations, selectedCategory, statusFilter, searchQuery]);

  const handleShare = (reg: RegistrationOpportunity) => {
    if (navigator.share) {
      navigator.share({
        title: reg.title,
        text: `${reg.title}\nمهلت: ${getDeadlineStatus(reg.deadlineAt).label}\nورود به سامانه:`,
        url: reg.officialUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${reg.title}\nلینک رسمی سامانه: ${reg.officialUrl}`);
      setCopyFeedback(reg.id);
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Rule Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              ثبت‌نام‌های اینترنتی فعال کشوری
            </h1>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {toPersianDigits(filteredRegistrations.length)} مورد تایید شده
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>اعمال قانون قطعی ۲۰ روز: تنها اطلاعیه‌های معتبر منتشر شده در ۲۰ روز اخیر نمایش داده می‌شوند.</span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          {isRefreshing ? 'در حال پایش منابع رسمی...' : 'به‌روزرسانی و دریافت اخبار جدید'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        {/* Search input + Status dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جست‌وجوی عنوان ثبت‌نام، سازمان متولی یا کلمه کلیدی..."
              className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">فعال و دارای مهلت</option>
              <option value="ending_soon">فوری (نزدیک به پایان)</option>
              <option value="no_deadline">بدون مهلت پایانی مشخص</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedCategory === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations Cards Grid */}
      {filteredRegistrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredRegistrations.map((item) => {
            const dl = getDeadlineStatus(item.deadlineAt);
            const isEndingSoon = dl.status === 'ending_soon';
            const isNoDeadline = dl.status === 'no_deadline';

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:shadow-md group"
              >
                <div>
                  {/* Card Header: Organization + Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Building className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-bold truncate max-w-[200px]">{item.organization}</span>
                    </div>

                    {/* Deadline status tag */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isEndingSoon
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                            : isNoDeadline
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {isEndingSoon && <Clock className="w-3 h-3 animate-bounce" />}
                        {dl.label}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* Requirements checklist preview */}
                  {item.requirements && item.requirements.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-4 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        شرایط و مدارک اعلامی:
                      </span>
                      {item.requirements.slice(0, 2).map((req, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{req}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Verification source & publication info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 mb-4">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>منبع رسمی: {item.sourceName}</span>
                    </div>
                    <div>انتشار: {formatJalaliFull(item.publishedAt)}</div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-1">
                    {/* Make Poster Button */}
                    <button
                      onClick={() => onQuickCreatePoster(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 transition-colors"
                      title="ساخت پوستر شبکه اجتماعی از این اطلاعیه"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">پوستر</span>
                    </button>

                    {/* Make Caption Button */}
                    <button
                      onClick={() => onQuickGenerateContent(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-600 transition-colors"
                      title="تولید متن و کپشن تلگرام/اینستاگرام"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">متن</span>
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        item.isBookmarked
                          ? 'border-amber-300 text-amber-500 bg-amber-50 dark:bg-slate-800'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                      }`}
                      title={item.isBookmarked ? 'حذف از نشان‌شده‌ها' : 'نشان کردن'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(item)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="اشتراک‌گذاری لینک"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {copyFeedback === item.id && (
                      <span className="text-[10px] text-emerald-600 font-bold">کپی شد!</span>
                    )}
                  </div>

                  {/* Official Direct Portal Link */}
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <span>ورود به سامانه</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Info className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            موردی مطابق با فیلترهای انتخابی یافت نشد
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            تنها ثبت‌نام‌های معتبر ۲۰ روز اخیر در این بخش مجاز هستند. با تغییر فیلتر دسته‌بندی یا پاک‌سازی جست‌وجو نتایج را بررسی فرمایید.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
          >
            پاک کردن فیلترها
          </button>
        </div>
      )}
    </div>
  );
};
