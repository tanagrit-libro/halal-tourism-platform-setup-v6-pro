import { AdminLayout } from "../components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, UserPlus, MoreVertical, Shield, Ban, Edit, CheckCircle, RotateCcw, Filter, MapPin, Building2, Briefcase, User as UserIcon } from "lucide-react";
import { PLACE_TYPE_LABELS } from "../data/place-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface AdminUsersProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Approver' | 'Content Admin (Creator)' | 'Data Reviewer' | 'Entrepreneur' | 'Tourist';
  status: 'Active' | 'Pending' | 'Suspended';
  department?: string;
  // Req 3.3: Specific fields for grouping Entrepreneurs
  businessType?: string;
  province?: string;
  joinDate: string;
  lastActive: string;
}

export function AdminUsers({ onNavigate, onLogout }: AdminUsersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  // Req 3.3: Additional Filters
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User>>({});

  // Requirement 3.3: Search & Filter Data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ahmad Hassan',
      email: 'ahmad@email.com',
      role: 'Tourist',
      status: 'Active',
      joinDate: '2026-01-15',
      lastActive: '2 hours ago',
    },
    {
      id: '2',
      name: 'Fatima Ali',
      email: 'fatima@email.com',
      role: 'Tourist',
      status: 'Suspended',
      joinDate: '2026-01-20',
      lastActive: '1 day ago',
    },
    {
      id: '3',
      name: 'Yana Restaurant Owner',
      email: 'owner@yana.com',
      role: 'Entrepreneur',
      status: 'Active',
      businessType: 'Restaurant',
      province: 'Bangkok',
      joinDate: '2026-01-10',
      lastActive: '3 hours ago',
    },
    {
      id: '4',
      name: 'Phuket Resort Manager',
      email: 'manager@phuketresort.com',
      role: 'Entrepreneur',
      status: 'Pending',
      businessType: 'Hotel',
      province: 'Phuket',
      joinDate: '2026-02-01',
      lastActive: '5 hours ago',
    },
    {
      id: '5',
      name: 'Chiang Mai Cafe',
      email: 'cafe@chiangmai.com',
      role: 'Entrepreneur',
      status: 'Active',
      businessType: 'Restaurant',
      province: 'Chiang Mai',
      joinDate: '2026-02-03',
      lastActive: '1 hour ago',
    },
    {
      id: '6',
      name: 'Reza Prasert',
      email: 'reza@gosafar.th',
      role: 'Super Admin',
      status: 'Active',
      department: 'Platform Governance',
      joinDate: '2025-01-01',
      lastActive: 'Just now',
    },
    {
      id: '7',
      name: 'Ahmad Siddiqui',
      email: 'ahmad@gosafar.th',
      role: 'Approver',
      status: 'Active',
      department: 'Place Verification',
      joinDate: '2025-06-15',
      lastActive: '20 mins ago',
    },
    {
      id: '8',
      name: 'Nurul Iman',
      email: 'nurul@gosafar.th',
      role: 'Content Admin (Creator)',
      status: 'Active',
      department: 'Content Team',
      joinDate: '2025-08-01',
      lastActive: '28 mins ago',
    },
    {
      id: '9',
      name: 'Siti Rahimah',
      email: 'reviewer@gosafar.th',
      role: 'Data Reviewer',
      status: 'Active',
      department: 'Data QA',
      joinDate: '2025-09-10',
      lastActive: '35 mins ago',
    },
  ]);

  const [newUser, setNewUser] = useState<Partial<User>>({ 
    name: '', email: '', role: 'Tourist', status: 'Active' 
  });

  // Requirement 3.2: Manage User Account (Create)
  const handleCreateUser = () => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name || '',
      email: newUser.email || '',
      role: newUser.role as any,
      status: 'Active',
      department: newUser.department,
      businessType: newUser.businessType,
      province: newUser.province,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Never',
    };
    setUsers([...users, user]);
    setIsCreateDialogOpen(false);
    setNewUser({ name: '', email: '', role: 'Tourist', status: 'Active' });
    toast.success(`User ${user.name} created successfully`);
  };

  // Requirement 3.2: Manage User Account (Edit)
  const handleEditClick = (user: User) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editingUser } as User : u));
    setIsEditDialogOpen(false);
    toast.success(`User ${editingUser.name} updated successfully`);
  };

  // Requirement 3.2: Manage User Account (Suspend/Restore)
  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast.success(`User status updated to ${newStatus}`);
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast.success(`User role updated to ${newRole}`);
  };

  // Requirement 3.3: Advanced Filtering Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.province && user.province.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    // Req 3.3: Filter by Business Type & Province
    const matchesType = typeFilter === "all" || user.businessType === typeFilter;
    const matchesProvince = provinceFilter === "all" || user.province === provinceFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesType && matchesProvince;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'Suspended': return 'bg-rose-100 text-rose-700 hover:bg-rose-200';
      default: return '';
    }
  };

  // Requirement 3.1: RBAC Visualization
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Super Admin': return <Badge className="bg-purple-600">Super Admin</Badge>;
      case 'Approver': return <Badge className="bg-blue-600">Approver</Badge>;
      case 'Content Admin (Creator)': return <Badge className="bg-emerald-600">Content Admin (Creator)</Badge>;
      case 'Data Reviewer': return <Badge className="bg-amber-600">Data Reviewer</Badge>;
      case 'Entrepreneur': return <Badge className="bg-purple-500">Entrepreneur</Badge>;
      default: return <Badge variant="secondary">Tourist</Badge>;
    }
  };

  // Extract unique provinces for filter
  const provinces = Array.from(new Set(users.filter(u => u.province).map(u => u.province)));

  return (
    <AdminLayout activePage="users" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User & Access Control</h1>
            <p className="text-muted-foreground">Requirement 3: Manage users, roles (RBAC), and grouping</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="size-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>
                  Req 3.2: Create new accounts and assign roles.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="John Doe" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role (RBAC)</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(val) => setNewUser({...newUser, role: val as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tourist">Tourist</SelectItem>
                        <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Approver">Approver</SelectItem>
                        <SelectItem value="Content Admin (Creator)">Content Admin (Creator)</SelectItem>
                        <SelectItem value="Data Reviewer">Data Reviewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newUser.role === 'Entrepreneur' && (
                    <div className="space-y-2">
                      <Label>Business Type</Label>
                      <Select 
                        value={newUser.businessType} 
                        onValueChange={(val) => setNewUser({...newUser, businessType: val as any})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PLACE_TYPE_LABELS.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {newUser.role === 'Entrepreneur' && (
                    <div className="space-y-2">
                      <Label>Province</Label>
                      <Input 
                        placeholder="e.g. Bangkok" 
                        value={newUser.province}
                        onChange={(e) => setNewUser({...newUser, province: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-600">
                {users.filter(u => u.status === 'Active').length}
              </div>
              <p className="text-sm text-muted-foreground">Active Accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'Entrepreneur').length}
              </div>
              <p className="text-sm text-muted-foreground">Entrepreneurs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-rose-600">
                {users.filter(u => u.status === 'Suspended').length}
              </div>
              <p className="text-sm text-muted-foreground">Suspended/Banned</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters (Requirement 3.3) */}
        <Card>
          <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="size-5" />
                Filter & Grouping (Req 3.3)
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, email, or province..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[230px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Approver">Approver</SelectItem>
                    <SelectItem value="Content Admin (Creator)">Content Admin (Creator)</SelectItem>
                    <SelectItem value="Data Reviewer">Data Reviewer</SelectItem>
                    <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="Tourist">Tourist</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Advanced Filters Row */}
              <div className="flex flex-col md:flex-row gap-4 pt-2 border-t border-dashed">
                <div className="flex items-center gap-2 text-sm text-muted-foreground w-[100px]">
                  <Filter className="size-4" /> Group By:
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[200px] border-dashed">
                     <Building2 className="size-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Business Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {PLACE_TYPE_LABELS.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger className="w-[200px] border-dashed">
                    <MapPin className="size-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p as string}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  className="ml-auto text-xs"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setProvinceFilter("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Role (RBAC)</TableHead>
                  <TableHead>Business/Type</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-sm">
                        {user.role === 'Entrepreneur' ? (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="font-normal text-xs">{user.businessType}</Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.province ? (
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="size-3 mr-1" />
                            {user.province}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)} variant="secondary">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions (Req 3.2)</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(user)}>
                              <Edit className="size-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            
                            {/* Role Management (Requirement 3.2) */}
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Change Role</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'Super Admin')}>
                               <Shield className="size-4 mr-2" /> Make Super Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'Approver')}>
                               <Shield className="size-4 mr-2" /> Make Approver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'Content Admin (Creator)')}>
                               <Shield className="size-4 mr-2" /> Make Content Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'Data Reviewer')}>
                               <Shield className="size-4 mr-2" /> Make Data Reviewer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'Entrepreneur')}>
                               <Briefcase className="size-4 mr-2" /> Make Entrepreneur
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'Tourist')}>
                               <UserIcon className="size-4 mr-2" /> Make Tourist
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            
                            {/* Status Management (Requirement 3.2) */}
                            {user.status === 'Suspended' ? (
                              <DropdownMenuItem 
                                className="text-green-600"
                                onClick={() => handleStatusChange(user.id, 'Active')}
                              >
                                <RotateCcw className="size-4 mr-2" />
                                Restore Access
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleStatusChange(user.id, 'Suspended')}
                              >
                                <Ban className="size-4 mr-2" />
                                Suspend Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                     <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                        No users found matching your filters.
                     </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Details</DialogTitle>
              <DialogDescription>
                Update user information and permissions (Req 3.2).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  type="email" 
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              
              {/* Conditional Fields for Entrepreneurs */}
              {editingUser.role === 'Entrepreneur' && (
                <>
                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <Select 
                      value={editingUser.businessType} 
                      onValueChange={(val) => setEditingUser({...editingUser, businessType: val as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLACE_TYPE_LABELS.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <Input 
                      value={editingUser.province || ''}
                      onChange={(e) => setEditingUser({...editingUser, province: e.target.value})}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
