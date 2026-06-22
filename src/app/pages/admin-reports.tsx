import { AdminLayout } from "../components/admin-layout";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, Users, MapPin, Star, Table as TableIcon, BarChart3 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

interface AdminReportsProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function AdminReports({ onNavigate, onLogout }: AdminReportsProps) {
  // Requirement 6.3: Website usage stats by time period
  const userTrafficData = [
    { period: 'Jan', visitors: 4000, pageViews: 12000 },
    { period: 'Feb', visitors: 5500, pageViews: 16500 },
    { period: 'Mar', visitors: 7200, pageViews: 21600 },
    { period: 'Apr', visitors: 8900, pageViews: 26700 },
    { period: 'May', visitors: 11000, pageViews: 33000 },
    { period: 'Jun', visitors: 12340, pageViews: 37000 },
  ];

  // Requirement 6.1: Places by Type
  const placesByTypeData = [
    { name: 'Restaurants', value: 450, color: '#ef4444' },
    { name: 'Hotels', value: 280, color: '#3b82f6' },
    { name: 'Prayer Facilities', value: 180, color: '#10b981' },
    { name: 'Attractions', value: 120, color: '#a855f7' },
    { name: 'Shopping', value: 90, color: '#f59e0b' },
  ];

  // Requirement 6.1: Places by Province
  const placesByProvinceData = [
    { name: 'Bangkok', value: 450 },
    { name: 'Phuket', value: 280 },
    { name: 'Chiang Mai', value: 210 },
    { name: 'Krabi', value: 120 },
    { name: 'Pattaya', value: 90 },
  ];

  // Requirement 6.1: Places by Verification Status
  const placesByStatusData = [
    { name: 'Approved', value: 850, color: '#10b981' },
    { name: 'Pending', value: 45, color: '#f59e0b' },
    { name: 'Rejected', value: 120, color: '#ef4444' },
    { name: 'Returned', value: 35, color: '#3b82f6' },
  ];

  // Requirement 6.3: Usage by Content Type
  const contentUsageData = [
    { type: 'Restaurant Details', views: 45000 },
    { type: 'Hotel Details', views: 28000 },
    { type: 'Prayer Locations', views: 18000 },
    { type: 'Attraction Details', views: 12000 },
    { type: 'Articles/Blog', views: 9000 },
  ];

  return (
    <AdminLayout activePage="reports" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Reports (Req 6)</h1>
            <p className="text-muted-foreground">Detailed statistics and platform insights</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="size-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Visitors</p>
                  <p className="text-2xl font-bold">12,340</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="size-3 mr-1" />
                    +12.5%
                  </p>
                </div>
                <Users className="size-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Places</p>
                  <p className="text-2xl font-bold">1,150</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="size-3 mr-1" />
                    +8.3%
                  </p>
                </div>
                <MapPin className="size-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">4.7</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="size-3 mr-1" />
                    +0.2
                  </p>
                </div>
                <Star className="size-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    Req 6.1 Status
                  </p>
                </div>
                <BarChart3 className="size-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requirement 6.2: Support both Table and Chart views */}
        <Tabs defaultValue="charts" className="w-full">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-semibold">Data Visualization</h2>
             <TabsList>
                <TabsTrigger value="charts">
                  <BarChart3 className="size-4 mr-2" />
                  Charts View
                </TabsTrigger>
                <TabsTrigger value="tables">
                  <TableIcon className="size-4 mr-2" />
                  Table View
                </TabsTrigger>
             </TabsList>
          </div>

          <TabsContent value="charts" className="space-y-6">
            {/* Req 6.3: Usage Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Website Usage (Req 6.3)</h3>
                  <p className="text-sm text-muted-foreground">Visitors & Page Views over time</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userTrafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} name="Unique Visitors" />
                      <Line type="monotone" dataKey="pageViews" stroke="#10b981" strokeWidth={2} name="Page Views" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Most Viewed Content (Req 6.3)</h3>
                  <p className="text-sm text-muted-foreground">Traffic by content type</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart layout="vertical" data={contentUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="type" type="category" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#8884d8" name="Total Views" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Req 6.1: Places Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">By Type (Req 6.1)</h3>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={placesByTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {placesByTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">By Status (Req 6.1)</h3>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={placesByStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                         {placesByStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">By Province (Req 6.1)</h3>
                </CardHeader>
                <CardContent>
                   <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={placesByProvinceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" name="Places" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Detailed Data Table (Req 6.2)</h3>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category/Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead className="text-right">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Page Views</TableCell>
                      <TableCell>146,800</TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell className="text-right text-green-600">+15%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Restaurants (Approved)</TableCell>
                      <TableCell>450</TableCell>
                      <TableCell>39%</TableCell>
                      <TableCell className="text-right text-green-600">+5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Hotels (Approved)</TableCell>
                      <TableCell>280</TableCell>
                      <TableCell>24%</TableCell>
                      <TableCell className="text-right text-green-600">+8%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bangkok Places</TableCell>
                      <TableCell>450</TableCell>
                      <TableCell>39%</TableCell>
                      <TableCell className="text-right text-green-600">+12%</TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell className="font-medium">Phuket Places</TableCell>
                      <TableCell>280</TableCell>
                      <TableCell>24%</TableCell>
                      <TableCell className="text-right text-green-600">+10%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}