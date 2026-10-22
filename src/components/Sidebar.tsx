import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Activity,
  Palette,
  FileText,
  Link2,
  Newspaper,
  Bookmark,
  Settings,
  ShieldAlert,
  Sparkles,
  UserRound,
  X
} from 'lucide-react';

export type NavTabId =
  | 'dashboard'
  | 'registrations'
  | 'systems'
  | 'studio'
  | 'content'
  | 'links'
  | 'news'
  | 'bookmarks'
  | 'settings'
  | 'workspace'
  | 'admin';

interface SidebarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  activeRegistrationsCount: number;
  endingSoonCount: number;
  systemsAlertCount: number;
  bookmarksCount: number;
  primaryColor: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeRegistrationsCount,
  endingSoonCount,
  systemsAlertCount,
  bookmarksCount,
  primaryColor,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTabId,
      label: 'داشبورد',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'registrations' as NavTabId,
      label: 'ثبت‌نام‌های فعال',
      icon: FileCheck2,
      badge: endingSoonCount > 0 ? `${endingSoonCount} فوری` : `${activeRegistrationsCount}`,
      badgeColor: endingSoonCount > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'systems' as NavTabId,
      label: 'وضعیت سامانه‌ها',
      icon: Activity,
      badge: systemsAlertCount > 0 ? `${systemsAlertCount} خطا` : 'پایدار',
      badgeColor: systemsAlertCount > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'studio' as NavTabId,
      label: 'استودیو تصویر و ویدئو',
      icon: Palette,
      badge: 'بدون نیاز به هوش مصنوعی',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px]',
    },
    {
      id: 'content' as NavTabId,
      label: 'تولید محتوای متنی',
      icon: FileText,
      badge: 'هوشمند + آفلاین',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-[10px]',
    },
    {
      id: 'links' as NavTabId,
      label: 'بانک لینک سامانه‌ها',
      icon: Link2,
      badge: null,
    },
    {
      id: 'news' as NavTabId,
      label: 'اخبار و تعرفه صنف',
      icon: Newspaper,
      badge: 'نرخ‌نامه',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px]',
    },
    {
      id: 'bookmarks' as NavTabId,
      label: 'نشان‌شده‌ها و ذخیره‌ها',
      icon: Bookmark,
      badge: bookmarksCount > 0 ? `${bookmarksCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'workspace' as NavTabId,
      label: 'فضای کاربری و پروفایل AI',
      icon: UserRound,
      badge: 'حساب من',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]',
    },
    {
      id: 'settings' as NavTabId,
      label: 'تنظیمات و هوش مصنوعی',
      icon: Settings,
      badge: null,
    },
    {
      id: 'admin' as NavTabId,
      label: 'پنل مدیریت',
      icon: ShieldAlert,
      badge: 'مدیر',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px]',
    },
  ];

  const handleSelect = (tab: NavTabId) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-24 h-screen md:h-[calc(100vh-6rem)] z-40 w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } right-0`}
        dir="rtl"
      >
        <div>
          {/* Mobile Close Button */}
          <div className="flex md:hidden items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-white">منوی دسترسی سریع</span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="بستن منو"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="منوی اصلی سامانه">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer text-right group ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  style={isActive ? { backgroundColor: primaryColor } : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Guild & Support Info Box */}
        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              پشتیبانی صنف کافی‌نت
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              ویژه دفاتر پیشخوان و واحدهای صنفی کافی‌نت سراسر کشور.
            </p>
          </div>
          <div className="text-center text-[10px] text-slate-400">
            نسخه ۲.۵ پایدار • سال ۱۴۰۵
          </div>
        </div>
      </aside>
    </>
  );
};
