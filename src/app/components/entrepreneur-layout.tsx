import { ReactNode } from "react";
import { Button } from "./ui/button";
import { 
  Home, 
  Building2, 
  PlusCircle, 
  ClipboardList, 
  Edit3, 
  MessageCircle,
  LogOut,
  Menu,
  Compass
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import { HalalLogo } from "./halal-logo";

interface EntrepreneurLayoutProps {
  children: ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function EntrepreneurLayout({ 
  children, 
  activePage = 'dashboard', 
  onNavigate,
  onLogout 
}: EntrepreneurLayoutProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'profile', label: t('nav.profile'), icon: Building2 },
    { id: 'submit', label: t('nav.submitPlace'), icon: PlusCircle },
    { id: 'tracking', label: t('nav.tracking'), icon: ClipboardList },
    { id: 'listings', label: t('nav.myListings'), icon: Edit3 },
    { id: 'support', label: t('nav.support'), icon: MessageCircle },
    { id: 'prayer', label: t('nav.prayer'), icon: Compass },
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
            <Icon className="size-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-emerald-600 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HalalLogo className="text-white" textClassName="text-white text-xl" />
              <div className="hidden md:block text-sm opacity-80 border-l pl-2 ml-2 border-emerald-400">
                {t('portal.entrepreneur')}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <LanguageSwitcher />

              <span className="text-sm hidden md:inline opacity-90">Business Owner</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-emerald-700 hover:text-white"
                onClick={onLogout}
              >
                <LogOut className="size-4 mr-2" />
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 border-r min-h-[calc(100vh-73px)] p-4 bg-emerald-50">
          <nav className="flex flex-col gap-2">
            <NavLinks />
          </nav>
        </aside>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden fixed bottom-4 right-4 z-50">
            <Button size="icon" className="rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
               <SheetTitle>{t('portal.entrepreneur')}</SheetTitle>
               <SheetDescription className="sr-only">Mobile Menu</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-8">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
