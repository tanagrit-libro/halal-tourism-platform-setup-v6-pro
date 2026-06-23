import { AdminLayout } from "../components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import {
  Search, Download, FileText, FileSpreadsheet, FileJson,
  ChevronDown, Filter, X, ShieldAlert
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePrototypeAuditEvents } from "../data/prototype-audit-workflow";

interface AdminAuditLogProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const SHOW_SECURITY_PDPA_INDICATORS = false;

type EventType =
  | 'Login' | 'Logout' | 'Edit' | 'Approve' | 'Reject' | 'Return for Correction'
  | 'Import' | 'Export' | 'Publish' | 'Unpublish' | 'Revoke'
  | 'API Key Action' | 'Auto-hide Expired' | 'Request Docs'
  | 'Create Draft' | 'Submit for Review' | 'Schedule' | 'Archive' | 'Restore'
  | 'View Sensitive Data' | 'PDPA Request' | 'Backup';

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: EventType;
  entity: string;
  entityType: string;
  detail: string;
  ip: string;
  session: string;
  status: 'Success' | 'Failed' | 'Warning';
}

const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'EVT-001', timestamp: '2026-06-16 09:14:02', actor: 'yana@yana-group.com',       role: 'Business',    action: 'Login',              entity: 'Yana Hospitality Group', entityType: 'Business Account', detail: 'Successful login with 2FA from Chrome on macOS',           ip: '101.12.34.56',   session: 'sess_aaa111', status: 'Success' },
  { id: 'EVT-002', timestamp: '2026-06-16 09:02:18', actor: 'ahmad@halaltourism.com',    role: 'Approver', action: 'Approve',            entity: 'Al-Baraka Restaurant',   entityType: 'Place',           detail: 'Approved for publication. Cert verified: CICOT-2024-0012', ip: '192.168.1.10',   session: 'sess_bbb222', status: 'Success' },
  { id: 'EVT-003', timestamp: '2026-06-16 08:45:55', actor: 'system',                   role: 'System',      action: 'Auto-hide Expired',  entity: 'Old Town Kebab House',   entityType: 'Place',           detail: 'Certificate expired 2025-12-31. Listing auto-hidden.',    ip: 'system',         session: 'auto',        status: 'Success' },
  { id: 'EVT-004', timestamp: '2026-06-15 22:10:04', actor: 'reza@halaltourism.com',    role: 'Super Admin', action: 'API Key Action',     entity: 'Mobile App Production',  entityType: 'API Key',         detail: 'Key rotated. Old key deactivated. New key issued.',        ip: '10.0.0.5',       session: 'sess_ccc333', status: 'Success' },
  { id: 'EVT-005', timestamp: '2026-06-15 18:30:40', actor: 'sarah@halaltourism.com',   role: 'Approver', action: 'Return for Correction', entity: 'Phuket Beach Resort', entityType: 'Place',           detail: 'Cert scan illegible. Reason: Low-res PDF submitted.',      ip: '192.168.1.11',   session: 'sess_ddd444', status: 'Success' },
  { id: 'EVT-006', timestamp: '2026-06-15 14:20:00', actor: 'reza@halaltourism.com',    role: 'Super Admin', action: 'Export',             entity: 'All approved places',    entityType: 'Data Export',     detail: 'CSV export of 1842 approved place records.',              ip: '10.0.0.5',       session: 'sess_ccc333', status: 'Success' },
  { id: 'EVT-007', timestamp: '2026-06-15 11:05:33', actor: 'unknown@external.com',     role: 'External Login Attempt', action: 'Login',     entity: 'Admin Portal',           entityType: 'Auth',            detail: 'Failed login: wrong password (3rd attempt).',             ip: '203.45.67.89',   session: 'blocked_login_attempt', status: 'Failed' },
  { id: 'EVT-008', timestamp: '2026-06-15 10:44:12', actor: 'ahmad@halaltourism.com',   role: 'Approver', action: 'Request Docs',       entity: 'Chiang Mai Central Mosque', entityType: 'Place',        detail: 'Requested renewed halal certificate from business.',       ip: '192.168.1.10',   session: 'sess_bbb222', status: 'Success' },
  { id: 'EVT-009', timestamp: '2026-06-14 16:55:00', actor: 'reza@halaltourism.com',    role: 'Super Admin', action: 'Revoke',             entity: 'Old CRM Integration',    entityType: 'API Key',         detail: 'API key revoked. Reason: Integration decommissioned.',     ip: '10.0.0.5',       session: 'sess_eee555', status: 'Success' },
  { id: 'EVT-010', timestamp: '2026-06-14 14:30:55', actor: 'system',                   role: 'System',      action: 'Import',             entity: 'CICOT Certificate API',  entityType: 'Data Import',     detail: '28 records imported. 0 errors.',                           ip: 'system',         session: 'auto',        status: 'Success' },
  { id: 'EVT-011', timestamp: '2026-06-14 09:00:00', actor: 'nurul@halaltourism.com',   role: 'Content Admin (Creator)', action: 'Edit',    entity: 'Halal Tourism Article', entityType: 'Content',          detail: 'Updated body text and hero image for featured article.',   ip: '192.168.1.12',   session: 'sess_fff666', status: 'Success' },
  { id: 'EVT-012', timestamp: '2026-06-13 15:20:10', actor: 'ahmad@halaltourism.com',   role: 'Approver', action: 'Unpublish',          entity: 'Halal Cafe & Bistro',    entityType: 'Place',           detail: 'Unpublished: pending certificate renewal. Admin comment added.', ip: '192.168.1.10', session: 'sess_bbb222', status: 'Success' },
  { id: 'EVT-013', timestamp: '2026-06-13 11:45:00', actor: 'system',                   role: 'System',      action: 'Auto-hide Expired',  entity: 'Halal Seafood Paradise', entityType: 'Place',           detail: 'Certificate expiry warning emailed to business 30 days prior.', ip: 'system',        session: 'auto',        status: 'Warning' },
  { id: 'EVT-014', timestamp: '2026-06-12 10:00:00', actor: 'reza@halaltourism.com',    role: 'Super Admin', action: 'Publish',            entity: 'Grand Halal Restaurant', entityType: 'Place',           detail: 'Restored to published after cert re-upload verified.',     ip: '10.0.0.5',       session: 'sess_ggg777', status: 'Success' },
  { id: 'EVT-015', timestamp: '2026-06-12 09:10:44', actor: 'sarah@halaltourism.com',   role: 'Approver', action: 'Reject',             entity: 'Siam Halal Bakery',      entityType: 'Place',           detail: 'Rejected: duplicate GPS coordinates with existing record.', ip: '192.168.1.11',  session: 'sess_ddd444', status: 'Success' },
  { id: 'EVT-016', timestamp: '2026-06-12 08:44:10', actor: 'ahmad@halaltourism.com',   role: 'Approver', action: 'View Sensitive Data', entity: 'Yana Halal Restaurant',  entityType: 'Security / PDPA', detail: 'Viewed protected halal certificate document. Access allowed by Approver role.', ip: '192.168.1.10', session: 'sess_hhh888', status: 'Success' },
  { id: 'EVT-017', timestamp: '2026-06-12 02:15:00', actor: 'system',                   role: 'System',      action: 'Backup',             entity: 'Document vault snapshot', entityType: 'Security / PDPA', detail: 'Encrypted backup completed and restore point marked available.', ip: 'system', session: 'auto', status: 'Success' },
  { id: 'EVT-018', timestamp: '2026-06-11 16:30:00', actor: 'dpo@gosafar.th',           role: 'Super Admin', action: 'PDPA Request',       entity: 'PDPA-REQ-001',          entityType: 'Security / PDPA', detail: 'Business data access request received and assigned for review.', ip: '10.0.0.5', session: 'sess_iii999', status: 'Warning' },
];

