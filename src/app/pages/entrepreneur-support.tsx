import { EntrepreneurLayout } from "../components/entrepreneur-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import {
  MessageCircle, Send, Plus, Clock, CheckCircle, FileQuestion,
  AlertCircle, FileText, Eye, RefreshCw, Tag, Star
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { loadSupportSatisfactionRatings, saveSupportSatisfactionRating } from "../data/prototype-support-satisfaction";

interface EntrepreneurSupportProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type TicketStatus = 'open' | 'waiting_admin' | 'waiting_business' | 'resolved';
type TicketCategory = 'document_correction' | 'certification_inquiry' | 'listing_visibility' | 'data_update';

interface Message {
  id: string;
  from: 'business' | 'admin';
  name: string;
  text: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  document_correction: 'Document Correction',
  certification_inquiry: 'Certification Inquiry',
  listing_visibility: 'Listing Visibility',
  data_update: 'Data Update',
};

const CATEGORY_COLORS: Record<TicketCategory, string> = {
  document_correction: 'bg-rose-100 text-rose-700',
  certification_inquiry: 'bg-purple-100 text-purple-700',
  listing_visibility: 'bg-blue-100 text-blue-700',
  data_update: 'bg-amber-100 text-amber-700',
};

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: 'Open', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <AlertCircle className="size-3" /> },
  waiting_admin: { label: 'Waiting for Admin', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="size-3" /> },
  waiting_business: { label: 'Waiting for You', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <MessageCircle className="size-3" /> },
  resolved: { label: 'Resolved', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: <CheckCircle className="size-3" /> },
};

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Halal certificate re-upload for Grand Halal Restaurant',
    category: 'document_correction',
    status: 'waiting_business',
    createdAt: 'Jun 10, 2026',
    updatedAt: 'Jun 15, 2026',
    messages: [
      { id: 'm1', from: 'business', name: 'Yana Ali', text: 'Hi, I uploaded our updated halal certificate but the system still shows Returned for Correction. Can you check?', timestamp: 'Jun 10, 2026 · 10:30 AM' },
      { id: 'm2', from: 'admin', name: 'Admin Farhan', text: 'Thank you for reaching out. I have reviewed the document. The scan is still slightly blurry. Please re-upload with a higher resolution (at least 300 DPI). PDF format is preferred.', timestamp: 'Jun 12, 2026 · 2:15 PM' },
      { id: 'm3', from: 'business', name: 'Yana Ali', text: 'Understood, will re-scan and upload by tomorrow.', timestamp: 'Jun 12, 2026 · 3:00 PM' },
      { id: 'm4', from: 'admin', name: 'Admin Farhan', text: 'Once uploaded, please reply here and I will prioritize the review.', timestamp: 'Jun 15, 2026 · 9:00 AM' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Certificate type change from Traveler-Friendly to Halal Food',
    category: 'certification_inquiry',
    status: 'waiting_admin',
    createdAt: 'Jun 8, 2026',
    updatedAt: 'Jun 8, 2026',
    messages: [
      { id: 'm1', from: 'business', name: 'Ahmad Fauzi', text: 'We recently upgraded our certification from Traveler-Friendly to Halal Food. Can we update the certificate type on our existing listing?', timestamp: 'Jun 8, 2026 · 11:00 AM' },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Old Town Kebab House hidden — need help restoring visibility',
    category: 'listing_visibility',
    status: 'open',
    createdAt: 'Jun 14, 2026',
    updatedAt: 'Jun 14, 2026',
    messages: [
      { id: 'm1', from: 'business', name: 'Yana Ali', text: 'Our listing "Old Town Kebab House" is now hidden because the certificate expired. We have renewed it. Please advise on the steps to restore visibility.', timestamp: 'Jun 14, 2026 · 8:45 AM' },
    ],
  },
  {
    id: 'TKT-004',
    subject: 'Update operating hours for Halal Cafe & Bistro',
    category: 'data_update',
    status: 'resolved',
    createdAt: 'May 20, 2026',
    updatedAt: 'May 22, 2026',
    messages: [
      { id: 'm1', from: 'business', name: 'Sarah Nurul', text: 'Please update operating hours for Halal Cafe & Bistro to 8:00 AM – 10:00 PM.', timestamp: 'May 20, 2026 · 9:00 AM' },
      { id: 'm2', from: 'admin', name: 'Admin Farhan', text: 'Done! The operating hours have been updated. The listing will reflect the change within 30 minutes.', timestamp: 'May 22, 2026 · 10:30 AM' },
    ],
  },
];

const FAQS = [
  { question: 'How long does the verification process take?', answer: 'Verification typically takes 3–5 business days. We review all submissions thoroughly for quality and authenticity.' },
  { question: 'What documents are required for halal certification?', answer: 'You need a valid halal certificate from a recognized body, business registration documents, and clear photos of your establishment.' },
  { question: 'Can I edit my listing after approval?', answer: 'Yes, from "My Listings". Changes to critical information (name, certification) will trigger a re-review.' },
  { question: 'What should I do if my certificate is expiring?', answer: 'Upload a renewed certificate from "My Listings" → Upload Document at least 30 days before expiry to avoid interruption.' },
  { question: 'Why is my listing hidden?', answer: 'Listings are automatically hidden when their certification expires. Uploading a valid document and requesting re-verification will restore visibility.' },
];

export function EntrepreneurSupport({ onNavigate, onLogout }: EntrepreneurSupportProps) {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: '' as TicketCategory | '', message: '' });
  const [ratings, setRatings] = useState(() => loadSupportSatisfactionRatings());
  const [ratingDraft, setRatingDraft] = useState<Record<string, { rating: number; comment: string }>>({});

  const activeTicket = tickets.find(t => t.id === activeTicketId) ?? null;

  const handleSendReply = () => {
    if (!activeTicket || !replyText.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      from: 'business',
      name: 'Yana Ali',
      text: replyText.trim(),
      timestamp: 'Just now',
    };
    setTickets(prev => prev.map(t =>
      t.id === activeTicket.id
        ? { ...t, messages: [...t.messages, msg], status: 'waiting_admin', updatedAt: 'Just now' }
        : t
    ));
    setReplyText('');
    toast.success('Reply sent');
  };

  const handleSubmitNewTicket = () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.message) {
      toast.error('Please fill all fields'); return;
    }
    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      category: newTicket.category as TicketCategory,
      status: 'open',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: [{
        id: 'm1',
        from: 'business',
        name: 'Yana Ali',
        text: newTicket.message,
        timestamp: 'Just now',
      }],
    };
    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ subject: '', category: '', message: '' });
    setShowNewTicket(false);
    setActiveTicketId(ticket.id);
    toast.success('Support ticket created');
  };

  const renderStatusBadge = (status: TicketStatus) => {
    const cfg = STATUS_CONFIG[status];
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  const openCount = tickets.filter(t => t.status !== 'resolved').length;
  const submitRating = (ticketId: string) => {
    const draft = ratingDraft[ticketId];
    if (!draft?.rating) {
      toast.error("Please select a rating.");
      return;
    }
    saveSupportSatisfactionRating({
      ticketId,
      rating: draft.rating,
      comment: draft.comment,
      ratedBy: "Yana Ali",
      ratedAt: new Date().toISOString().slice(0, 10),
    });
    setRatings(loadSupportSatisfactionRatings());
    toast.success("Thank you for rating this support case.");
  };

  return (
    <EntrepreneurLayout activePage="support" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground">Message our admin team and track your open cases.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 shrink-0" onClick={() => setShowNewTicket(true)}>
            <Plus className="size-4 mr-2" /> New Ticket
          </Button>
        </div>

        <Tabs defaultValue="messages">
          <TabsList className="grid w-full grid-cols-2 lg:w-80">
            <TabsTrigger value="messages">
              <MessageCircle className="size-3.5 mr-1.5" />
              Messages
              {openCount > 0 && (
                <span className="ml-1.5 bg-emerald-600 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">{openCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="faq">
              <FileQuestion className="size-3.5 mr-1.5" /> FAQ
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="mt-4">
            {showNewTicket && (
              <Card className="mb-4 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-base">New Support Ticket</CardTitle>
                  <CardDescription>Describe your issue. Our admin team typically responds within 1 business day.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <select className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                      value={newTicket.category}
                      onChange={e => setNewTicket({...newTicket, category: e.target.value as TicketCategory})}>
                      <option value="">Select category</option>
                      <option value="document_correction">Document Correction</option>
                      <option value="certification_inquiry">Certification Inquiry</option>
                      <option value="listing_visibility">Listing Visibility</option>
                      <option value="data_update">Data Update</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Input placeholder="Brief description of your issue" value={newTicket.subject}
                      onChange={e => setNewTicket({...newTicket, subject: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Message *</Label>
                    <Textarea rows={4} placeholder="Describe your issue in detail..." value={newTicket.message}
                      onChange={e => setNewTicket({...newTicket, message: e.target.value})} />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowNewTicket(false)}>Cancel</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmitNewTicket}>
                      <Send className="size-4 mr-2" /> Submit Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ticket List */}
              <div className="md:col-span-1 space-y-2">
                {tickets.map(ticket => (
                  <button key={ticket.id}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      activeTicketId === ticket.id ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                    onClick={() => setActiveTicketId(ticket.id)}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-xs font-semibold text-slate-500">{ticket.id}</p>
                      {renderStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm font-medium leading-tight line-clamp-2">{ticket.subject}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_COLORS[ticket.category]}`}>
                        {CATEGORY_LABELS[ticket.category]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{ticket.updatedAt}</p>
                  </button>
                ))}
              </div>

              {/* Message Thread */}
              <div className="md:col-span-2">
                {activeTicket ? (
                  <Card className="h-full flex flex-col">
                    <CardHeader className="border-b pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-base leading-tight">{activeTicket.subject}</CardTitle>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {renderStatusBadge(activeTicket.status)}
                            <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_COLORS[activeTicket.category]}`}>
                              <Tag className="size-2.5 inline mr-1" />{CATEGORY_LABELS[activeTicket.category]}
                            </span>
                            <span className="text-xs text-muted-foreground">Opened {activeTicket.createdAt}</span>
                          </div>
                        </div>
                        {activeTicket.status !== 'resolved' && (
                          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground shrink-0"
                            onClick={() => {
                              setTickets(prev => prev.map(t => t.id === activeTicket.id ? {...t, status: 'resolved'} : t));
                              toast.success('Ticket marked as resolved');
                            }}>
                            <CheckCircle className="size-3.5 mr-1" /> Mark Resolved
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto py-4 space-y-4 max-h-80">
                      {activeTicket.messages.map(msg => (
                        <div key={msg.id} className={`flex gap-3 ${msg.from === 'business' ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="size-8 shrink-0">
                            <AvatarFallback className={`text-xs ${msg.from === 'admin' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                              {msg.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`max-w-[75%] ${msg.from === 'business' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-600">{msg.name}</span>
                              {msg.from === 'admin' && <Badge variant="outline" className="text-xs h-4 py-0 text-emerald-600 border-emerald-200">Admin</Badge>}
                            </div>
                            <div className={`px-3 py-2 rounded-lg text-sm leading-relaxed ${
                              msg.from === 'business'
                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                : 'bg-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                              {msg.text}
                            </div>
                            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    {activeTicket.status !== 'resolved' && (
                      <div className="border-t p-4">
                        <div className="flex gap-2">
                          <Textarea
                            rows={2}
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            className="resize-none text-sm"
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }}
                          />
                          <Button className="bg-emerald-600 hover:bg-emerald-700 shrink-0" onClick={handleSendReply}>
                            <Send className="size-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Press Enter to send · Shift+Enter for new line</p>
                      </div>
                    )}
                    {activeTicket.status === 'resolved' && (
                      <div className="border-t p-4 bg-slate-50 rounded-b-lg space-y-3">
                        <div className="text-center text-xs text-muted-foreground">
                          <CheckCircle className="size-4 text-emerald-500 inline mr-1" /> This ticket is resolved.
                          <button className="ml-2 text-emerald-600 hover:underline" onClick={() => {
                            setTickets(prev => prev.map(t => t.id === activeTicket.id ? {...t, status: 'open'} : t));
                            toast.info('Ticket reopened');
                          }}>Reopen</button>
                        </div>
                        {ratings.find((item) => item.ticketId === activeTicket.id) ? (
                          <div className="rounded-lg border bg-white p-3 text-sm">
                            <p className="font-semibold text-emerald-700">Support experience rated</p>
                            <div className="flex items-center gap-1 mt-1 text-amber-500">
                              {Array.from({ length: ratings.find((item) => item.ticketId === activeTicket.id)?.rating ?? 0 }).map((_, index) => (
                                <Star key={index} className="size-4 fill-current" />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{ratings.find((item) => item.ticketId === activeTicket.id)?.comment}</p>
                          </div>
                        ) : (
                          <div className="rounded-lg border bg-white p-3 space-y-3">
                            <div>
                              <p className="text-sm font-semibold">Rate this support response</p>
                              <p className="text-xs text-muted-foreground">Your rating helps the admin team improve response quality.</p>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRatingDraft((prev) => ({ ...prev, [activeTicket.id]: { rating: star, comment: prev[activeTicket.id]?.comment ?? "" } }))}
                                >
                                  <Star className={`size-6 ${star <= (ratingDraft[activeTicket.id]?.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                                </button>
                              ))}
                            </div>
                            <Textarea
                              rows={2}
                              placeholder="Optional feedback for the admin team"
                              value={ratingDraft[activeTicket.id]?.comment ?? ""}
                              onChange={(event) => setRatingDraft((prev) => ({ ...prev, [activeTicket.id]: { rating: prev[activeTicket.id]?.rating ?? 0, comment: event.target.value } }))}
                            />
                            <Button size="sm" onClick={() => submitRating(activeTicket.id)}>Submit Rating</Button>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border rounded-lg bg-slate-50">
                    <MessageCircle className="size-10 mb-3 text-slate-300" />
                    <p className="text-sm">Select a ticket to view the conversation</p>
                    <Button variant="link" size="sm" className="mt-2 text-emerald-600" onClick={() => setShowNewTicket(true)}>
                      Or create a new ticket
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Status legend */}
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Ticket Status Guide</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map(s => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about documents, certification, and listings.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-sm text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-200 mt-4">
              <CardContent className="p-4 flex items-start gap-3">
                <MessageCircle className="size-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-800 text-sm">Can't find what you need?</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Open a support ticket and our admin team will respond within 1 business day (Mon–Fri, 9 AM – 6 PM GMT+7).
                  </p>
                  <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowNewTicket(true)}>
                    <Plus className="size-3.5 mr-1.5" /> New Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EntrepreneurLayout>
  );
}
