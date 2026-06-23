import { AdminLayout, ROLE_PERMISSIONS } from "../components/admin-layout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Archive,
  CheckCircle,
  Clock,
  DatabaseBackup,
  Download,
  FileKey2,
  FileText,
  HardDriveDownload,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

interface AdminSecurityPDPAProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const ROLE_ROWS = [
  {
    role: "Super Admin",
    scope: "Full governance, user access, API keys, export approval, backup restore.",
    sensitive: "Full access with audit trail",
  },
  {
    role: "Place Manager",
    scope: "Review entrepreneur submissions, certification documents, contact data, and publish status.",
    sensitive: "Business contact and certificate documents only",
  },
  {
    role: "Content Manager",
    scope: "Manage content, article workflow, content moderation, and public communication.",
    sensitive: "No certificate document access",
  },
];

const DOCUMENT_POLICIES = [
  { item: "Halal certificates", storage: "Encrypted object storage", access: "Super Admin, Place Manager", retention: "Active period + audit archive", status: "Protected" },
  { item: "Business registration", storage: "Encrypted object storage", access: "Super Admin, Place Manager", retention: "Account lifetime + legal archive", status: "Protected" },
  { item: "Contact phone/email", storage: "Masked in review panels", access: "Need-to-know by workflow", retention: "Until account deletion request is approved", status: "Restricted" },
  { item: "Export files", storage: "Time-limited download package", access: "Super Admin approval", retention: "30 days then auto-expire", status: "Controlled" },
];

const EXPORT_CONTROLS = [
  { control: "Export reason required", owner: "Super Admin", evidence: "Reason, requester, scope, timestamp" },
  { control: "Sensitive fields masked by default", owner: "System", evidence: "Phone/email/certificate number masking" },
  { control: "Download expiry", owner: "System", evidence: "Export package expires after 30 days" },
  { control: "Audit event generated", owner: "System", evidence: "Export logged in Security Audit and Audit Log" },
];

const BACKUP_POLICIES = [
  { name: "Daily encrypted backup", cadence: "Daily 02:00", lastRun: "2026-06-23 02:00", restorePoint: "Available", status: "Healthy" },
  { name: "Monthly compliance archive", cadence: "Monthly", lastRun: "2026-06-01 02:30", restorePoint: "Available", status: "Healthy" },
  { name: "Document vault snapshot", cadence: "Daily 02:15", lastRun: "2026-06-23 02:15", restorePoint: "Available", status: "Healthy" },
];

const SECURITY_EVENTS = [
  { id: "SEC-001", time: "2026-06-23 09:10", actor: "Super Admin", action: "Export approved", target: "All approved places", result: "Success" },
  { id: "SEC-002", time: "2026-06-23 08:42", actor: "Place Manager", action: "Viewed certificate document", target: "Yana Halal Restaurant", result: "Success" },
  { id: "SEC-003", time: "2026-06-22 17:20", actor: "System", action: "Backup completed", target: "Document vault snapshot", result: "Success" },
  { id: "SEC-004", time: "2026-06-22 15:05", actor: "Content Manager", action: "Denied certificate access", target: "Phuket Beach Resort", result: "Blocked" },
];

const PDPA_REQUESTS = [
  { id: "PDPA-REQ-001", requester: "Yana Hospitality Group", type: "Access request", dataScope: "Business profile and submission records", status: "In Review", due: "2026-06-30" },
  { id: "PDPA-REQ-002", requester: "Phuket Beach Resort", type: "Correction request", dataScope: "Contact email and authorized person", status: "Received", due: "2026-07-02" },
  { id: "PDPA-REQ-003", requester: "Chiang Mai Cafe", type: "Withdraw consent", dataScope: "Marketing communication", status: "Completed", due: "2026-06-20" },
];

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    Protected: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Restricted: "bg-blue-100 text-blue-700 border-blue-200",
    Controlled: "bg-purple-100 text-purple-700 border-purple-200",
    Healthy: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "In Review": "bg-blue-100 text-blue-700 border-blue-200",
    Received: "bg-amber-100 text-amber-700 border-amber-200",
    Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Blocked: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return <Badge variant="outline" className={colors[status] ?? "bg-slate-100 text-slate-700 border-slate-200"}>{status}</Badge>;
}

