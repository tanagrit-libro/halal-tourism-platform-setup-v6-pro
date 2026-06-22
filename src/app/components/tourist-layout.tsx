import { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Home,
  Search,
  Map,
  Heart,
  BookOpen,
  Sparkles,
  Settings,
  Menu,
  Compass,
  Route,
  UserCircle,
  LogOut,
  Gauge,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import { HalalLogo } from "./halal-logo";
import { TouristAuthProps } from "../types/tourist-auth";

interface TouristLayoutProps extends TouristAuthProps {
  children: ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export function TouristLayout({
  children,
  activePage = 'home',
  onNavigate,
  isTouristLoggedIn = false,
  onTouristLogout,
}: TouristLayoutProps) {
  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'articles', label: t('nav.articles'), icon: BookOpen },
    { id: 'search', label: t('nav.search'), icon: Search },
    { id: 'map', label: t('nav.map'), icon: Map },
    { id: 'ai-planner', label: t('nav.planner'), icon: Sparkles },
    { id: 'my-trips', label: t('nav.myTrips'), icon: Route },
    { id: 'favorites', label: t('nav.favorites'), icon: Heart },
    { id: 'prayer', label: t('nav.prayer'), icon: Compass },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={activePage === item.id ? "default" : "ghost"}
            className="justify-start w-full"
            onClick={() => onNavigate?.(item.id)}
          >
            <Icon className="size-4 me-2" />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={() => onNavigate?.('home')} style={{cursor: 'pointer'}}>
              <HalalLogo />
            </div>
            
            {/* Desktop Navigation */}
            <div className="flex items-center gap-2">
              <nav className="hidden xl:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activePage === item.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onNavigate?.(item.id)}
                    >
                      <Icon className="size-4 me-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
              
              <div className="w-px h-6 bg-border mx-2 hidden xl:block"></div>
              <LanguageSwitcher />
              {isTouristLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                        TG
                      </span>
                      <span className="hidden sm:inline">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="text-sm font-semibold">Tourist Guest</div>
                      <div className="text-xs font-normal text-muted-foreground">AI Planner quota: 4/5 remaining today</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
                      <UserCircle className="size-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate?.('my-trips')}>
                      <Route className="size-4 mr-2" />
                      My Trips
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate?.('favorites')}>
                      <Heart className="size-4 mr-2" />
                      Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate?.('ai-planner')}>
                      <Gauge className="size-4 mr-2" />
                      AI Planner quota
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
                      <Settings className="size-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onTouristLogout}>
                      <LogOut className="size-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={() => onNavigate?.('login')}>
                  <UserCircle className="size-4 mr-2" />
                  Sign in
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="xl:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRtl ? 'left' : 'right'}>
                  <SheetHeader>
                    <SheetTitle>{t('app.name')}</SheetTitle>
                    <SheetDescription className="sr-only">
                      Mobile navigation menu
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-8">
                    <NavLinks />
                    {!isTouristLoggedIn && (
                      <Button variant="outline" className="justify-start w-full" onClick={() => onNavigate?.('login')}>
                        <UserCircle className="size-4 me-2" />
                        Sign in
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
                <HalalLogo className="opacity-70 grayscale" />
             </div>
             <div className="text-center md:text-right text-sm text-muted-foreground">
               <p>© 2026 {t('app.name')}. All rights reserved.</p>
               <p>{t('app.tagline')}</p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
