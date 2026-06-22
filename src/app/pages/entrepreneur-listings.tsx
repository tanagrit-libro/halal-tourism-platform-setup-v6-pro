import { EntrepreneurLayout } from "../components/entrepreneur-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { TrustBadge, TrustStatus } from "../components/halal-badge";
import {
  Edit, Eye, BarChart3, Star, MessageSquare, AlertCircle, Clock,
  CheckCircle, RotateCcw, Plus, Upload, RefreshCw, XCircle,
  FileText, CalendarDays, ChevronDown, ChevronUp,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { PrototypePlaceRecord, usePrototypePlaces } from "../data/prototype-place-workflow";

interface EntrepreneurListingsProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type ListingStatus = 'Approved' | 'Pending Review' | 'Returned for Correction' | 'Expiring Soon' | 'Expired';

interface DocTimelineEvent {
  label: string;
  date: string;
  done: boolean;
  active?: boolean;
}

interface Listing {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  views: number;
  status: ListingStatus;
  trustStatus: TrustStatus;
  certAgency?: string;
  lastUpdated: string;
  adminComment?: string;
  certExpiry?: string;
  timeline?: DocTimelineEvent[];
}

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  'Approved': {
    label: 'Approved / Published',
    color: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    icon: <CheckCircle className="size-3" />,
  },
  'Pending Review': {
    label: 'Pending Review',
    color: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: <Clock className="size-3" />,
  },
  'Returned for Correction': {
    label: 'Returned for Correction',
    color: 'bg-rose-100 text-rose-700 border border-rose-200',
    icon: <RotateCcw className="size-3" />,
  },
  'Expiring Soon': {
    label: 'Expiring Soon',
    color: 'bg-orange-100 text-orange-700 border border-orange-200',
    icon: <AlertCircle className="size-3" />,
  },
  'Expired': {
    label: 'Expired / Hidden',
    color: 'bg-slate-100 text-slate-600 border border-slate-200',
    icon: <XCircle className="size-3" />,
  },
};

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    name: 'Grand Halal Restaurant',
    category: 'Restaurant',
    location: 'Bangkok, Thailand',
    image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?w=400',
    rating: 4.8,
    reviews: 234,
    views: 1245,
    status: 'Approved',
    trustStatus: 'certified',
    certAgency: 'CICOT',
    lastUpdated: '2026-01-15',
    certExpiry: '2027-01-14',
    timeline: [
      { label: 'Submitted', date: 'Jan 1, 2025', done: true },
      { label: 'Auto-validation passed', date: 'Jan 1, 2025', done: true },
      { label: 'Under admin review', date: 'Jan 3, 2025', done: true },
      { label: 'Approved', date: 'Jan 15, 2025', done: true, active: true },
      { label: 'Expiring soon', date: 'Dec 2026', done: false },
    ],
  },
  {
    id: '2',
    name: 'Halal Cafe & Bistro',
    category: 'Cafe',
    location: 'Chiang Mai, Thailand',
    image: 'https://images.unsplash.com/photo-1607411144164-97857cf86e1a?w=400',
    rating: 4.7,
    reviews: 89,
    views: 567,
    status: 'Pending Review',
    trustStatus: 'pending',
    lastUpdated: '2026-02-09',
    timeline: [
      { label: 'Submitted', date: 'Feb 9, 2026', done: true },
      { label: 'Auto-validation passed', date: 'Feb 9, 2026', done: true },
      { label: 'Under admin review', date: 'Feb 10, 2026', done: false, active: true },
      { label: 'Approved', date: '—', done: false },
    ],
  },
  {
    id: '3',
    name: 'Phuket Beach Resort',
    category: 'Hotel',
    location: 'Phuket, Thailand',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    rating: 0,
    reviews: 0,
    views: 12,
    status: 'Returned for Correction',
    adminComment: "Business license document is unclear. Please re-upload a sharper scan.",
    trustStatus: 'owner-submitted',
    lastUpdated: '2026-02-08',
    timeline: [
      { label: 'Submitted', date: 'Feb 5, 2026', done: true },
      { label: 'Auto-validation passed', date: 'Feb 5, 2026', done: true },
      { label: 'Returned for correction', date: 'Feb 8, 2026', done: true, active: true },
      { label: 'Re-submitted', date: '—', done: false },
      { label: 'Approved', date: '—', done: false },
    ],
  },
  {
    id: '4',
    name: 'Halal Seafood Paradise',
    category: 'Restaurant',
    location: 'Pattaya, Thailand',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    rating: 4.5,
    reviews: 120,
    views: 800,
    status: 'Expiring Soon',
    trustStatus: 'certified',
    certAgency: 'HALA Thailand',
    lastUpdated: '2025-06-01',
    certExpiry: '2026-07-01',
    timeline: [
      { label: 'Submitted', date: 'Jun 1, 2025', done: true },
      { label: 'Auto-validation passed', date: 'Jun 1, 2025', done: true },
      { label: 'Under admin review', date: 'Jun 2, 2025', done: true },
      { label: 'Approved', date: 'Jun 10, 2025', done: true },
      { label: 'Expiring soon', date: 'Jun 2026', done: false, active: true },
    ],
  },
  {
    id: '5',
    name: 'Old Town Kebab House',
    category: 'Restaurant',
    location: 'Ayutthaya, Thailand',
    image: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400',
    rating: 3.9,
    reviews: 45,
    views: 300,
    status: 'Expired',
    trustStatus: 'expired',
    lastUpdated: '2025-01-01',
    certExpiry: '2025-12-31',
    timeline: [
      { label: 'Submitted', date: 'Jan 1, 2024', done: true },
      { label: 'Approved', date: 'Jan 20, 2024', done: true },
      { label: 'Certificate expired', date: 'Dec 31, 2025', done: true, active: true },
      { label: 'Expired and hidden', date: 'Jan 1, 2026', done: true },
      { label: 'Re-upload required', date: '—', done: false },
    ],
  },
];

