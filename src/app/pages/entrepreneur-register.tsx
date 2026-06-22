import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Building2, Mail, Phone, MapPin, FileText, Check, Lock, ShieldCheck, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Progress } from "../components/ui/progress";

interface EntrepreneurRegisterProps {
  onRegister?: () => void;
  onNavigateToLogin?: () => void;
}

export function EntrepreneurRegister({ onRegister, onNavigateToLogin }: EntrepreneurRegisterProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Req 2.2: Password Policy Logic
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    setPasswordStrength(score);
  }, [password]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password strength before proceeding
    if (passwordStrength < 75) {
      toast.error("Please create a stronger password");
      return;
    }
    // Req 2.1: Proceed to Email Verification
    setStep(2);
    toast.success("Verification code sent to " + email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl border-emerald-100">
        <CardHeader className="text-center border-b bg-emerald-50/50 rounded-t-xl pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
             <div className="bg-white p-2 rounded-full shadow-sm">
               <span className="text-2xl">🕌</span>
             </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Registration</h1>
          <p className="text-muted-foreground">Join our global Halal tourism network</p>
          
          {/* Progress Tracker */}
          <div className="flex items-center justify-center gap-2 mt-8 px-4">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Verify' },
              { num: 3, label: 'Documents' },
              { num: 4, label: 'Review' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`size-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      s.num <= step 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {s.num < step ? <Check className="size-4" /> : s.num}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${s.num <= step ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`w-12 h-[2px] mb-4 mx-2 rounded-full ${s.num < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Step 1: Account Creation & Basic Info */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleStep1Submit}>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Lock className="size-5 text-emerald-600" />
                  Account Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="owner@business.com" 
                        className="pl-10" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">We'll send a verification code to this email.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        className="pl-10" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {/* Req 2.2: Password Strength Indicator */}
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between text-xs">
                        <span className={passwordStrength < 50 ? "text-red-500" : "text-emerald-600"}>
                          {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Good" : "Strong"}
                        </span>
                        <span className="text-muted-foreground">{passwordStrength}%</span>
                      </div>
                      <Progress value={passwordStrength} className="h-1" />
                      <p className="text-[10px] text-muted-foreground">
                        Must be 8+ chars, include numbers & special characters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building2 className="size-5 text-emerald-600" />
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input id="businessName" placeholder="e.g. Al-Madina Restaurant" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <select id="businessType" className="w-full border rounded-md px-3 py-2 bg-background" required>
                      <option value="">Select type</option>
                      <option>Restaurant</option>
                      <option>Hotel</option>
                      <option>Mosque/Prayer Room</option>
                      <option>Tourism Attraction</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="+66" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Province *</Label>
                    <Input id="city" placeholder="e.g. Bangkok" required />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                  Continue to Verification
                </Button>
                <div className="text-center mt-4">
                  <span className="text-sm text-muted-foreground">Already a partner? </span>
                  <button type="button" onClick={onNavigateToLogin} className="text-sm font-semibold text-emerald-600 hover:underline">
                    Login here
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 2: Email Verification (Req 2.1) */}
          {step === 2 && (
            <div className="max-w-md mx-auto text-center space-y-6 py-4">
              <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Mail className="size-10 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Verify Your Email</h2>
                <p className="text-muted-foreground mt-2">
                  We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
                  Enter it below to verify your account.
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Input 
                    key={i} 
                    className="w-12 h-14 text-center text-2xl font-bold" 
                    maxLength={1}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <Button onClick={() => setStep(3)} className="w-full" size="lg">
                Verify Email
              </Button>

              <button type="button" className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground">
                <RefreshCw className="size-3" /> Resend Code
              </button>
              
              <Button variant="ghost" onClick={() => setStep(1)} className="w-full">
                Back to Edit Email
              </Button>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Verify Business Identity</h2>
                <p className="text-muted-foreground">Upload documents to verify your business legitimacy.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-white transition-colors">
                    <FileText className="size-6 text-slate-500" />
                  </div>
                  <p className="font-semibold text-sm">Business Registration</p>
                  <p className="text-xs text-muted-foreground mb-4">DBD Registration or similar</p>
                  <Button type="button" variant="outline" size="sm">Select File</Button>
                </div>

                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-white transition-colors">
                    <FileText className="size-6 text-slate-500" />
                  </div>
                  <p className="font-semibold text-sm">Halal Certification</p>
                  <p className="text-xs text-muted-foreground mb-4">Issued by CICOT or local authority</p>
                  <Button type="button" variant="outline" size="sm">Select File</Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                <Button type="submit" className="flex-1">Continue to Review</Button>
              </div>
            </form>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold">Review Application</h2>
                <p className="text-muted-foreground">Please ensure all details are correct.</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 space-y-4 border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Business Name</span>
                    <span className="font-medium">Al-Madina Restaurant</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Type</span>
                    <span className="font-medium">Restaurant</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Email</span>
                    <span className="font-medium">{email} <span className="text-emerald-600 text-xs ml-1">(Verified)</span></span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Phone</span>
                    <span className="font-medium">+66 89 123 4567</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <Checkbox id="terms" className="mt-1" />
                <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed text-emerald-900">
                  I confirm that I am the authorized owner/manager of this business and agree to the <a href="#" className="underline font-semibold">Terms of Service</a>. I understand that false information may lead to account suspension.
                </Label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
                <Button onClick={onRegister} className="flex-1 bg-emerald-600 hover:bg-emerald-700">Submit Application</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
