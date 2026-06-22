import React from "react";
import { EntrepreneurLayout } from "../components/entrepreneur-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Clock, CheckCircle, XCircle, AlertCircle, Eye, RefreshCw,
  Calendar, FileBadge, AlertTriangle, Info, FileText, Bell,
  ChevronDown, ChevronUp, Upload,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PrototypePlaceRecord, usePrototypePlaces } from "../data/prototype-place-workflow";

interface EntrepreneurTrackingProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type SubmissionStatus = 'Approved' | 'Under Review' | 'Rejected' | 'Returned for Correction';

interface TimelineEvent {
  date: string;
  event: string;
  type: 'submit' | 'review' | 'action' | 'cert' | 'expiry' | 'alert';
}

interface Submission {
  id: string;
  name: string;
  category: string;
  submittedDate: string;
  status: SubmissionStatus;
  reviewDate: string | null;
  image: string;
  feedback: string;
  certAgency: string;
  certNumber: string;
  certIssueDate: string;
  certExpiryDate: string;
  daysUntilExpiry: number | null;
  reVerificationRequired: boolean;
  reVerificationDue: string | null;
  timeline: TimelineEvent[];
  expanded: boolean;
}

const SUBMISSIONS: Submission[] = [
  {
    id: '1',
    name: 'Grand Halal Restaurant',
    category: 'Restaurant',
    submittedDate: '2026-01-15',
    status: 'Approved',
    reviewDate: '2026-01-18',
    image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?w=400',
    feedback: 'Approved. Your listing is now live on the platform.',
    certAgency: 'CICOT',
    certNumber: 'CICOT-2024-1187',
    certIssueDate: '2024-01-15',
    certExpiryDate: '2026-01-14',
    daysUntilExpiry: -153,
    reVerificationRequired: true,
    reVerificationDue: '2025-12-15',
    timeline: [
      { date: '2026-01-15', event: 'Submission received', type: 'submit' },
      { date: '2026-01-16', event: 'Auto-validation passed (score 91/100)', type: 'review' },
      { date: '2026-01-18', event: 'Reviewed by Admin Farhan', type: 'review' },
      { date: '2026-01-18', event: 'Approved & Published', type: 'action' },
      { date: '2025-12-15', event: 'Re-verification reminder sent (30 days before expiry)', type: 'alert' },
      { date: '2026-01-14', event: 'Certificate expired — listing flagged', type: 'expiry' },
    ],
    expanded: false,
  },
  {
    id: '2',
    name: 'Islamic Boutique Hotel',
    category: 'Hotel',
    submittedDate: '2026-06-01',
    status: 'Under Review',
    reviewDate: null,
    image: 'https://images.unsplash.com/photo-1766856925165-94997a2104b4?w=400',
    feedback: 'Your submission is currently being reviewed by our team.',
    certAgency: 'HALA Thailand',
    certNumber: 'HALA-2025-0892',
    certIssueDate: '2025-06-01',
    certExpiryDate: '2027-05-31',
    daysUntilExpiry: 349,
    reVerificationRequired: false,
    reVerificationDue: null,
    timeline: [
      { date: '2026-06-01', event: 'Submission received', type: 'submit' },
      { date: '2026-06-01', event: 'Auto-validation in progress (score 78/100)', type: 'review' },
      { date: '2026-06-02', event: 'Document request: high-res certificate scan needed', type: 'alert' },
    ],
    expanded: false,
  },
  {
    id: '3',
    name: 'Halal Street Food Stall',
    category: 'Restaurant',
    submittedDate: '2026-05-28',
    status: 'Returned for Correction',
    reviewDate: '2026-06-02',
    image: 'https://images.unsplash.com/photo-1607411144164-97857cf86e1a?w=400',
    feedback: 'Please upload a valid halal certificate from CICOT or HALA Thailand, and provide a complete business address.',
    certAgency: '—',
    certNumber: '—',
    certIssueDate: '—',
    certExpiryDate: '—',
    daysUntilExpiry: null,
    reVerificationRequired: false,
    reVerificationDue: null,
    timeline: [
      { date: '2026-05-28', event: 'Submission received', type: 'submit' },
      { date: '2026-05-29', event: 'Auto-validation failed (score 42/100) — missing certificate', type: 'alert' },
      { date: '2026-06-02', event: 'Returned for edit by Admin Priya', type: 'action' },
      { date: '2026-06-02', event: 'Admin note: upload CICOT or HALA certificate', type: 'review' },
    ],
    expanded: false,
  },
  {
    id: '4',
    name: 'Prayer Facility Downtown',
    category: 'Prayer Facility',
    submittedDate: '2026-05-20',
    status: 'Rejected',
    reviewDate: '2026-05-25',
    image: 'https://images.unsplash.com/photo-1768152860286-15fa04f4b1a1?w=400',
    feedback: 'Rejected: duplicate submission with conflicting location data. You may resubmit with full documentation after resolving the address conflict.',
    certAgency: '—',
    certNumber: '—',
    certIssueDate: '—',
    certExpiryDate: '—',
    daysUntilExpiry: null,
    reVerificationRequired: false,
    reVerificationDue: null,
    timeline: [
      { date: '2026-05-20', event: 'Submission received', type: 'submit' },
      { date: '2026-05-21', event: 'Auto-validation flagged: duplicate submission detected', type: 'alert' },
      { date: '2026-05-25', event: 'Rejected by Admin Farhan — duplicate & conflicting data', type: 'action' },
      { date: '2026-05-25', event: 'Listing auto-hidden from public view', type: 'expiry' },
    ],
    expanded: false,
  },
];

