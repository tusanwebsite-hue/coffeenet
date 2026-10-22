import React, { useState } from 'react';
import {
  Link2,
  ExternalLink,
  Copy,
  Check,
  Star,
  Search,
  Building,
  BookmarkCheck,
  Share2,
  Layers,
  GraduationCap,
  Scale,
  Calculator,
  Shield,
  Car,
  Globe2,
  Landmark
} from 'lucide-react';
import { SystemLinkBankItem } from '../types';

interface LinkBankViewProps {
  links: SystemLinkBankItem[];
  onToggleFavorite: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'آزمون و آموزش': <GraduationCap className="w-4 h-4 text-indigo-500" />,
  'عدل ایران و قضایی': <Scale className="w-4 h-4 text-emerald-500" />,
  'امور مالیاتی': <Calculator className="w-4 h-4 text-amber-500" />,
  'تامین اجتماعی': <Shield className="w-4 h-4 text-teal-500" />,
  'خودرو و حمل‌ونقل': <Car className="w-4 h-4 text-blue-500" />,
  'درگاه‌های جامع دولتی': <Globe2 className="w-4 h-4 text-purple-500" />,
  'تسهیلات و بانک مرکزی': <Landmark className="w-4 h-4 text-rose-500" />,
};

export const LinkBankView: React.FC<LinkBankViewProps> = ({ links, onToggleFavorite }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(links.map((l) => l.category)))];

  const filteredLinks = links.filter((link) => {
    if (onlyFavorites && !link.isFavorite) return false;
    if (selectedCat !== 'all' && link.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        link.title.toLowerCase().includes(q) ||
        link.organization.toLowerCase().includes(q) ||
        link.description.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q) ||
        (link.shortcutCode && link.shortcutCode.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopyLink = (link: SystemLinkBankItem) => {
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              بانک جامع لینک‌ها و درگاه‌های رسمی کشوری
            </h1>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {links.length} سامانه معتبر
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            مجموعه کامل و تفکیک‌شده سامانه‌های پرکاربرد صنف کافی‌نت و دفاتر پیشخوان: آزمون و سنجش، عدل ایران، مالیات، تامین اجتماعی و سامانه‌های یکپارچه
          </p>
        </div>

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            onlyFavorites
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-current' : ''}`} />
          {onlyFavorites ? 'نمایش همه سامانه‌ها' : 'فقط سامانه‌های برگزیده (ستاره‌دار)'}
        </button>
      </div>

      {/* 2. Filter, Search & Categories Tabs */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جست‌وجوی سامانه بر اساس نام، ارگان، نشانی اینترنتی یا کاربرد (مثال: ابلاغیه، ثنا، سوابق بیمه، مایتکس، کنکور)..."
            className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const count =
              cat === 'all'
                ? links.length
                : links.filter((l) => l.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  selectedCat === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat !== 'all' && CATEGORY_ICONS[cat]}
                <span>{cat === 'all' ? 'همه دسته‌بندی‌ها' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCat === cat
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((link) => (
          <div
            key={link.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                  {CATEGORY_ICONS[link.category]}
                  <span>{link.category}</span>
                </span>

                <button
                  onClick={() => onToggleFavorite(link.id)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    link.isFavorite
                      ? 'text-amber-500'
                      : 'text-slate-300 hover:text-amber-500'
                  }`}
                  title={link.isFavorite ? 'حذف از برگزیده‌ها' : 'افزودن به برگزیده‌ها'}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {link.title}
              </h3>

              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                {link.organization}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                {link.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopyLink(link)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="کپی لینک"
              >
                {copiedId === link.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] text-emerald-600 font-bold">کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">کپی نشانی</span>
                  </>
                )}
              </button>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>ورود به سامانه</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}

        {filteredLinks.length === 0 && (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Link2 className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              هیچ سامانه‌ای با مشخصات جست‌وجو شده یافت نشد
            </h3>
            <p className="text-xs text-slate-500">
              لطفاً عبارت دیگری را جست‌وجو کنید یا فیلتر دسته‌بندی را به «همه» تغییر دهید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
