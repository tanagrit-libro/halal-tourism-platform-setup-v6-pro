import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Archive,
  BookOpen,
  CalendarClock,
  Edit,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Globe2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
} from "lucide-react";
import { AdminLayout } from "../components/admin-layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  CONTENT_CATEGORIES,
  CONTENT_STATUSES,
  CONTENT_TYPES,
  PrototypeContentRecord,
  PrototypeContentStatus,
  PrototypeContentType,
  createContentRecord,
  createSlug,
  updatePrototypeContent,
  usePrototypeContent,
} from "../data/prototype-content-workflow";
import { usePrototypeAuditEvents } from "../data/prototype-audit-workflow";

interface AdminContentProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type ViewMode = "list" | "form" | "preview";

const STATUS_BADGE: Record<PrototypeContentStatus, string> = {
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  "In Review": "bg-blue-100 text-blue-700 border-blue-200",
  Scheduled: "bg-purple-100 text-purple-700 border-purple-200",
  Published: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Archived: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

function blankForm(): Omit<PrototypeContentRecord, "id" | "createdAt" | "updatedAt"> {
  return {
    title: "",
    slug: "",
    type: "Article",
    category: "Travel Guide",
    excerpt: "",
    body: "",
    coverImage: "",
    author: "Content Admin",
    status: "Draft",
    tags: [],
    relatedPlaceIds: [],
    seoTitle: "",
    seoDescription: "",
    scheduledAt: "",
    reviewerComment: "",
    featured: false,
  };
}

function toForm(record: PrototypeContentRecord): Omit<PrototypeContentRecord, "id" | "createdAt" | "updatedAt"> {
  return {
    title: record.title,
    slug: record.slug,
    type: record.type,
    category: record.category,
    excerpt: record.excerpt,
    body: record.body,
    coverImage: record.coverImage,
    author: record.author,
    status: record.status,
    tags: record.tags,
    relatedPlaceIds: record.relatedPlaceIds,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    publishedAt: record.publishedAt,
    scheduledAt: record.scheduledAt,
    reviewerComment: record.reviewerComment,
    featured: record.featured,
  };
}

export function AdminContent({ onNavigate, onLogout }: AdminContentProps) {
  const { content } = usePrototypeContent();
  const { events } = usePrototypeAuditEvents();
  const [view, setView] = useState<ViewMode>("list");
  const [selectedContent, setSelectedContent] = useState<PrototypeContentRecord | null>(null);
  const [formData, setFormData] = useState(blankForm());
  const [tagInput, setTagInput] = useState("");
  const [relatedInput, setRelatedInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredContent = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return content.filter((item) => {
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.tags.join(" ").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchStatus && matchType && matchCategory;
    });
  }, [content, searchQuery, statusFilter, typeFilter, categoryFilter]);

  const stats = {
    total: content.length,
    draft: content.filter((item) => item.status === "Draft").length,
    review: content.filter((item) => item.status === "In Review").length,
    published: content.filter((item) => item.status === "Published").length,
    archived: content.filter((item) => item.status === "Archived").length,
  };

  const contentEvents = events.filter((event) => event.entityType === "Content").slice(0, 5);

  const setField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = () => {
    setSelectedContent(null);
    setFormData(blankForm());
    setTagInput("");
    setRelatedInput("");
    setView("form");
  };

  const handleEdit = (record: PrototypeContentRecord) => {
    setSelectedContent(record);
    setFormData(toForm(record));
    setTagInput(record.tags.join(", "));
    setRelatedInput(record.relatedPlaceIds.join(", "));
    setView("form");
  };

  const handlePreview = (record?: PrototypeContentRecord) => {
    if (record) {
      setSelectedContent(record);
      setFormData(toForm(record));
      setTagInput(record.tags.join(", "));
      setRelatedInput(record.relatedPlaceIds.join(", "));
    }
    setView("preview");
  };

  const normalizeForm = (status: PrototypeContentStatus) => {
    const title = formData.title.trim();
    const tags = tagInput.split(",").map((tag) => tag.trim()).filter(Boolean);
    const relatedPlaceIds = relatedInput.split(",").map((id) => id.trim()).filter(Boolean);
    return {
      ...formData,
      title,
      slug: formData.slug.trim() || createSlug(title),
      excerpt: formData.excerpt.trim(),
      body: formData.body.trim(),
      coverImage: formData.coverImage.trim() || "https://images.unsplash.com/photo-1600555379885-08a02224726d?w=1200",
      seoTitle: formData.seoTitle.trim() || title,
      seoDescription: formData.seoDescription.trim() || formData.excerpt.trim(),
      tags,
      relatedPlaceIds,
      status,
    };
  };

  const saveContent = (status: PrototypeContentStatus) => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.excerpt.trim() || !formData.body.trim()) {
      toast.error("Excerpt and body content are required");
      return;
    }
    const next = normalizeForm(status);
    if (selectedContent) {
      updatePrototypeContent(selectedContent.id, next, status === "Published" ? "Publish" : status === "In Review" ? "Submit for Review" : status === "Scheduled" ? "Schedule" : "Edit");
      toast.success(`Content updated as ${status}`);
    } else {
      createContentRecord(next);
      toast.success(`Content created as ${status}`);
    }
    setView("list");
  };

  const quickAction = (record: PrototypeContentRecord, status: PrototypeContentStatus) => {
    const action = status === "Published" ? "Publish" : status === "Archived" ? "Archive" : status === "Draft" ? "Restore" : "Submit for Review";
    updatePrototypeContent(record.id, { status }, action);
    toast.success(`${record.title} moved to ${status}`);
  };

  const statusBadge = (status: PrototypeContentStatus) => (
    <Badge className={`${STATUS_BADGE[status]} border`}>{status}</Badge>
  );

  if (view === "preview") {
    return (
      <AdminLayout activePage="content" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Content Preview</h1>
              <p className="text-sm text-muted-foreground">Preview how this content will read in the Tourist Portal before publishing.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setView(selectedContent ? "list" : "form")}>Back</Button>
              <Button onClick={() => saveContent("Published")} className="bg-emerald-600 hover:bg-emerald-700">
                <Globe2 className="size-4 mr-2" /> Publish
              </Button>
            </div>
          </div>

          <article className="space-y-6">
            <div className="rounded-lg overflow-hidden border">
              <img src={formData.coverImage || "https://images.unsplash.com/photo-1600555379885-08a02224726d?w=1200"} alt={formData.title} className="w-full h-80 object-cover" />
            </div>
            <div>
              <Badge className="mb-3">{formData.category}</Badge>
              <h2 className="text-3xl font-bold leading-tight">{formData.title || "Untitled content"}</h2>
              <p className="text-lg text-muted-foreground mt-3">{formData.excerpt || "No excerpt yet."}</p>
              <div className="flex flex-wrap gap-2 mt-4 text-sm text-muted-foreground">
                <span>By {formData.author}</span>
                <span>•</span>
                <span>{formData.type}</span>
                <span>•</span>
                {statusBadge(formData.status)}
              </div>
            </div>
            <div className="prose prose-emerald max-w-none">
              {formData.body.split("\n").filter(Boolean).map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-slate-700 mb-4">{paragraph}</p>
              ))}
            </div>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4 text-sm text-blue-800">
                GoSafar Thailand displays travel information from recognized agencies, partner datasets, and reviewed operator submissions. The platform does not issue halal certification.
              </CardContent>
            </Card>
          </article>
        </div>
      </AdminLayout>
    );
  }

  if (view === "form") {
    return (
      <AdminLayout activePage="content" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{selectedContent ? "Edit Content" : "Create Content"}</h1>
              <p className="text-sm text-muted-foreground">Create public articles, guides, news, and source-aware travel communication.</p>
            </div>
            <Button variant="ghost" onClick={() => setView("list")}>Cancel</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Content Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Title *</Label>
                    <Input value={formData.title} onChange={(e) => setField("title", e.target.value)} placeholder="Enter article or guide title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={formData.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated-if-empty" />
                  </div>
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input value={formData.author} onChange={(e) => setField("author", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select className="w-full h-10 border rounded-md px-3 text-sm bg-background" value={formData.type} onChange={(e) => setField("type", e.target.value as PrototypeContentType)}>
                      {CONTENT_TYPES.map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select className="w-full h-10 border rounded-md px-3 text-sm bg-background" value={formData.category} onChange={(e) => setField("category", e.target.value)}>
                      {CONTENT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Excerpt *</Label>
                  <Textarea rows={3} value={formData.excerpt} onChange={(e) => setField("excerpt", e.target.value)} placeholder="Short summary shown on cards and article header" />
                </div>
                <div className="space-y-2">
                  <Label>Body Content *</Label>
                  <Textarea rows={10} value={formData.body} onChange={(e) => setField("body", e.target.value)} placeholder="Write public content. Separate paragraphs with line breaks." />
                </div>
                <div className="space-y-2">
                  <Label>Cover Image URL</Label>
                  <Input value={formData.coverImage} onChange={(e) => setField("coverImage", e.target.value)} placeholder="https://..." />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Card>
                <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select className="w-full h-10 border rounded-md px-3 text-sm bg-background" value={formData.status} onChange={(e) => setField("status", e.target.value as PrototypeContentStatus)}>
                      {CONTENT_STATUSES.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Schedule Date</Label>
                    <Input type="date" value={formData.scheduledAt ?? ""} onChange={(e) => setField("scheduledAt", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Reviewer Comment</Label>
                    <Textarea rows={3} value={formData.reviewerComment ?? ""} onChange={(e) => setField("reviewerComment", e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Discovery</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Bangkok, halal food, mosque" />
                  </div>
                  <div className="space-y-2">
                    <Label>Related Place IDs</Label>
                    <Input value={relatedInput} onChange={(e) => setRelatedInput(e.target.value)} placeholder="demo-1, SUB-..." />
                  </div>
                  <div className="space-y-2">
                    <Label>SEO Title</Label>
                    <Input value={formData.seoTitle} onChange={(e) => setField("seoTitle", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>SEO Description</Label>
                    <Textarea rows={3} value={formData.seoDescription} onChange={(e) => setField("seoDescription", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => saveContent("Draft")}><Save className="size-4 mr-2" /> Save Draft</Button>
            <Button variant="outline" onClick={() => handlePreview()}><Eye className="size-4 mr-2" /> Preview</Button>
            <Button variant="outline" onClick={() => saveContent("In Review")}><Send className="size-4 mr-2" /> Submit for Review</Button>
            <Button variant="outline" onClick={() => saveContent("Scheduled")}><CalendarClock className="size-4 mr-2" /> Schedule</Button>
            <Button onClick={() => saveContent("Published")} className="bg-emerald-600 hover:bg-emerald-700"><Globe2 className="size-4 mr-2" /> Publish Now</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="content" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">Manage public articles, guides, news, and travel content shown in the Tourist Portal.</p>
          </div>
          <Button onClick={handleCreate}><Plus className="size-4 mr-2" /> Create Content</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ["Total Content", stats.total, "text-slate-700"],
            ["Draft", stats.draft, "text-slate-600"],
            ["In Review", stats.review, "text-blue-600"],
            ["Published", stats.published, "text-emerald-600"],
            ["Archived", stats.archived, "text-zinc-600"],
          ].map(([label, value, color]) => (
            <Card key={label as string}>
              <CardContent className="pt-4 pb-3">
                <div className={`text-xl font-bold ${color}`}>{value}</div>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search title, author, or tag..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Filter className="size-4 text-muted-foreground" />
              <select className="h-10 border rounded-md px-3 text-sm bg-background" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                {CONTENT_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
              <select className="h-10 border rounded-md px-3 text-sm bg-background" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                {CONTENT_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
              <select className="h-10 border rounded-md px-3 text-sm bg-background" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {CONTENT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.category} · {item.author}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                    <TableCell>{statusBadge(item.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.updatedAt}</TableCell>
                    <TableCell>
                      {item.status === "Published" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><Globe2 className="size-3" /> Tourist visible</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500"><FileText className="size-3" /> Internal only</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handlePreview(item)}><Eye className="size-3.5 mr-1" /> Preview</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Edit className="size-3.5 mr-1" /> Edit</Button>
                        {item.status !== "Published" && item.status !== "Archived" && (
                          <Button variant="ghost" size="sm" onClick={() => quickAction(item, "Published")}><FileCheck2 className="size-3.5 mr-1" /> Publish</Button>
                        )}
                        {item.status === "Draft" && (
                          <Button variant="ghost" size="sm" onClick={() => quickAction(item, "In Review")}><Send className="size-3.5 mr-1" /> Review</Button>
                        )}
                        {item.status !== "Archived" ? (
                          <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => quickAction(item, "Archived")}><Archive className="size-3.5 mr-1" /> Archive</Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => quickAction(item, "Draft")}><RotateCcw className="size-3.5 mr-1" /> Restore</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredContent.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">No content matched the current filters.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="size-4" /> Recent Content Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {contentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Content actions will appear here after create, publish, archive, or restore.</p>
            ) : contentEvents.map((event) => (
              <div key={event.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{event.action}</span>
                  <span className="text-muted-foreground"> · {event.entity}</span>
                </div>
                <span className="text-xs text-muted-foreground">{event.timestamp}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
