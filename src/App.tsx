/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTabId } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { RegistrationsView } from './views/RegistrationsView';
import { SystemStatusView } from './views/SystemStatusView';
import { StudioView } from './views/StudioView';
import { ContentGeneratorView } from './views/ContentGeneratorView';
import { LinkBankView } from './views/LinkBankView';
import { NewsView } from './views/NewsView';
import { BookmarksView } from './views/BookmarksView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';
import { WorkspaceView } from './views/WorkspaceView';

import {
  RegistrationOpportunity,
  GovernmentSystem,
  GuildNewsItem,
  SystemLinkBankItem,
  UserCafeSettings,
  ContentDraft,
} from './types';
import {
  INITIAL_REGISTRATIONS,
  INITIAL_SYSTEMS,
  INITIAL_NEWS,
  INITIAL_LINKS,
  INITIAL_USER_SETTINGS,
} from './data/initialData';
import { isWithinLast20Days, getDeadlineStatus, formatJalaliFull } from './utils/dateUtils';
import { X, ExternalLink, Calendar, Building, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Main Navigation state
  const [currentTab, setCurrentTab] = useState<NavTabId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Application Data States
  const [registrations, setRegistrations] = useState<RegistrationOpportunity[]>(() => {
    const saved = localStorage.getItem('coffeenet_registrations_v2');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [systems, setSystems] = useState<GovernmentSystem[]>(() => {
    const saved = localStorage.getItem('coffeenet_systems_v2');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEMS;
  });

  const [news, setNews] = useState<GuildNewsItem[]>(() => {
    const saved = localStorage.getItem('coffeenet_news_v2');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [links, setLinks] = useState<SystemLinkBankItem[]>(() => {
    const saved = localStorage.getItem('coffeenet_links_v2');
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  const [settings, setSettings] = useState<UserCafeSettings>(() => {
    const saved = localStorage.getItem('coffeenet_settings');
    return saved ? JSON.parse(saved) : INITIAL_USER_SETTINGS;
  });

  const [savedDrafts, setSavedDrafts] = useState<ContentDraft[]>(() => {
    const saved = localStorage.getItem('coffeenet_drafts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'draft-sample-1',
        title: 'اطلاعیه آزمون استخدامی آموزش و پرورش',
        content: '📢 اطلاعیه فوری: ثبت‌نام آزمون استخدامی ویژه آموزش و پرورش آغاز گردید.\nمهلت ثبت‌نام: تا پایان هفته جاری.\nثبت‌نام رسمی و تضمینی در کافی‌نت پلاس.',
        channel: 'telegram_notice',
        date: new Date().toISOString(),
      }
    ];
  });

  // Cross-view handover states
  const [studioPreset, setStudioPreset] = useState<{ title?: string; organization?: string; deadline?: string } | undefined>(undefined);
  const [contentPresetRegId, setContentPresetRegId] = useState<string | undefined>(undefined);
  const [activeNewsModal, setActiveNewsModal] = useState<GuildNewsItem | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('coffeenet_registrations_v2', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('coffeenet_systems_v2', JSON.stringify(systems));
  }, [systems]);

  useEffect(() => {
    localStorage.setItem('coffeenet_news_v2', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('coffeenet_links_v2', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('coffeenet_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('coffeenet_drafts', JSON.stringify(savedDrafts));
  }, [savedDrafts]);

  // Sync Dark/Light theme class to html element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Toggle Dark/Light Theme
  const handleToggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  // Update Settings
  const handleUpdateSettings = (updated: Partial<UserCafeSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  // Toggle Bookmark for Registrations
  const handleToggleBookmarkReg = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  // Toggle Favorite for Links
  const handleToggleFavoriteLink = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isFavorite: !l.isFavorite } : l))
    );
  };

  // Single System Health Probe (Calls server endpoint)
  const handleProbeSystem = async (sys: GovernmentSystem) => {
    try {
      const res = await fetch('/api/system-status/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: sys.url,
          id: sys.id,
          name: sys.name,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned error status');
      }

      const result = await res.json();
      setSystems((prev) =>
        prev.map((s) =>
          s.id === sys.id
            ? {
                ...s,
                status: result.status,
                latencyMs: result.latencyMs,
                statusCode: result.statusCode,
                lastChecked: result.lastChecked,
                message: result.message,
              }
            : s
        )
      );
    } catch {
      setSystems((prev) =>
        prev.map((s) =>
          s.id === sys.id
            ? {
                ...s,
                status: 'down',
                message: 'خطا در برقراری تماس با سرور پایش.',
                lastChecked: new Date().toISOString(),
              }
            : s
        )
      );
    }
  };

  // Batch Probe All Systems
  const handleProbeAllSystems = async () => {
    for (const sys of systems) {
      await handleProbeSystem(sys);
    }
  };

  // Quick Action Handlers from Dashboard/Registrations
  const handleQuickCreatePoster = (reg: RegistrationOpportunity) => {
    setStudioPreset({
      title: reg.title,
      organization: reg.organization,
      deadline: getDeadlineStatus(reg.deadlineAt).label,
    });
    setCurrentTab('studio');
  };

  const handleQuickGenerateContent = (reg: RegistrationOpportunity) => {
    setContentPresetRegId(reg.id);
    setCurrentTab('content');
  };

  // Add new registration
  const handleAddRegistration = (newReg: RegistrationOpportunity) => {
    setRegistrations((prev) => [newReg, ...prev]);
  };

  // Delete registration
  const handleDeleteRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  // Save Draft
  const handleSaveDraft = (draft: ContentDraft) => {
    setSavedDrafts((prev) => [draft, ...prev]);
  };

  const handleDeleteDraft = (id: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  // Derived counts for Sidebar Badges
  const validRegistrations = registrations.filter((r) => isWithinLast20Days(r.publishedAt) && r.isVerified);
  const activeRegistrationsCount = validRegistrations.length;
  const endingSoonCount = validRegistrations.filter(
    (r) => getDeadlineStatus(r.deadlineAt).status === 'ending_soon'
  ).length;
  const systemsAlertCount = systems.filter((s) => s.status === 'down' || s.status === 'degraded').length;
  const bookmarksCount =
    registrations.filter((r) => r.isBookmarked).length +
    links.filter((l) => l.isFavorite).length +
    savedDrafts.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header with strictly LTR ticker, status indicator & brand */}
      <Header
        news={news}
        settings={settings}
        systems={systems}
        onToggleTheme={handleToggleTheme}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenSettings={() => setCurrentTab('settings')}
        onSelectSystemStatus={() => setCurrentTab('systems')}
        onSelectNews={(item) => setActiveNewsModal(item)}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6" dir="rtl">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          activeRegistrationsCount={activeRegistrationsCount}
          endingSoonCount={endingSoonCount}
          systemsAlertCount={systemsAlertCount}
          bookmarksCount={bookmarksCount}
          primaryColor={settings.primaryColor}
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 w-full min-w-0 pb-12">
          {currentTab === 'dashboard' && (
            <DashboardView
              registrations={validRegistrations}
              systems={systems}
              news={news}
              settings={settings}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectRegistration={(reg) => handleQuickGenerateContent(reg)}
              onQuickCreatePoster={handleQuickCreatePoster}
              onQuickGenerateContent={handleQuickGenerateContent}
              onToggleBookmark={handleToggleBookmarkReg}
              onProbeSystem={handleProbeSystem}
            />
          )}

          {currentTab === 'registrations' && (
            <RegistrationsView
              registrations={registrations}
              onToggleBookmark={handleToggleBookmarkReg}
              onQuickCreatePoster={handleQuickCreatePoster}
              onQuickGenerateContent={handleQuickGenerateContent}
            />
          )}

          {currentTab === 'systems' && (
            <SystemStatusView
              systems={systems}
              onUpdateSystemStatus={(id, updated) =>
                setSystems((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)))
              }
              onProbeSystem={handleProbeSystem}
            />
          )}

          {currentTab === 'studio' && (
            <StudioView settings={settings} initialTemplateData={studioPreset} />
          )}

          {currentTab === 'content' && (
            <ContentGeneratorView
              settings={settings}
              registrations={validRegistrations}
              initialSelectedRegId={contentPresetRegId}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {currentTab === 'links' && (
            <LinkBankView links={links} onToggleFavorite={handleToggleFavoriteLink} />
          )}

          {currentTab === 'news' && <NewsView news={news} />}

          {currentTab === 'bookmarks' && (
            <BookmarksView
              bookmarkedRegistrations={registrations.filter((r) => r.isBookmarked)}
              bookmarkedLinks={links.filter((l) => l.isFavorite)}
              savedDrafts={savedDrafts}
              onToggleBookmarkReg={handleToggleBookmarkReg}
              onToggleFavoriteLink={handleToggleFavoriteLink}
              onDeleteDraft={handleDeleteDraft}
              onSelectRegistration={handleQuickGenerateContent}
            />
          )}

          {currentTab === 'workspace' && <WorkspaceView />}

          {currentTab === 'settings' && (
            <SettingsView settings={settings} onUpdateSettings={handleUpdateSettings} />
          )}

          {currentTab === 'admin' && (
            <AdminView
              registrations={registrations}
              systems={systems}
              onAddRegistration={handleAddRegistration}
              onDeleteRegistration={handleDeleteRegistration}
              onProbeAllSystems={handleProbeAllSystems}
            />
          )}
        </main>
      </div>

      {/* News Details Modal when clicking any ticker item */}
      {activeNewsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          dir="rtl"
          onClick={() => setActiveNewsModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {activeNewsModal.isUrgent && (
                  <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold px-2 py-0.5 rounded-full">
                    فوری
                  </span>
                )}
                <span className="text-xs font-bold text-slate-500">
                  {activeNewsModal.sourceName}
                </span>
              </div>
              <button
                onClick={() => setActiveNewsModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-black text-base md:text-lg text-slate-900 dark:text-white">
              {activeNewsModal.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeNewsModal.summary}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatJalaliFull(activeNewsModal.publishedAt)}</span>
              </div>

              <button
                onClick={() => {
                  setActiveNewsModal(null);
                  setCurrentTab('news');
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                مشاهده در بخش اخبار و بخشنامه‌ها
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