function toListingStatus(status: PrototypePlaceRecord["status"]): ListingStatus {
  if (status === "Approved") return "Approved";
  if (status === "Expiring Soon") return "Expiring Soon";
  if (status === "Expired" || status === "Hidden" || status === "Rejected") return "Expired";
  if (status === "Returned for Correction") return "Returned for Correction";
  return "Pending Review";
}

function buildTimeline(place: PrototypePlaceRecord): DocTimelineEvent[] {
  const isApproved = place.status === "Approved" || place.status === "Expiring Soon";
  const isReturned = place.status === "Returned for Correction";
  const isClosed = place.status === "Expired" || place.status === "Hidden" || place.status === "Rejected";
  return [
    { label: "Submitted", date: place.submittedDate, done: true },
    { label: "Auto-validation passed", date: place.submittedDate, done: true },
    { label: "Under admin review", date: isApproved || isReturned || isClosed ? place.submittedDate : "In progress", done: true, active: place.status === "Pending Review" || place.status === "Under Review" },
    { label: isReturned ? "Returned for correction" : isClosed ? "Hidden / closed" : "Approved", date: isApproved || isReturned || isClosed ? "Updated in prototype" : "—", done: isApproved || isReturned || isClosed, active: isApproved || isReturned || isClosed },
  ];
}

const STATUS_COUNT_LABELS: [ListingStatus, string][] = [
  ['Approved', 'Live'],
  ['Pending Review', 'Pending'],
  ['Returned for Correction', 'Needs Action'],
  ['Expiring Soon', 'Expiring Soon'],
  ['Expired', 'Expired'],
];

