import React, { useState } from 'react';
import {
  Bookmark,
  FileCheck2,
  FileText,
  Link2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Share2
} from 'lucide-react';
import { RegistrationOpportunity, SystemLinkBankItem, ContentDraft } from '../types';
import { formatJalaliFull, getDeadlineStatus } from '../utils/dateUtils';

interface BookmarksViewProps {
  bookmarkedRegistrations: RegistrationOpportunity[];
  bookmarkedLinks: SystemLinkBankItem[];
  savedDrafts: ContentDraft[];
  onToggleBookmarkReg: (id: string) => void;
  onToggleFavoriteLink: (id: string) => void;
  onDeleteDraft: (id: string) => void;
  onSelectRegistration: (reg: RegistrationOpportunity) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedRegistrations,
  bookmarkedLinks,
  savedDrafts,
  onToggleBookmarkReg,
  onToggleFavoriteLink,
  onDeleteDraft,
  onSelectRegistration,
}) => {
  const [activeTab, setActiveTab] = useState<'regs' | 'links' | 'drafts'>('regs');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);

  const handleCopyDraft = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraftId(id);
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1">
            نشان‌شده‌ها و پیش‌نویس‌های من
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            دسترسی سریع به ثبت‌نام‌های ذخیره‌شده، درگاه‌های منتخب و متن‌های تولیدی آماده انتشار
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('regs')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'regs'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ثبت‌نام‌ها ({bookmarkedRegistrations.length})
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'links'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            سامانه‌ها ({bookmarkedLinks.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'drafts'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            پیش‌نویس‌ها ({savedDrafts.length})
          </button>
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === 'regs' && (
        <div className="space-y-4">
          {bookmarkedRegistrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedRegistrations.map((reg) => {
                const dl = getDeadlineStatus(reg.deadlineAt);
                return (
                  <div
                    key={reg.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {reg.organization}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          {dl.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                        {reg.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {reg.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => onToggleBookmarkReg(reg.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف از ذخیره‌ها
                      </button>

                      <a
                        href={reg.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs"
                      >
                        ورود به سامانه
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">هیچ ثبت‌نامی در علاقه‌مندی‌ها ذخیره نشده است.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'links' && (
        <div className="space-y-4">
          {bookmarkedLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">
                      {link.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                      {link.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                      {link.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onToggleFavoriteLink(link.id)}
                      className="text-xs text-rose-500 hover:text-rose-700"
                    >
                      حذف نشان
                    </button>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      باز کردن
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
              <Link2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">هیچ سامانه‌ای به عنوان برگزیده ذخیره نشده است.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'drafts' && (
        <div className="space-y-4">
          {savedDrafts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedDrafts.map((d) => (
                <div
                  key={d.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {d.title}
                      </span>
                      <span>{formatJalaliFull(d.date)}</span>
                    </div>

                    {d.imageUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <img src={d.imageUrl} alt="پیوست پیش‌نویس" className="max-h-40 w-full object-contain" />
                      </div>
                    )}

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-200 line-clamp-4 whitespace-pre-wrap leading-relaxed mb-4">
                      {d.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onDeleteDraft(d.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف پیش‌نویس
                    </button>

                    <div className="flex items-center gap-2">
                      {d.imageUrl && (
                        <a
                          href={d.imageUrl}
                          download={`attached-poster-${d.id}.png`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          دانلود عکس
                        </a>
                      )}
                      <button
                        onClick={() => handleCopyDraft(d.id, d.content)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
                      >
                        {copiedDraftId === d.id ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedDraftId === d.id ? 'کپی شد' : 'کپی متن'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">هنوز متنی در پیش‌نویس‌ها ذخیره نشده است.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
