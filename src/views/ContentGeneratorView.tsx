import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Send,
  Bookmark,
  RefreshCw,
  Sliders,
  Share2,
  AlertCircle,
  HelpCircle,
  Hash,
  Download,
  Info,
  Image as ImageIcon,
  Upload,
  X,
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { RegistrationOpportunity, UserCafeSettings, ContentDraft } from '../types';
import { generateOfflineContent, OFFLINE_CONTENT_TEMPLATES } from '../utils/contentTemplates';
import { getDeadlineStatus } from '../utils/dateUtils';
import { supabase } from '../lib/supabase';

interface ContentGeneratorViewProps {
  settings: UserCafeSettings;
  registrations: RegistrationOpportunity[];
  initialSelectedRegId?: string;
  onSaveDraft: (draft: ContentDraft) => void;
}

export const ContentGeneratorView: React.FC<ContentGeneratorViewProps> = ({
  settings,
  registrations,
  initialSelectedRegId,
  onSaveDraft,
}) => {
  const [selectedRegId, setSelectedRegId] = useState<string>(initialSelectedRegId || '');
  const [channel, setChannel] = useState<string>('telegram_notice');
  const [tone, setTone] = useState<'formal' | 'friendly' | 'promotional' | 'urgent'>('formal');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [customOrg, setCustomOrg] = useState<string>('');
  const [customRequirements, setCustomRequirements] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [engineMode, setEngineMode] = useState<'offline' | 'ai'>('offline');

  // Image attachment state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  // If a registration is selected, auto-populate variables
  const selectedReg = registrations.find((r) => r.id === selectedRegId);

  const handleSelectRegistration = (regId: string) => {
    setSelectedRegId(regId);
    setCustomTopic('');
    const reg = registrations.find((r) => r.id === regId);
    if (reg) {
      const deadline = getDeadlineStatus(reg.deadlineAt).label;
      const text = generateOfflineContent(channel, {
        title: reg.title,
        org: reg.organization,
        deadline,
        url: reg.officialUrl,
        requirements: reg.requirements.length > 0 ? `• ${reg.requirements.join('\n• ')}` : undefined,
        cafeName: settings.cafeName,
        phone: settings.phone,
        address: settings.address,
      });
      setGeneratedOutput(text);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiError(null);
    setCopied(false);
    setDraftSaved(false);

    const title = selectedReg ? selectedReg.title : customTopic || 'خدمات ویژه کافی‌نت و پیشخوان دولت';
    const org = selectedReg ? selectedReg.organization : customOrg || 'سازمان‌های مربوطه';
    const deadline = selectedReg ? getDeadlineStatus(selectedReg.deadlineAt).label : 'اطلاع‌رسانی خواهد شد';
    const url = selectedReg ? selectedReg.officialUrl : 'سامانه رسمی کشور';
    const requirements = selectedReg
      ? selectedReg.requirements.join('\n• ')
      : customRequirements || 'مدارک شناسایی و اطلاعات هویتی';

    // 1. Offline Mode (Zero AI)
    if (engineMode === 'offline') {
      setTimeout(() => {
        const text = generateOfflineContent(channel, {
          title,
          org,
          deadline,
          url,
          requirements: requirements ? `• ${requirements}` : undefined,
          cafeName: settings.cafeName,
          phone: settings.phone,
          address: settings.address,
        });
        setGeneratedOutput(text);
        setIsGenerating(false);
      }, 300);
      return;
    }

    // 2. Gemini AI Mode (Server-side API Call)
    try {
      let prompt = `یک متن جذاب، دقیق و حرفه‌ای برای ${channel} آماده کن.
عنوان موضوع: ${title}
سازمان مجری: ${org}
مهلت رسمی: ${deadline}
آدرس سامانه: ${url}
مدارک و شرایط لازم: ${requirements}
کلمات کلیدی: ${keywords}
اطلاعات تماس کافی‌نت: نام ${settings.cafeName}، تلفن ${settings.phone}، آدرس ${settings.address}
لحن درخواستی: ${tone}`;

      // Load this authenticated user's AI profile; RLS ensures users can only read their own row.
      if (supabase) {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;
        if (user) {
          const { data: aiProfile, error: profileError } = await supabase
            .from('user_ai_profiles')
            .select('display_name,cafe_name,phone,ai_instructions,preferred_tone,preferred_channel')
            .eq('user_id', user.id)
            .maybeSingle();
          if (profileError) throw new Error('بارگذاری پروفایل هوش مصنوعی ناموفق بود. ابتدا تنظیمات فضای کاربری را بررسی کنید.');
          if (aiProfile) {
            prompt += `\n\nتنظیمات اختصاصی صاحب حساب (بر تنظیمات عمومی اولویت دارد):\nنام نمایشی: ${aiProfile.display_name || ''}\nنام کسب‌وکار: ${aiProfile.cafe_name || settings.cafeName}\nتلفن کسب‌وکار: ${aiProfile.phone || settings.phone}\nلحن ترجیحی: ${aiProfile.preferred_tone || tone}\nکانال ترجیحی: ${aiProfile.preferred_channel || channel}\nدستورالعمل اختصاصی: ${aiProfile.ai_instructions || 'بدون دستورالعمل اضافی'}\nاز این تنظیمات برای شخصی‌سازی متن استفاده کن؛ هیچ تاریخ، مبلغ یا ادعای رسمی تأییدنشده‌ای اختراع نکن.`;
          }
        }
      }

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          contentType: channel,
          tone,
          cafeName: settings.cafeName,
          registrationTitle: title,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در تولید محتوا توسط هوش مصنوعی');
      }

      setGeneratedOutput(data.text);
    } catch (err: any) {
      console.warn('AI Generation Fallback triggered:', err);
      setApiError(err.message || 'عدم دسترسی به هوش مصنوعی. محتوا از طریق موتور آفلاین تولید شد.');
      // Auto-fallback to offline template
      const fallbackText = generateOfflineContent(channel, {
        title,
        org,
        deadline,
        url,
        requirements: `• ${requirements}`,
        cafeName: settings.cafeName,
        phone: settings.phone,
        address: settings.address,
      });
      setGeneratedOutput(fallbackText);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    if (!generatedOutput.trim()) return;
    onSaveDraft({
      id: `draft-${Date.now()}`,
      title: selectedReg ? selectedReg.title : customTopic || 'پیش‌نویس بدون عنوان',
      content: generatedOutput,
      channel,
      date: new Date().toISOString(),
      imageUrl: attachedImage || undefined,
    });
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const wordCount = generatedOutput.trim() ? generatedOutput.trim().split(/\s+/).length : 0;
  const charCount = generatedOutput.length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              تولید محتوای هوشمند شبکه‌های اجتماعی و پیام‌رسان‌ها
            </h1>
            <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              ویژه اطلاعیه‌ها و ثبت‌نام‌های فعال
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            نگارش خودکار متن آماده برای کانال تلگرام، پیج اینستاگرام و پیامک به همراه پیوست پوستر و تصویر
          </p>
        </div>

        {/* Engine Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setEngineMode('offline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              engineMode === 'offline'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            موتور آفلاین (رایگان)
          </button>
          <button
            onClick={() => setEngineMode('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              engineMode === 'ai'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            هوش مصنوعی Gemini
          </button>
        </div>
      </div>

      {/* 2. Active Registrations Quick-Pick Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            انتخاب سریع از اطلاعیه‌ها و ثبت‌نام‌های فعال امروز:
          </span>
          <span className="text-[11px] text-slate-400">برای نگارش فوری کلیک کنید</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {registrations.slice(0, 8).map((reg) => (
            <button
              key={reg.id}
              onClick={() => handleSelectRegistration(reg.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium border text-right transition-all flex items-center gap-2 ${
                selectedRegId === reg.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="truncate max-w-[190px]">{reg.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {reg.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top Controls (Col 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-500" />
            تنظیمات محتوا و پیوست تصویر
          </h2>

          {/* Quick Select from Active Registrations Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              موضوع ثبت‌نام:
            </label>
            <select
              value={selectedRegId}
              onChange={(e) => {
                if (e.target.value) {
                  handleSelectRegistration(e.target.value);
                } else {
                  setSelectedRegId('');
                }
              }}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- متن سفارشی (بدون انتخاب ثبت‌نام) --</option>
              {registrations.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.title} ({reg.organization})
                </option>
              ))}
            </select>
          </div>

          {/* If Custom Topic */}
          {!selectedRegId && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  موضوع یا عنوان خدمت:
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="مثال: ثبت نام وام ودیعه مسکن مستاجران"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  سازمان یا نهاد متولی:
                </label>
                <input
                  type="text"
                  value={customOrg}
                  onChange={(e) => setCustomOrg(e.target.value)}
                  placeholder="مثال: وزارت راه و شهرسازی"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Channel selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              قالب و کانال انتشار:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OFFLINE_CONTENT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setChannel(tpl.id)}
                  className={`p-2 rounded-xl text-xs font-semibold text-right border transition-all truncate ${
                    channel === tpl.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tone selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              لحن نگارش:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'formal', label: 'رسمی' },
                { id: 'friendly', label: 'صمیمی' },
                { id: 'promotional', label: 'تبلیغاتی' },
                { id: 'urgent', label: 'فوری و مهم' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as any)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    tone === t.id
                      ? 'border-emerald-500 bg-emerald-600 text-white font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Attachment Section (Prompt requirement #6) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                پیوست تصویر یا پوستر به محتوا
              </span>
              {attachedImage && (
                <button
                  onClick={() => setAttachedImage(null)}
                  className="text-[11px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  حذف تصویر
                </button>
              )}
            </div>

            {!attachedImage ? (
              <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  انتخاب تصویر از کامپیوتر یا موبایل
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  پوستر اطلاعیه برای ارسال در کانال و استوری
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 max-h-36 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                <img
                  src={attachedImage}
                  alt="پیوست محتوا"
                  className="w-full h-36 object-contain"
                />
              </div>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              کلمات کلیدی و هشتگ‌ها (اختیاری):
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="مثال: استخدام، سنجش، کافی‌نت، فوری"
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                در حال نگارش متن...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                تولید متن آماده انتشار
              </>
            )}
          </button>
        </div>

        {/* Right / Bottom Output View (Col 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  پیش‌نمایش پست آماده انتشار
                </h3>
              </div>

              {/* Statistics */}
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{wordCount} کلمه</span>
                <span>•</span>
                <span>{charCount} کاراکتر</span>
              </div>
            </div>

            {/* Error message alert */}
            {apiError && (
              <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Image preview alongside text if attached */}
            {attachedImage && (
              <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <img
                  src={attachedImage}
                  alt="پیوست"
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    تصویر پوستر پیوست شد
                  </div>
                  <div className="text-[11px] text-slate-500">
                    همراه متن در پیش‌نویس ذخیره می‌شود و می‌توانید برای کانال تلگرام استفاده کنید.
                  </div>
                </div>
              </div>
            )}

            {/* Text Output Box */}
            <textarea
              rows={13}
              value={generatedOutput}
              onChange={(e) => setGeneratedOutput(e.target.value)}
              placeholder="روی یکی از ثبت‌نام‌های فعال بالا یا دکمه «تولید متن آماده انتشار» کلیک کنید تا متن شما بر اساس اطلاعات رسمی سازمان و مشخصات کافی‌نت شما نگارش شود..."
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-sans text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
              dir="rtl"
            />
          </div>

          {/* Output Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!generatedOutput}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-40"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'متن کپی شد!' : 'کپی متن پست'}
              </button>

              <button
                onClick={handleSaveDraft}
                disabled={!generatedOutput}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all disabled:opacity-40"
              >
                <Bookmark className="w-4 h-4" />
                {draftSaved ? 'ذخیره شد!' : 'ذخیره در پیش‌نویس‌ها'}
              </button>
            </div>

            <div className="text-[11px] text-slate-400">
              اطلاعات موثق بدون تخمین‌های غیرواقعی
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