export function EntrepreneurListings({ onNavigate, onLogout }: EntrepreneurListingsProps) {
  const { places } = usePrototypePlaces();
  const listings = useMemo<Listing[]>(() => places.map((place) => ({
    id: place.id,
    name: place.name,
    category: place.type,
    location: `${place.province}, Thailand`,
    image: place.image,
    rating: place.rating,
    reviews: place.reviews,
    views: place.views,
    status: toListingStatus(place.status),
    trustStatus: place.trustStatus,
    certAgency: place.certAgency || undefined,
    lastUpdated: place.submittedDate,
    adminComment: place.adminComment,
    certExpiry: place.certExpiry,
    timeline: buildTimeline(place),
  })), [places]);
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);

  const getStatusBadge = (status: ListingStatus) => {
    const cfg = STATUS_CONFIG[status];
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  const handleAction = (action: string, name: string) => {
    if (action === 'upload') toast.info(`Upload new document for "${name}"`);
    else if (action === 'reverify') toast.success(`Re-verification requested for "${name}"`);
    else if (action === 'edit') { onNavigate?.('submit'); toast.info("Editing will resubmit for admin approval"); }
    else if (action === 'message') onNavigate?.('support');
  };

  const renderTimeline = (events: DocTimelineEvent[]) => (
    <div className="mt-4 border-t pt-4">
      <p className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1">
        <FileText className="size-3" /> Document Timeline
      </p>
      <div className="relative">
        <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-slate-200" />
        <div className="space-y-3">
          {events.map((event, i) => (
            <div key={i} className="flex items-start gap-3 relative">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                event.active ? 'border-emerald-500 bg-emerald-500' :
                event.done ? 'border-emerald-400 bg-emerald-100' :
                'border-slate-300 bg-white'
              }`}>
                {event.done ? <CheckCircle className={`size-3 ${event.active ? 'text-white' : 'text-emerald-600'}`} /> :
                  <div className="w-2 h-2 rounded-full bg-slate-300" />}
              </div>
              <div className="flex-1 pb-1">
                <p className={`text-xs font-medium ${event.active ? 'text-emerald-700' : event.done ? 'text-slate-700' : 'text-slate-400'}`}>
                  {event.label}
                </p>
                <p className="text-xs text-muted-foreground">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActions = (listing: Listing) => {
    const actions = [];

    if (listing.status === 'Approved' || listing.status === 'Expiring Soon' || listing.status === 'Expired') {
      actions.push(
        <Button key="upload" variant="outline" size="sm" onClick={() => handleAction('upload', listing.name)}
          className="flex items-center gap-1.5 text-xs h-8">
          <Upload className="size-3.5" /> Upload Document
        </Button>
      );
      actions.push(
        <Button key="reverify" variant="outline" size="sm" onClick={() => handleAction('reverify', listing.name)}
          className="flex items-center gap-1.5 text-xs h-8">
          <RefreshCw className="size-3.5" /> Re-verify
        </Button>
      );
    }

    if (listing.status === 'Returned for Correction') {
      actions.push(
        <Button key="edit" size="sm" onClick={() => handleAction('edit', listing.name)}
          className="flex items-center gap-1.5 text-xs h-8 bg-rose-600 hover:bg-rose-700">
          <Edit className="size-3.5" /> Fix & Resubmit
        </Button>
      );
    }

    if (listing.status !== 'Expired') {
      actions.push(
        <Button key="edit-plain" variant="outline" size="sm" onClick={() => handleAction('edit', listing.name)}
          className="flex items-center gap-1.5 text-xs h-8">
          <Edit className="size-3.5" /> Edit
        </Button>
      );
    }

    actions.push(
      <Button key="msg" variant="ghost" size="sm" onClick={() => handleAction('message', listing.name)}
        className="flex items-center gap-1.5 text-xs h-8 text-slate-600">
        <MessageSquare className="size-3.5" /> Message Admin
      </Button>
    );

    return <div className="flex flex-wrap gap-2">{actions}</div>;
  };

  return (
    <EntrepreneurLayout activePage="listings" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="text-muted-foreground">Manage your places and track document verification status</p>
          </div>
          <Button onClick={() => onNavigate?.('submit')} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="size-4 mr-2" /> Add New Place
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {STATUS_COUNT_LABELS.map(([status, displayLabel]) => {
            const cfg = STATUS_CONFIG[status];
            const count = listings.filter(l => l.status === status).length;
            return (
              <Card key={status} className="border">
                <CardContent className="pt-4 pb-3">
                  <div className={`text-xl font-bold ${
                    status === 'Approved' ? 'text-emerald-600' :
                    status === 'Pending Review' ? 'text-amber-500' :
                    status === 'Returned for Correction' ? 'text-rose-500' :
                    status === 'Expiring Soon' ? 'text-orange-500' : 'text-slate-500'
                  }`}>{count}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{displayLabel}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Listing Cards */}
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing.id} className={`${
              listing.status === 'Returned for Correction' ? 'border-rose-200' :
              listing.status === 'Expiring Soon' ? 'border-orange-200' :
              listing.status === 'Expired' ? 'border-slate-200 opacity-80' : ''
            }`}>
              <CardContent className="pt-5">
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Image */}
                  <div className="relative w-full md:w-56 h-36 shrink-0">
                    <ImageWithFallback
                      src={listing.image}
                      alt={listing.name}
                      className={`w-full h-full object-cover rounded-lg ${listing.status === 'Expired' ? 'grayscale' : ''}`}
                    />
                    {(listing.status === 'Approved' || listing.status === 'Expiring Soon') && (
                      <div className="absolute top-2 left-2">
                        <TrustBadge status={listing.trustStatus} agency={listing.certAgency} size="sm" />
                      </div>
                    )}
                    {listing.status === 'Expired' && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                        <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded">Hidden</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{listing.name}</h3>
                          {getStatusBadge(listing.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="font-normal text-xs">{listing.category}</Badge>
                          <span>{listing.location}</span>
                          {listing.certExpiry && (
                            <span className={`flex items-center gap-1 ${
                              listing.status === 'Expiring Soon' ? 'text-orange-600 font-medium' :
                              listing.status === 'Expired' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              <CalendarDays className="size-3" /> Cert expires {listing.certExpiry}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin comment for Returned */}
                    {listing.status === 'Returned for Correction' && listing.adminComment && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-md mb-3 flex items-start gap-2 text-xs">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Admin Feedback: </span>{listing.adminComment}
                          <div className="mt-1 opacity-80">Edit and resubmit to address this correction.</div>
                        </div>
                      </div>
                    )}

                    {/* Expiry warning */}
                    {listing.status === 'Expiring Soon' && (
                      <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-md mb-3 flex items-start gap-2 text-xs">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Certificate Expiring Soon: </span>
                          Your certification expires on {listing.certExpiry}. Upload a renewed certificate to keep your listing live.
                        </div>
                      </div>
                    )}

                    {/* Expired warning */}
                    {listing.status === 'Expired' && (
                      <div className="bg-slate-100 border border-slate-200 text-slate-700 p-3 rounded-md mb-3 flex items-start gap-2 text-xs">
                        <XCircle className="size-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Listing Hidden: </span>
                          Your certificate expired. Upload a valid document and request re-verification to restore visibility.
                        </div>
                      </div>
                    )}

                    {/* Stats (approved) */}
                    {(listing.status === 'Approved' || listing.status === 'Expiring Soon') && listing.rating > 0 && (
                      <div className="flex gap-6 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{listing.rating}</span>
                          <span className="text-xs text-muted-foreground">({listing.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="size-4 text-blue-500" />
                          <span className="text-sm font-medium">{listing.views} views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrustBadge status={listing.trustStatus} agency={listing.certAgency} size="sm" />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {renderActions(listing)}

                    {/* Timeline toggle */}
                    {listing.timeline && (
                      <button
                        className="mt-3 text-xs text-muted-foreground flex items-center gap-1 hover:text-slate-700 transition-colors"
                        onClick={() => setExpandedTimeline(expandedTimeline === listing.id ? null : listing.id)}
                      >
                        <FileText className="size-3" />
                        {expandedTimeline === listing.id ? 'Hide' : 'Show'} Document Timeline
                        {expandedTimeline === listing.id ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                      </button>
                    )}

                    {expandedTimeline === listing.id && listing.timeline && renderTimeline(listing.timeline)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </EntrepreneurLayout>
  );
}
