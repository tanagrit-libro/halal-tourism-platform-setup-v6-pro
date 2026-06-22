import { AdminLayout } from "../components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Check, X, AlertCircle, Clock, FileEdit, Eye, FileSearch,
  EyeOff, Trash2, Send, AlertTriangle, RefreshCw, FileBadge,
  Shield, Info, ChevronDown, ChevronUp,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { TrustBadge, TrustStatus } from "../components/halal-badge";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  PrototypePlaceRecord,
  PrototypePlaceStatus,
  statusToTrustStatus,
  usePrototypePlaces,
} from "../data/prototype-place-workflow";

interface AdminModerationProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

interface PlaceItem {
  id: string;
  name: string;
  category: string;
  submittedBy: string;
  submittedDate: string;
  location: string;
  image: string;
  status: string;
  trustStatus: TrustStatus;
  certAgency: string;
  certNumber: string;
  certExpiry: string;
  autoValidationScore: number;
  autoValidationFlags: string[];
  isPublished: boolean;
  isAutoHidden: boolean;
  documentsMissing: string[];
  notes: string;
  expanded: boolean;
}

const INITIAL_PLACES: PlaceItem[] = [
  {
    id: '1', name: 'Nusantara Halal Restaurant', category: 'Restaurant',
    submittedBy: 'Ahmad Siddiqui', submittedDate: '2026-06-15', location: 'Silom, Bangkok',
    image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?w=400',
    status: 'Pending', trustStatus: 'certified', certAgency: 'CICOT', certNumber: 'CICOT-2024-1187',
    certExpiry: '2027-01-14', autoValidationScore: 91, autoValidationFlags: [],
    isPublished: false, isAutoHidden: false, documentsMissing: [], notes: '', expanded: false,
  },
  {
    id: '2', name: 'Madinah Boutique Hotel', category: 'Hotel',
    submittedBy: 'Fatimah Yusof', submittedDate: '2026-06-14', location: 'Patong, Phuket',
    image: 'https://images.unsplash.com/photo-1766856925165-94997a2104b4?w=400',
    status: 'Reviewed', trustStatus: 'source-verified', certAgency: 'TAT Dataset', certNumber: '—',
    certExpiry: '—', autoValidationScore: 78, autoValidationFlags: ['Certificate copy low resolution'],
    isPublished: false, isAutoHidden: false, documentsMissing: ['High-res certificate scan'], notes: '', expanded: false,
  },
  {
    id: '3', name: 'Halal Street Food Stall', category: 'Restaurant',
    submittedBy: 'Sulaiman Wirawan', submittedDate: '2026-06-12', location: 'Nimmanhaemin, Chiang Mai',
    image: 'https://images.unsplash.com/photo-1607411144164-97857cf86e1a?w=400',
    status: 'Returned for Correction', trustStatus: 'pending', certAgency: '—', certNumber: '—',
    certExpiry: '—', autoValidationScore: 42, autoValidationFlags: ['No certifying agency', 'Missing certificate number', 'Address incomplete'],
    isPublished: false, isAutoHidden: false, documentsMissing: ['Certification document', 'Business registration'], notes: 'Please upload official certification from CICOT or HALA Thailand.', expanded: false,
  },
  {
    id: '4', name: 'Grand Central Mosque Prayer Room', category: 'Mosque',
    submittedBy: 'Platform Admin', submittedDate: '2026-05-20', location: 'Hat Yai, Songkhla',
    image: 'https://images.unsplash.com/photo-1645334633515-4adec58e546a?w=400',
    status: 'Approved', trustStatus: 'certified', certAgency: 'CICOT', certNumber: 'CICOT-2023-0441',
    certExpiry: '2025-12-31', autoValidationScore: 97, autoValidationFlags: ['Certificate expired 14 Jan 2026'],
    isPublished: true, isAutoHidden: false, documentsMissing: [], notes: '', expanded: false,
  },
  {
    id: '5', name: 'Rayong Seafood Corner', category: 'Restaurant',
    submittedBy: 'Priya Nair', submittedDate: '2026-06-10', location: 'Mueang, Rayong',
    image: 'https://images.unsplash.com/photo-1769265114898-083ad50197f4?w=400',
    status: 'Rejected', trustStatus: 'owner-submitted', certAgency: '—', certNumber: '—',
    certExpiry: '—', autoValidationScore: 18, autoValidationFlags: ['Duplicate submission', 'Conflicting address data', 'No halal evidence'],
    isPublished: false, isAutoHidden: true, documentsMissing: ['All required documents'], notes: 'Rejected: duplicate submission with conflicting data. Owner may resubmit with full documentation.', expanded: false,
  },
];