const ACTION_COLORS: Partial<Record<EventType, string>> = {
  'Login':              'bg-blue-50 text-blue-700 border-blue-200',
  'Logout':             'bg-slate-50 text-slate-600 border-slate-200',
  'Approve':            'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Publish':            'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Reject':             'bg-rose-50 text-rose-700 border-rose-200',
  'Revoke':             'bg-rose-50 text-rose-700 border-rose-200',
  'Return for Correction': 'bg-amber-50 text-amber-700 border-amber-200',
  'Request Docs':       'bg-amber-50 text-amber-700 border-amber-200',
  'Auto-hide Expired':  'bg-slate-50 text-slate-600 border-slate-200',
  'Unpublish':          'bg-slate-50 text-slate-600 border-slate-200',
  'Edit':               'bg-purple-50 text-purple-700 border-purple-200',
  'Create Draft':       'bg-purple-50 text-purple-700 border-purple-200',
  'Submit for Review':  'bg-blue-50 text-blue-700 border-blue-200',
  'Schedule':           'bg-violet-50 text-violet-700 border-violet-200',
  'Archive':            'bg-slate-50 text-slate-600 border-slate-200',
  'Restore':            'bg-emerald-50 text-emerald-700 border-emerald-200',
  'View Sensitive Data': 'bg-blue-50 text-blue-700 border-blue-200',
  'PDPA Request':        'bg-purple-50 text-purple-700 border-purple-200',
  'Backup':              'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Import':             'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Export':             'bg-indigo-50 text-indigo-700 border-indigo-200',
  'API Key Action':     'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const SECURITY_PDPA_ACTIONS: EventType[] = ['View Sensitive Data', 'PDPA Request', 'Backup'];

const BASE_ACTIONS: EventType[] = [
  'Login', 'Logout', 'Edit', 'Approve', 'Reject', 'Return for Correction',
  'Import', 'Export', 'Publish', 'Unpublish', 'Revoke', 'API Key Action',
  'Auto-hide Expired', 'Request Docs', 'Create Draft', 'Submit for Review',
  'Schedule', 'Archive', 'Restore'
];

const ALL_ACTIONS: EventType[] = SHOW_SECURITY_PDPA_INDICATORS
  ? [...BASE_ACTIONS, ...SECURITY_PDPA_ACTIONS]
  : BASE_ACTIONS;

const ROLES = ['Super Admin', 'Approver', 'Content Admin (Creator)', 'Data Reviewer', 'Business', 'System'];
const BASE_ENTITY_TYPES = ['Place', 'API Key', 'Data Import', 'Data Export', 'Auth', 'Content', 'Business Account'];
const ENTITY_TYPES = SHOW_SECURITY_PDPA_INDICATORS
  ? [...BASE_ENTITY_TYPES, 'Security / PDPA']
  : BASE_ENTITY_TYPES;

export function AdminAuditLog({ onNavigate, onLogout }: AdminAuditLogProps) {
  const { events: dynamicEvents } = usePrototypeAuditEvents();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterIp, setFilterIp] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const visibleStaticAuditEvents = SHOW_SECURITY_PDPA_INDICATORS
    ? AUDIT_EVENTS
    : AUDIT_EVENTS.filter(event => !SECURITY_PDPA_ACTIONS.includes(event.action) && event.entityType !== 'Security / PDPA');

  const allEvents: AuditEvent[] = [
    ...dynamicEvents.map((event): AuditEvent => ({
      id: event.id,
      timestamp: event.timestamp,
      actor: event.actor,
      role: event.role,
      action: event.action as EventType,
      entity: event.entity,
      entityType: event.entityType,
      detail: [
        event.detail,
        event.statusBefore && event.statusAfter ? `Status: ${event.statusBefore} -> ${event.statusAfter}.` : '',
        event.reason ? `Reason: ${event.reason}` : '',
      ].filter(Boolean).join(' '),
      ip: 'local',
      session: 'prototype',
      status: event.status,
    })),
    ...visibleStaticAuditEvents,
  ];

  const filtered = allEvents.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.actor.includes(q) || e.detail.toLowerCase().includes(q) || e.entity.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
    const matchAction = filterAction === 'all' || e.action === filterAction;
    const matchRole = filterRole === 'all' || e.role === filterRole;
    const matchEntity = filterEntity === 'all' || e.entityType === filterEntity;
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchIp = !filterIp || e.ip.includes(filterIp);
    return matchSearch && matchAction && matchRole && matchEntity && matchStatus && matchIp;
  });

	  const hasActiveFilters = filterAction !== 'all' || filterRole !== 'all' || filterEntity !== 'all' || filterStatus !== 'all' || filterIp;
  const clearFilters = () => { setFilterAction('all'); setFilterRole('all'); setFilterEntity('all'); setFilterStatus('all'); setFilterIp(''); };

  return (
    <AdminLayout activePage="audit-log" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audit Log</h1>
            <p className="text-muted-foreground">Immutable record of all governance actions, system events, and data changes.</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Download className="size-4 mr-2" /> Export Logs</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => toast.info('Exporting as CSV...')}><FileSpreadsheet className="size-4 mr-2" /> Export as .CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Exporting as JSON...')}><FileJson className="size-4 mr-2" /> Export as .JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Exporting as TXT...')}><FileText className="size-4 mr-2" /> Export as .TXT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {SHOW_SECURITY_PDPA_INDICATORS && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="size-5 text-blue-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">Security and PDPA events are included</p>
                  <p className="text-sm text-blue-800">Sensitive document access, export approvals, encrypted backups, and PDPA request actions are traceable here.</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.("security-pdpa")}>
                View PDPA Controls
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-5"><div className="text-2xl font-bold">3,456</div><p className="text-xs text-muted-foreground mt-0.5">Total Events (1-yr retention)</p></CardContent></Card>
          <Card><CardContent className="pt-5"><div className="text-2xl font-bold text-emerald-600">3,420</div><p className="text-xs text-muted-foreground mt-0.5">Successful Operations</p></CardContent></Card>
          <Card><CardContent className="pt-5"><div className="text-2xl font-bold text-rose-600">36</div><p className="text-xs text-muted-foreground mt-0.5">Failed / Flagged Events</p></CardContent></Card>
          <Card><CardContent className="pt-5"><div className="text-2xl font-bold">5</div><p className="text-xs text-muted-foreground mt-0.5">Active Admin Actors</p></CardContent></Card>
        </div>

        {/* Search + Filters */}
        <Card>
          <CardContent className="pt-5 space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search by actor, entity, event ID, or detail..." className="pl-9"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="size-4" /> Filters
                {hasActiveFilters && <span className="size-2 bg-emerald-500 rounded-full" />}
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
                  <X className="size-4 mr-1" /> Clear
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Action</Label>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {ALL_ACTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Role</Label>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Entity Type</Label>
                  <Select value={filterEntity} onValueChange={setFilterEntity}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      {ENTITY_TYPES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Date Range</Label>
                  <Select value={filterDate} onValueChange={setFilterDate}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="year">Last 1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">IP / Session</Label>
                  <Input className="h-8 text-xs" placeholder="e.g. 192.168..." value={filterIp}
                    onChange={e => setFilterIp(e.target.value)} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="size-4" /> Activity Log
              </CardTitle>
	              <p className="text-xs text-muted-foreground">{filtered.length} of {allEvents.length} events</p>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">Timestamp</TableHead>
                  <TableHead>Actor / Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead>IP / Session</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(log => (
                  <TableRow key={log.id} className={log.status === 'Failed' ? 'bg-rose-50/30' : log.status === 'Warning' ? 'bg-amber-50/30' : ''}>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium truncate max-w-32">{log.actor}</p>
                      <p className="text-xs text-muted-foreground">{log.role}</p>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded border font-medium ${ACTION_COLORS[log.action] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium truncate max-w-36">{log.entity}</p>
                      <p className="text-xs text-muted-foreground">{log.entityType}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate" title={log.detail}>
                      {log.detail}
                    </TableCell>
                    <TableCell>
                      <p className="font-mono text-xs">{log.ip}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.session}</p>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                        log.status === 'Success' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        log.status === 'Failed' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                        'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>{log.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No events match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-800">
              <ShieldAlert className="size-4" /> Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-amber-700">
            <p>• Failed login attempt detected from IP <strong>203.45.67.89</strong> at 11:05:33 — 3rd consecutive failure.</p>
            <p>• Web Dashboard API key rate limit at 82% capacity. Consider increasing limit or investigating usage spike.</p>
            <p>• 2 listings auto-hidden this week due to expired certificates. Businesses notified.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
