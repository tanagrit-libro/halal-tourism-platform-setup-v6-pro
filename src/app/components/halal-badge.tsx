import { Badge } from "./ui/badge";
import { CheckCircle2, ShieldCheck, Clock, AlertTriangle, FileQuestion } from "lucide-react";

export type TrustStatus =
  | 'certified'
  | 'source-verified'
  | 'pending'
  | 'expired'
  | 'owner-submitted';

interface TrustBadgeProps {
  status: TrustStatus;
  agency?: string;
  source?: string;
  expiryDate?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CONFIG: Record<TrustStatus, {
  label: string;
  icon: React.ElementType;
  style: string;
}> = {
  certified: {
    label: 'Certified by Agency',
    icon: ShieldCheck,
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  'source-verified': {
    label: 'Source-Verified Record',
    icon: CheckCircle2,
    style: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  pending: {
    label: 'Pending Review',
    icon: Clock,
    style: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  expired: {
    label: 'Certificate Expired',
    icon: AlertTriangle,
    style: 'bg-red-50 text-red-700 border-red-200',
  },
  'owner-submitted': {
    label: 'Owner Submitted',
    icon: FileQuestion,
    style: 'bg-gray-50 text-gray-600 border-gray-200',
  },
};

export function TrustBadge({ status, agency, source, expiryDate, size = 'md', className = '' }: TrustBadgeProps) {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';

  let label = cfg.label;
  if (status === 'certified' && agency) label = `Certified by ${agency}`;
  if (status === 'source-verified' && source) label = `Data from ${source}`;
  if (status === 'expired' && expiryDate) label = `Expired ${expiryDate}`;

  return (
    <Badge
      variant="outline"
      className={`${cfg.style} flex items-center gap-1 w-fit ${sizeClasses[size]} ${className}`}
    >
      <Icon className={iconSize} />
      {label}
    </Badge>
  );
}

/** Legacy alias kept for backward compatibility — renders as source-verified */
export function HalalBadge({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return <TrustBadge status="source-verified" size={size} className={className} />;
}
