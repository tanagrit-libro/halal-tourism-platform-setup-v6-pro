import { EntrepreneurLayout } from "../components/entrepreneur-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import {
  MapPin,
  Upload,
  Clock,
  DollarSign,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Building2,
  Phone,
  Globe,
  Link,
  CalendarDays,
  ShieldCheck,
  UtensilsCrossed,
  Waves,
  Star,
  Hash,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PLACE_TYPES, placeTypeLabel } from "../data/place-types";
import { createSubmittedPlace } from "../data/prototype-place-workflow";
import { AMENITIES, CERTIFYING_SOURCE_RECORDS, formatPriceRange } from "../data/prototype-options";

interface EntrepreneurSubmitPlaceProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const STEPS = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Location & Map' },
  { id: 3, label: 'Amenities' },
  { id: 4, label: 'Muslim Facilities' },
  { id: 5, label: 'Certification' },
  { id: 6, label: 'Contact & Media' },
  { id: 7, label: 'Review' },
];

const MUSLIM_FACILITIES = [
  { id: 'prayerRoom', label: 'Prayer Room (ห้องละหมาด)' },
  { id: 'wuduFacility', label: 'Wudu / Ablution Facility' },
  { id: 'qiblaDirection', label: 'Qibla Direction Marked' },
  { id: 'prayerMat', label: 'Prayer Mat Available' },
  { id: 'halalOnly', label: 'Halal-only Kitchen' },
  { id: 'noPork', label: 'No Pork Served' },
  { id: 'noAlcohol', label: 'No Alcohol Served' },
  { id: 'separateSeating', label: 'Separate Seating Available' },
];

