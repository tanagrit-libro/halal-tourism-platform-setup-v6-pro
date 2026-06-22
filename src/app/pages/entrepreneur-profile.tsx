import { EntrepreneurLayout } from "../components/entrepreneur-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Building2,
  Shield,
  FileText,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Upload,
  Smartphone,
  UserPlus,
  Users,
  Clock,
  XCircle,
  Info,
  Lock,
  PenSquare
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EntrepreneurProfileProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type AdminRole = 'Owner' | 'Manager' | 'Editor' | 'Document Uploader';

interface BusinessAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

const ROLE_COLORS: Record<AdminRole, string> = {
  Owner: 'bg-purple-100 text-purple-700 border-purple-200',
  Manager: 'bg-blue-100 text-blue-700 border-blue-200',
  Editor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Document Uploader': 'bg-amber-100 text-amber-700 border-amber-200',
};

export function EntrepreneurProfile({ onNavigate, onLogout }: EntrepreneurProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const [companyInfo, setCompanyInfo] = useState({
    name: "Yana Hospitality Group Co., Ltd.",
    taxId: "0105551234567",
    address: "123 Sukhumvit Road, Watthana, Bangkok 10110",
    phone: "+66 2 123 4567",
    email: "admin@yana-group.com",
    contactPerson: "Ms. Yana Ali",
    website: "www.yana-group.com"
  });

  const [admins, setAdmins] = useState<BusinessAdmin[]>([
    {
      id: '1',
      name: 'Yana Ali',
      email: 'yana@yana-group.com',
      role: 'Owner',
      lastLogin: '2026-06-16 09:14 AM',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Ahmad Fauzi',
      email: 'ahmad@yana-group.com',
      role: 'Manager',
      lastLogin: '2026-06-15 03:42 PM',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Sarah Nurul',
      email: 'sarah@yana-group.com',
      role: 'Editor',
      lastLogin: '2026-06-10 11:00 AM',
      status: 'Active',
    },
    {
      id: '4',
      name: 'Reza Pratama',
      email: 'reza@yana-group.com',
      role: 'Document Uploader',
      lastLogin: 'Never',
      status: 'Pending',
    },
  ]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Company information updated successfully");
  };

  const handleRevokeAdmin = (id: string, name: string) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: 'Inactive' as const } : a));
    toast.success(`Access revoked for ${name}`);
  };

  const getStatusBadge = (status: BusinessAdmin['status']) => {
    if (status === 'Active') return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">Active</Badge>;
    if (status === 'Pending') return <Badge className="bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100">Pending Invite</Badge>;
    return <Badge className="bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-100">Inactive</Badge>;
  };

  const lastEditAudit = "Last edited by Ahmad Fauzi (Manager) on Jun 14, 2026 at 2:30 PM";

  return (
    <EntrepreneurLayout activePage="profile" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Business Profile</h1>
          <p className="text-muted-foreground">Manage your company details, team access, and verification documents.</p>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-emerald-600 text-white border-none">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="size-24 border-4 border-white/20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>YH</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{companyInfo.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-emerald-100 text-sm">
                <span className="flex items-center gap-1"><Building2 className="size-4" /> Hospitality</span>
                <span className="flex items-center gap-1"><MapPin className="size-4" /> Bangkok, Thailand</span>
                <span className="flex items-center gap-1"><CheckCircle className="size-4" /> Verified Business</span>
              </div>
              <p className="text-emerald-200 text-xs mt-2 flex items-center gap-1">
                <PenSquare className="size-3" /> {lastEditAudit}
              </p>
            </div>
            <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[560px]">
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="admins">
              <Users className="size-3.5 mr-1" />Admins
            </TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Company Information Tab */}
          <TabsContent value="company" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Official business information used for invoicing and verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Company Name (Legal Entity)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        disabled={!isEditing}
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tax ID / Registration Number</Label>
                    <Input
                      disabled={!isEditing}
                      value={companyInfo.taxId}
                      onChange={(e) => setCompanyInfo({...companyInfo, taxId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                      disabled={!isEditing}
                      value={companyInfo.contactPerson}
                      onChange={(e) => setCompanyInfo({...companyInfo, contactPerson: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Official Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        disabled={!isEditing}
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        disabled={!isEditing}
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      disabled={!isEditing}
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Registered Address</Label>
                    <Input
                      disabled={!isEditing}
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-between border-t pt-6">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="size-3" /> {lastEditAudit}
                  </p>
                  <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>Bank account details for receiving payouts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                  <div className="p-3 bg-white border rounded-full">
                    <CreditCard className="size-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Kasikorn Bank (KBank)</p>
                    <p className="text-sm text-muted-foreground">**** **** **** 4567</p>
                    <p className="text-xs text-muted-foreground mt-1">Primary Payout Account</p>
                  </div>
                  <Button variant="outline" size="sm" disabled={!isEditing}>Edit</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Admins Tab */}
          <TabsContent value="admins" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Business Admins</CardTitle>
                  <CardDescription>People who can access and manage this business account.</CardDescription>
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 shrink-0">
                  <UserPlus className="size-4 mr-2" />
                  Invite Admin
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Last Login</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin, idx) => (
                        <tr key={admin.id} className={`border-b last:border-b-0 ${idx % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                                  {admin.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{admin.name}</p>
                                <p className="text-xs text-muted-foreground">{admin.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${ROLE_COLORS[admin.role]}`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              {admin.lastLogin}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(admin.status)}
                          </td>
                          <td className="px-4 py-3">
                            {admin.role !== 'Owner' && admin.status !== 'Inactive' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-7 text-xs"
                                onClick={() => handleRevokeAdmin(admin.id, admin.name)}
                              >
                                <XCircle className="size-3 mr-1" /> Revoke
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground px-3">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Role Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Role Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {[
                    { role: 'Owner' as AdminRole, desc: 'Full access — manage admins, billing, and all settings.' },
                    { role: 'Manager' as AdminRole, desc: 'Manage listings, view stats, and respond to support.' },
                    { role: 'Editor' as AdminRole, desc: 'Create and edit listing content. Cannot manage staff.' },
                    { role: 'Document Uploader' as AdminRole, desc: 'Upload and renew certification documents only.' },
                  ].map(({ role, desc }) => (
                    <div key={role} className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/60">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${ROLE_COLORS[role]}`}>{role}</span>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your password and 2-factor authentication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <Label className="font-semibold text-base">Email Address</Label>
                      <p className="text-sm text-muted-foreground">Used for login and notifications</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{companyInfo.email}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <Label className="font-semibold text-base">Password</Label>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex gap-4">
                      <div className="mt-1"><Smartphone className="size-5 text-slate-500" /></div>
                      <div>
                        <Label className="font-semibold text-base">Two-Factor Authentication (2FA)</Label>
                        <p className="text-sm text-muted-foreground max-w-sm mt-1">
                          Require a code from your phone in addition to your password on login.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">{twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex gap-4">
                      <div className="mt-1"><Mail className="size-5 text-slate-500" /></div>
                      <div>
                        <Label className="font-semibold text-base">Login Notifications</Label>
                        <p className="text-sm text-muted-foreground max-w-sm mt-1">
                          Receive an email whenever a new sign-in occurs on your account from a new device or location.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">{loginNotifications ? "On" : "Off"}</span>
                      <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage devices currently logged into your account. Revoke access for former staff or unknown devices.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: Shield, label: 'Chrome on macOS', sub: 'Bangkok, Thailand • Current Session', color: 'bg-emerald-100 text-emerald-600', badge: 'Active Now', current: true },
                    { icon: Smartphone, label: 'Safari on iPhone 14', sub: 'Bangkok, Thailand • 2 days ago', color: 'bg-slate-100 text-slate-600', badge: null, current: false },
                    { icon: Lock, label: 'Firefox on Windows', sub: 'Unknown location • 5 days ago', color: 'bg-rose-100 text-rose-600', badge: null, current: false },
                  ].map((session, i) => (
                    <div key={i} className={`flex items-center justify-between ${!session.current ? 'opacity-70' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${session.color}`}>
                          <session.icon className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{session.label}</p>
                          <p className="text-xs text-muted-foreground">{session.sub}</p>
                        </div>
                      </div>
                      {session.current ? (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">{session.badge}</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-rose-500 h-8 text-xs">Revoke</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 flex items-start gap-3">
                <Info className="size-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-blue-800 text-sm">Security Recommendations</h4>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>This account may be accessed from multiple devices. Review active sessions regularly.</li>
                    <li>Enable login notifications to be alerted of any unauthorized sign-in attempts.</li>
                    <li>Revoke access immediately for any staff who are no longer with your organization.</li>
                    <li>Use a strong, unique password and rotate it every 6 months.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Verification</CardTitle>
                <CardDescription>Upload official documents to verify your business identity.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FileText className="size-6" /></div>
                      <div>
                        <h4 className="font-semibold text-sm">Business Registration (DBD)</h4>
                        <p className="text-xs text-muted-foreground">Verified on Jan 15, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified</Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Shield className="size-6" /></div>
                      <div>
                        <h4 className="font-semibold text-sm">Tax Payer ID Card (Por Por 20)</h4>
                        <p className="text-xs text-muted-foreground">Verified on Jan 15, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified</Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 border-dashed">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white border text-slate-400 rounded-lg"><Upload className="size-6" /></div>
                      <div>
                        <h4 className="font-semibold text-sm">Tourism License (TAT)</h4>
                        <p className="text-xs text-muted-foreground">Optional for some businesses</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Upload</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="size-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 text-sm">Important Note</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Keeping your business documents up to date ensures your listings remain visible and builds trust with tourists. Expired documents may lead to temporary suspension of your listings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EntrepreneurLayout>
  );
}
