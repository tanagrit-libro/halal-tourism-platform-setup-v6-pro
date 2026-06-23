import React, { useState } from "react";
import { TouristLayout } from "../components/tourist-layout";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { TrustBadge } from "../components/halal-badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ShareButton } from "../components/share-button";
import { TouristAuthProps } from "../types/tourist-auth";
import { toast } from "sonner";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Globe,
  Heart,
  Navigation,
  DollarSign,
  Utensils,
  Wifi,
  ParkingCircle,
  User,
  Send,
  Shield,
  ShieldCheck,
  FileText,
  ExternalLink,
  Info,
  AlertCircle,
  Flag,
  CheckCircle2,
  Calendar,
  RefreshCw,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

interface TouristPlaceDetailProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

const mockReviews = [
  {
    id: "1",
    name: "Ahmad Hassan",
    initials: "AH",
    rating: 5,
    date: "3 days ago",
    comment: "Excellent restaurant with authentic Thai cuisine. Prayer facilities available.",
    verified: true,
  },
  {
    id: "2",
    name: "Fatima Ali",
    initials: "FA",
    rating: 4,
    date: "1 week ago",
    comment: "Great food and service. Very welcoming for Muslim families.",
    verified: true,
  },
  {
    id: "3",
    name: "Mohammed Khan",
    initials: "MK",
    rating: 5,
    date: "2 weeks ago",
    comment: "Highly recommended! Staff is knowledgeable about requirements.",
    verified: false,
  },
];

const certHistory = [
  { date: "15 Jan 2024", event: "Certificate issued", status: "Certified" },
  { date: "14 Jun 2025", event: "Source check completed", status: "Confirmed" },
  { date: "14 Jan 2026", event: "Certificate expired", status: "Expired" },
];

const images = [
  "https://images.unsplash.com/photo-1600555379885-08a02224726d?w=800",
  "https://images.unsplash.com/photo-1607411144164-97857cf86e1a?w=800",
  "https://images.unsplash.com/photo-1768152860286-15fa04f4b1a1?w=800",
];