export function AdminSecurityPDPA({ onNavigate, onLogout }: AdminSecurityPDPAProps) {
  const coverage = [
    { label: "RBAC roles", value: "3", note: "Minimum role set" },
    { label: "Sensitive data controls", value: "4", note: "Documents, contacts, exports, audit" },
    { label: "Backup restore points", value: "3", note: "Mock compliance evidence" },
    { label: "Open PDPA requests", value: "2", note: "1 completed" },
  ];

  return (
    <AdminLayout activePage="security-pdpa" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Security & PDPA</h1>
            <p className="text-muted-foreground">
              Governance controls for entrepreneur data, certification documents, contact information, exports, backups, and auditability.
            </p>
          </div>
          <Button onClick={() => toast.info("Security control report generated")}>
            <Download className="size-4 mr-2" /> Export Control Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {coverage.map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="access" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto">
            <TabsTrigger value="access"><UserCheck className="size-3.5 mr-1" /> Access Control</TabsTrigger>
            <TabsTrigger value="documents"><FileKey2 className="size-3.5 mr-1" /> Secure Documents</TabsTrigger>
            <TabsTrigger value="exports"><HardDriveDownload className="size-3.5 mr-1" /> Import / Export</TabsTrigger>
            <TabsTrigger value="backup"><DatabaseBackup className="size-3.5 mr-1" /> Backup</TabsTrigger>
            <TabsTrigger value="audit"><ShieldCheck className="size-3.5 mr-1" /> Audit Log</TabsTrigger>
            <TabsTrigger value="requests"><FileText className="size-3.5 mr-1" /> PDPA Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle>Access Control / RBAC</CardTitle>
                <CardDescription>Minimum role set with responsibilities moved into three admin roles.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Responsibilities</TableHead>
                      <TableHead>Sensitive Access</TableHead>
                      <TableHead>Key Permissions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ROLE_ROWS.map((row) => {
                      const perms = ROLE_PERMISSIONS[row.role as keyof typeof ROLE_PERMISSIONS];
                      return (
                        <TableRow key={row.role}>
                          <TableCell className="font-semibold">{row.role}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{row.scope}</TableCell>
                          <TableCell className="text-sm">{row.sensitive}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(perms).filter(([, allowed]) => allowed).slice(0, 4).map(([perm]) => (
                                <Badge key={perm} variant="outline" className="text-xs">{perm}</Badge>
                              ))}
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

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Secure Document Storage</CardTitle>
                <CardDescription>Protected handling for certification files, business documents, and contact data.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data / File</TableHead>
                      <TableHead>Storage Control</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Retention</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DOCUMENT_POLICIES.map((policy) => (
                      <TableRow key={policy.item}>
                        <TableCell className="font-medium">{policy.item}</TableCell>
                        <TableCell className="text-sm">{policy.storage}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{policy.access}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{policy.retention}</TableCell>
                        <TableCell>{statusBadge(policy.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exports">
            <Card>
              <CardHeader>
                <CardTitle>Import / Export Governance</CardTitle>
                <CardDescription>Controls for data movement, reporting exports, and partner data sharing.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {EXPORT_CONTROLS.map((control) => (
                  <div key={control.control} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <KeyRound className="size-4 text-blue-600" />
                      <p className="font-semibold">{control.control}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Owner: {control.owner}</p>
                    <p className="text-xs text-muted-foreground mt-2">Evidence: {control.evidence}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Retention</CardTitle>
                <CardDescription>Mock restore points and retention evidence for operational continuity.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {BACKUP_POLICIES.map((policy) => (
                    <div key={policy.name} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-lg border p-4">
                      <div>
                        <p className="font-semibold flex items-center gap-2"><DatabaseBackup className="size-4 text-emerald-600" /> {policy.name}</p>
                        <p className="text-sm text-muted-foreground">Cadence: {policy.cadence} · Last run: {policy.lastRun}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusBadge(policy.status)}
                        <Badge variant="outline"><Archive className="size-3 mr-1" /> {policy.restorePoint}</Badge>
                        <Button size="sm" variant="outline" onClick={() => toast.info(`Restore simulation opened for ${policy.name}`)}>
                          <RotateCcw className="size-3 mr-1" /> Test Restore
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Security Audit</CardTitle>
                <CardDescription>Security-specific event trail for sensitive access, exports, denials, and backups.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event ID</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SECURITY_EVENTS.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell><code className="text-xs">{event.id}</code></TableCell>
                        <TableCell className="text-sm">{event.time}</TableCell>
                        <TableCell>{event.actor}</TableCell>
                        <TableCell>{event.action}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{event.target}</TableCell>
                        <TableCell>{statusBadge(event.result)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>PDPA Request Handling</CardTitle>
                <CardDescription>Operational queue for data subject access, correction, deletion, objection, and consent withdrawal.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Data Scope</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PDPA_REQUESTS.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell><code className="text-xs">{request.id}</code></TableCell>
                        <TableCell className="font-medium">{request.requester}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{request.dataScope}</TableCell>
                        <TableCell className="text-sm">{request.due}</TableCell>
                        <TableCell>{statusBadge(request.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 flex gap-3">
                  <LockKeyhole className="size-5 shrink-0 mt-0.5" />
                  <p>
                    PDPA requests should be logged with requester identity, lawful basis, affected data scope, decision reason, completion date, and audit evidence.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