function toModerationStatus(status: PrototypePlaceStatus) {
  if (status === "Pending Review") return "Pending";
  if (status === "Under Review") return "Reviewed";
  if (status === "Returned for Correction") return "Returned for Correction";
  if (status === "Hidden") return "Rejected";
  return status;
}

function fromModerationStatus(status: string): PrototypePlaceStatus {
  if (status === "Pending") return "Pending Review";
  if (status === "Reviewed") return "Under Review";
  if (status === "Returned for Correction") return "Returned for Correction";
  if (status === "Approved") return "Approved";
  if (status === "Rejected") return "Rejected";
  return "Pending Review";
}

function toPlaceItem(place: PrototypePlaceRecord, expanded: boolean): PlaceItem {
  return {
    id: place.id,
    name: place.name,
    category: place.type,
    submittedBy: place.source === "Owner Submitted" ? "Demo Entrepreneur" : "Platform Admin",
    submittedDate: place.submittedDate,
    location: `${place.address || place.province}, ${place.province}`,
    image: place.image,
    status: toModerationStatus(place.status),
    trustStatus: statusToTrustStatus(place),
    certAgency: place.certAgency || "—",
    certNumber: place.certNumber || "—",
    certExpiry: place.certExpiry || "—",
    autoValidationScore: Math.min(100, Math.max(20, 55 + place.images * 8 + (place.certAgency ? 15 : 0))),
    autoValidationFlags: [
      ...(place.images < 3 ? ["Image completeness below minimum"] : []),
      ...(!place.certAgency ? ["No certifying agency"] : []),
      ...(!place.certNumber ? ["Missing certificate number"] : []),
      ...(place.adminComment ? [place.adminComment] : []),
    ],
    isPublished: place.status === "Approved" || place.status === "Expiring Soon",
    isAutoHidden: place.status === "Hidden" || place.status === "Rejected" || place.status === "Expired",
    documentsMissing: [
      ...(place.images < 3 ? ["At least 3 photos"] : []),
      ...(!place.docs.halal ? ["Halal certificate"] : []),
    ],
    notes: place.adminComment || "",
    expanded,
  };
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'Pending':          { color: 'text-amber-700',   bg: 'bg-amber-100 border-amber-300',   label: 'Pending Review' },
  'Reviewed':         { color: 'text-blue-700',    bg: 'bg-blue-100 border-blue-300',     label: 'Reviewed' },
  'Returned for Correction':{ color: 'text-orange-700',  bg: 'bg-orange-100 border-orange-300', label: 'Returned for Correction' },
  'Approved':         { color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-300',label: 'Approved' },
  'Rejected':         { color: 'text-red-700',     bg: 'bg-red-100 border-red-300',       label: 'Rejected' },
  'Expiring Soon':    { color: 'text-orange-700',  bg: 'bg-orange-100 border-orange-300', label: 'Expiring Soon' },
  'Expired':          { color: 'text-slate-600',   bg: 'bg-slate-100 border-slate-300',   label: 'Expired' },
};

interface ValidationCheck {
  label: string;
  pass: boolean | null; // null = not applicable
  note?: string;
}

function buildValidationChecks(place: PlaceItem): ValidationCheck[] {
  const hasPhone = !place.documentsMissing.some(d => d.toLowerCase().includes('phone'));
  const hasWebsite = true; // assume present unless flagged
  const hasCoords = !place.autoValidationFlags.some(f => f.toLowerCase().includes('address'));
  const hasCertAgency = !!place.certAgency && place.certAgency !== '—';
  const hasCertNumber = !!place.certNumber && place.certNumber !== '—';
  const hasExpiry = !!place.certExpiry && place.certExpiry !== '—';
  const expiryValid = hasExpiry && place.certExpiry >= '2026-06-18';
  const hasImages = !place.documentsMissing.some(d => d.toLowerCase().includes('image') || d.toLowerCase().includes('photo'));
  const hasDocs = place.documentsMissing.length === 0;
  const noFormatFlag = !place.autoValidationFlags.some(f => f.toLowerCase().includes('format') || f.toLowerCase().includes('resolution'));
  const noDuplicate = !place.autoValidationFlags.some(f => f.toLowerCase().includes('duplicate'));

  return [
    { label: 'Required fields complete',    pass: place.autoValidationScore >= 60,  note: place.autoValidationScore < 60 ? 'Some required fields missing' : undefined },
    { label: 'File format valid',            pass: noFormatFlag,                     note: !noFormatFlag ? 'Low resolution or unsupported file type' : undefined },
    { label: 'Expiry date valid',            pass: expiryValid,                      note: !hasExpiry ? 'No expiry date provided' : !expiryValid ? 'Certificate already expired' : undefined },
    { label: 'Duplicate coordinates check', pass: noDuplicate && hasCoords,         note: !noDuplicate ? 'Duplicate location detected' : undefined },
    { label: 'Phone format valid',           pass: hasPhone,                         note: !hasPhone ? 'Phone number missing or invalid format' : undefined },
    { label: 'Website URL valid',            pass: hasWebsite,                       note: undefined },
    { label: 'Image completeness',           pass: hasImages,                        note: !hasImages ? 'Cover image or gallery missing' : undefined },
    { label: 'Document completeness',        pass: hasDocs,                          note: !hasDocs ? `Missing: ${place.documentsMissing.join(', ')}` : undefined },
    { label: 'Source agency selected',       pass: hasCertAgency && hasCertNumber,   note: !hasCertAgency ? 'No certifying agency selected' : !hasCertNumber ? 'Certificate number missing' : undefined },
  ];
}

function ValidationChecklist({ place }: { place: PlaceItem }) {
  const checks = buildValidationChecks(place);
  const passed = checks.filter(c => c.pass === true).length;
  const total = checks.length;
  const scoreColor = passed >= 8 ? 'text-emerald-600' : passed >= 5 ? 'text-amber-600' : 'text-red-600';
  const barColor = passed >= 8 ? 'bg-emerald-500' : passed >= 5 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground font-medium">Auto-validation — {passed}/{total} checks passed</span>
        <span className={`font-bold ${scoreColor}`}>{place.autoValidationScore}/100</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${(passed / total) * 100}%` }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {checks.map((check) => (
          <div key={check.label} className={`flex items-start gap-2 px-2.5 py-1.5 rounded-md text-[11px] border ${
            check.pass === true  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            check.pass === false ? 'bg-red-50 border-red-200 text-red-800' :
                                   'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span className="flex-shrink-0 mt-0.5">
              {check.pass === true  ? '✓' : check.pass === false ? '✗' : '—'}
            </span>
            <div className="min-w-0">
              <p className="font-medium leading-tight">{check.label}</p>
              {check.note && <p className="text-[10px] opacity-80 leading-tight mt-0.5">{check.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminModeration({ onNavigate, onLogout }: AdminModerationProps) {
  const { places: prototypePlaces, updatePlace } = usePrototypePlaces();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});

  const places = useMemo(
    () => prototypePlaces.map((place) => toPlaceItem(place, expandedIds.includes(place.id))),
    [prototypePlaces, expandedIds]
  );

  const update = (id: string, patch: Partial<PlaceItem>) => {
    const existing = prototypePlaces.find((p) => p.id === id);
    if (!existing) return;
    const nextStatus = patch.status ? fromModerationStatus(patch.status) : existing.status;
    updatePlace(id, {
      status: nextStatus,
      adminComment: patch.notes ?? existing.adminComment,
      trustStatus: statusToTrustStatus({ ...existing, status: nextStatus }),
    });
  };

  const action = (id: string, newStatus: string, extra?: Partial<PlaceItem>) => {
    update(id, { status: newStatus, ...extra });
    toast.success(`Action applied: ${newStatus}`);
  };

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const byStatus = (s: string) => places.filter((p) => p.status === s);

  const tabs = [
    { key: 'pending',   label: 'Pending Review',   items: byStatus('Pending') },
    { key: 'reviewed',  label: 'Reviewed',          items: byStatus('Reviewed') },
    { key: 'returned',  label: 'Returned for Correction', items: byStatus('Returned for Correction') },
    { key: 'approved',  label: 'Approved',          items: byStatus('Approved') },
    { key: 'rejected',  label: 'Rejected',          items: byStatus('Rejected') },
  ];

  const PlaceCard = ({ place }: { place: PlaceItem }) => {
    const cfg = STATUS_CONFIG[place.status] ?? STATUS_CONFIG['Pending'];
    const noteVal = noteInput[place.id] ?? place.notes;

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header row */}
          <div className="flex gap-4 p-4">
            <ImageWithFallback
              src={place.image} alt={place.name}
              className="w-24 h-20 sm:w-32 sm:h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base leading-tight truncate">{place.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <Badge variant="outline" className="text-xs">{place.category}</Badge>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    {place.isAutoHidden && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-slate-100 border-slate-300 text-slate-600 flex items-center gap-1">
                        <EyeOff className="size-2.5" /> Auto-hidden
                      </span>
                    )}
                    {place.isPublished && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-emerald-50 border-emerald-300 text-emerald-700 flex items-center gap-1">
                        <Eye className="size-2.5" /> Live
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{place.location} · Submitted by {place.submittedBy} · {place.submittedDate}</p>
                </div>
                <button onClick={() => toggleExpand(place.id)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                  {place.expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Expanded validation panel */}
          {place.expanded && (
            <div className="border-t bg-slate-50 p-4 space-y-4">
              {/* Auto-validation — 9-check structured checklist */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                  <Shield className="size-3.5" /> Auto-Validation Checklist
                </p>
                <ValidationChecklist place={place} />
              </div>

              {/* Certificate record */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Trust Status</p>
                  <TrustBadge status={place.trustStatus} agency={place.certAgency} size="sm" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Agency</p>
                  <p className="text-xs font-medium">{place.certAgency}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Cert No.</p>
                  <p className="text-xs font-medium font-mono">{place.certNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Expiry</p>
                  <p className={`text-xs font-medium ${place.certExpiry < '2026-06-16' && place.certExpiry !== '—' ? 'text-red-600' : ''}`}>
                    {place.certExpiry}
                  </p>
                </div>
              </div>

              {/* Missing documents */}
              {place.documentsMissing.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-800 mb-1.5 flex items-center gap-1">
                    <FileBadge className="size-3.5" /> Missing Documents
                  </p>
                  <ul className="space-y-0.5">
                    {place.documentsMissing.map((d) => (
                      <li key={d} className="text-xs text-amber-700 flex items-center gap-1.5">
                        <AlertCircle className="size-2.5 flex-shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Admin note */}
              <div className="space-y-1.5">
                <Label htmlFor={`note-${place.id}`} className="text-xs font-medium text-slate-600">
                  Admin note (visible to entrepreneur)
                </Label>
                <Textarea
                  id={`note-${place.id}`}
                  rows={2}
                  className="text-xs"
                  value={noteVal}
                  onChange={(e) => setNoteInput((prev) => ({ ...prev, [place.id]: e.target.value }))}
                  placeholder="Add a note for the submitter…"
                />
              </div>

              {/* Auto-hide toggle */}
              <div className="flex items-center gap-3">
                <Switch
                  id={`autohide-${place.id}`}
                  checked={place.isAutoHidden}
                  onCheckedChange={(v) => {
                    update(place.id, { isAutoHidden: v });
                    toast.info(v ? 'Listing auto-hidden from public view' : 'Auto-hide removed — listing visible again');
                  }}
                />
                <Label htmlFor={`autohide-${place.id}`} className="text-xs cursor-pointer">
                  Auto-hide from public view
                </Label>
                <span className="text-[10px] text-muted-foreground">(hides immediately, no approval needed)</span>
              </div>
            </div>
          )}

          {/* Action bar */}
          <div className="border-t bg-white p-3 flex flex-wrap gap-2">
            {/* Pending actions */}
            {place.status === 'Pending' && (
              <>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
                  onClick={() => action(place.id, 'Reviewed')}>
                  <Eye className="size-3.5 mr-1.5" /> Mark Reviewed
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"
                  onClick={() => action(place.id, 'Returned for Correction', { notes: noteInput[place.id] || '' })}>
                  <FileEdit className="size-3.5 mr-1.5" /> Return for Correction
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-amber-400 text-amber-700 hover:bg-amber-50"
                  onClick={() => { update(place.id, { documentsMissing: place.documentsMissing.length ? place.documentsMissing : ['Certificate document'] }); toast.info('Document request sent to entrepreneur'); }}>
                  <FileBadge className="size-3.5 mr-1.5" /> Request Document
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => action(place.id, 'Rejected', { isPublished: false, isAutoHidden: true })}>
                  <X className="size-3.5 mr-1.5" /> Reject
                </Button>
              </>
            )}

            {/* Reviewed actions */}
            {place.status === 'Reviewed' && (
              <>
                {place.trustStatus === 'source-verified' ? (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                    onClick={() => action(place.id, 'Approved', { isPublished: true })}>
                    <Check className="size-3.5 mr-1.5" /> Verify Source Record & Publish
                  </Button>
                ) : (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                    onClick={() => action(place.id, 'Approved', { isPublished: true })}>
                    <Check className="size-3.5 mr-1.5" /> Approve for Publication
                  </Button>
                )}
                <Button size="sm" variant="outline" className="h-8 text-xs"
                  onClick={() => action(place.id, 'Returned for Correction', { notes: noteInput[place.id] || '' })}>
                  <FileEdit className="size-3.5 mr-1.5" /> Return for Correction
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-amber-400 text-amber-700 hover:bg-amber-50"
                  onClick={() => toast.info('Document request sent to entrepreneur')}>
                  <FileBadge className="size-3.5 mr-1.5" /> Request Document
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => action(place.id, 'Rejected', { isPublished: false, isAutoHidden: true })}>
                  <X className="size-3.5 mr-1.5" /> Reject
                </Button>
              </>
            )}

            {/* Returned actions */}
            {place.status === 'Returned for Correction' && (
              <>
                <span className="text-xs text-orange-600 flex items-center gap-1 mr-2">
                  <Clock className="size-3.5" /> Waiting for resubmission
                </span>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
                  onClick={() => action(place.id, 'Reviewed')}>
                  <RefreshCw className="size-3.5 mr-1.5" /> Resume Review
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => action(place.id, 'Rejected', { isPublished: false, isAutoHidden: true })}>
                  <X className="size-3.5 mr-1.5" /> Reject
                </Button>
              </>
            )}

            {/* Approved actions */}
            {place.status === 'Approved' && (
              <>
                {place.isPublished ? (
                  <Button size="sm" variant="outline" className="h-8 text-xs border-slate-400 text-slate-600 hover:bg-slate-50"
                    onClick={() => { update(place.id, { isPublished: false }); toast.info('Listing unpublished'); }}>
                    <EyeOff className="size-3.5 mr-1.5" /> Unpublish
                  </Button>
                ) : (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                    onClick={() => { update(place.id, { isPublished: true }); toast.success('Listing published'); }}>
                    <Eye className="size-3.5 mr-1.5" /> Publish
                  </Button>
                )}
                <Button size="sm" variant="outline" className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => action(place.id, 'Rejected', { isPublished: false, isAutoHidden: true })}>
                  <X className="size-3.5 mr-1.5" /> Reject & Remove
                </Button>
              </>
            )}

            {/* Rejected actions */}
            {place.status === 'Rejected' && (
              <>
                <Button size="sm" variant="outline" className="h-8 text-xs"
                  onClick={() => action(place.id, 'Pending', { isAutoHidden: false })}>
                  <RefreshCw className="size-3.5 mr-1.5" /> Restore to Queue
                </Button>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <EyeOff className="size-3.5" /> Hidden from public
                </span>
              </>
            )}

            {/* Expand toggle for validation */}
            <Button size="sm" variant="ghost" className="h-8 text-xs ml-auto text-muted-foreground"
              onClick={() => toggleExpand(place.id)}>
              <FileSearch className="size-3.5 mr-1.5" />
              {place.expanded ? 'Hide' : 'Validation Panel'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminLayout activePage="moderation" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Content Moderation — Approval Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pre-publish approval workflow with auto-validation, document requests, and source governance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {tabs.map(({ key, label, items }) => (
            <Card key={key} className="text-center">
              <CardContent className="pt-4 pb-3">
                <div className={`text-xl font-bold ${
                  key === 'pending' ? 'text-amber-600' :
                  key === 'reviewed' ? 'text-blue-600' :
                  key === 'returned' ? 'text-orange-600' :
                  key === 'approved' ? 'text-emerald-600' : 'text-red-600'
                }`}>{items.length}</div>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Governance note */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Info className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Source Governance:</strong> Auto-validation checks certificate number format, agency match,
            expiry date, and address completeness. Score ≥ 80 = recommended for fast-track approval.
            Certificate authority decisions remain with CICOT / HALA Thailand / TAT — this platform records and displays status only.
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto gap-1 h-auto flex-wrap">
            {tabs.map(({ key, label, items }) => (
              <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                {label}
                {items.length > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    key === 'pending' ? 'bg-amber-100 text-amber-700' :
                    key === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                    key === 'returned' ? 'bg-orange-100 text-orange-700' :
                    key === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>{items.length}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ key, items }) => (
            <TabsContent key={key} value={key} className="space-y-4 mt-6">
              {items.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Check className="size-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No items in this queue</p>
                  </CardContent>
                </Card>
              ) : (
                items.map((place) => <PlaceCard key={place.id} place={place} />)
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
