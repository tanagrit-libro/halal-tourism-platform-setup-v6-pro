import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EntrepreneurLoginProps {
  onLogin?: () => void;
  onNavigateToRegister?: () => void;
}

export function EntrepreneurLogin({ onLogin, onNavigateToRegister }: EntrepreneurLoginProps) {
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simulate API check
      setStep('2fa');
      toast.info("Verification code sent to your email");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 6) {
      // Req 2.3: 2FA Verification
      toast.success("Login successful");
      onLogin?.();
    } else {
      toast.error("Please enter a valid 6-digit code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-emerald-100">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {step === 'credentials' ? 'Entrepreneur Login' : 'Two-Factor Authentication'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === 'credentials' 
              ? 'Access your business management dashboard' 
              : `Enter the code sent to ${email}`}
          </p>
        </CardHeader>
        <CardContent>
          {step === 'credentials' ? (
            <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                <strong>Single active session policy:</strong> each business account can keep only one active login session at a time. A new login will replace the previous session in production.
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="name@company.com" 
                    className="pl-10" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <a href="#" className="text-xs text-emerald-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    id="login-password" 
                    type="password" 
                    className="pl-10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Req 2.4: Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer font-normal">
                  Remember me for 15 days
                </Label>
              </div>
              
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                Continue <ArrowRight className="ml-2 size-4" />
              </Button>
              
              <div className="text-center text-sm pt-2">
                Don't have an account?{" "}
                <button 
                  type="button"
                  className="text-emerald-600 hover:underline font-medium"
                  onClick={onNavigateToRegister}
                >
                  Register here
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handle2FASubmit}>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Didn't receive the code?</p>
                <button type="button" className="text-emerald-600 hover:underline font-medium mt-1">
                  Resend Code
                </button>
              </div>

              <div className="space-y-3">
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                  <ShieldCheck className="mr-2 size-4" /> Verify & Login
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setStep('credentials')}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