export function EntrepreneurSubmitPlace({ onNavigate, onLogout }: EntrepreneurSubmitPlaceProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [certDoc, setCertDoc] = useState<File | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [muslimFacilities, setMuslimFacilities] = useState<string[]>([]);

  const [form, setForm] = useState({
    // Basic
    placeName: '',
    placeNameTh: '',
    placeNameMs: '',
    placeNameAr: '',
    placeType: '',
    subCategory: '',
    description: '',
    descriptionTh: '',
    descriptionMs: '',
    descriptionAr: '',
    priceMin: '',
    priceMax: '',
    // Location
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    // Hours
    openTime: '09:00',
    closeTime: '22:00',
    openDaily: true,
    closedDays: '',
    // Muslim
    porkPolicy: '',
    alcoholPolicy: '',
    prayerFacility: '',
    // Cert
    certType: '',
    certAgency: '',
    customCertAgency: '',
    customCertLogoUrl: '',
    certNumber: '',
    issueDate: '',
    expiryDate: '',
    // Contact
    contactPhone: '',
    contactEmail: '',
    website: '',
    googleMaps: '',
    facebook: '',
    instagram: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) {
        toast.error(`${f.name}: JPG/PNG only`); return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name}: exceeds 5MB`); return false;
      }
      return true;
    });
    setImages(prev => [...prev, ...valid]);
  };

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('PDF, JPG or PNG only'); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File exceeds 10MB'); return;
    }
    setCertDoc(file);
    toast.success('Certificate document uploaded');
  };

  const toggleAmenity = (a: string) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const toggleMuslimFacility = (id: string) => {
    setMuslimFacilities(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const resetForm = () => {
    setImages([]);
    setCertDoc(null);
    setAmenities([]);
    setMuslimFacilities([]);
    setValidationErrors([]);
    setSubmissionId("");
    setForm({
      placeName: '',
      placeNameTh: '',
      placeNameMs: '',
      placeNameAr: '',
      placeType: '',
      subCategory: '',
      description: '',
      descriptionTh: '',
      descriptionMs: '',
      descriptionAr: '',
      priceMin: '',
      priceMax: '',
      address: '',
      city: '',
      latitude: '',
      longitude: '',
      openTime: '09:00',
      closeTime: '22:00',
      openDaily: true,
      closedDays: '',
      porkPolicy: '',
      alcoholPolicy: '',
      prayerFacility: '',
      certType: '',
      certAgency: '',
      customCertAgency: '',
      customCertLogoUrl: '',
      certNumber: '',
      issueDate: '',
      expiryDate: '',
      contactPhone: '',
      contactEmail: '',
      website: '',
      googleMaps: '',
      facebook: '',
      instagram: '',
    });
  };

  const validateSubmission = () => {
    const hasAnyName = [form.placeName, form.placeNameTh, form.placeNameMs, form.placeNameAr].some((value) => value.trim());
    const hasAnyDescription = [form.description, form.descriptionTh, form.descriptionMs, form.descriptionAr].some((value) => value.trim().length >= 20);
    const numericPriceMin = Number(form.priceMin);
    const numericPriceMax = Number(form.priceMax);
    const effectiveCertAgency = form.certAgency === "other" ? form.customCertAgency.trim() : form.certAgency.trim();
    const checks: { step: number; message: string; pass: boolean }[] = [
      { step: 1, message: "At least one Place / Business Name language is required.", pass: hasAnyName },
      { step: 1, message: "Place Type is required.", pass: !!form.placeType },
      { step: 1, message: "Minimum price in Baht is required.", pass: !!form.priceMin && Number.isFinite(numericPriceMin) && numericPriceMin >= 0 },
      { step: 1, message: "Maximum price in Baht is required and must be greater than or equal to minimum price.", pass: !!form.priceMax && Number.isFinite(numericPriceMax) && numericPriceMax >= numericPriceMin },
      { step: 1, message: "At least one description language must have 20 characters or more.", pass: hasAnyDescription },
      { step: 2, message: "Full Address is required.", pass: !!form.address.trim() },
      { step: 2, message: "City / Province is required.", pass: !!form.city.trim() },
      { step: 2, message: "GPS latitude and longitude are required.", pass: !!form.latitude.trim() && !!form.longitude.trim() },
      { step: 4, message: "Pork Policy is required.", pass: !!form.porkPolicy },
      { step: 4, message: "Alcohol Policy is required.", pass: !!form.alcoholPolicy },
      { step: 4, message: "Prayer Facility Status is required.", pass: !!form.prayerFacility },
      { step: 5, message: "Certificate Type is required.", pass: !!form.certType },
      { step: 5, message: "Certifying Source is required.", pass: !!effectiveCertAgency },
      { step: 5, message: "Certificate Number is required.", pass: !!form.certNumber.trim() },
      { step: 5, message: "Issue Date and Expiry Date are required.", pass: !!form.issueDate && !!form.expiryDate },
      { step: 5, message: "Certificate document upload is required.", pass: !!certDoc },
      { step: 6, message: "Contact Phone is required.", pass: !!form.contactPhone.trim() },
      { step: 6, message: "At least 3 photos are required.", pass: images.length >= 3 },
    ];
    const failed = checks.filter((check) => !check.pass);
    setValidationErrors(failed.map((check) => check.message));
    if (failed.length > 0) {
      setStep(failed[0].step);
      toast.error("Please complete required fields before submitting.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateSubmission()) return;
    const priceMin = Number(form.priceMin);
    const priceMax = Number(form.priceMax);
    const certAgency = form.certAgency === "other" ? form.customCertAgency.trim() : form.certAgency.trim();
    const submittedPlace = createSubmittedPlace({
      name: form.placeName.trim() || form.placeNameTh.trim() || form.placeNameMs.trim() || form.placeNameAr.trim(),
      type: placeTypeLabel(form.placeType),
      province: form.city.trim(),
      address: form.address.trim(),
      lat: form.latitude.trim(),
      lng: form.longitude.trim(),
      openingHours: form.openDaily ? `${form.openTime}-${form.closeTime}` : `${form.openTime}-${form.closeTime}`,
      phone: form.contactPhone.trim(),
      website: form.website.trim(),
      certAgency,
      certNumber: form.certNumber.trim(),
      certExpiry: form.expiryDate,
      priceRange: String(Math.round((priceMin + priceMax) / 2)),
      priceMin,
      priceMax,
      amenities: Array.from(new Set([
        ...amenities,
        ...(form.porkPolicy === "No pork served" ? ["No Pork"] : []),
        ...(form.alcoholPolicy === "No alcohol served" ? ["No Alcohol"] : []),
        ...(form.prayerFacility !== "No prayer facility" ? ["Prayer Room"] : []),
      ])),
      porkFree: form.porkPolicy === "No pork served",
      alcoholFree: form.alcoholPolicy === "No alcohol served",
      hasPrayer: form.prayerFacility !== "No prayer facility",
      images: images.length,
    });
    setSubmissionId(submittedPlace.id);
    setSubmitted(true);
  };

  // Post-submit success screen
  if (submitted) {
    return (
      <EntrepreneurLayout activePage="submit" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="size-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emerald-700 mb-2">Submission Received!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your place has been submitted as <strong>{submissionId}</strong> and is now <strong>Pending Review</strong> by our admin team. We will review your documents and listing details within 3–5 business days.
            </p>
          </div>
          <Card className="text-left border-emerald-200 bg-emerald-50">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-emerald-800">What happens next?</h3>
              <ol className="text-sm text-emerald-700 space-y-2 list-decimal list-inside">
                <li>Auto-validation checks your documents and data format.</li>
                <li>An admin reviews your submission and certification documents.</li>
                <li>You will receive an email notification once approved or if corrections are needed.</li>
                <li>Approved listings are published and appear in tourist search results.</li>
              </ol>
            </CardContent>
          </Card>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => onNavigate?.('listings')}>View My Listings</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSubmitted(false); setStep(1); resetForm(); }}>
              Submit Another Place
            </Button>
          </div>
        </div>
      </EntrepreneurLayout>
    );
  }

  const renderStepNav = () => (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center shrink-0">
          <button
            onClick={() => setStep(s.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              step === s.id
                ? 'bg-emerald-600 text-white'
                : step > s.id
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              step > s.id ? 'bg-emerald-600 text-white' : step === s.id ? 'bg-white text-emerald-600' : 'bg-slate-300 text-slate-600'
            }`}>
              {step > s.id ? <CheckCircle className="size-3.5" /> : s.id}
            </span>
            {s.label}
          </button>
          {i < STEPS.length - 1 && <ChevronRight className="size-4 text-slate-300 mx-1" />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Building2 className="size-5 text-emerald-600" /> Basic Information</CardTitle>
        <CardDescription>Start with your place name, type, description, and price range.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <div>
            <Label>Place / Business Name *</Label>
            <p className="text-xs text-muted-foreground mt-1">Enter at least one language. Other languages are optional.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="placeName" className="text-xs text-muted-foreground">English</Label>
              <Input id="placeName" placeholder="e.g. Al-Madina Halal Restaurant" value={form.placeName}
                onChange={e => setForm({...form, placeName: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="placeNameTh" className="text-xs text-muted-foreground">ไทย</Label>
              <Input id="placeNameTh" placeholder="เช่น ร้านอาหารอัลมาดีนะห์" value={form.placeNameTh}
                onChange={e => setForm({...form, placeNameTh: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="placeNameMs" className="text-xs text-muted-foreground">Bahasa Melayu</Label>
              <Input id="placeNameMs" placeholder="cth. Restoran Al-Madina" value={form.placeNameMs}
                onChange={e => setForm({...form, placeNameMs: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="placeNameAr" className="text-xs text-muted-foreground">العربية</Label>
              <Input id="placeNameAr" dir="rtl" placeholder="مثال: مطعم المدينة" value={form.placeNameAr}
                onChange={e => setForm({...form, placeNameAr: e.target.value})} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="placeType">Place Type *</Label>
            <select id="placeType" className="w-full border rounded-md px-3 py-2 bg-background text-sm" required
              value={form.placeType} onChange={e => setForm({...form, placeType: e.target.value})}>
              <option value="">Select type</option>
              {PLACE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 hidden">
            <Label htmlFor="subCategory">Sub-Category / Cuisine</Label>
            <Input id="subCategory" disabled placeholder="e.g. Thai, Middle Eastern, Resort" value={form.subCategory}
              onChange={e => setForm({...form, subCategory: e.target.value})} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price Range *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="priceMin"
                type="number"
                min="0"
                inputMode="numeric"
                className="pl-9 pr-16"
                placeholder="Minimum e.g. 150"
                value={form.priceMin}
                onChange={e => setForm({...form, priceMin: e.target.value})}
              />
              <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">Baht</span>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="priceMax"
                type="number"
                min="0"
                inputMode="numeric"
                className="pl-9 pr-16"
                placeholder="Maximum e.g. 450"
                value={form.priceMax}
                onChange={e => setForm({...form, priceMax: e.target.value})}
              />
              <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">Baht</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Tourist pages show this as a range. AI Planner uses the average for budget estimation.</p>
        </div>
        <div className="space-y-3">
          <div>
            <Label>Description *</Label>
            <p className="text-xs text-muted-foreground mt-1">Enter at least one language with 20 characters or more. Other languages are optional.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs text-muted-foreground">English</Label>
              <Textarea id="description" placeholder="Describe your place, services, and what makes it special for Muslim travelers..."
                rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descriptionTh" className="text-xs text-muted-foreground">ไทย</Label>
              <Textarea id="descriptionTh" placeholder="อธิบายสถานที่ บริการ และสิ่งอำนวยความสะดวกสำหรับนักท่องเที่ยวมุสลิม"
                rows={4} value={form.descriptionTh} onChange={e => setForm({...form, descriptionTh: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descriptionMs" className="text-xs text-muted-foreground">Bahasa Melayu</Label>
              <Textarea id="descriptionMs" placeholder="Terangkan tempat, perkhidmatan, dan kemudahan untuk pelancong Muslim"
                rows={4} value={form.descriptionMs} onChange={e => setForm({...form, descriptionMs: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descriptionAr" className="text-xs text-muted-foreground">العربية</Label>
              <Textarea id="descriptionAr" dir="rtl" placeholder="صف المكان والخدمات والمرافق المناسبة للمسافرين المسلمين"
                rows={4} value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="size-5 text-emerald-600" /> Location & Map</CardTitle>
        <CardDescription>Provide your address and GPS coordinates for accurate map placement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Full Address *</Label>
          <Input placeholder="House No, Street, Sub-district, District, Province, Postal Code"
            value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>City / Province *</Label>
          <Input placeholder="e.g. Bangkok, Chiang Mai, Phuket" value={form.city}
            onChange={e => setForm({...form, city: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">GPS Latitude *</Label>
            <Input id="latitude" placeholder="13.7563" value={form.latitude}
              onChange={e => setForm({...form, latitude: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">GPS Longitude *</Label>
            <Input id="longitude" placeholder="100.5018" value={form.longitude}
              onChange={e => setForm({...form, longitude: e.target.value})} />
          </div>
        </div>
        <div className="bg-slate-100 h-44 rounded-md flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed gap-2">
          <MapPin className="size-6 text-slate-400" />
          <p className="text-sm">Map Preview</p>
          <p className="text-xs">Enter coordinates above to see your pin location</p>
        </div>
        <div className="border-t pt-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><Clock className="size-4" /> Opening Hours *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Opening Time</Label>
              <Input type="time" value={form.openTime} onChange={e => setForm({...form, openTime: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Closing Time</Label>
              <Input type="time" value={form.closeTime} onChange={e => setForm({...form, closeTime: e.target.value})} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="openDaily" checked={form.openDaily}
              onCheckedChange={v => setForm({...form, openDaily: !!v})} />
            <Label htmlFor="openDaily">Open Every Day</Label>
          </div>
          {!form.openDaily && (
            <div className="space-y-2">
              <Label>Closed on (specify days)</Label>
              <Input placeholder="e.g. Sunday, Public Holidays" value={form.closedDays}
                onChange={e => setForm({...form, closedDays: e.target.value})} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Star className="size-5 text-emerald-600" /> Amenities</CardTitle>
        <CardDescription>Select all amenities available at your place.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AMENITIES.map(a => (
            <div key={a} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
              amenities.includes(a) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
            }`} onClick={() => toggleAmenity(a)}>
              <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
              <Label className="cursor-pointer text-sm">{a}</Label>
            </div>
          ))}
        </div>
        {amenities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {amenities.map(a => (
              <Badge key={a} variant="secondary" className="bg-emerald-100 text-emerald-700">{a}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Waves className="size-5 text-emerald-600" /> Halal-Friendly Facilities</CardTitle>
        <CardDescription>Accurately declare your halal policy and prayer facilities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold flex items-center gap-2"><UtensilsCrossed className="size-4 text-rose-500" /> Pork Policy *</Label>
            <div className="flex gap-3 flex-wrap">
              {['No pork served', 'Pork served', 'Separate kitchen (pork & halal)'].map(p => (
                <button key={p} type="button"
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    form.porkPolicy === p ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 hover:border-slate-300'
                  }`} onClick={() => setForm({...form, porkPolicy: p})}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Alcohol Policy *</Label>
            <div className="flex gap-3 flex-wrap">
              {['No alcohol served', 'Alcohol served', 'Alcohol in separate area'].map(p => (
                <button key={p} type="button"
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    form.alcoholPolicy === p ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 hover:border-slate-300'
                  }`} onClick={() => setForm({...form, alcoholPolicy: p})}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Prayer Facility Status *</Label>
            <div className="flex gap-3 flex-wrap">
              {['Dedicated prayer room', 'Shared prayer area', 'Prayer mats available', 'No prayer facility'].map(p => (
                <button key={p} type="button"
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    form.prayerFacility === p ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 hover:border-slate-300'
                  }`} onClick={() => setForm({...form, prayerFacility: p})}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-5">
          <Label className="font-semibold mb-3 block">Additional Halal-Friendly Features</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MUSLIM_FACILITIES.map(f => (
              <div key={f.id} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                muslimFacilities.includes(f.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
              }`} onClick={() => toggleMuslimFacility(f.id)}>
                <Checkbox checked={muslimFacilities.includes(f.id)} onCheckedChange={() => toggleMuslimFacility(f.id)} />
                <Label className="cursor-pointer text-sm">{f.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-emerald-600" /> Certification Documents</CardTitle>
        <CardDescription>Provide your halal or other certification details and upload the official document.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Certificate Type *</Label>
            <select className="w-full border rounded-md px-3 py-2 bg-background text-sm"
              value={form.certType} onChange={e => setForm({...form, certType: e.target.value})}>
              <option value="">Select type</option>
              <option value="halal-food">Halal Food Certificate</option>
              <option value="halal-hotel">Halal Friendly Hotel</option>
              <option value="traveler-friendly">Traveler-Friendly Certificate</option>
              <option value="sha">SHA Safety Standard</option>
              <option value="halal-tourism">Halal Tourism Certificate</option>
              <option value="other">Other Certification</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Certifying Source *</Label>
            <select className="w-full border rounded-md px-3 py-2 bg-background text-sm"
              value={form.certAgency} onChange={e => setForm({...form, certAgency: e.target.value})}>
              <option value="">Select certifying source</option>
              {CERTIFYING_SOURCE_RECORDS.map(source => (
                <option key={source.id} value={source.name}>{source.name}</option>
              ))}
              <option value="other">Other certifying source</option>
            </select>
          </div>
          {form.certAgency === "other" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customCertAgency">Other Certifying Source Name *</Label>
                <Input
                  id="customCertAgency"
                  placeholder="Enter certifying source name"
                  value={form.customCertAgency}
                  onChange={e => setForm({...form, customCertAgency: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customCertLogoUrl">Logo URL / File Reference</Label>
                <Input
                  id="customCertLogoUrl"
                  placeholder="Optional: paste logo URL or file reference"
                  value={form.customCertLogoUrl}
                  onChange={e => setForm({...form, customCertLogoUrl: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">If no logo is provided, Tourist Search will show the source name instead.</p>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="certNumber">Certificate Number *</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input id="certNumber" className="pl-9" placeholder="e.g. HAL-2024-00123" value={form.certNumber}
                onChange={e => setForm({...form, certNumber: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            {/* placeholder column */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date *</Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input id="issueDate" type="date" className="pl-9" value={form.issueDate}
                onChange={e => setForm({...form, issueDate: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input id="expiryDate" type="date" className="pl-9" value={form.expiryDate}
                onChange={e => setForm({...form, expiryDate: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="border-t pt-5 space-y-3">
          <Label className="font-semibold">Upload Certificate Document *</Label>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3 flex items-start gap-2">
              <LockKeyhole className="size-4 text-blue-700 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800">
                Your certificate file is treated as protected data. It is stored in restricted document storage, reviewed only by authorized admins, and access is recorded in the audit log.
              </p>
            </CardContent>
          </Card>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative ${
            certDoc ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'
          }`}>
            <FileText className={`size-10 mx-auto mb-2 ${certDoc ? 'text-emerald-600' : 'text-slate-400'}`} />
            {certDoc ? (
              <div>
                <p className="font-medium text-sm text-emerald-700">{certDoc.name}</p>
                <p className="text-xs text-emerald-600 mt-1">{(certDoc.size / 1024).toFixed(0)} KB — Uploaded</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium">Drag and drop your certificate here</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG — Max 10MB</p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleCertUpload} accept=".pdf,.jpg,.jpeg,.png" />
            <Button variant={certDoc ? "outline" : "secondary"} size="sm" className="mt-3 pointer-events-none">
              {certDoc ? 'Change Document' : 'Browse File'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertCircle className="size-3" /> Documents will be reviewed by our admin team. Accepted formats: PDF, JPG, PNG.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep6 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Phone className="size-5 text-emerald-600" /> Contact & Media</CardTitle>
        <CardDescription>Provide contact details and add photos of your establishment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Contact Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="+66 2 123 4567" value={form.contactPhone}
                onChange={e => setForm({...form, contactPhone: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="contact@yourplace.com" value={form.contactEmail}
                onChange={e => setForm({...form, contactEmail: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="www.yourplace.com" value={form.website}
                onChange={e => setForm({...form, website: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Google Maps Link</Label>
            <div className="relative">
              <Link className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="https://maps.google.com/..." value={form.googleMaps}
                onChange={e => setForm({...form, googleMaps: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Facebook Page</Label>
            <Input placeholder="facebook.com/yourpage" value={form.facebook}
              onChange={e => setForm({...form, facebook: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input placeholder="@yourhandle" value={form.instagram}
              onChange={e => setForm({...form, instagram: e.target.value})} />
          </div>
        </div>

        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-3 flex items-start gap-2">
            <LockKeyhole className="size-4 text-emerald-700 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-800">
              Contact information is used for verification and traveler support only. It may be masked in exports and handled under the platform privacy and PDPA governance workflow.
            </p>
          </CardContent>
        </Card>

        <div className="border-t pt-5 space-y-3">
          <Label className="font-semibold flex items-center gap-2"><ImageIcon className="size-4" /> Photos *</Label>
          <p className="text-xs text-muted-foreground">Upload at least 3 photos. Max 5MB each, JPG/PNG only.</p>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors relative">
            <ImageIcon className="size-12 mx-auto text-slate-400 mb-3" />
            <p className="text-sm font-medium">Drag and drop images here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageUpload} accept="image/jpeg,image/png,image/jpg" />
            <Button className="mt-3 pointer-events-none" size="sm">Select Photos</Button>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group border rounded-lg overflow-hidden h-24 bg-slate-100">
                  <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                    {(img.size / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep7 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle className="size-5 text-emerald-600" /> Review Before Submit</CardTitle>
        <CardDescription>Review your information before submitting for admin verification.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary rows */}
        {[
          { label: 'Place Name', value: form.placeName || form.placeNameTh || form.placeNameMs || form.placeNameAr || '—' },
          { label: 'Type', value: form.placeType ? placeTypeLabel(form.placeType) : '—' },
          { label: 'Price Range', value: form.priceMin && form.priceMax ? formatPriceRange(form.priceMin, form.priceMax) : '—' },
          { label: 'Address', value: form.address ? `${form.address}, ${form.city}` : '—' },
          { label: 'GPS', value: form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : '—' },
          { label: 'Hours', value: `${form.openTime} – ${form.closeTime}${form.openDaily ? ', Daily' : ''}` },
          { label: 'Pork Policy', value: form.porkPolicy || '—' },
          { label: 'Alcohol Policy', value: form.alcoholPolicy || '—' },
          { label: 'Prayer Facility', value: form.prayerFacility || '—' },
          { label: 'Amenities', value: amenities.length ? amenities.join(', ') : 'None selected' },
          { label: 'Muslim Facilities', value: muslimFacilities.length ? muslimFacilities.join(', ') : 'None selected' },
          { label: 'Certificate Type', value: form.certType || '—' },
          { label: 'Certifying Source', value: form.certAgency === "other" ? form.customCertAgency || '—' : form.certAgency || '—' },
          { label: 'Certifying Source Logo', value: form.customCertLogoUrl || 'Official logo / fallback name' },
          { label: 'Certificate #', value: form.certNumber || '—' },
          { label: 'Validity', value: form.issueDate && form.expiryDate ? `${form.issueDate} → ${form.expiryDate}` : '—' },
          { label: 'Certificate Doc', value: certDoc ? certDoc.name : '—' },
          { label: 'Photos', value: `${images.length} photo(s) uploaded` },
          { label: 'Contact', value: form.contactPhone || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start gap-4 border-b pb-3 last:border-b-0 last:pb-0">
            <span className="text-sm font-medium w-36 shrink-0 text-muted-foreground">{label}</span>
            <span className="text-sm">{value}</span>
          </div>
        ))}

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Important Declaration</p>
              <p className="text-xs text-amber-700 mt-1">
                By submitting, you confirm that all information provided is accurate and your documents are valid. Providing false information may result in permanent account suspension. You also acknowledge that the platform will process your business contact details and certification documents for verification, audit, and listing governance.
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );

  const stepContent: Record<number, JSX.Element> = {
    1: renderStep1(),
    2: renderStep2(),
    3: renderStep3(),
    4: renderStep4(),
    5: renderStep5(),
    6: renderStep6(),
    7: renderStep7(),
  };

  return (
    <EntrepreneurLayout activePage="submit" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Submit New Place</h1>
          <p className="text-muted-foreground">Complete all sections to submit your place for verification.</p>
        </div>

        {renderStepNav()}

        {validationErrors.length > 0 && (
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-rose-800">Please fix these required items before submission</p>
                  <ul className="mt-2 space-y-1 text-xs text-rose-700 list-disc list-inside">
                    {validationErrors.map((error) => <li key={error}>{error}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stepContent[step]}

        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={() => step > 1 ? setStep(s => s - 1) : onNavigate?.('listings')} className="flex items-center gap-2">
            <ChevronLeft className="size-4" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          {step < 7 ? (
            <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2" onClick={() => setStep(s => s + 1)}>
              Next <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2" onClick={handleSubmit}>
              <CheckCircle className="size-4" /> Submit for Verification
            </Button>
          )}
        </div>
      </div>
    </EntrepreneurLayout>
  );
}
