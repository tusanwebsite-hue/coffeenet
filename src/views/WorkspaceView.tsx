import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, UserRound, Sparkles, Save, LoaderCircle, ShieldCheck } from 'lucide-react';
import { supabase, supabaseConfigured } from '../lib/supabase';

type Profile = { display_name: string; cafe_name: string; phone: string; ai_instructions: string; preferred_tone: string; preferred_channel: string };

const emptyProfile: Profile = { display_name: '', cafe_name: '', phone: '', ai_instructions: '', preferred_tone: 'رسمی و حرفه‌ای', preferred_channel: 'تلگرام' };

export const WorkspaceView: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) setMessage('بازیابی نشست ناموفق بود. دوباره تلاش کنید.');
      setSession(data.session);
      setLoading(false);
    }).catch(() => { if (alive) { setMessage('خطا در اتصال به سرویس حساب کاربری.'); setLoading(false); } });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) setProfile(emptyProfile);
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user?.id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setMessage('');
      try {
        const { data, error } = await supabase.from('user_ai_profiles').select('display_name,cafe_name,phone,ai_instructions,preferred_tone,preferred_channel').eq('user_id', session.user.id).maybeSingle();
        if (error) throw error;
        if (alive && data) setProfile({ ...emptyProfile, ...data });
      } catch (error: any) {
        if (alive) setMessage(error?.code === '42P01' || error?.code === 'PGRST205'
          ? 'جدول پروفایل هنوز ساخته نشده است. فایل supabase/migrations/202610220001_user_ai_profiles.sql را در SQL Editor سوپابیس اجرا کنید.'
          : 'بارگذاری پروفایل انجام نشد. تنظیمات Supabase و سیاست‌های دسترسی را بررسی کنید.');
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [session?.user?.id]);

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true); setMessage('');
    try {
      const result = mode === 'signup'
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) throw result.error;
      if (mode === 'signup' && !result.data.session) setMessage('حساب ساخته شد. ایمیل خود را برای تأیید حساب بررسی کنید؛ سپس وارد شوید.');
      else setMessage(mode === 'signup' ? 'حساب کاربری ایجاد شد.' : 'با موفقیت وارد شدید.');
    } catch (error: any) {
      setMessage(error?.message || 'ورود یا ثبت‌نام انجام نشد. اطلاعات را بررسی کنید.');
    } finally { setLoading(false); }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !session?.user?.id) return;
    setSaving(true); setMessage('');
    try {
      const payload = { user_id: session.user.id, ...profile, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('user_ai_profiles').upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;
      setMessage('پروفایل شخصی و تنظیمات هوش مصنوعی ذخیره شد.');
    } catch (error: any) {
      setMessage(error?.message || 'ذخیره پروفایل انجام نشد. دسترسی دیتابیس را بررسی کنید.');
    } finally { setSaving(false); }
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setMessage(error ? 'خروج انجام نشد؛ دوباره تلاش کنید.' : 'از حساب خارج شدید.');
  };

  const field = (label: string, key: keyof Profile, placeholder: string, multiline = false) => (
    <label className="block space-y-1.5" key={key}>
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
      {multiline ? <textarea value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} rows={4} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm" /> :
      <input value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm" />}
    </label>
  );

  return <section className="mx-auto max-w-4xl space-y-6" dir="rtl">
    <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-100 dark:bg-emerald-950 p-3 text-emerald-700"><UserRound /></div><div><h1 className="text-2xl font-black">فضای کاربری و پروفایل هوش مصنوعی</h1><p className="mt-1 text-sm text-slate-500">اطلاعات کسب‌وکار و دستورالعمل‌های هوش مصنوعی به حساب شما متصل می‌شوند.</p></div></div>
    </header>
    {!supabaseConfigured ? <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900"><b>اتصال Supabase تنظیم نشده است.</b><p className="mt-2 text-sm">در Netlify متغیرهای VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY را تنظیم و سپس سایت را دوباره منتشر کنید. هرگز کلید service_role را در متغیرهای VITE_ قرار ندهید.</p></div>
    : loading ? <div className="flex items-center gap-2 p-6 text-slate-500"><LoaderCircle className="animate-spin" /> در حال بارگذاری حساب...</div>
    : !session ? <form onSubmit={submitAuth} className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h2 className="text-lg font-bold">{mode === 'login' ? 'ورود به حساب' : 'ایجاد حساب کاربری'}</h2>
      <label className="block space-y-1"><span className="text-sm">ایمیل</span><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border bg-slate-50 dark:bg-slate-800 p-3" /></label>
      <label className="block space-y-1"><span className="text-sm">گذرواژه (حداقل ۸ نویسه)</span><input required minLength={8} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border bg-slate-50 dark:bg-slate-800 p-3" /></label>
      <button disabled={loading} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white disabled:opacity-50"><LogIn size={18}/>{mode === 'login' ? 'ورود' : 'ثبت‌نام'}</button>
      <button type="button" onClick={()=>setMode(m=>m === 'login' ? 'signup' : 'login')} className="mr-3 text-sm font-bold text-emerald-700">{mode === 'login' ? 'حساب ندارید؟ ثبت‌نام کنید' : 'قبلاً حساب ساخته‌اید؟ وارد شوید'}</button>
    </form>
    : <form onSubmit={saveProfile} className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-bold">{session.user.email}</div><div className="text-xs text-slate-500 mt-1">پروفایل ذخیره‌شده در فضای امن حساب شما</div></div><button type="button" onClick={signOut} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"><LogOut size={16}/> خروج</button></div>
      <div className="grid gap-4 sm:grid-cols-2">{field('نام نمایشی','display_name','نام و نام خانوادگی')}{field('نام کافی‌نت / کسب‌وکار','cafe_name','مثلاً کافی‌نت توسن')}{field('شماره تماس','phone','شماره تماس دفتر')}<label className="block space-y-1.5"><span className="text-sm font-bold">لحن پیش‌فرض هوش مصنوعی</span><select value={profile.preferred_tone} onChange={e=>setProfile(p=>({...p,preferred_tone:e.target.value}))} className="w-full rounded-xl border bg-slate-50 dark:bg-slate-800 p-3"><option>رسمی و حرفه‌ای</option><option>صمیمی و دوستانه</option><option>تبلیغاتی و ترغیب‌کننده</option><option>فوری و کوتاه</option></select></label><label className="block space-y-1.5"><span className="text-sm font-bold">کانال پیش‌فرض</span><select value={profile.preferred_channel} onChange={e=>setProfile(p=>({...p,preferred_channel:e.target.value}))} className="w-full rounded-xl border bg-slate-50 dark:bg-slate-800 p-3"><option>تلگرام</option><option>اینستاگرام</option><option>واتساپ</option><option>وب‌سایت</option><option>پیامک</option></select></label></div>
      {field('دستورالعمل اختصاصی هوش مصنوعی','ai_instructions','مثلاً نام برند را همیشه بنویس، از لحن رسمی استفاده کن، اطلاعات تأییدنشده نساز...',true)}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-600 dark:text-slate-300"><Sparkles className="inline ml-2 text-emerald-600" size={18}/> این تنظیمات برای حساب واردشده ذخیره می‌شود؛ در مرحله بعد باید به درخواست‌های تولید محتوا نیز تزریق شود.</div>
      <button disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white disabled:opacity-50"><Save size={18}/>{saving ? 'در حال ذخیره...' : 'ذخیره پروفایل'}</button>
    </form>}
    {message && <p role="status" className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 p-4 text-sm">{message}</p>}
    <p className="text-xs text-slate-500"><ShieldCheck className="inline ml-1" size={14}/> دسترسی به هر پروفایل باید توسط سیاست‌های RLS دیتابیس محدود شود.</p>
  </section>;
};
