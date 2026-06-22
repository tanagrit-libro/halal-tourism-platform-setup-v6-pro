import { EntrepreneurLayout } from "../components/entrepreneur-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Users,
  Star,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  MessageSquare,
  Calendar,
  CheckCircle,
  PlusCircle,
  Settings,
  Shield,
  UserPlus,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
import { toast } from "sonner";

interface EntrepreneurDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type AdminRole = 'Owner' | 'Manager' | 'Staff' | 'Viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastActive: string;
  status: 'Active' | 'Invited' | 'Suspended';
}

const ROLE_PERMS: Record<AdminRole, { color: string; perms: string[] }> = {
  Owner:   { color: 'bg-purple-100 text-purple-800 border-purple-300', perms: ['All permissions'] },
  Manager: { color: 'bg-blue-100 text-blue-800 border-blue-300',       perms: ['Edit listings', 'Respond to reviews', 'View analytics', 'Submit certificates'] },
  Staff:   { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', perms: ['Edit listings', 'Respond to reviews'] },
  Viewer:  { color: 'bg-slate-100 text-slate-700 border-slate-300',    perms: ['View analytics only'] },
};

const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: 'Ahmad Siddiqui', email: 'ahmad@nusantara.co', role: 'Owner',   lastActive: 'Just now',    status: 'Active' },
  { id: '2', name: 'Siti Rahimah',   email: 'siti@nusantara.co',  role: 'Manager', lastActive: '2 hours ago', status: 'Active' },
  { id: '3', name: 'Irfan Malik',    email: 'irfan@nusantara.co', role: 'Staff',   lastActive: '1 day ago',   status: 'Active' },
  { id: '4', name: 'Pending Invite', email: 'new@partner.co',     role: 'Viewer',  lastActive: '—',           status: 'Invited' },
];

