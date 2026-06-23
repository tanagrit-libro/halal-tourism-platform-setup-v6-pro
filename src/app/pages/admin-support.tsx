import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  Tag,
} from "lucide-react";
import { AdminLayout } from "../components/admin-layout";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";

interface AdminSupportProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type TicketStatus = "open" | "waiting_admin" | "waiting_business" | "resolved";
type TicketCategory = "document_correction" | "certification_inquiry" | "listing_visibility" | "data_update";

interface Message {
  id: string;
  from: "business" | "admin";
  name: string;
  text: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  business: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: "High" | "Medium" | "Low";
  assignedTo: string;
  relatedPlace: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  document_correction: "Document Correction",
  certification_inquiry: "Certification Inquiry",
  listing_visibility: "Listing Visibility",
  data_update: "Data Update",
};

const CATEGORY_COLORS: Record<TicketCategory, string> = {
  document_correction: "bg-rose-100 text-rose-700 border-rose-200",
  certification_inquiry: "bg-purple-100 text-purple-700 border-purple-200",
  listing_visibility: "bg-blue-100 text-blue-700 border-blue-200",
  data_update: "bg-amber-100 text-amber-700 border-amber-200",
};

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: "Open", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <AlertCircle className="size-3" /> },
  waiting_admin: { label: "Waiting for Admin", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock className="size-3" /> },
  waiting_business: { label: "Waiting for Business", color: "bg-blue-100 text-blue-700 border-blue-200", icon: <MessageCircle className="size-3" /> },
  resolved: { label: "Resolved", color: "bg-slate-100 text-slate-500 border-slate-200", icon: <CheckCircle className="size-3" /> },
};

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TKT-001",
    business: "Yana Hospitality Group",
    subject: "Halal certificate re-upload for Grand Halal Restaurant",
    category: "document_correction",
    status: "waiting_business",
    priority: "High",
    assignedTo: "Admin Farhan",
    relatedPlace: "Grand Halal Restaurant",
    createdAt: "Jun 10, 2026",
    updatedAt: "Jun 15, 2026",
    messages: [
      { id: "m1", from: "business", name: "Yana Ali", text: "Hi, I uploaded our updated halal certificate but the system still shows Returned for Correction. Can you check?", timestamp: "Jun 10, 2026 - 10:30 AM" },
      { id: "m2", from: "admin", name: "Admin Farhan", text: "Thank you for reaching out. I have reviewed the document. The scan is still slightly blurry. Please re-upload with a higher resolution. PDF format is preferred.", timestamp: "Jun 12, 2026 - 2:15 PM" },
      { id: "m3", from: "business", name: "Yana Ali", text: "Understood, will re-scan and upload by tomorrow.", timestamp: "Jun 12, 2026 - 3:00 PM" },
      { id: "m4", from: "admin", name: "Admin Farhan", text: "Once uploaded, please reply here and I will prioritize the review.", timestamp: "Jun 15, 2026 - 9:00 AM" },
    ],
  },
  {
    id: "TKT-002",
    business: "Ahmad Fauzi Foods",
    subject: "Certificate type change from Traveler-Friendly to Halal Food",
    category: "certification_inquiry",
    status: "waiting_admin",
    priority: "Medium",
    assignedTo: "Unassigned",
    relatedPlace: "Ahmad Halal Kitchen",
    createdAt: "Jun 8, 2026",
    updatedAt: "Jun 8, 2026",
    messages: [
      { id: "m1", from: "business", name: "Ahmad Fauzi", text: "We recently upgraded our certification from Traveler-Friendly to Halal Food. Can we update the certificate type on our existing listing?", timestamp: "Jun 8, 2026 - 11:00 AM" },
    ],
  },
  {
    id: "TKT-003",
    business: "Yana Hospitality Group",
    subject: "Old Town Kebab House hidden - need help restoring visibility",
    category: "listing_visibility",
    status: "open",
    priority: "High",
    assignedTo: "Approver",
    relatedPlace: "Old Town Kebab House",
    createdAt: "Jun 14, 2026",
    updatedAt: "Jun 14, 2026",
    messages: [
      { id: "m1", from: "business", name: "Yana Ali", text: "Our listing is now hidden because the certificate expired. We have renewed it. Please advise on the steps to restore visibility.", timestamp: "Jun 14, 2026 - 8:45 AM" },
    ],
  },
  {
    id: "TKT-004",
    business: "Sarah Nurul Cafe",
    subject: "Update operating hours for Halal Cafe & Bistro",
    category: "data_update",
    status: "resolved",
    priority: "Low",
    assignedTo: "Admin Farhan",
    relatedPlace: "Halal Cafe & Bistro",
    createdAt: "May 20, 2026",
    updatedAt: "May 22, 2026",
    messages: [
      { id: "m1", from: "business", name: "Sarah Nurul", text: "Please update operating hours for Halal Cafe & Bistro to 8:00 AM - 10:00 PM.", timestamp: "May 20, 2026 - 9:00 AM" },
      { id: "m2", from: "admin", name: "Admin Farhan", text: "Done. The operating hours have been updated. The listing will reflect the change within 30 minutes.", timestamp: "May 22, 2026 - 10:30 AM" },
    ],
  },
];

