import { lazy, Suspense, useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { HalalLogo } from "./components/halal-logo";
import { GuestSignInPrompt } from "./components/guest-sign-in-prompt";

// Landing Page
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

type Portal = 'landing' | 'walkthrough' | 'tourist' | 'admin' | 'entrepreneur';
type TouristPage = 'home' | 'login' | 'register' | 'search' | 'map' | 'place-detail' | 'ai-planner' | 'favorites' | 'my-trips' | 'articles' | 'article-detail' | 'settings' | 'prayer';
type AdminPage = 'login' | 'dashboard' | 'users' | 'moderation' | 'reports' | 'api-keys' | 'audit-log' | 'prayer' | 'master-data' | 'places' | 'content';
type EntrepreneurPage = 'login' | 'register' | 'submit' | 'tracking' | 'listings' | 'support' | 'dashboard' | 'prayer' | 'profile';

const TouristHome = lazy(() => import("./pages/tourist-home").then((module) => ({ default: module.TouristHome })));
const TouristSearch = lazy(() => import("./pages/tourist-search").then((module) => ({ default: module.TouristSearch })));
const TouristMapExplorer = lazy(() => import("./pages/tourist-map-explorer").then((module) => ({ default: module.TouristMapExplorer })));
const TouristPlaceDetail = lazy(() => import("./pages/tourist-place-detail").then((module) => ({ default: module.TouristPlaceDetail })));
const TouristAITripPlanner = lazy(() => import("./pages/tourist-ai-planner").then((module) => ({ default: module.TouristAITripPlanner })));
const TouristFavorites = lazy(() => import("./pages/tourist-favorites").then((module) => ({ default: module.TouristFavorites })));
const TouristArticles = lazy(() => import("./pages/tourist-articles").then((module) => ({ default: module.TouristArticles })));
const TouristArticleDetail = lazy(() => import("./pages/tourist-article-detail").then((module) => ({ default: module.TouristArticleDetail })));
const TouristSettings = lazy(() => import("./pages/tourist-settings").then((module) => ({ default: module.TouristSettings })));
const TouristPrayer = lazy(() => import("./pages/tourist-prayer").then((module) => ({ default: module.TouristPrayer })));
const TouristMyTrips = lazy(() => import("./pages/tourist-my-trips").then((module) => ({ default: module.TouristMyTrips })));
const TouristLogin = lazy(() => import("./pages/tourist-login").then((module) => ({ default: module.TouristLogin })));
const TouristRegister = lazy(() => import("./pages/tourist-register").then((module) => ({ default: module.TouristRegister })));

const AdminLogin = lazy(() => import("./pages/admin-login").then((module) => ({ default: module.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/admin-dashboard").then((module) => ({ default: module.AdminDashboard })));
const AdminUsers = lazy(() => import("./pages/admin-users").then((module) => ({ default: module.AdminUsers })));
const AdminModeration = lazy(() => import("./pages/admin-moderation").then((module) => ({ default: module.AdminModeration })));
const AdminReports = lazy(() => import("./pages/admin-reports").then((module) => ({ default: module.AdminReports })));
const AdminAPIKeys = lazy(() => import("./pages/admin-api-keys").then((module) => ({ default: module.AdminAPIKeys })));
const AdminAuditLog = lazy(() => import("./pages/admin-audit-log").then((module) => ({ default: module.AdminAuditLog })));
const AdminPrayer = lazy(() => import("./pages/admin-prayer").then((module) => ({ default: module.AdminPrayer })));
const AdminMasterData = lazy(() => import("./pages/admin-master-data").then((module) => ({ default: module.AdminMasterData })));
const AdminPlaces = lazy(() => import("./pages/admin-places").then((module) => ({ default: module.AdminPlaces })));
const AdminContent = lazy(() => import("./pages/admin-content").then((module) => ({ default: module.AdminContent })));

const EntrepreneurLogin = lazy(() => import("./pages/entrepreneur-login").then((module) => ({ default: module.EntrepreneurLogin })));
const EntrepreneurRegister = lazy(() => import("./pages/entrepreneur-register").then((module) => ({ default: module.EntrepreneurRegister })));
const EntrepreneurSubmitPlace = lazy(() => import("./pages/entrepreneur-submit-place").then((module) => ({ default: module.EntrepreneurSubmitPlace })));
const EntrepreneurTracking = lazy(() => import("./pages/entrepreneur-tracking").then((module) => ({ default: module.EntrepreneurTracking })));
const EntrepreneurListings = lazy(() => import("./pages/entrepreneur-listings").then((module) => ({ default: module.EntrepreneurListings })));
const EntrepreneurSupport = lazy(() => import("./pages/entrepreneur-support").then((module) => ({ default: module.EntrepreneurSupport })));
const EntrepreneurPrayer = lazy(() => import("./pages/entrepreneur-prayer").then((module) => ({ default: module.EntrepreneurPrayer })));
const EntrepreneurDashboard = lazy(() => import("./pages/entrepreneur-dashboard").then((module) => ({ default: module.EntrepreneurDashboard })));
const EntrepreneurProfile = lazy(() => import("./pages/entrepreneur-profile").then((module) => ({ default: module.EntrepreneurProfile })));

function PageLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 text-sm text-slate-500">
      Loading...
    </div>
  );
}

function LazyPage({ children }: { children: JSX.Element }) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>;
}

function AppContent() {
  const [currentPortal, setCurrentPortal] = useState<Portal>('landing');
  const [touristPage, setTouristPage] = useState<TouristPage>('home');
  const [adminPage, setAdminPage] = useState<AdminPage>('login');
  const [entrepreneurPage, setEntrepreneurPage] = useState<EntrepreneurPage>('login');
  const [isTouristLoggedIn, setIsTouristLoggedIn] = useState(false);
  const [showTouristSignInPrompt, setShowTouristSignInPrompt] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isEntrepreneurLoggedIn, setIsEntrepreneurLoggedIn] = useState(false);
  const { t, dir } = useLanguage();

  // Navigation handlers
  const handleTouristNavigate = (page: string) => {
    setTouristPage(page as TouristPage);
  };

  const handleTouristLogin = () => {
    setIsTouristLoggedIn(true);
    setTouristPage('home');
  };

  const handleTouristLogout = () => {
    setIsTouristLoggedIn(false);
    setTouristPage('home');
  };

  const requireTouristSignIn = () => {
    setShowTouristSignInPrompt(true);
  };

  const goToTouristLogin = () => {
    setShowTouristSignInPrompt(false);
    setCurrentPortal('tourist');
    setTouristPage('login');
  };

  const goToTouristRegister = () => {
    setShowTouristSignInPrompt(false);
    setCurrentPortal('tourist');
    setTouristPage('register');
  };

  const handleAdminNavigate = (page: string) => {
    setAdminPage(page as AdminPage);
  };

  const handleEntrepreneurNavigate = (page: string) => {
    setEntrepreneurPage(page as EntrepreneurPage);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setAdminPage('dashboard'); // Redirect to Dashboard on login
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminPage('login');
    setCurrentPortal('landing');
  };

  const handleEntrepreneurLogin = () => {
    setIsEntrepreneurLoggedIn(true);
    setEntrepreneurPage('dashboard');
  };

  const handleEntrepreneurLogout = () => {
    setIsEntrepreneurLoggedIn(false);
    setEntrepreneurPage('login');
    setCurrentPortal('landing');
  };

  const walkthroughItems = [
    { step: 1, portal: 'Tourist', title: 'Landing — Neutral Branding & Data Source', desc: 'Review data governance statement, trust explanation, and source disclaimers. No halal certification claim.' },
    { step: 2, portal: 'Tourist', title: 'Search — Filters, Source & Status Badges', desc: 'Filter by province, certification source (CICOT, TAT, HALA), status badges, and amenities.', action: () => { setCurrentPortal('tourist'); setTouristPage('search'); } },
    { step: 3, portal: 'Tourist', title: 'Place Detail — Certification & Source Record', desc: 'View source record, certifying agency, expiry date, and transparency disclaimer per place.', action: () => { setCurrentPortal('tourist'); setTouristPage('place-detail'); } },
    { step: 4, portal: 'Tourist', title: 'Map Explorer — Layers, Pins & Legend', desc: 'Toggle map layers (restaurants, mosques, hotels), view pin legend, and apply source filters.', action: () => { setCurrentPortal('tourist'); setTouristPage('map'); } },
    { step: 5, portal: 'Tourist', title: 'AI Trip Planner — Route, Quota & Alternatives', desc: 'Generate multi-province itinerary with start point, reasons, alternatives, and AI quota disclosure.', action: () => { setCurrentPortal('tourist'); setTouristPage('ai-planner'); } },
    { step: 6, portal: 'Entrepreneur', title: 'Entrepreneur — Submit & Re-verify Certificate', desc: 'Upload certificate, track re-verification status, and receive automated expiry notification.', action: () => { setCurrentPortal('entrepreneur'); setEntrepreneurPage('login'); } },
    { step: 7, portal: 'Admin', title: 'Admin — Task Queue, Approval & Audit Log', desc: 'Auto-validation pipeline, approval workflow, source governance, Open API management, and audit trail.', action: () => { setCurrentPortal('admin'); setAdminPage('login'); } },
  ];

  // Landing Page
  if (currentPortal === 'landing') {
    const isRtl = dir === 'rtl';
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* MARKER-MAKE-KIT-INVOKED */}
        <Toaster />
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className={`flex items-center justify-between gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2 flex-shrink-0">
                <HalalLogo />
              </div>
              <div className={`flex gap-1 sm:gap-2 items-center flex-wrap justify-end ${isRtl ? 'flex-row-reverse' : ''}`}>
                <LanguageSwitcher />
                <Button variant="ghost" size="sm" onClick={() => setCurrentPortal('tourist')} className="text-xs sm:text-sm">
                  {t('portal.tourist')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setCurrentPortal('admin'); setAdminPage('login'); }} className="text-xs sm:text-sm">
                  {t('portal.admin')}
                </Button>
                <Button size="sm" onClick={() => { setCurrentPortal('entrepreneur'); setEntrepreneurPage('login'); }} className="text-xs sm:text-sm">
                  {t('portal.entrepreneur')}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 py-12 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          <Button size="lg" className="px-8" onClick={() => setCurrentPortal('tourist')}>
            {t('landing.start')}
          </Button>
        </section>

        {/* Portals */}
        <section className="container mx-auto px-4 py-10 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">{t('landing.choose')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Tourist Portal */}
            <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentPortal('tourist')}>
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-3">🧳</div>
                <h3 className="text-xl font-bold">{t('portal.tourist')}</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {t('landing.tourist.desc')}
                </p>
                <ul className="text-sm space-y-1.5 mb-5 text-start max-w-[180px] mx-auto">
                  <li>✓ {t('nav.search')}</li>
                  <li>✓ {t('nav.planner')}</li>
                  <li>✓ {t('nav.map')}</li>
                  <li>✓ {t('nav.articles')}</li>
                </ul>
                <Button className="w-full">{t('landing.enter')} {t('portal.tourist')}</Button>
              </CardContent>
            </Card>

            {/* Admin Portal */}
            <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => { setCurrentPortal('admin'); setAdminPage('login'); }}>
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-3">👨‍💼</div>
                <h3 className="text-xl font-bold">{t('portal.admin')}</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {t('landing.admin.desc')}
                </p>
                <ul className="text-sm space-y-1.5 mb-5 text-start max-w-[180px] mx-auto">
                  <li>✓ {t('nav.users')}</li>
                  <li>✓ {t('nav.moderation')}</li>
                  <li>✓ {t('nav.reports')}</li>
                  <li>✓ {t('nav.apiKeys')}</li>
                </ul>
                <Button variant="outline" className="w-full">{t('landing.login')}</Button>
              </CardContent>
            </Card>

            {/* Entrepreneur Portal */}
            <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => { setCurrentPortal('entrepreneur'); setEntrepreneurPage('login'); }}>
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-3">🏪</div>
                <h3 className="text-xl font-bold">{t('portal.entrepreneur')}</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {t('landing.entrepreneur.desc')}
                </p>
                <ul className="text-sm space-y-1.5 mb-5 text-start max-w-[180px] mx-auto">
                  <li>✓ {t('nav.submitPlace')}</li>
                  <li>✓ {t('nav.tracking')}</li>
                  <li>✓ {t('nav.myListings')}</li>
                  <li>✓ {t('nav.support')}</li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {t('landing.getStarted')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-emerald-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-1">2,500+</div>
                <div className="text-emerald-100 text-sm">Source-Verified Places</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-1">15,000+</div>
                <div className="text-emerald-100 text-sm">Happy Travelers</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-1">50+</div>
                <div className="text-emerald-100 text-sm">Cities Covered</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-1">234</div>
                <div className="text-emerald-100 text-sm">Business Partners</div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Source & Trust Explanation */}
        <section className="border-t bg-white py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-6">
              <Badge variant="outline" className="mb-3 text-xs font-medium text-slate-600 border-slate-300">
                Department of Tourism — Platform Review Information
              </Badge>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('landing.trust.title')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
                {t('landing.trust.body')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[
                { icon: '📊', title: 'Survey Evidence', body: '428 survey responses across stakeholder groups informing platform design and feature priorities.' },
                { icon: '🗺️', title: '8 Province Groups', body: 'Coverage across 8 regional province clusters, from Bangkok Metro to Deep South border provinces.' },
                { icon: '🏛️', title: 'Multi-Agency Data', body: 'Data sourced from TAT, CICOT, HALA Thailand, JAKIM, and verified operator submissions.' },
                { icon: '🤖', title: 'AI Transparency', body: 'AI trip planner discloses reasoning, quota limits per request, and confidence for each suggested route.' },
                { icon: '📋', title: 'Document Expiry Automation', body: 'Certification expiry tracked automatically; listings flagged 30 days before renewal and archived on expiry.' },
                { icon: '🔗', title: 'Information Support System', body: 'Platform acts as an information and service support layer. Certification authority remains with the relevant agency.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">{item.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prototype Walkthrough Entry */}
        <section className="border-t bg-slate-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium"
              onClick={() => setCurrentPortal('walkthrough')}
            >
              Prototype Walkthrough
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-6 bg-white">
          <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
            © 2026 {t('app.name')}. Information and Service Support Platform. Data sourced from TAT, CICOT, HALA Thailand, and partner agencies.
          </div>
        </footer>
      </div>
    );
  }

  if (currentPortal === 'walkthrough') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Toaster />
        <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPortal('landing')}>
                <HalalLogo />
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPortal('landing')}>
                ← Back to Home
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 text-xs font-medium text-slate-600 border-slate-300">
              Prototype Walkthrough
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Recommended Demo Path</h1>
            <p className="text-sm text-slate-500">
              Follow this path for a structured review of all platform capabilities
            </p>
          </div>

          <ol className="space-y-3">
            {walkthroughItems.map((item) => (
              <li key={item.step}
                className={`flex gap-3 items-start p-4 bg-white rounded-lg border border-slate-200 ${item.action ? 'cursor-pointer hover:border-emerald-300 hover:shadow-sm transition-all' : ''}`}
                onClick={item.action}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5">
                  {item.step}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <Badge variant="secondary" className="text-[10px] py-0">{item.portal}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                {item.action && <span className="flex-shrink-0 text-emerald-600 text-xs ml-auto mt-1">→</span>}
              </li>
            ))}
          </ol>
        </main>
      </div>
    );
  }

  // Tourist Portal
  if (currentPortal === 'tourist') {
    const pages: Record<TouristPage, JSX.Element> = {
      'home': <TouristHome onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} onRequireSignIn={requireTouristSignIn} />,
      'login': <TouristLogin onLogin={handleTouristLogin} onNavigate={handleTouristNavigate} />,
      'register': <TouristRegister onRegister={handleTouristLogin} onNavigate={handleTouristNavigate} />,
      'search': <TouristSearch onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} onRequireSignIn={requireTouristSignIn} />,
      'map': <TouristMapExplorer onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} />,
      'place-detail': <TouristPlaceDetail onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} onRequireSignIn={requireTouristSignIn} />,
      'ai-planner': <TouristAITripPlanner onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} onRequireSignIn={requireTouristSignIn} />,
      'favorites': <TouristFavorites onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} onRequireSignIn={requireTouristSignIn} />,
      'my-trips': <TouristMyTrips onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} onRequireSignIn={requireTouristSignIn} />,
      'articles': <TouristArticles onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} />,
      'article-detail': <TouristArticleDetail onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} />,
      'settings': <TouristSettings onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} />,
      'prayer': <TouristPrayer onNavigate={handleTouristNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={handleTouristLogout} />,
    };

    return (
      <>
        <Toaster />
        <div className="relative">
          <Button 
            variant="outline" 
            className="fixed bottom-4 left-4 z-50"
            onClick={() => setCurrentPortal('landing')}
          >
            ← {t('landing.back')}
          </Button>
          <LazyPage>{pages[touristPage]}</LazyPage>
          <GuestSignInPrompt
            open={showTouristSignInPrompt}
            onOpenChange={setShowTouristSignInPrompt}
            onSignIn={goToTouristLogin}
            onCreateAccount={goToTouristRegister}
          />
        </div>
      </>
    );
  }

  // Admin Portal
  if (currentPortal === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <>
          <Toaster />
          <div className="relative">
            <Button 
              variant="ghost" 
              className="absolute top-4 left-4 z-50 text-white"
              onClick={() => setCurrentPortal('landing')}
            >
              ← {t('landing.back')}
            </Button>
            <LazyPage>
              <AdminLogin onLogin={handleAdminLogin} />
            </LazyPage>
          </div>
        </>
      );
    }

    const pages: Record<AdminPage, JSX.Element> = {
      'login': <AdminLogin onLogin={handleAdminLogin} />,
      'dashboard': <AdminDashboard onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />, 
      'users': <AdminUsers onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
      'moderation': <AdminModeration onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
      'reports': <AdminReports onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
      'api-keys': <AdminAPIKeys onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
      'audit-log': <AdminAuditLog onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
      'prayer': <AdminPrayer onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
      'master-data': <AdminMasterData onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
      'places': <AdminPlaces onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
      'content': <AdminContent onNavigate={handleAdminNavigate} onLogout={handleAdminLogout} />,
    };

    return (
      <>
        <Toaster />
        <LazyPage>{pages[adminPage]}</LazyPage>
      </>
    );
  }

  // Entrepreneur Portal
  if (currentPortal === 'entrepreneur') {
    if (!isEntrepreneurLoggedIn) {
      // Determine which page to show when not logged in
      const content = entrepreneurPage === 'register' ? (
        <EntrepreneurRegister 
          onRegister={() => setEntrepreneurPage('login')} // After register, go to login
          onNavigateToLogin={() => setEntrepreneurPage('login')}
        />
      ) : (
        <EntrepreneurLogin 
          onLogin={handleEntrepreneurLogin} 
          onNavigateToRegister={() => setEntrepreneurPage('register')}
        />
      );

      return (
        <>
          <Toaster />
          <div className="relative">
            <Button 
              variant="ghost" 
              className="absolute top-4 left-4 z-50"
              onClick={() => setCurrentPortal('landing')}
            >
              ← {t('landing.back')}
            </Button>
            <LazyPage>{content}</LazyPage>
          </div>
        </>
      );
    }

    const pages: Record<EntrepreneurPage, JSX.Element> = {
      'login': <EntrepreneurLogin onLogin={handleEntrepreneurLogin} />, // Should not be reached but good for safety
      'register': <EntrepreneurRegister onRegister={() => setEntrepreneurPage('login')} />, // Should not be reached
      'dashboard': <EntrepreneurDashboard onNavigate={handleEntrepreneurNavigate} onLogout={handleEntrepreneurLogout} />,
      'submit': <EntrepreneurSubmitPlace onNavigate={handleEntrepreneurNavigate} onLogout={handleEntrepreneurLogout} />,
      'tracking': <EntrepreneurTracking onNavigate={handleEntrepreneurNavigate} onLogout={handleEntrepreneurLogout} />,
      'listings': <EntrepreneurListings onNavigate={handleEntrepreneurNavigate} onLogout={handleEntrepreneurLogout} />,
      'support': <EntrepreneurSupport onNavigate={handleEntrepreneurNavigate} onLogout={handleEntrepreneurLogout} />,
      'prayer': <EntrepreneurPrayer onNavigate={handleEntrepreneurNavigate} onLogout={handleEntrepreneurLogout} />,
      'profile': <EntrepreneurProfile onNavigate={handleEntrepreneurNavigate} onLogout={handleEntrepreneurLogout} />,
    };

    // If logged in but on login/register page, redirect to dashboard
    if (entrepreneurPage === 'login' || entrepreneurPage === 'register') {
      return (
        <>
          <Toaster />
          <LazyPage>{pages['dashboard']}</LazyPage>
        </>
      );
    }

    return (
      <>
        <Toaster />
        <LazyPage>{pages[entrepreneurPage]}</LazyPage>
      </>
    );
  }

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
