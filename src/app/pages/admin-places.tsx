import { AdminLayout } from "../components/admin-layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Search, MapPin, CheckCircle, XCircle, AlertCircle, Clock, EyeOff,
  RotateCcw, Eye, FileText, Upload, RefreshCw, ChevronDown, ChevronUp,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { PLACE_TYPE_LABELS } from "../data/place-types";
import {
  PrototypePlaceRecord,
  PrototypePlaceStatus,
  statusToTrustStatus,
  usePrototypePlaces,
} from "../data/prototype-place-workflow";

interface AdminPlacesProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type PlaceStatus = PrototypePlaceStatus;
type Place = PrototypePlaceRecord;

type WorkflowAction = 'approve' | 'reject' | 'return' | 'request-docs' | 'publish' | 'unpublish';

const WORKFLOW_CONFIG: Record<WorkflowAction, { label: string; color: string; requiresReason: boolean }> = {
  'approve':      { label: 'Approve for Publication',      color: 'bg-emerald-600 hover:bg-emerald-700', requiresReason: false },
  'reject':       { label: 'Reject Submission',            color: 'bg-rose-600 hover:bg-rose-700',       requiresReason: true },
  'return':       { label: 'Return for Correction',        color: 'bg-amber-600 hover:bg-amber-700',     requiresReason: true },
  'request-docs': { label: 'Request More Documents',       color: 'bg-blue-600 hover:bg-blue-700',       requiresReason: true },
  'publish':      { label: 'Publish / Restore Visibility', color: 'bg-emerald-600 hover:bg-emerald-700', requiresReason: false },
  'unpublish':    { label: 'Unpublish / Hide Listing',     color: 'bg-slate-600 hover:bg-slate-700',     requiresReason: true },
};

const STATUS_CONFIG: Record<PlaceStatus, { badge: string; icon: React.ReactNode }> = {
  'Approved':             { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle className="size-3" /> },
  'Pending Review':       { badge: 'bg-amber-100 text-amber-700 border-amber-200',       icon: <Clock className="size-3" /> },
  'Under Review':         { badge: 'bg-blue-100 text-blue-700 border-blue-200',          icon: <Eye className="size-3" /> },
  'Returned for Correction': { badge: 'bg-rose-100 text-rose-700 border-rose-200',    icon: <RotateCcw className="size-3" /> },
  'Rejected':             { badge: 'bg-red-100 text-red-700 border-red-200',             icon: <XCircle className="size-3" /> },
  'Expiring Soon':        { badge: 'bg-orange-100 text-orange-700 border-orange-200',   icon: <AlertTriangle className="size-3" /> },
  'Expired':              { badge: 'bg-slate-100 text-slate-600 border-slate-200',      icon: <XCircle className="size-3" /> },
  'Hidden':               { badge: 'bg-slate-100 text-slate-500 border-slate-200',      icon: <EyeOff className="size-3" /> },
};

function autoValidate(place: Place) {
  return [
    { check: 'Required fields complete',   pass: !!(place.name && place.address && place.type && place.province) },
    { check: 'Certificate document uploaded', pass: place.docs.halal || place.docs.license },
    { check: 'Expiry date valid',          pass: !!place.certExpiry && new Date(place.certExpiry) > new Date() },
    { check: 'Coordinates in range',       pass: parseFloat(place.lat) >= 5 && parseFloat(place.lat) <= 21 },
    { check: 'Phone format valid',         pass: !!(place.phone && place.phone.startsWith('+66')) },
    { check: 'Website URL valid',          pass: !place.website || place.website.startsWith('http') },
    { check: 'Image completeness (≥3)',    pass: place.images >= 3 },
    { check: 'Opening hours format',       pass: /^([0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}|24 Hours)$/.test(place.openingHours) },
    { check: 'Source agency selected',     pass: !!place.certAgency },
  ];
}