function statusBadge(status: TicketStatus) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export function AdminSupport({ onNavigate, onLogout }: AdminSupportProps) {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeTicketId, setActiveTicketId] = useState<string>(INITIAL_TICKETS[0].id);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTickets = useMemo(() => tickets.filter((ticket) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || ticket.id.toLowerCase().includes(q) || ticket.subject.toLowerCase().includes(q) || ticket.business.toLowerCase().includes(q) || ticket.relatedPlace.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [tickets, search, statusFilter]);

  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId) ?? filteredTickets[0] ?? null;
  const waitingAdmin = tickets.filter((ticket) => ticket.status === "waiting_admin" || ticket.status === "open").length;
  const openCases = tickets.filter((ticket) => ticket.status !== "resolved").length;

  const handleReply = () => {
    if (!activeTicket || !replyText.trim()) return;
    const message: Message = {
      id: `admin-${Date.now()}`,
      from: "admin",
      name: "Admin Farhan",
      text: replyText.trim(),
      timestamp: "Just now",
    };
    setTickets((prev) => prev.map((ticket) => ticket.id === activeTicket.id
      ? { ...ticket, messages: [...ticket.messages, message], status: "waiting_business", updatedAt: "Just now", assignedTo: "Admin Farhan" }
      : ticket
    ));
    setReplyText("");
    toast.success("Reply sent to Entrepreneur Support Center");
  };

  const updateStatus = (status: TicketStatus) => {
    if (!activeTicket) return;
    setTickets((prev) => prev.map((ticket) => ticket.id === activeTicket.id
      ? { ...ticket, status, updatedAt: "Just now", assignedTo: ticket.assignedTo === "Unassigned" ? "Admin Farhan" : ticket.assignedTo }
      : ticket
    ));
    toast.success(`Ticket marked as ${STATUS_CONFIG[status].label}`);
  };

  return (
    <AdminLayout activePage="support" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground">
              Admin workspace for responding to Entrepreneur Support Center tickets, document questions, and listing visibility issues.
            </p>
          </div>
          <Button variant="outline" onClick={() => toast.info("Support SLA report exported")}>
            <FileText className="size-4 mr-2" /> Export SLA Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Open Cases</p><p className="text-2xl font-bold">{openCases}</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Need Admin Reply</p><p className="text-2xl font-bold text-amber-600">{waitingAdmin}</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">High Priority</p><p className="text-2xl font-bold text-rose-600">{tickets.filter((t) => t.priority === "High" && t.status !== "resolved").length}</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Resolved</p><p className="text-2xl font-bold text-emerald-600">{tickets.filter((t) => t.status === "resolved").length}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets"><MessageCircle className="size-3.5 mr-1.5" /> Ticket Inbox</TabsTrigger>
            <TabsTrigger value="workflow"><RefreshCw className="size-3.5 mr-1.5" /> Support Workflow</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Entrepreneur Tickets</CardTitle>
                  <CardDescription>Shared mock queue aligned with Entrepreneur Support Center.</CardDescription>
                  <div className="space-y-2 pt-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="Search ticket, business, place..." value={search} onChange={(event) => setSearch(event.target.value)} />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="waiting_admin">Waiting for Admin</SelectItem>
                        <SelectItem value="waiting_business">Waiting for Business</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filteredTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      className={`w-full text-left rounded-lg border p-3 transition-colors ${activeTicket?.id === ticket.id ? "border-slate-900 bg-slate-50" : "hover:bg-slate-50"}`}
                      onClick={() => setActiveTicketId(ticket.id)}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{ticket.id}</code>
                        {statusBadge(ticket.status)}
                      </div>
                      <p className="font-semibold text-sm line-clamp-2">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ticket.business} · {ticket.updatedAt}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                {activeTicket ? (
                  <>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{activeTicket.id}</code>
                            {statusBadge(activeTicket.status)}
                            <Badge variant="outline" className={CATEGORY_COLORS[activeTicket.category]}>
                              <Tag className="size-3 mr-1" /> {CATEGORY_LABELS[activeTicket.category]}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{activeTicket.subject}</CardTitle>
                          <CardDescription>{activeTicket.business} · Related place: {activeTicket.relatedPlace}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => onNavigate?.("places")}><Eye className="size-3.5 mr-1" /> Review Place</Button>
                          <Button variant="outline" size="sm" onClick={() => updateStatus("resolved")}>Resolve</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Priority</p><p className="font-semibold">{activeTicket.priority}</p></div>
                        <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Assigned To</p><p className="font-semibold">{activeTicket.assignedTo}</p></div>
                        <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Last Updated</p><p className="font-semibold">{activeTicket.updatedAt}</p></div>
                      </div>

                      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {activeTicket.messages.map((message) => (
                          <div key={message.id} className={`flex gap-3 ${message.from === "admin" ? "justify-end" : "justify-start"}`}>
                            {message.from === "business" && <Avatar className="size-8"><AvatarFallback>EN</AvatarFallback></Avatar>}
                            <div className={`max-w-[78%] rounded-lg p-3 text-sm ${message.from === "admin" ? "bg-slate-900 text-white" : "bg-slate-100"}`}>
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <span className="font-semibold">{message.name}</span>
                                <span className={`text-[10px] ${message.from === "admin" ? "text-slate-300" : "text-muted-foreground"}`}>{message.timestamp}</span>
                              </div>
                              <p className="leading-relaxed">{message.text}</p>
                            </div>
                            {message.from === "admin" && <Avatar className="size-8"><AvatarFallback>AD</AvatarFallback></Avatar>}
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-3">
                        <Label>Admin Reply</Label>
                        <Textarea rows={3} placeholder="Type a reply that will appear in Entrepreneur Support Center..." value={replyText} onChange={(event) => setReplyText(event.target.value)} />
                        <div className="flex flex-wrap gap-2 justify-between">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => updateStatus("waiting_admin")}>Need Admin Review</Button>
                            <Button variant="outline" size="sm" onClick={() => updateStatus("waiting_business")}>Waiting Business</Button>
                          </div>
                          <Button onClick={handleReply}><Send className="size-4 mr-2" /> Send Reply</Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="p-10 text-center text-muted-foreground">No support ticket selected.</CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workflow">
            <Card>
              <CardHeader>
                <CardTitle>Admin ↔ Entrepreneur Support Flow</CardTitle>
                <CardDescription>How this page communicates with the Entrepreneur Support Center in the prototype.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  ["1", "Entrepreneur opens ticket", "Business submits document, certification, visibility, or data update issue."],
                  ["2", "Admin triages", "Approver reviews priority, related place, and supporting message history."],
                  ["3", "Admin replies / acts", "Reply is reflected in the Entrepreneur Support Center and status changes to Waiting for Business."],
                  ["4", "Resolve or route", "Admin resolves the case or navigates to Place Management for formal workflow action."],
                ].map(([step, title, body]) => (
                  <div key={step} className="rounded-lg border p-4">
                    <div className="size-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">{step}</div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
