import { AdminLayout } from "../components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  CheckCircle2, Clock, RotateCcw, AlertTriangle, XCircle, EyeOff,
  Inbox, FileText, ArrowUpRight, Activity, Users, RefreshCw,
  ChevronRight, CalendarDays, Upload
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar
} from "recharts";
import { Progress } from "../components/ui/progress";
import { useLanguage } from "../context/LanguageContext";

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const STATUS_CARDS = [
  { label: 'Published',      count: 1842, color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200', icon: CheckCircle2 },
  { label: 'Pending Review', count: 37,   color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200',   icon: Clock },
  { label: 'Returned',       count: 12,   color: 'text-rose-600',    bg: 'bg-rose-50',     border: 'border-rose-200',    icon: RotateCcw },
  { label: 'Expiring Soon',  count: 28,   color: 'text-orange-600',  bg: 'bg-orange-50',   border: 'border-orange-200',  icon: AlertTriangle },
  { label: 'Expired',        count: 9,    color: 'text-slate-600',   bg: 'bg-slate-50',    border: 'border-slate-200',   icon: XCircle },
  { label: 'Hidden',         count: 14,   color: 'text-slate-500',   bg: 'bg-slate-50',    border: 'border-slate-200',   icon: EyeOff },
  { label: 'Stale Queue',    count: 5,    color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200',     icon: Inbox },
];

const TASK_QUEUE = [
  { id: 1, label: 'New Submissions',         count: 8,  urgency: 'high',   page: 'places',     desc: 'Awaiting initial review' },
  { id: 2, label: 'Pending Review',          count: 29, urgency: 'high',   page: 'moderation', desc: 'In-progress verifications' },
  { id: 3, label: 'Returned for Correction', count: 12, urgency: 'medium', page: 'moderation', desc: 'Entrepreneur action needed' },
  { id: 4, label: 'Expiring Documents',      count: 28, urgency: 'medium', page: 'places',     desc: 'Certificates due within 30 days' },
  { id: 5, label: 'Expired Documents',       count: 9,  urgency: 'high',   page: 'places',     desc: 'Auto-hidden listings' },
  { id: 6, label: 'Recently Modified Records', count: 15, urgency: 'low', page: 'audit-log',  desc: 'Edited within last 24h' },
];

const trafficData = [
  { time: '00:00', visitors: 120 },
  { time: '04:00', visitors: 80 },
  { time: '08:00', visitors: 450 },
  { time: '12:00', visitors: 980 },
  { time: '16:00', visitors: 850 },
  { time: '20:00', visitors: 600 },
  { time: '23:59', visitors: 300 },
];

const submissionData = [
  { day: 'Mon', approved: 12, rejected: 2 },
  { day: 'Tue', approved: 15, rejected: 3 },
  { day: 'Wed', approved: 20, rejected: 1 },
  { day: 'Thu', approved: 18, rejected: 4 },
  { day: 'Fri', approved: 25, rejected: 2 },
  { day: 'Sat', approved: 10, rejected: 0 },
  { day: 'Sun', approved: 8,  rejected: 1 },
];

const recentActivity = [
  { id: 1, actor: 'Ahmad (Approver)', action: 'Approved for publication', target: 'Yana Halal Restaurant',     time: '5 min ago',  type: 'approve' },
  { id: 2, actor: 'System',              action: 'Auto-hidden expired listing', target: 'Old Town Kebab House',    time: '12 min ago', type: 'auto-hide' },
  { id: 3, actor: 'Sarah (Approver)', action: 'Returned for correction',    target: 'Phuket Beach Resort',      time: '28 min ago', type: 'return' },
  { id: 4, actor: 'Entrepreneur',        action: 'New submission',             target: 'Chiang Mai Halal Cafe',    time: '1 hr ago',   type: 'submit' },
  { id: 5, actor: 'Reza (Super Admin)',  action: 'API key rotated',            target: 'Mobile App Production',    time: '2 hr ago',   type: 'api' },
];

const activityColor: Record<string, string> = {
  approve: 'text-emerald-500',
  'auto-hide': 'text-slate-500',
  return: 'text-rose-500',
  submit: 'text-blue-500',
  api: 'text-purple-500',
};

const urgencyBadge: Record<string, string> = {
  high: 'bg-rose-100 text-rose-700 border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  const { t } = useLanguage();

  return (
    <AdminLayout activePage="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('admin.dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('admin.dashboard.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate?.('reports')}>
              {t('nav.reports')}
            </Button>
            <Button onClick={() => onNavigate?.('moderation')}>
              {t('nav.moderation')} (37)
            </Button>
          </div>
        </div>

        {/* Listing Status Summary — 7 cards */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Listing Status Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {STATUS_CARDS.map(({ label, count, color, bg, border, icon: Icon }) => (
              <Card key={label} className={`border ${border} ${bg} hover:shadow-sm transition-shadow cursor-pointer`}
                onClick={() => onNavigate?.('places')}>
                <CardContent className="p-4">
                  <div className={`${color} mb-2`}><Icon className="size-5" /></div>
                  <div className={`text-2xl font-bold ${color}`}>{count}</div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Task Queue */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Task Queue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TASK_QUEUE.map(task => (
              <div key={task.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50/60 transition-colors cursor-pointer"
                onClick={() => onNavigate?.(task.page)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    task.urgency === 'high' ? 'bg-rose-100 text-rose-700' :
                    task.urgency === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{task.count}</div>
                  <div>
                    <p className="text-sm font-medium">{task.label}</p>
                    <p className="text-xs text-muted-foreground">{task.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${urgencyBadge[task.urgency]}`}>
                    {task.urgency}
                  </span>
                  <ChevronRight className="size-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Traffic</CardTitle>
                <CardDescription>Visitor activity over the last 24 hours.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis key="ac-x" dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis key="ac-y" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip key="ac-tt" />
                      <Area key="ac-area" type="monotone" dataKey="visitors" stroke="#10b981" fillOpacity={1} fill="url(#colorVisits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Source Record Verifications</CardTitle>
                  <CardDescription>Weekly approved vs rejected.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={submissionData}>
                        <XAxis key="bc-x" dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip key="bc-tt" cursor={{ fill: 'transparent' }} />
                        <Bar key="bc-app" dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                        <Bar key="bc-rej" dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Storage Usage</CardTitle>
                  <CardDescription>Server capacity status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Database (PostgreSQL)', pct: 45 },
                    { label: 'Media Storage (S3)', pct: 72 },
                    { label: 'Logs & Backups', pct: 28 },
                  ].map(({ label, pct }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest governance actions across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map(a => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 size-2 rounded-full shrink-0 ${
                        a.type === 'approve' ? 'bg-emerald-500' :
                        a.type === 'auto-hide' ? 'bg-slate-400' :
                        a.type === 'return' ? 'bg-rose-500' :
                        a.type === 'submit' ? 'bg-blue-500' : 'bg-purple-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none truncate">{a.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.actor} · <span className="text-foreground">{a.target}</span>
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4" onClick={() => onNavigate?.('audit-log')}>
                  View full audit log →
                </Button>
              </CardContent>
            </Card>

            {/* System health / quick stats */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'API Uptime', value: '99.9%', ok: true },
                  { label: 'Avg Response', value: '142ms', ok: true },
                  { label: 'Error Rate', value: '0.04%', ok: true },
                  { label: 'Active Admin Sessions', value: '3', ok: true },
                  { label: 'Pending Export Jobs', value: '1', ok: true },
                ].map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={`font-semibold ${ok ? 'text-emerald-600' : 'text-rose-600'}`}>{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
