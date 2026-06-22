import { AdminLayout } from "../components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../components/ui/dialog";
import {
  Key, Plus, Copy, Trash2, RefreshCw, AlertTriangle, CheckCircle,
  XCircle, Activity, Shield, Clock, BarChart3, AlertCircle, Eye,
  EyeOff, Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminAPIKeysProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  expiry: string;
  lastUsed: string;
  status: 'Active' | 'Inactive' | 'Revoked' | 'Expiring';
  usageCount: number;
  rateLimit: number;
  rateLimitUsed: number;
  dataScope: string[];
  health: 'Healthy' | 'Warning' | 'Error';
  errorCount: number;
  owner: string;
}

const INITIAL_KEYS: APIKey[] = [
  {
    id: '1', name: 'Mobile App Production',
    key: 'pk_live_abc123...xyz789',
    created: '2026-01-15', expiry: '2027-01-15',
    lastUsed: '2 hours ago', status: 'Active',
    usageCount: 12345, rateLimit: 10000, rateLimitUsed: 3450,
    dataScope: ['Read Places', 'Search', 'Read Reviews'],
    health: 'Healthy', errorCount: 2, owner: 'Mobile Team'
  },
  {
    id: '2', name: 'Web Dashboard Internal',
    key: 'pk_live_def456...uvw012',
    created: '2026-01-10', expiry: '2027-01-10',
    lastUsed: '5 minutes ago', status: 'Active',
    usageCount: 45678, rateLimit: 50000, rateLimitUsed: 41200,
    dataScope: ['Read Places', 'Write Places', 'Read Reviews', 'User Management'],
    health: 'Warning', errorCount: 18, owner: 'Web Team'
  },
  {
    id: '3', name: 'TAT Data Sharing Partner',
    key: 'pk_live_ghi789...rst345',
    created: '2025-12-20', expiry: '2026-07-01',
    lastUsed: '3 days ago', status: 'Expiring',
    usageCount: 2890, rateLimit: 5000, rateLimitUsed: 890,
    dataScope: ['Read Places', 'Search'],
    health: 'Healthy', errorCount: 0, owner: 'Partnerships'
  },
  {
    id: '4', name: 'Development / Staging',
    key: 'pk_test_jkl012...opq678',
    created: '2025-11-05', expiry: '2026-11-05',
    lastUsed: 'Never', status: 'Inactive',
    usageCount: 0, rateLimit: 1000, rateLimitUsed: 0,
    dataScope: ['Read Places', 'Search'],
    health: 'Healthy', errorCount: 0, owner: 'Dev Team'
  },
  {
    id: '5', name: 'Old CRM Integration',
    key: 'pk_live_zzz000...aaa111',
    created: '2024-06-01', expiry: '2025-06-01',
    lastUsed: '8 months ago', status: 'Revoked',
    usageCount: 8900, rateLimit: 5000, rateLimitUsed: 0,
    dataScope: ['Read Places'],
    health: 'Error', errorCount: 0, owner: 'Legacy'
  },
];

const ERROR_LOGS = [
  { keyId: '2', time: '2026-06-16 08:45:12', code: 429, message: 'Rate limit exceeded', endpoint: '/places/search', count: 12 },
  { keyId: '2', time: '2026-06-15 22:10:04', code: 403, message: 'Forbidden: scope not allowed', endpoint: '/admin/users', count: 4 },
  { keyId: '2', time: '2026-06-14 14:30:55', code: 500, message: 'Internal server error', endpoint: '/places/bulk-update', count: 2 },
  { keyId: '1', time: '2026-06-16 06:12:00', code: 404, message: 'Place not found', endpoint: '/places/99999', count: 2 },
];

const HEALTH_CONFIG = {
  Healthy: { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: <CheckCircle className="size-3.5" /> },
  Warning: { color: 'text-amber-600',   bg: 'bg-amber-100',   icon: <AlertTriangle className="size-3.5" /> },
  Error:   { color: 'text-rose-600',    bg: 'bg-rose-100',    icon: <XCircle className="size-3.5" /> },
};