export function AdminPlaces({ onNavigate, onLogout }: AdminPlacesProps) {
  const { places, updatePlace } = usePrototypePlaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [workflowAction, setWorkflowAction] = useState<WorkflowAction | null>(null);
  const [reason, setReason] = useState('');
  const [showValidation, setShowValidation] = useState<number | null>(null);

  const filtered = places.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchType = filterType === 'all' || p.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const statusCounts: Record<string, number> = {
    pending: places.filter(p => p.status === 'Pending Review' || p.status === 'Under Review').length,
    expiring: places.filter(p => p.status === 'Expiring Soon').length,
    expired: places.filter(p => p.status === 'Expired').length,
  };

  const getStatusBadge = (status: PlaceStatus) => {
    const cfg = STATUS_CONFIG[status];
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.badge}`}>
        {cfg.icon} {status}
      </span>
    );
  };

  const handleWorkflowSubmit = () => {
    if (!selectedPlace || !workflowAction) return;
    const cfg = WORKFLOW_CONFIG[workflowAction];
    if (cfg.requiresReason && !reason.trim()) {
      toast.error('A reason or comment is required for this action.');
      return;
    }
    const newStatus: PlaceStatus =
      workflowAction === 'approve' || workflowAction === 'publish' ? 'Approved' :
      workflowAction === 'reject' ? 'Rejected' :
      workflowAction === 'return' ? 'Returned for Correction' :
      workflowAction === 'unpublish' ? 'Hidden' :
      workflowAction === 'request-docs' ? 'Returned for Correction' : selectedPlace.status;

    updatePlace(selectedPlace.id, {
      status: newStatus,
      adminComment: reason || undefined,
      trustStatus: statusToTrustStatus({ ...selectedPlace, status: newStatus }),
    });
    toast.success(`Action "${cfg.label}" applied to ${selectedPlace.name}.`);
    setSelectedPlace(null);
    setWorkflowAction(null);
    setReason('');
  };

  return (
    <AdminLayout activePage="places" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Place Management</h1>
          <p className="text-muted-foreground">Verify source records, manage certification, and govern listing visibility.</p>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Places</TabsTrigger>
            <TabsTrigger value="queue">
              Action Queue
              {(statusCounts.pending + statusCounts.expiring + statusCounts.expired) > 0 && (
                <span className="ml-1.5 bg-rose-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                  {statusCounts.pending + statusCounts.expiring + statusCounts.expired}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Queue Tab */}
          <TabsContent value="queue" className="mt-4 space-y-4">
            {(['Pending Review', 'Under Review', 'Expiring Soon', 'Expired', 'Returned for Correction'] as PlaceStatus[]).map(status => {
              const items = places.filter(p => p.status === status);
              if (!items.length) return null;
              const cfg = STATUS_CONFIG[status];
              return (
                <Card key={status}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getStatusBadge(status)}
                        <span className="text-muted-foreground font-normal text-sm">— {items.length} listing(s)</span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {items.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border bg-white gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.type} · {p.province} · Submitted {p.submittedDate}</p>
                            {p.adminComment && (
                              <p className="text-xs text-rose-600 mt-1 flex items-start gap-1">
                                <AlertCircle className="size-3 mt-0.5 shrink-0" /> {p.adminComment}
                              </p>
                            )}
                          </div>
                          <Button size="sm" className="shrink-0" onClick={() => { setSelectedPlace(p); setWorkflowAction(null); }}>
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* All Places Tab */}
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <CardTitle>Place Database</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                      <Input placeholder="Search places..." className="pl-8 w-52" value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {(Object.keys(STATUS_CONFIG) as PlaceStatus[]).map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {PLACE_TYPE_LABELS.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Auto-Validation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(place => {
                      const validChecks = autoValidate(place);
                      const passCount = validChecks.filter(c => c.pass).length;
                      const failCount = validChecks.length - passCount;
                      return (
                        <TableRow key={place.id}>
                          <TableCell className="font-medium">{place.name}</TableCell>
                          <TableCell>{place.type}</TableCell>
                          <TableCell>{place.province}</TableCell>
                          <TableCell>{getStatusBadge(place.status)}</TableCell>
                          <TableCell>
                            <button
                              className="flex items-center gap-1.5 text-xs group"
                              onClick={() => setShowValidation(showValidation === place.id ? null : place.id)}
                            >
                              <span className={`font-medium ${failCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {passCount}/{validChecks.length}
                              </span>
                              <span className="text-muted-foreground group-hover:text-foreground">
                                {showValidation === place.id ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                              </span>
                            </button>
                            {showValidation === place.id && (
                              <div className="mt-2 space-y-1 p-2 bg-slate-50 rounded border text-xs w-64">
                                {validChecks.map(c => (
                                  <div key={c.check} className={`flex items-center gap-1.5 ${c.pass ? 'text-emerald-700' : 'text-rose-600'}`}>
                                    {c.pass ? <CheckCircle className="size-3 shrink-0" /> : <XCircle className="size-3 shrink-0" />}
                                    {c.check}
                                  </div>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" className="text-xs h-7"
                                onClick={() => { setSelectedPlace(place); setWorkflowAction(null); }}>
                                <Eye className="size-3.5 mr-1" /> Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review & Workflow Dialog */}
      <Dialog open={!!selectedPlace} onOpenChange={open => { if (!open) { setSelectedPlace(null); setWorkflowAction(null); setReason(''); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPlace && (
            <>
              <DialogHeader>
                <DialogTitle>Verify Source Record: {selectedPlace.name}</DialogTitle>
                <DialogDescription>Review all information and apply a governance action.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Basic info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Type', selectedPlace.type],
                    ['Province', selectedPlace.province],
                    ['Address', selectedPlace.address],
                    ['Coordinates', `${selectedPlace.lat}, ${selectedPlace.lng}`],
                    ['Hours', selectedPlace.openingHours],
                    ['Phone', selectedPlace.phone || '—'],
                    ['Website', selectedPlace.website || '—'],
                    ['Source Agency', selectedPlace.certAgency || 'Not set'],
                    ['Cert Expiry', selectedPlace.certExpiry || 'Not provided'],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b pb-2">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Auto-validation */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="size-4 text-amber-500" /> Auto-Validation Results
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {autoValidate(selectedPlace).map(c => (
                      <div key={c.check} className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded border ${
                        c.pass ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                      }`}>
                        {c.pass ? <CheckCircle className="size-3 shrink-0" /> : <XCircle className="size-3 shrink-0" />}
                        {c.check}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <FileText className="size-4 text-blue-500" /> Certification Documents
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {([['Business License', selectedPlace.docs.license], ['Halal Certificate', selectedPlace.docs.halal], ['SHA Standard', selectedPlace.docs.sha]] as [string, boolean][]).map(([doc, present]) => (
                      <div key={doc} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border ${
                        present ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                      }`}>
                        {present ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />} {doc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previous admin comment */}
                {selectedPlace.adminComment && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                    <p className="font-medium text-amber-800 text-xs mb-1">Previous admin note:</p>
                    <p className="text-amber-700">{selectedPlace.adminComment}</p>
                  </div>
                )}

                {/* Workflow action selector */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Select Governance Action</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(WORKFLOW_CONFIG) as WorkflowAction[]).map(action => {
                      const cfg = WORKFLOW_CONFIG[action];
                      return (
                        <button key={action}
                          className={`text-xs text-left px-3 py-2 rounded-lg border-2 transition-colors font-medium ${
                            workflowAction === action
                              ? 'border-slate-700 bg-slate-700 text-white'
                              : 'border-slate-200 hover:border-slate-400 text-slate-700'
                          }`}
                          onClick={() => { setWorkflowAction(action); setReason(''); }}>
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reason/comment field */}
                {workflowAction && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Reason / Comment {WORKFLOW_CONFIG[workflowAction].requiresReason && <span className="text-rose-500">*</span>}
                    </Label>
                    <Textarea
                      rows={3}
                      placeholder={`Provide reason for "${WORKFLOW_CONFIG[workflowAction].label}"...`}
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">This will be logged in the audit trail and visible to the business.</p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => { setSelectedPlace(null); setWorkflowAction(null); setReason(''); }}>
                  Cancel
                </Button>
                {workflowAction && (
                  <Button
                    className={`text-white ${WORKFLOW_CONFIG[workflowAction].color}`}
                    onClick={handleWorkflowSubmit}
                  >
                    Confirm: {WORKFLOW_CONFIG[workflowAction].label}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
