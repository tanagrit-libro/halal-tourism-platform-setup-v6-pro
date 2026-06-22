import { Button } from "./ui/button";
import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LANG_LABELS: { code: 'en' | 'th' | 'ms' | 'ar'; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'th', flag: '🇹🇭', label: 'ภาษาไทย' },
  { code: 'ms', flag: '🇲🇾', label: 'Bahasa Melayu' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const current = LANG_LABELS.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2 hover:bg-accent hover:text-accent-foreground text-current">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium hidden sm:inline">{current?.flag} {current?.label}</span>
          <span className="text-xs font-medium sm:hidden">{current?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANG_LABELS.map(({ code, flag, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className={`gap-2 ${language === code ? 'bg-accent font-medium' : ''}`}
          >
            <span>{flag}</span>
            <span>{label}</span>
            {language === code && <span className="ml-auto text-primary text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