const STATUS_CONFIG = {
  Active:   { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Expiring: { badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  Inactive: { badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  Revoked:  { badge: 'bg-rose-100 text-rose-600 border-rose-200' },
};

export function AdminAPIKeys({ onNavigate, onLogout }: AdminAPIKeysProps) {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);

  const handleRevoke = (id: string, name: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'Revoked' as const } : k));
    toast.success(`API key "${name}" has been revoked.`);
  };

  const handleRotate = (id: string, name: string) => {
    toast.success(`New key generated for "${name}". Old key deactivated.`);
  };

  const totalRequests = keys.reduce((sum, k) => sum + k.usageCount, 0);
  const activeKeys = keys.filter(k => k.status === 'Active').length;
  const errorKeys = keys.filter(k => k.health !== 'Healthy' && k.status !== 'Revoked').length;
  const expiringKeys = keys.filter(k => k.status === 'Expiring').length;

  return (
    <AdminLayout activePage="api-keys" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Open API Key Management</h1>
            <p className="text-muted-foreground">Manage API access, rate limits, data scope, and health monitoring.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="size-4 mr-2" /> Generate New Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New API Key</DialogTitle>
                <DialogDescription>Configure access scope and rate limits for the new key.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Key Name *</Label>
                  <Input placeholder="e.g. Partner Portal Integration" />
                </div>
                <div className="space-y-2">
                  <Label>Owner / Team</Label>
                  <Input placeholder="e.g. Partnerships Team" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                      <option>Production (pk_live_)</option>
                      <option>Test (pk_test_)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rate Limit (req/day)</Label>
                    <Input type="number" defaultValue={5000} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Data Scope</Label>
                  <div className="border rounded-md p-3 space-y-2">
                    {['Read Places', 'Search', 'Write Places', 'Read Reviews', 'User Management', 'Export Data'].map(scope => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" defaultChecked={scope.startsWith('Read')} />
                        {scope}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogTrigger asChild><Button variant="outline">Cancel</Button></DialogTrigger>
                <Button onClick={() => toast.success('New API key generated successfully')}>Generate Key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5">
              <div className="text-2xl font-bold text-emerald-600">{activeKeys}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Active Keys</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Total Requests (all time)</p>
            </CardContent>
          </Card>
          <Card className={expiringKeys > 0 ? 'border-amber-200' : ''}>
            <CardContent className="pt-5">
              <div className={`text-2xl font-bold ${expiringKeys > 0 ? 'text-amber-600' : ''}`}>{expiringKeys}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Keys Expiring Soon</p>
            </CardContent>
          </Card>
          <Card className={errorKeys > 0 ? 'border-rose-200' : ''}>
            <CardContent className="pt-5">
              <div className={`text-2xl font-bold ${errorKeys > 0 ? 'text-rose-600' : ''}`}>{errorKeys}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Keys with Alerts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="keys">
          <TabsList>
            <TabsTrigger value="keys"><Key className="size-3.5 mr-1.5" /> API Keys</TabsTrigger>
            <TabsTrigger value="errors">
              <AlertCircle className="size-3.5 mr-1.5" /> Error Log
              <span className="ml-1.5 bg-rose-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                {ERROR_LOGS.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Keys Table */}
          <TabsContent value="keys" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Status / Health</TableHead>
                      <TableHead>Usage / Rate Limit</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Data Scope</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map(k => {
                      const healthCfg = HEALTH_CONFIG[k.health];
                      const statusCfg = STATUS_CONFIG[k.status];
                      const usagePct = Math.round((k.rateLimitUsed / k.rateLimit) * 100);
                      return (
                        <TableRow key={k.id} className={k.status === 'Revoked' ? 'opacity-50' : ''}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{k.name}</p>
                              <p className="text-xs text-muted-foreground">{k.owner}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono">
                                {showKey === k.id ? k.key : k.key.slice(0, 12) + '...'}
                              </code>
                              <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} className="text-slate-400 hover:text-slate-600">
                                {showKey === k.id ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                              </button>
                              <button onClick={() => { navigator.clipboard.writeText(k.key); toast.success('Copied'); }} className="text-slate-400 hover:text-slate-600">
                                <Copy className="size-3.5" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${statusCfg.badge}`}>
                                {k.status}
                              </span>
                              <div className={`flex items-center gap-1 text-xs ${healthCfg.color}`}>
                                {healthCfg.icon} {k.health}
                                {k.errorCount > 0 && <span className="ml-1">({k.errorCount} errors)</span>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-32 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{k.rateLimitUsed.toLocaleString()}</span>
                                <span className="text-muted-foreground">/{k.rateLimit.toLocaleString()}/day</span>
                              </div>
                              <Progress value={usagePct} className={`h-1.5 ${usagePct > 80 ? '[&>div]:bg-amber-500' : ''}`} />
                              <p className="text-xs text-muted-foreground">{k.usageCount.toLocaleString()} total</p>
                            </div>
                          </TableCell>
                          <TableCell className={`text-xs ${k.status === 'Expiring' ? 'text-amber-600 font-semibold' : 'text-muted-foreground'}`}>
                            {k.expiry}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{k.lastUsed}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-40">
                              {k.dataScope.map(s => (
                                <span key={s} className="text-xs px-1.5 py-0.5 bg-slate-100 rounded border text-slate-600">{s}</span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {k.status !== 'Revoked' && (
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" className="text-xs h-7"
                                  onClick={() => handleRotate(k.id, k.name)}>
                                  <RefreshCw className="size-3 mr-1" /> Rotate
                                </Button>
                                <Button variant="ghost" size="sm" className="text-xs h-7 text-rose-600 hover:text-rose-700"
                                  onClick={() => handleRevoke(k.id, k.name)}>
                                  <Trash2 className="size-3 mr-1" /> Revoke
                                </Button>
                              </div>
                            )}
                            {k.status === 'Revoked' && (
                              <span className="text-xs text-muted-foreground">Revoked</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Log */}
          <TabsContent value="errors" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Error Log</CardTitle>
                <CardDescription>Recent errors grouped by API key. Use this to diagnose integration issues.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Status Code</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ERROR_LOGS.map((e, i) => {
                      const k = keys.find(k => k.id === e.keyId);
                      return (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs">{e.time}</TableCell>
                          <TableCell className="text-xs font-medium">{k?.name ?? '—'}</TableCell>
                          <TableCell>
                            <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${
                              e.code >= 500 ? 'bg-rose-100 text-rose-700' :
                              e.code === 429 ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>{e.code}</span>
                          </TableCell>
                          <TableCell className="text-sm">{e.message}</TableCell>
                          <TableCell><code className="text-xs">{e.endpoint}</code></TableCell>
                          <TableCell className="font-semibold text-sm">{e.count}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-start gap-3">
                <Zap className="size-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Health Check Endpoint</p>
                  <code className="text-xs bg-blue-100 px-2 py-0.5 rounded">GET https://api.halaltourism.com/v1/health?key=YOUR_KEY</code>
                  <p className="mt-1.5 text-xs text-blue-700">Returns key status, remaining rate limit, and last activity. Use this to monitor integrations proactively.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