export function TouristPlaceDetail({
  onNavigate,
  isTouristLoggedIn = false,
  onTouristLogout,
  onRequireSignIn,
}: TouristPlaceDetailProps) {
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState(mockReviews);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const toggleFavorite = () => {
    if (!isTouristLoggedIn) {
      onRequireSignIn?.();
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTouristLoggedIn) {
      onRequireSignIn?.();
      return;
    }
    if (!newReview.comment.trim()) return;
    setReviews([
      {
        id: Date.now().toString(),
        name: "You",
        initials: "YO",
        rating: newReview.rating,
        date: "Just now",
        comment: newReview.comment,
        verified: false,
      },
      ...reviews,
    ]);
    setNewReview({ rating: 5, comment: "" });
    toast.success("Review submitted successfully!");
  };

  const handleReportReview = () => {
    if (!isTouristLoggedIn) {
      onRequireSignIn?.();
      return;
    }
    toast.info("Review reported. Our team will review it within 48 hours.");
  };

  return (
    <TouristLayout activePage="search" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <Button variant="ghost" className="mb-4" onClick={() => onNavigate?.("search")}>
        {isRtl ? '→' : '←'} Back to Search
      </Button>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isRtl ? 'direction-rtl' : ''}`}>
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={images[0]}
              alt="Main"
              className="col-span-2 w-full h-[220px] sm:h-[320px] lg:h-[400px] object-cover"
            />
            {images.slice(1).map((img, idx) => (
              <ImageWithFallback
                key={idx}
                src={img}
                alt={`Gallery ${idx + 2}`}
                className="w-full h-[110px] sm:h-[160px] lg:h-[200px] object-cover"
              />
            ))}
          </div>

          {/* Title & Actions */}
          <div>
            <div className={`flex items-start justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Grand Mosque Restaurant</h1>
                  <TrustBadge status="certified" agency="CICOT" />
                </div>
                <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                  <div className="flex items-center">
                    <Star className="size-5 fill-yellow-400 text-yellow-400 me-1" />
                    <span className="font-semibold text-foreground">4.8</span>
                    <span className="ms-1">({reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="size-4 me-1" />
                    <span>Bangkok, Thailand</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="icon"
                  onClick={toggleFavorite}
                  className={isFavorite ? "bg-red-500 hover:bg-red-600 text-white border-red-500" : ""}
                >
                  <Heart className={`size-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
                <ShareButton title="Grand Mosque Restaurant" />
              </div>
            </div>

            <p className="text-muted-foreground">
              Experience authentic Thai cuisine prepared according to halal standards. Our restaurant
              offers a wide variety of traditional dishes in a family-friendly environment with
              dedicated prayer facilities.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="certification">Certification &amp; Source</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
            </TabsList>

            {/* ── Overview ── */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Features &amp; Amenities</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Utensils className="size-5 text-emerald-500" />
                      <span>Halal-Friendly Menu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-5 text-emerald-500" />
                      <span>Prayer Room</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="size-5 text-emerald-500" />
                      <span>Free WiFi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ParkingCircle className="size-5 text-emerald-500" />
                      <span>Parking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="size-5 text-emerald-500" />
                      <span>Family Room</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-5 text-emerald-500" />
                      <span>Affordable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Opening Hours</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                      (day) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-muted-foreground">{day}</span>
                          <span className="font-medium">10:00 AM – 10:00 PM</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Certification & Source ── */}
            <TabsContent value="certification" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-emerald-600" />
                    <h3 className="font-semibold text-lg">Certification &amp; Source Record</h3>
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-1">
                    Information display only. GoSafar Thailand is not a halal certification body.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Two-column detail grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Source Record */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="size-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                          Source Record
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Source Agency</span>
                          <span className="font-medium text-right">Thailand Authority of Tourism (TAT)</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Data Provider</span>
                          <span className="font-medium">CICOT (Central Islamic Council of Thailand)</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Record Type</span>
                          <span className="font-medium">Agency-verified submission</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Source Check</span>
                          <span className="font-medium flex items-center gap-1">
                            <RefreshCw className="size-3" />
                            14 June 2026
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Public Visibility</span>
                          <Badge variant="secondary" className="text-xs">Published</Badge>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Platform Role</span>
                          <span className="font-medium text-muted-foreground italic">Information display only</span>
                        </div>
                      </div>
                    </div>

                    {/* Certification Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="size-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                          Certification Details
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Certifying Source</span>
                          <span className="font-medium text-right">CICOT (Central Islamic Council of Thailand)</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Certificate No.</span>
                          <span className="font-medium font-mono">TH-2024-00423</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Issue Date</span>
                          <span className="font-medium flex items-center gap-1">
                            <Calendar className="size-3" />
                            15 January 2024
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expiry Date</span>
                          <span className="font-medium text-red-600 flex items-center gap-1">
                            <Calendar className="size-3" />
                            14 January 2026
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-muted-foreground">Certificate Status</span>
                          <TrustBadge status="expired" size="sm" />
                        </div>
                        <Separator />
                        <div className="text-sm">
                          <p className="text-muted-foreground mb-1">Remarks</p>
                          <p className="text-sm text-amber-700 bg-amber-50 rounded p-2 border border-amber-200">
                            Certificate has expired. Owner has been notified. Data remains visible
                            pending re-certification.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amber alert notice */}
                  <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
                    <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      This certificate has expired. The information remains visible for reference.
                      Travelers are advised to confirm certification status directly with the operator
                      before visiting.
                    </p>
                  </div>

                  {/* View certificate external link */}
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 hover:underline font-medium"
                  >
                    <FileText className="size-4" />
                    View official CICOT certification register
                    <ExternalLink className="size-3" />
                  </a>

                  {/* History table */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
                      Certification History
                    </h4>
                    <div className="rounded-lg border overflow-hidden text-sm">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-4 py-2 font-medium text-muted-foreground">Date</th>
                            <th className="text-left px-4 py-2 font-medium text-muted-foreground">Event</th>
                            <th className="text-left px-4 py-2 font-medium text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certHistory.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                              <td className="px-4 py-2 font-mono text-xs">{row.date}</td>
                              <td className="px-4 py-2">{row.event}</td>
                              <td className="px-4 py-2">
                                <Badge
                                  variant={
                                    row.status === "Certified"
                                      ? "default"
                                      : row.status === "Expired"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {row.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Reviews ── */}
            <TabsContent value="reviews" className="space-y-6 mt-6">
              {/* Disclaimer banner */}
              <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <Info className="size-4 shrink-0 mt-0.5 text-blue-600" />
                <span>
                  Reviews are separate from certification or source status. User reviews are
                  traveler experiences and are not an assessment of certification records.
                </span>
              </div>

              {/* Write Review */}
              <Card className="bg-slate-50 border-dashed">
                <CardHeader>
                  <h3 className="font-semibold">Write a Review</h3>
                </CardHeader>
                <CardContent>
                  {!isTouristLoggedIn ? (
                    <div className="rounded-lg bg-white border p-4">
                      <p className="font-medium mb-1">Sign in to write a review</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Reviews are separate from certification or source status. Sign in only when
                        you want to share your travel experience.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="button" onClick={() => onNavigate?.("login")}>Sign in</Button>
                        <Button type="button" variant="outline" onClick={() => onNavigate?.("register")}>Create account</Button>
                        <Button type="button" variant="ghost" onClick={() => onNavigate?.("search")}>Continue browsing</Button>
                      </div>
                    </div>
                  ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`size-6 ${
                                star <= newReview.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review-comment">Your Experience</Label>
                      <Textarea
                        id="review-comment"
                        placeholder="Share your experience with other travelers..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                        className="bg-white"
                      />
                    </div>
                    <Button type="submit">
                      <Send className="size-4 mr-2" />
                      Submit Review
                    </Button>
                  </form>
                  )}
                </CardContent>
              </Card>

              {/* Duplicate review warning */}
              <div className="flex gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-yellow-600" />
                <span>
                  <strong>Duplicate review detected:</strong> One earlier review from Ahmad Hassan may
                  be a duplicate submission and is under review.
                </span>
              </div>

              {/* Reviews list */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarFallback>{review.initials ?? review.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2 gap-2 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold">{review.name}</p>
                                {review.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="size-3" />
                                    Verified Reviewer
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground h-7 px-2"
                                onClick={handleReportReview}
                                title="Report this review"
                              >
                                <Flag className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── Menu ── */}
            <TabsContent value="menu" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    Menu information provided by operator. Last updated: March 2026.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-6">
          {/* Trust Status card */}
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-amber-600" />
                <h3 className="font-semibold text-sm">Trust Status</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <TrustBadge status="expired" size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Certifying Source</span>
                <span className="text-sm font-medium">CICOT (Central Islamic Council of Thailand)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Certificate No.</span>
                <span className="text-sm font-mono text-muted-foreground">TH-2024-00423</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Valid Until</span>
                <span className="text-sm font-medium text-red-600">14 Jan 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data Source</span>
                <span className="text-sm text-muted-foreground">Agency record</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Checked</span>
                <span className="text-sm font-medium">14 Jun 2026</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1 border-t border-amber-100">
                Information display only. GoSafar Thailand does not issue halal certification.
              </p>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Contact Information</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+66 2 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="font-medium">grandmosque.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">123 Sukhumvit Rd, Bangkok</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-emerald-600">Open Now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full" size="lg">
                <Navigation className="size-4 mr-2" />
                Get Directions
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Phone className="size-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Globe className="size-4 mr-2" />
                Visit Website
              </Button>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Location</h3>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden rounded-b-lg">
              <iframe
                src="https://maps.google.com/maps?q=13.7563,100.5018&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-48"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </TouristLayout>
  );
}