function daysUntil(date?: string) {
  if (!date) return null;
  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  const ms = target.getTime() - today.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function toSubmissionStatus(status: PrototypePlaceRecord["status"]): SubmissionStatus {
  if (status === "Approved" || status === "Expiring Soon") return "Approved";
  if (status === "Returned for Correction") return "Returned for Correction";
  if (status === "Rejected" || status === "Hidden" || status === "Expired") return "Rejected";
  return "Under Review";
}

function toSubmission(place: PrototypePlaceRecord): Submission {
  const status = toSubmissionStatus(place.status);
  const expiryDays = daysUntil(place.certExpiry);
  const feedback =
    place.adminComment ||
    (status === "Approved"
      ? "Approved. Your listing is now live on the platform."
      : status === "Returned for Correction"
      ? "Admin returned this submission for correction. Please revise and resubmit."
      : status === "Rejected"
      ? "This submission is hidden from public view. You may submit again with corrected information."
      : "Your submission is currently being reviewed by our team.");

  return {
    id: place.id,
    name: place.name,
    category: place.type,
    submittedDate: place.submittedDate,
    status,
    reviewDate: status === "Under Review" ? null : place.submittedDate,
    image: place.image,
    feedback,
    certAgency: place.certAgency || "—",
    certNumber: place.certNumber || "—",
    certIssueDate: "Recorded in submission",
    certExpiryDate: place.certExpiry || "—",
    daysUntilExpiry: expiryDays,
    reVerificationRequired: place.status === "Expired" || (expiryDays !== null && expiryDays < 0),
    reVerificationDue: place.certExpiry || null,
    timeline: [
      { date: place.submittedDate, event: "Submission received", type: "submit" },
      { date: place.submittedDate, event: "Auto-validation completed", type: "review" },
      {
        date: place.submittedDate,
        event:
          status === "Approved"
            ? "Approved & Published"
            : status === "Returned for Correction"
            ? "Returned for correction by admin"
            : status === "Rejected"
            ? "Hidden from public view"
            : "Pending admin review",
        type: status === "Under Review" ? "review" : "action",
      },
    ],
    expanded: false,
  };
}

const TIMELINE_ICONS: Record<TimelineEvent['type'], { icon: React.ElementType; color: string }> = {
  submit:  { icon: FileText,      color: 'text-blue-500 bg-blue-50 border-blue-200' },
  review:  { icon: Eye,           color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
  action:  { icon: CheckCircle,   color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  cert:    { icon: FileBadge,     color: 'text-teal-500 bg-teal-50 border-teal-200' },
  expiry:  { icon: AlertTriangle, color: 'text-red-500 bg-red-50 border-red-200' },
  alert:   { icon: Bell,          color: 'text-amber-500 bg-amber-50 border-amber-200' },
};

function ExpiryTimeline({ submission }: { submission: Submission }) {
  if (submission.certExpiryDate === '—') return null;
  const expired = (submission.daysUntilExpiry ?? 0) < 0;
  const expiringSoon = (submission.daysUntilExpiry ?? 999) <= 30 && !expired;

  return (
    <div className={`rounded-lg border p-3 text-xs space-y-2 ${
      expired ? 'bg-red-50 border-red-200' :
      expiringSoon ? 'bg-amber-50 border-amber-200' :
      'bg-emerald-50 border-emerald-200'
    }`}>
      <div className="flex items-center gap-1.5 font-semibold">
        <FileBadge className={`size-3.5 ${expired ? 'text-red-600' : expiringSoon ? 'text-amber-600' : 'text-emerald-600'}`} />
        <span className={expired ? 'text-red-700' : expiringSoon ? 'text-amber-700' : 'text-emerald-700'}>
          Certificate Status
        </span>
        {expired && <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0">Expired</Badge>}
        {expiringSoon && <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0">Expiring Soon</Badge>}
        {!expired && !expiringSoon && <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0">Valid</Badge>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><p className="text-muted-foreground">Agency</p><p className="font-medium">{submission.certAgency}</p></div>
        <div><p className="text-muted-foreground">Number</p><p className="font-medium font-mono">{submission.certNumber}</p></div>
        <div><p className="text-muted-foreground">Issued</p><p className="font-medium">{submission.certIssueDate}</p></div>
        <div>
          <p className="text-muted-foreground">Expires</p>
          <p className={`font-medium ${expired ? 'text-red-700' : expiringSoon ? 'text-amber-700' : ''}`}>
            {submission.certExpiryDate}
            {expired && ' (expired)'}
            {expiringSoon && ` (${submission.daysUntilExpiry} days)`}
          </p>
        </div>
      </div>
      {submission.reVerificationRequired && (
        <div className="flex items-start gap-2 pt-1 border-t border-red-200">
          <RefreshCw className="size-3.5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">Re-verification required</p>
            <p className="text-red-600">Due: {submission.reVerificationDue} — upload a new certificate to restore listing visibility.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SubmissionTimeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
        <Clock className="size-3.5" /> Event Timeline
      </p>
      <div className="relative pl-5">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
        {sorted.map((ev, i) => {
          const cfg = TIMELINE_ICONS[ev.type];
          const Icon = cfg.icon;
          return (
            <div key={i} className="relative mb-3 last:mb-0">
              <div className={`absolute -left-3 top-0.5 size-4 rounded-full border flex items-center justify-center ${cfg.color}`}>
                <Icon className="size-2.5" />
              </div>
              <div className="pl-2">
                <p className="text-[10px] text-muted-foreground">{ev.date}</p>
                <p className="text-xs text-slate-700">{ev.event}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EntrepreneurTracking({ onNavigate, onLogout }: EntrepreneurTrackingProps) {
  const { places } = usePrototypePlaces();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const submissions = useMemo(
    () => places.map((place) => ({ ...toSubmission(place), expanded: expandedIds.includes(place.id) })),
    [places, expandedIds]
  );

  const toggle = (id: string) =>
    setExpandedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const stats = {
    total: submissions.length,
    approved: submissions.filter((s) => s.status === 'Approved').length,
    pending: submissions.filter((s) => s.status === 'Under Review').length,
    needsAction: submissions.filter((s) => ['Returned for Correction', 'Rejected'].includes(s.status)).length,
    expiring: submissions.filter((s) => s.reVerificationRequired).length,
  };

  const STATUS_CFG: Record<SubmissionStatus, { label: string; bg: string; icon: React.ElementType }> = {
    'Approved':          { label: 'Approved',          bg: 'bg-emerald-500', icon: CheckCircle },
    'Under Review':      { label: 'Under Review',      bg: 'bg-amber-500',   icon: Clock },
    'Returned for Correction': { label: 'Returned for Correction', bg: 'bg-orange-500',  icon: AlertCircle },
    'Rejected':          { label: 'Rejected',          bg: 'bg-red-500',     icon: XCircle },
  };

  return (
    <EntrepreneurLayout activePage="tracking" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Submission Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor approval status, certificate expiry, and re-verification schedule for all your submissions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: stats.total, color: '' },
            { label: 'Approved', value: stats.approved, color: 'text-emerald-600' },
            { label: 'Under Review', value: stats.pending, color: 'text-amber-600' },
            { label: 'Needs Action', value: stats.needsAction, color: 'text-orange-600' },
            { label: 'Cert Expiring', value: stats.expiring, color: 'text-red-600' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3 text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Expiry alert banner */}
        {stats.expiring > 0 && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertTriangle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-800">
              <strong>Re-verification required:</strong> {stats.expiring} listing(s) have expired certificates.
              Upload a renewed certificate to restore public visibility. The platform does not issue certificates —
              contact your certifying agency (CICOT / HALA Thailand) for renewal.
            </div>
          </div>
        )}

        {/* Submissions */}
        <div className="space-y-4">
          {submissions.map((sub) => {
            const cfg = STATUS_CFG[sub.status];
            const Icon = cfg.icon;
            return (
              <Card key={sub.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Card header */}
                  <div className="flex gap-3 p-4">
                    <ImageWithFallback
                      src={sub.image} alt={sub.name}
                      className="w-20 h-16 sm:w-28 sm:h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base leading-tight truncate">{sub.name}</h3>
                          <div className="flex items-center flex-wrap gap-1.5 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{sub.category}</Badge>
                            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${cfg.bg}`}>
                              <Icon className="size-2.5" /> {cfg.label}
                            </span>
                            {sub.reVerificationRequired && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white">
                                <RefreshCw className="size-2.5" /> Re-verify
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Submitted {sub.submittedDate}
                            {sub.reviewDate && ` · Reviewed ${sub.reviewDate}`}
                          </p>
                        </div>
                        <button onClick={() => toggle(sub.id)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                          {sub.expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  {sub.feedback && (
                    <div className="mx-4 mb-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700">
                      <span className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">Admin feedback: </span>
                      {sub.feedback}
                    </div>
                  )}

                  {/* Expanded: cert timeline + event log */}
                  {sub.expanded && (
                    <div className="border-t bg-slate-50 p-4 space-y-4">
                      <ExpiryTimeline submission={sub} />
                      <Separator />
                      <SubmissionTimeline events={sub.timeline} />
                    </div>
                  )}

                  {/* Action bar */}
                  <div className="border-t bg-white px-4 py-2.5 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toggle(sub.id)}>
                      <Eye className="size-3 mr-1.5" />
                      {sub.expanded ? 'Hide Timeline' : 'View Timeline'}
                    </Button>
                    {sub.status === 'Returned for Correction' && (
                      <Button size="sm" className="h-7 text-xs" onClick={() => onNavigate?.('submit')}>
                        <RefreshCw className="size-3 mr-1.5" /> Revise & Resubmit
                      </Button>
                    )}
                    {sub.status === 'Rejected' && (
                      <Button size="sm" className="h-7 text-xs" onClick={() => onNavigate?.('submit')}>
                        <Upload className="size-3 mr-1.5" /> Submit Again
                      </Button>
                    )}
                    {sub.status === 'Approved' && !sub.reVerificationRequired && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onNavigate?.('listings')}>
                        Manage Listing
                      </Button>
                    )}
                    {sub.reVerificationRequired && (
                      <Button size="sm" className="h-7 text-xs bg-red-600 hover:bg-red-700" onClick={() => toast.info('Upload new certificate to re-verify')}>
                        <Upload className="size-3 mr-1.5" /> Upload Renewed Certificate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* SLA info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-2">
              <Info className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 space-y-1">
                <p className="font-semibold">Review timeline & certificate policy</p>
                <p>• Initial review: 1–2 business days · Full verification: 3–5 business days</p>
                <p>• Certificate expiry reminders sent 30 days before expiry date</p>
                <p>• Listings with expired certificates are automatically flagged and hidden after grace period</p>
                <p>• Certification decisions remain with CICOT / HALA Thailand / JAKIM — this platform records status only</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EntrepreneurLayout>
  );
}
