import React, { useState } from 'react';
import {
  ShieldAlert,
  PlusCircle,
  FileCheck2,
  Activity,
  Check,
  AlertCircle,
  Trash2,
  Calendar,
  ExternalLink,
  RefreshCw,
  Building
} from 'lucide-react';
import { RegistrationOpportunity, GovernmentSystem, RegistrationCategory } from '../types';
import { isWithinLast20Days, formatJalaliFull, toPersianDigits } from '../utils/dateUtils';

interface AdminViewProps {
  registrations: RegistrationOpportunity[];
  systems: GovernmentSystem[];
  onAddRegistration: (reg: RegistrationOpportunity) => void;
  onDeleteRegistration: (id: string) => void;
  onProbeAllSystems: () => Promise<void>;
}

export const AdminView: React.FC<AdminViewProps> = ({
  registrations,
  systems,
  onAddRegistration,
  onDeleteRegistration,
  onProbeAllSystems,
}) => {
  const [activeTab, setActiveTab] = useState<'add_reg' | 'manage_regs' | 'system_audit'>('add_reg');

  // Form states
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<RegistrationCategory>('exam');
  const [summary, setSummary] = useState('');
  const [officialUrl, setOfficialUrl] = useState('https://');
  const [sourceName, setSourceName] = useState('');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);
  const [deadlineAt, setDeadlineAt] = useState('');
  const [feeEstimated, setFeeEstimated] = useState('طبق تعرفه مصوب');
  const [requirementsInput, setRequirementsInput] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleCreateRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!title.trim() || !organization.trim() || !summary.trim() || !officialUrl.trim()) {
      setFormError('لطفاً کلیه فیلدهای الزامی را تکمیل فرمایید.');
      return;
    }

    // 20-day rule check validation on publish date
    const isoPub = new Date(publishedAt).toISOString();
    if (!isWithinLast20Days(isoPub)) {
      setFormError('طبق قانون قطعی سامانه، تاریخ انتشار نمی‌تواند قدیمی‌تر از ۲۰ روز گذشته باشد.');
      return;
    }

    const requirements = requirementsInput
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const newReg: RegistrationOpportunity = {
      id: `reg-custom-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      category,
      summary: summary.trim(),
      requirements: requirements.length > 0 ? requirements : ['مدارک هویتی متقاضی', 'شماره همراه به نام شخص'],
      publishedAt: isoPub,
      deadlineAt: deadlineAt ? new Date(deadlineAt).toISOString() : null,
      officialUrl: officialUrl.trim(),
      sourceName: sourceName.trim() || 'درگاه رسمی دولتی',
      sourceUrl: officialUrl.trim(),
      isVerified: true,
      feeEstimated: feeEstimated.trim(),
      tags: [organization.trim(), 'ثبت‌نام رسمی'],
    };

    onAddRegistration(newReg);
    setFormSuccess(`ثبت‌نام «${newReg.title}» با موفقیت به پایگاه داده اضافه شد.`);

    // Reset Form
    setTitle('');
    setOrganization('');
    setSummary('');
    setOfficialUrl('https://');
    setSourceName('');
    setRequirementsInput('');
    setDeadlineAt('');
    setTimeout(() => setFormSuccess(null), 3000);
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      await onProbeAllSystems();
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              پنل مدیریت و پایش داده‌های کافی‌نت
            </h1>
            <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              سطح دسترسی: مدیر ارشد
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            افزودن ثبت‌نام‌های جدید، اعتبارسنجی منابع، مدیریت فهرست‌ها و بررسی سلامت تجمیعی سامانه‌های کشوری
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('add_reg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'add_reg'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
            افزودن ثبت‌نام جدید
          </button>
          <button
            onClick={() => setActiveTab('manage_regs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'manage_regs'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-blue-500" />
            مدیریت ثبت‌نام‌ها ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('system_audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'system_audit'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            آزمون سلامت سرورها
          </button>
        </div>
      </div>

      {activeTab === 'add_reg' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-3xl mx-auto space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
            فرم ثبت فرصت یا اطلاعیه ثبت‌نام جدید
          </h2>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreateRegistration} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  عنوان کامل ثبت‌نام: *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: ثبت‌نام آزمون کارشناسی ارشد ناپیوسته"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  دستگاه / سازمان برگزارکننده: *
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="مثال: سازمان سنجش آموزش کشور"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  دسته‌بندی موضوعی:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="exam">آزمون‌های استخدامی و عمومی</option>
                  <option value="employment">استخدامی و جذب نیرو</option>
                  <option value="university">ثبت‌نام دانشگاه‌ها و پذیرش</option>
                  <option value="konkur">کنکور سراسری و ارشد</option>
                  <option value="loan">تسهیلات و وام‌های دولتی</option>
                  <option value="auto">ثبت‌نام و فروش خودرو</option>
                  <option value="social_security">تأمین اجتماعی و بیمه</option>
                  <option value="identity">خدمات هویتی و مسکن</option>
                  <option value="social_support">طرح‌های حمایتی</option>
                  <option value="other">سایر امور مرتبط کافی‌نت</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  نشانی اینترنتی سامانه رسمی (URL): *
                </label>
                <input
                  type="url"
                  value={officialUrl}
                  onChange={(e) => setOfficialUrl(e.target.value)}
                  placeholder="https://sanjesh.org"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  تاریخ انتشار یا آخرین به‌روزرسانی (محدوده ۲۰ روز): *
                </label>
                <input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  مهلت پایانی ثبت‌نام (خالی بگذارید اگر مشخص نیست):
                </label>
                <input
                  type="date"
                  value={deadlineAt}
                  onChange={(e) => setDeadlineAt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                خلاصه و توضیحات فرصت: *
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="توضیح کوتاه در مورد شرایط ثبت‌نام، مدارک، افراد واجد شرایط و..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                شرایط و مدارک لازم (هر شرط در یک خط):
              </label>
              <textarea
                rows={2}
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                placeholder="مدارک هویتی&#10;کد پستی معتبر&#10;عکس پرسنلی اسکن شده"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              افزودن و انتشار در فهرست ثبت‌نام‌های فعال
            </button>
          </form>
        </div>
      )}

      {activeTab === 'manage_regs' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
            فهرست ثبت‌نام‌های ثبت‌شده در سامانه
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {registrations.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {r.title}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {r.organization}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    انتشار: {formatJalaliFull(r.publishedAt)} | نشانی: {r.officialUrl}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteRegistration(r.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                  title="حذف این مورد"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'system_audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                آزمون جامع سلامت سامانه‌های دولتی
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ارسال پینگ همزمان به سرورهای سنجش، تأمین اجتماعی، سخا، ثنا و... با گزارش زمان پاسخ
              </p>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
              {isAuditing ? 'در حال آزمون کلیه سامانه‌ها...' : 'اجرای آزمون تجمیعی'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {systems.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[180px]">
                    {s.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {s.latencyMs ? `${toPersianDigits(s.latencyMs)} ms` : 'بررسی نشده'}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === 'up'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : s.status === 'degraded'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {s.status === 'up' ? 'پایدار' : s.status === 'degraded' ? 'کندی' : 'قطع'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
