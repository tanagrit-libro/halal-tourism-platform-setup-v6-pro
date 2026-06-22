import { AdminLayout } from "../components/admin-layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../components/ui/table";
import {
  Plus, Search, Edit, Trash2, ShieldCheck, Database, Building2,
  Tag, BarChart3, FileInput, FileOutput, Handshake, CheckCircle,
  AlertCircle, Clock, Download, Upload
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminMasterDataProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const CERTIFYING_AGENCIES = [
  { id: 1, code: 'CICOT',   name: 'Central Islamic Council of Thailand',      country: 'Thailand', status: 'Active',   certCount: 845 },
  { id: 2, code: 'IHC',     name: 'Islamic Halal Certification of Thailand',  country: 'Thailand', status: 'Active',   certCount: 312 },
  { id: 3, code: 'MUIS',    name: 'Majlis Ugama Islam Singapura',             country: 'Singapore', status: 'Active',  certCount: 128 },
  { id: 4, code: 'JAKIM',   name: 'Jabatan Kemajuan Islam Malaysia',          country: 'Malaysia', status: 'Active',   certCount: 94 },
  { id: 5, code: 'HMA',     name: 'Halal Media Australia',                    country: 'Australia', status: 'Inactive', certCount: 0 },
];

const DATA_SOURCES = [
  { id: 1, name: 'TAT Official Database',    type: 'Government', lastSync: '2026-06-15', recordCount: 1240, status: 'Active' },
  { id: 2, name: 'DBD Business Registry',    type: 'Government', lastSync: '2026-06-14', recordCount: 3450, status: 'Active' },
  { id: 3, name: 'CICOT Certificate API',    type: 'API',        lastSync: '2026-06-16', recordCount: 845,  status: 'Active' },
  { id: 4, name: 'Entrepreneur Portal',      type: 'Internal',   lastSync: '2026-06-16', recordCount: 234,  status: 'Active' },
  { id: 5, name: 'Legacy CSV Import (2024)', type: 'File',       lastSync: '2024-12-01', recordCount: 502,  status: 'Archived' },
];

const CERT_TYPES = [
  { id: 1, code: 'HAL-FOOD',    label: 'Halal Food Certificate',       level: 3, validYears: 2 },
  { id: 2, code: 'HAL-HOTEL',   label: 'Halal Friendly Hotel',         level: 2, validYears: 1 },
  { id: 3, code: 'MUSLIM-FRND', label: 'Muslim-Friendly Certificate',  level: 1, validYears: 1 },
  { id: 4, code: 'SHA',         label: 'SHA Safety & Health Standard', level: 2, validYears: 1 },
  { id: 5, code: 'HAL-TOUR',    label: 'Halal Tourism Certificate',    level: 3, validYears: 2 },
];

const VERIFICATION_LEVELS = [
  { level: 1, name: 'Self-Declared',      description: 'Business self-reports facilities. No third-party verification.',   color: 'text-slate-600',   bg: 'bg-slate-100' },
  { level: 2, name: 'Document Verified',  description: 'Admin reviews uploaded documents. Manual sign-off required.',      color: 'text-amber-700',   bg: 'bg-amber-100' },
  { level: 3, name: 'Source Certified',   description: 'Linked to official certification body (CICOT/JAKIM/MUIS etc.).',   color: 'text-emerald-700', bg: 'bg-emerald-100' },
  { level: 4, name: 'Field Inspected',    description: 'Physical on-site inspection completed by certified auditor.',      color: 'text-blue-700',    bg: 'bg-blue-100' },
];

const IMPORT_BATCHES = [
  { id: 'IMP-2026-06', date: '2026-06-14', source: 'CICOT Certificate API', records: 28,  status: 'Completed', errors: 0 },
  { id: 'IMP-2026-05', date: '2026-05-30', source: 'TAT Official Database', records: 115, status: 'Completed', errors: 3 },
  { id: 'IMP-2026-04', date: '2026-04-15', source: 'DBD Business Registry', records: 204, status: 'Completed', errors: 7 },
  { id: 'IMP-2026-03', date: '2026-03-01', source: 'Entrepreneur Portal',   records: 42,  status: 'Completed', errors: 0 },
];

const EXPORT_BATCHES = [
  { id: 'EXP-2026-06', date: '2026-06-15', requestedBy: 'Ahmad (Approver)', format: 'CSV',  scope: 'All approved places',   records: 1842, status: 'Ready' },
  { id: 'EXP-2026-05', date: '2026-05-31', requestedBy: 'Super Admin',      format: 'JSON', scope: 'Cert expiry report',    records: 37,   status: 'Ready' },
  { id: 'EXP-2026-04', date: '2026-04-20', requestedBy: 'Data Reviewer',    format: 'CSV',  scope: 'Pending review queue',  records: 29,   status: 'Ready' },
];

const DATA_SHARING = [
  { id: 'DSA-001', partner: 'Tourism Authority of Thailand (TAT)', purpose: 'Joint promotion portal', scope: 'Published listings, ratings', expiry: '2027-01-01', status: 'Active' },
  { id: 'DSA-002', partner: 'Grab Thailand',                        purpose: 'Restaurant discovery API', scope: 'Name, address, type, halal status', expiry: '2026-12-31', status: 'Active' },
  { id: 'DSA-003', partner: 'Agoda',                                purpose: 'Hotel listing integration', scope: 'Hotel listings only', expiry: '2026-06-30', status: 'Expiring' },
];

export function AdminMasterData({ onNavigate, onLogout }: AdminMasterDataProps) {
  const [search, setSearch] = useState('');

  return (
    <AdminLayout activePage="master-data" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Master Data & Source Governance</h1>
            <p className="text-muted-foreground">Manage reference data, certification authorities, data sources, and sharing agreements.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('Export initiated')} className="flex items-center gap-2">
              <Download className="size-4" /> Export
            </Button>
            <Button onClick={() => toast.info('Import wizard opened')} className="flex items-center gap-2">
              <Upload className="size-4" /> Import Batch
            </Button>
          </div>
        </div>

        <Tabs defaultValue="agencies">
          <TabsList className="flex flex-wrap gap-1 h-auto">
            <TabsTrigger value="agencies" className="flex items-center gap-1.5"><Building2 className="size-3.5" /> Certifying Agencies</TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-1.5"><Database className="size-3.5" /> Data Sources</TabsTrigger>
            <TabsTrigger value="certtypes" className="flex items-center gap-1.5"><Tag className="size-3.5" /> Certification Types</TabsTrigger>
            <TabsTrigger value="levels" className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Verification Levels</TabsTrigger>
            <TabsTrigger value="batches" className="flex items-center gap-1.5"><BarChart3 className="size-3.5" /> Import / Export</TabsTrigger>
            <TabsTrigger value="agreements" className="flex items-center gap-1.5"><Handshake className="size-3.5" /> Data Sharing</TabsTrigger>
          </TabsList>

          {/* Certifying Agencies */}
          <TabsContent value="agencies" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Certifying Agencies</CardTitle>
                  <CardDescription>Recognised bodies whose certificates are accepted for source record verification.</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast.info('Add agency form')}><Plus className="size-4 mr-1" /> Add Agency</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Linked Certs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CERTIFYING_AGENCIES.map(a => (
                      <TableRow key={a.id}>
                        <TableCell><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{a.code}</code></TableCell>
                        <TableCell className="font-medium">{a.name}</TableCell>
                        <TableCell>{a.country}</TableCell>
                        <TableCell>{a.certCount}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${a.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {a.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="size-7"><Edit className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="size-7 text-rose-500"><Trash2 className="size-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources */}
          <TabsContent value="sources" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Data Sources</CardTitle>
                  <CardDescription>External and internal data feeds that populate the place database.</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast.info('Add source form')}><Plus className="size-4 mr-1" /> Add Source</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DATA_SOURCES.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            s.type === 'Government' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            s.type === 'API' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            s.type === 'Internal' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>{s.type}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.lastSync}</TableCell>
                        <TableCell>{s.recordCount.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            s.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>{s.status}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-xs h-7 mr-1" onClick={() => toast.info(`Sync triggered for ${s.name}`)}>
                            Sync Now
                          </Button>
                          <Button variant="ghost" size="icon" className="size-7"><Edit className="size-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certification Types */}
          <TabsContent value="certtypes" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Certification Types</CardTitle>
                  <CardDescription>Accepted certificate categories with associated verification levels and validity periods.</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast.info('Add cert type')}><Plus className="size-4 mr-1" /> Add Type</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Verification Level</TableHead>
                      <TableHead>Valid (Years)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CERT_TYPES.map(c => (
                      <TableRow key={c.id}>
                        <TableCell><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{c.code}</code></TableCell>
                        <TableCell className="font-medium">{c.label}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            c.level === 3 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            c.level === 2 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>Level {c.level}</span>
                        </TableCell>
                        <TableCell>{c.validYears} year{c.validYears > 1 ? 's' : ''}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="size-7"><Edit className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="size-7 text-rose-500"><Trash2 className="size-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Levels */}
          <TabsContent value="levels" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VERIFICATION_LEVELS.map(v => (
                <Card key={v.level} className={`border-l-4 ${v.level === 1 ? 'border-l-slate-400' : v.level === 2 ? 'border-l-amber-400' : v.level === 3 ? 'border-l-emerald-500' : 'border-l-blue-500'}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${v.bg} ${v.color}`}>Level {v.level}</span>
                      <ShieldCheck className={`size-5 ${v.color}`} />
                    </div>
                    <h3 className="font-semibold text-base mb-1">{v.name}</h3>
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 px-1">Verification levels are assigned per listing and control the trust badge displayed to tourists.</p>
          </TabsContent>

          {/* Import/Export Batches */}
          <TabsContent value="batches" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileInput className="size-5 text-blue-500" /> Import Batches</CardTitle>
                <CardDescription>History of data imported into the platform from external sources.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {IMPORT_BATCHES.map(b => (
                      <TableRow key={b.id}>
                        <TableCell><code className="text-xs">{b.id}</code></TableCell>
                        <TableCell className="text-sm">{b.date}</TableCell>
                        <TableCell className="font-medium">{b.source}</TableCell>
                        <TableCell>{b.records}</TableCell>
                        <TableCell>
                          <span className={b.errors > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600'}>{b.errors}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">{b.status}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileOutput className="size-5 text-purple-500" /> Export Batches</CardTitle>
                <CardDescription>Data exports generated by admin users for reporting and compliance.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead className="text-right">Download</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {EXPORT_BATCHES.map(b => (
                      <TableRow key={b.id}>
                        <TableCell><code className="text-xs">{b.id}</code></TableCell>
                        <TableCell className="text-sm">{b.date}</TableCell>
                        <TableCell>{b.requestedBy}</TableCell>
                        <TableCell><code className="text-xs bg-slate-100 px-1 rounded">{b.format}</code></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{b.scope}</TableCell>
                        <TableCell>{b.records.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Downloading ${b.id}`)}>
                            <Download className="size-3 mr-1" /> Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sharing Agreements */}
          <TabsContent value="agreements" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Data Sharing Agreements</CardTitle>
                  <CardDescription>Formal agreements governing data shared with third-party partners.</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast.info('Add agreement')}><Plus className="size-4 mr-1" /> New Agreement</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DATA_SHARING.map(d => (
                    <div key={d.id} className={`p-4 rounded-lg border ${d.status === 'Expiring' ? 'border-amber-200 bg-amber-50' : 'border-slate-200'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{d.id}</code>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                              d.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                            }`}>{d.status}</span>
                          </div>
                          <p className="font-semibold">{d.partner}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{d.purpose}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                            <span>Data scope: <strong className="text-foreground">{d.scope}</strong></span>
                            <span>Expires: <strong className={d.status === 'Expiring' ? 'text-amber-700' : 'text-foreground'}>{d.expiry}</strong></span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="outline" size="sm" className="h-7 text-xs"><Edit className="size-3 mr-1" /> Edit</Button>
                          {d.status === 'Expiring' && (
                            <Button size="sm" className="h-7 text-xs bg-amber-600 hover:bg-amber-700">Renew</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