export function EntrepreneurDashboard({ onNavigate, onLogout }: EntrepreneurDashboardProps) {
  const { t } = useLanguage();
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [showTeam, setShowTeam] = useState(false);

  // Mock Data for Charts
  const visitorData = [
    { name: 'Mon', views: 4000, clicks: 2400 },
    { name: 'Tue', views: 3000, clicks: 1398 },
    { name: 'Wed', views: 2000, clicks: 9800 },
    { name: 'Thu', views: 2780, clicks: 3908 },
    { name: 'Fri', views: 1890, clicks: 4800 },
    { name: 'Sat', views: 2390, clicks: 3800 },
    { name: 'Sun', views: 3490, clicks: 4300 },
  ];

  const demographicData = [
    { name: 'Thai Tourists', value: 400 },
    { name: 'International (ASEAN)', value: 300 },
    { name: 'International (Middle East)', value: 300 },
    { name: 'Others', value: 200 },
  ];

  const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7'];

  const recentActivities = [
    {
      id: 1,
      type: 'review',
      title: 'New 5-star review',
      desc: 'Fatima A. reviewed "Grand Halal Restaurant"',
      time: '2 hours ago',
      icon: Star,
      color: 'text-yellow-500 bg-yellow-50'
    },
    {
      id: 2,
      type: 'booking',
      title: 'New Reservation',
      desc: 'Table for 4 at "Halal Cafe & Bistro"',
      time: '4 hours ago',
      icon: Calendar,
      color: 'text-blue-500 bg-blue-50'
    },
    {
      id: 3,
      type: 'system',
      title: 'Place Approved',
      desc: '"Phuket Beach Resort" is now live',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 4,
      type: 'system',
      title: 'Document Update Required',
      desc: 'Halal Certificate for "Grand Halal" expiring soon',
      time: '2 days ago',
      icon: Bell,
      color: 'text-rose-500 bg-rose-50'
    }
  ];

  return (
    <EntrepreneurLayout activePage="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('entrepreneur.dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('entrepreneur.dashboard.welcome')}</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => onNavigate?.('profile')}>
                <Settings className="size-4 mr-2" /> {t('entrepreneur.action.settings')}
             </Button>
             <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onNavigate?.('submit')}>
                <PlusCircle className="size-4 mr-2" /> {t('entrepreneur.action.addPlace')}
             </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('entrepreneur.stats.views')}</p>
                  <h3 className="text-2xl font-bold mt-2">124.5K</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Users className="size-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-xs text-emerald-600 font-medium">
                <ArrowUpRight className="size-3 mr-1" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('entrepreneur.stats.reviews')}</p>
                  <h3 className="text-2xl font-bold mt-2">1,892</h3>
                </div>
                <div className="p-3 bg-yellow-50 rounded-full">
                  <MessageSquare className="size-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-xs text-emerald-600 font-medium">
                <ArrowUpRight className="size-3 mr-1" />
                +5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('entrepreneur.stats.rating')}</p>
                  <h3 className="text-2xl font-bold mt-2">4.8</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <Star className="size-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-xs text-slate-500">
                Based on recent reviews
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('entrepreneur.stats.activePlaces')}</p>
                  <h3 className="text-2xl font-bold mt-2">3</h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full">
                  <MapPin className="size-5 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-xs text-rose-500 font-medium">
                <ArrowDownRight className="size-3 mr-1" />
                1 Pending Approval
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('entrepreneur.chart.performance')}</CardTitle>
              <CardDescription>Views vs Interactions over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorData}>
                    <CartesianGrid key="lc-grid" strokeDasharray="3 3" vertical={false} />
                    <XAxis key="lc-xaxis" dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis key="lc-yaxis" axisLine={false} tickLine={false} />
                    <Tooltip key="lc-tooltip" />
                    <Legend key="lc-legend" />
                    <Line key="lc-views" type="monotone" dataKey="views" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Page Views" />
                    <Line key="lc-clicks" type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Interactions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('entrepreneur.chart.demographics')}</CardTitle>
              <CardDescription>Tourist types visiting your page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      key="pc-pie"
                      data={demographicData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {demographicData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip key="pc-tooltip" />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 mt-2">
                  {demographicData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="ml-auto font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
             <CardHeader>
               <CardTitle>{t('entrepreneur.section.activity')}</CardTitle>
               <CardDescription>Latest updates from your listings</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {recentActivities.map((item) => (
                   <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                     <div className={`p-2 rounded-full shrink-0 ${item.color}`}>
                       <item.icon className="size-4" />
                     </div>
                     <div className="flex-1">
                       <h4 className="font-medium text-sm">{item.title}</h4>
                       <p className="text-xs text-muted-foreground">{item.desc}</p>
                     </div>
                     <span className="text-xs text-muted-foreground">{item.time}</span>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle>{t('entrepreneur.section.tips')}</CardTitle>
               <CardDescription>Improve your visibility on the platform</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                 <h4 className="font-semibold text-emerald-800 text-sm mb-1">Complete your profile</h4>
                 <p className="text-xs text-emerald-700">Listings with complete information and high-quality photos get 40% more views.</p>
                 <Button variant="link" className="h-auto p-0 text-emerald-800 text-xs mt-2" onClick={() => onNavigate?.('profile')}>
                   Update Profile &rarr;
                 </Button>
               </div>
               <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                 <h4 className="font-semibold text-blue-800 text-sm mb-1">Respond to reviews</h4>
                 <p className="text-xs text-blue-700">Active engagement shows you care. Try to respond to all new reviews within 24 hours.</p>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Team Management / Multi-Admin Roles */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-4" /> Team & Admin Roles
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Manage who can access and edit your business account. Role permissions control what each member can do.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowTeam((v) => !v)}>
                  {showTeam ? 'Hide' : 'Manage Team'}
                </Button>
                <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => toast.info('Invite sent to new team member')}>
                  <UserPlus className="size-3 mr-1.5" /> Invite Member
                </Button>
              </div>
            </div>
          </CardHeader>
          {showTeam && (
            <CardContent className="pt-0 space-y-3">
              {/* Role legend */}
              <div className="flex flex-wrap gap-2 pb-2">
                {(Object.keys(ROLE_PERMS) as AdminRole[]).map((role) => (
                  <span key={role} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_PERMS[role].color}`}>
                    {role}: {ROLE_PERMS[role].perms[0]}
                  </span>
                ))}
              </div>
              {/* Team list */}
              <div className="space-y-2">
                {team.map((member) => {
                  const roleCfg = ROLE_PERMS[member.role];
                  return (
                    <div key={member.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-emerald-700">
                          {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-slate-800 truncate">{member.name}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${roleCfg.color}`}>
                            {member.role}
                          </span>
                          {member.status === 'Invited' && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-700">
                              Pending invite
                            </span>
                          )}
                          {member.status === 'Suspended' && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-50 border border-red-300 text-red-700">
                              Suspended
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{member.email} · Last active: {member.lastActive}</p>
                      </div>
                      {member.role !== 'Owner' && (
                        <div className="flex gap-1 flex-shrink-0">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            title="Change role"
                            onClick={() => {
                              const roles: AdminRole[] = ['Manager', 'Staff', 'Viewer'];
                              const next = roles[(roles.indexOf(member.role as AdminRole) + 1) % roles.length];
                              setTeam((prev) => prev.map((m) => m.id === member.id ? { ...m, role: next } : m));
                              toast.info(`${member.name} role changed to ${next}`);
                            }}>
                            <Shield className="size-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            title="Remove member"
                            onClick={() => { setTeam((prev) => prev.filter((m) => m.id !== member.id)); toast.info(`${member.name} removed from team`); }}>
                            <AlertTriangle className="size-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground pt-1">
                Only the Owner can manage roles and submit certificates. Managers and Staff can edit listings and respond to reviews.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </EntrepreneurLayout>
  );
}
