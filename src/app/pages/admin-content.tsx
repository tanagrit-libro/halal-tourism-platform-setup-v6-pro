import { AdminLayout } from "../components/admin-layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Link as LinkIcon
} from "lucide-react";
import { useState } from "react";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

interface AdminContentProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const initialContent = [
  { id: 1, title: "Top 10 Halal Restaurants in Bangkok", type: "Article", status: "Published", author: "Admin", date: "2026-02-01" },
  { id: 2, title: "New Prayer Room at Airport", type: "News", status: "Draft", author: "Staff", date: "2026-02-05" },
];

export function AdminContent({ onNavigate, onLogout }: AdminContentProps) {
  const [contents, setContents] = useState(initialContent);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "Article",
    content: "",
    status: "Draft"
  });

  const handleEdit = (item: any) => {
    setSelectedContent(item);
    setFormData({
      title: item.title,
      type: item.type,
      content: "Sample content...",
      status: item.status
    });
    setView('form');
  };

  const handleCreate = () => {
    setSelectedContent(null);
    setFormData({
      title: "",
      type: "Article",
      content: "",
      status: "Draft"
    });
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    toast.success(selectedContent ? "Content updated" : "Content created");
    setView('list');
  };

  if (view === 'form') {
    return (
      <AdminLayout activePage="content" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{selectedContent ? 'Edit Content' : 'Create New Content'}</h1>
            <Button variant="ghost" onClick={() => setView('list')}>Cancel</Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Title *</Label>
                    <Input 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter article title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select 
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                      <option>Article</option>
                      <option>News</option>
                      <option>Review</option>
                      <option>Press Release</option>
                    </select>
                  </div>
                </div>

                {/* Rich Text Editor Toolbar Mock */}
                <div className="space-y-2">
                  <Label>Content</Label>
                  <div className="border rounded-md">
                    <div className="bg-slate-50 border-b p-2 flex gap-2">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <Bold className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <Italic className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <List className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <LinkIcon className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <ImageIcon className="size-4" />
                      </Button>
                    </div>
                    <Textarea 
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      className="border-0 focus-visible:ring-0 min-h-[300px]"
                      placeholder="Write your content here..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="draft" 
                        name="status" 
                        checked={formData.status === 'Draft'}
                        onChange={() => setFormData({...formData, status: 'Draft'})}
                      />
                      <Label htmlFor="draft">Draft</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="published" 
                        name="status" 
                        checked={formData.status === 'Published'}
                        onChange={() => setFormData({...formData, status: 'Published'})}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => setView('list')}>Cancel</Button>
              <Button type="submit">Save Content</Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="content" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">Manage articles, news, and reviews</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Add Content
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Search content..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="size-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contents.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>#{item.id}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={item.status === 'Published' ? 'bg-green-500' : 'bg-gray-500'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="size-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}