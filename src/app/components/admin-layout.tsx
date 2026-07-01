import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Database,
  BarChart3,
  Key,
  FileSearch,
  LogOut,
  Menu,
  Compass,
  MapPin,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  LockKeyhole,
  MessageCircle
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import { HalalLogo } from "./halal-logo";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type AdminRole = 'Super Admin' | 'Approver' | 'Data Reviewer';
export const ADMIN_ROLE_STORAGE_KEY = 'gosafar-admin-demo-role';

const ROLE_CONFIG: Record<AdminRole, { color: string; badge: string }> = {
  'Super Admin':             { color: 'bg-purple-600',  badge: 'bg-purple-100 text-purple-800 border-purple-300' },
  'Approver':                { color: 'bg-blue-600',    badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  'Data Reviewer':           { color: 'bg-amber-600',   badge: 'bg-amber-100 text-amber-800 border-amber-300' },
};

export const ROLE_PERMISSIONS: Record<AdminRole, Record<string, boolean>> = {
  'Super Admin':             { reviewData: true,  approveReject: true,  publishUnpublish: true,  manageContent: true,  manageApiKeys: true,  manageUsers: true,  exportData: true  },
  'Approver':                { reviewData: true,  approveReject: true,  publishUnpublish: true,  manageContent: true,  manageApiKeys: false, manageUsers: false, exportData: true  },
  'Data Reviewer':           { reviewData: true,  approveReject: false, publishUnpublish: false, manageContent: false, manageApiKeys: false, manageUsers: false, exportData: false },
};

export const ADMIN_ROLES = Object.keys(ROLE_CONFIG) as AdminRole[];

export function isAdminRole(value: string | null): value is AdminRole {
  return !!value && ADMIN_ROLES.includes(value as AdminRole);
}

export function getStoredAdminRole(fallback: AdminRole = 'Super Admin'): AdminRole {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);
  return isAdminRole(stored) ? stored : fallback;
}

interface AdminLayoutProps {
  children: ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  currentRole?: AdminRole;
  onRoleChange?: (role: AdminRole) => void;
}

export function AdminLayout({
  children,
  activePage = 'dashboard',
  onNavigate,
  onLogout,
  currentRole = 'Super Admin',
  onRoleChange,
}: AdminLayoutProps) {
  const { t } = useLanguage();
  const [role, setRole] = useState<AdminRole>(() => getStoredAdminRole(currentRole));
  const perms = ROLE_PERMISSIONS[role];

  const handleRoleChange = (r: AdminRole) => {
    setRole(r);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, r);
      window.dispatchEvent(new CustomEvent<AdminRole>('admin-role-change', { detail: r }));
    }
    onRoleChange?.(r);
  };

  const navItems = [
    { id: 'dashboard',   label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'places',      label: 'Place Management', icon: MapPin },
    { id: 'content',     label: 'Content Management', icon: BookOpen,  hidden: !perms.manageContent },
    { id: 'moderation',  label: 'Content Moderation', icon: FileText },
    { id: 'support',     label: 'Support Center', icon: MessageCircle },
    { id: 'users',       label: t('nav.users'),     icon: Users,     hidden: !perms.manageUsers },
    { id: 'master-data', label: t('nav.masterData'),icon: Database,  hidden: role !== 'Super Admin' },
    { id: 'reports',     label: t('nav.reports'),   icon: BarChart3 },
    { id: 'api-keys',    label: t('nav.apiKeys'),   icon: Key,       hidden: !perms.manageApiKeys },
    { id: 'security-pdpa', label: 'Security & PDPA', icon: LockKeyhole, hidden: true },
    { id: 'audit-log',   label: t('nav.audit'),     icon: FileSearch, hidden: role !== 'Super Admin' },
    { id: 'prayer',      label: t('nav.prayer'),    icon: Compass },
  ].filter(i => !i.hidden);

  const roleBadgeCfg = ROLE_CONFIG[role];

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
      <header className="border-b bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HalalLogo className="text-white" textClassName="text-white text-xl" />
              <div className="hidden md:block text-sm opacity-70 border-l pl-2 ml-1 border-slate-600">
                {t('portal.admin')}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              {/* Role Indicator + Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${roleBadgeCfg.badge} cursor-pointer`}>
                    <ShieldCheck className="size-3" />
                    {role}
                    <ChevronDown className="size-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Switch demo role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {ADMIN_ROLES.map(r => (
                    <DropdownMenuItem key={r} onClick={() => handleRoleChange(r)} className={role === r ? 'font-semibold' : ''}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${ROLE_CONFIG[r].color}`} />
                      {r}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground space-y-0.5">
                    {Object.entries({
                      'Review data': perms.reviewData,
                      'Approve/reject': perms.approveReject,
                      'Publish/unpublish places': perms.publishUnpublish,
                      'Manage content': perms.manageContent,
                      'Manage API keys': perms.manageApiKeys,
                      'Manage users': perms.manageUsers,
                      'Export data': perms.exportData,
                    }).map(([perm, allowed]) => (
                      <div key={perm} className={`flex items-center gap-1.5 ${allowed ? 'text-emerald-700' : 'text-slate-400 line-through'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${allowed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        {perm}
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <span className="text-sm hidden md:inline opacity-70">admin@gosafar.th</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-800 hover:text-white"
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
        <aside className="hidden md:block w-56 border-r min-h-[calc(100vh-61px)] p-3 bg-slate-50">
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
        </aside>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden fixed bottom-4 right-4 z-50">
            <Button size="icon" className="rounded-full shadow-lg bg-slate-900 hover:bg-slate-800 text-white">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>{t('portal.admin')}</SheetTitle>
              <SheetDescription className="sr-only">Admin Menu</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-8">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
