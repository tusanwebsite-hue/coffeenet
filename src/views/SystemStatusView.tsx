import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
  MessageSquare,
  Users,
  KeyRound,
  Server,
  ThumbsUp,
  ThumbsDown,
  Info,
  Check
} from 'lucide-react';
import { GovernmentSystem } from '../types';
import { formatJalaliFull, toPersianDigits } from '../utils/dateUtils';

interface SystemStatusViewProps {
  systems: GovernmentSystem[];
  onUpdateSystemStatus: (id: string, updated: Partial<GovernmentSystem>) => void;
  onProbeSystem: (sys: GovernmentSystem) => Promise<void>;
}

export const SystemStatusView: React.FC<SystemStatusViewProps> = ({
  systems,
  onUpdateSystemStatus,
  onProbeSystem,
}) => {
  const [probingId, setProbingId] = useState<string | null>(null);
  const [isProbingAll, setIsProbingAll] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customTestUrl, setCustomTestUrl] = useState<string>('');
  const [customTestResult, setCustomTestResult] = useState<any>(null);
  const [isTestingCustom, setIsTestingCustom] = useState<boolean>(false);

  // User feedback report modal / state
  const [reportingSystemId, setReportingSystemId] = useState<string | null>(null);
  const [reportComment, setReportComment] = useState<string>('');
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'همه سامانه‌ها' },
    { id: 'وام', label: 'وام و تسهیلات' },
    { id: 'خودرو', label: 'ثبت‌نام خودرو و اتونوین' },
    { id: 'آموزش', label: 'سنجش و جهاد دانشگاهی' },
    { id: 'قضایی', label: 'قوه قضائیه و ثنا' },
    { id: 'بیمه', label: 'تأمین اجتماعی و بیمه' },
    { id: 'دولت', label: 'درگاه‌های جامع دولتی' },
  ];

  const handleProbeOne = async (sys: GovernmentSystem) => {
    setProbingId(sys.id);
    try {
      await onProbeSystem(sys);
    } finally {
      setProbingId(null);
    }
  };

  const handleProbeAll = async () => {
    setIsProbingAll(true);
    try {
      for (const sys of systems) {
        setProbingId(sys.id);
        await onProbeSystem(sys);
      }
    } finally {
      setIsProbingAll(false);
      setProbingId(null);
    }
  };

  const handleSubmitUserReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingSystemId || !reportComment.trim()) return;

    onUpdateSystemStatus(reportingSystemId, {
      userReports: `گزارش جدید مدیر کافی‌نت: ${reportComment.trim()}`,
    });

    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportingSystemId(null);
      setReportComment('');
    }, 1500);
  };

  const handleTestCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestUrl.trim()) return;

    setIsTestingCustom(true);
    setCustomTestResult(null);

    try {
      const res = await fetch('/api/system-status/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: customTestUrl.trim(),
          id: 'custom-probe',
          name: 'آدرس سفارشی',
        }),
      });
      const data = await res.json();
      setCustomTestResult(data);
    } catch {
      setCustomTestResult({
        status: 'down',
        message: 'خطا در برقراری تماس با سرور بررسی پایش.',
      });
    } finally {
      setIsTestingCustom(false);
    }
  };

  // Filtered systems
  const filteredSystems = systems.filter((sys) => {
    if (filterCategory !== 'all') {
      const matchCat =
        sys.category.includes(filterCategory) ||
        sys.name.includes(filterCategory) ||
        (filterCategory === 'وام' && sys.url.includes('cbi')) ||
        (filterCategory === 'آموزش' && (sys.name.includes('سنجش') || sys.name.includes('جهاد')));
      if (!matchCat) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sys.name.toLowerCase().includes(q) ||
        sys.organization.toLowerCase().includes(q) ||
        sys.category.toLowerCase().includes(q) ||
        sys.url.toLowerCase().includes(q) ||
        (sys.userReports && sys.userReports.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const upCount = systems.filter((s) => s.status === 'up').length;
  const degradedCount = systems.filter((s) => s.status === 'degraded').length;
  const downCount = systems.filter((s) => s.status === 'down').length;
  const needsCheckCount = systems.filter((s) => s.status === 'needs_check').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              پایش سلامت و وضعیت عملکردی سامانه‌های دولتی
            </h1>
            <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              تست واقعی سرور + نظرات همکاران صنف
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
            با توجه به اینکه صرف بالا آمدن صفحه نخست سایت دلیلی بر باز بودن ثبت‌نام یا سلامت درگاه نیست، در این بخش وضعیت احراز هویت (SSO)، گزارش‌های تجربی کافی‌نت‌ها و اتصال سرور به‌طور همزمان تحلیل می‌گردد.
          </p>
        </div>

        <button
          onClick={handleProbeAll}
          disabled={isProbingAll}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 active:scale-95 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isProbingAll ? 'animate-spin' : ''}`} />
          {isProbingAll ? 'در حال پایش همزمان سامانه‌ها...' : 'بررسی زنده اتصال سرورها'}
        </button>
      </div>

      {/* 2. Status Counters Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">در دسترس و پایدار</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {toPersianDigits(upCount)}
          </div>
          <span className="text-[10px] text-emerald-600/80">بدون اختلال گزارش‌شده</span>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">دارای کندی یا ترافیک</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {toPersianDigits(degradedCount)}
          </div>
          <span className="text-[10px] text-amber-600/80">احتمال تاخیر در لاگین</span>
        </div>

        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300">قطع یا مسدود</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {toPersianDigits(downCount)}
          </div>
          <span className="text-[10px] text-rose-600/80">عدم پاسخ سرور دولتی</span>
        </div>

        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">نیازمند IP ایران</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {toPersianDigits(needsCheckCount)}
          </div>
          <span className="text-[10px] text-indigo-600/80">عدل ایران و تدابیر فراجا</span>
        </div>
      </div>

      {/* 3. Category Tabs & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جست‌وجوی سامانه (مثال: وام ازدواج، خودرو، تامین اجتماعی، ثنا، جهاد دانشگاهی)..."
            className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                filterCategory === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Enhanced Systems List */}
      <div className="space-y-4">
        {filteredSystems.map((sys) => {
          const isUp = sys.status === 'up';
          const isDegraded = sys.status === 'degraded';
          const isDown = sys.status === 'down';
          const isProbing = probingId === sys.id;

          return (
            <div
              key={sys.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
            >
              {/* Row 1: Header + Badges + Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="mt-0.5">
                    {isUp && (
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                    {isDegraded && (
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    )}
                    {isDown && (
                      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <XCircle className="w-5 h-5 animate-pulse" />
                      </div>
                    )}
                    {sys.status === 'needs_check' && (
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {sys.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {sys.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      سازمان متولی: {sys.organization}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setReportingSystemId(sys.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-colors"
                    title="ثبت گزارش تجربی شما از این سامانه"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="hidden sm:inline">ثبت گزارش اختلال</span>
                  </button>

                  <button
                    onClick={() => handleProbeOne(sys)}
                    disabled={isProbing}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin text-emerald-500' : ''}`} />
                    <span>{isProbing ? 'تست...' : 'پایش'}</span>
                  </button>

                  <a
                    href={sys.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>ورود به سامانه</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Row 2: Diagnostics & SSO Status Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">پاسخ سرور:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{sys.message}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-500">احراز هویت و ورود (SSO):</span>
                  <span className={`font-bold ${sys.ssoStatus === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {sys.ssoStatus === 'active' ? 'فعال و برقراری پیامک' : 'دارای تاخیر یا احراز هویت کند'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-500">شاخص پایداری:</span>
                  <span className="font-bold text-blue-600">
                    {sys.reliabilityScore ? `${toPersianDigits(sys.reliabilityScore)}٪` : '۹۲٪'}
                  </span>
                  {sys.latencyMs && (
                    <span className="text-slate-400 text-[11px] font-mono">
                      ({toPersianDigits(sys.latencyMs)} ms)
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3: Community & Guild Feedback Notice (نظرات و استناد کاربران صنف) */}
              {sys.userReports && (
                <div className="flex items-start gap-2 bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <Users className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">شواهد و گزارش‌های همکاران صنف کافی‌نت:</span>
                    <p>{sys.userReports}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. User Report Modal */}
      {reportingSystemId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              ثبت وضعیت تجربی و گزارش همکار کافی‌نت
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              آیا سامانه کند است؟ آیا پیامک کد ورود ارسال نمی‌شود یا خطای درگاه پرداخت دارد؟ گزارش شما برای اطلاع کلیه همکاران ثبت خواهد شد.
            </p>

            <form onSubmit={handleSubmitUserReport} className="space-y-3">
              <textarea
                rows={3}
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
                placeholder="مثال: درگاه بانک ملت متصل است اما مرحله آخر خطای سشن می‌دهد..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              {reportSuccess && (
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  گزارش شما با موفقیت ثبت گردید.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingSystemId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-500"
                >
                  ثبت گزارش صنف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Safe Custom URL Probing Tool with SSRF Protection Notice */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Server className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            بررسی سفارشی درگاه‌های دولتی با فیلتر ضدنفوذ SSRF
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          برای سنجش پایداری درگاهی خاص، آدرس آن را وارد کنید. به دلایل امنیتی فقط دامنه‌های معتبر دولتی کشور در فهرست مجاز توسط سرور بررسی خواهند شد.
        </p>

        <form onSubmit={handleTestCustomUrl} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={customTestUrl}
            onChange={(e) => setCustomTestUrl(e.target.value)}
            placeholder="مثال: https://esale.ikco.ir یا https://ve.cbi.ir"
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={isTestingCustom}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50 shrink-0"
          >
            {isTestingCustom ? 'در حال پایش...' : 'بررسی اتصال'}
          </button>
        </form>

        {customTestResult && (
          <div
            className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${
              customTestResult.status === 'up'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              {customTestResult.status === 'up' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500" />
              )}
              <span>نتیجه بررسی: {customTestResult.message}</span>
            </div>
            {customTestResult.latencyMs && (
              <div className="text-[11px] font-mono mt-1">
                زمان پاسخ سرور: {toPersianDigits(customTestResult.latencyMs)} میلی‌ثانیه | کد وضعیت: {customTestResult.statusCode}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
