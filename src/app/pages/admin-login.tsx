import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Lock, Mail, Smartphone, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin?: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setLoading(true);
    // Simulate API verification delay
    setTimeout(() => {
      setLoading(false);
      // Move to 2FA step (Requirement 2.2)
      setStep('2fa');
      toast.info("Please enter the verification code sent to your device");
    }, 1500);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = twoFactorCode.join("");
    if (code.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    setLoading(true);
    // Simulate 2FA verification
    setTimeout(() => {
      setLoading(false);
      // Simulate Session Management (Requirement 2.3)
      if (rememberMe) {
        localStorage.setItem("admin_session_expiry", new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()); // 15 days
      } else {
        localStorage.setItem("admin_session_expiry", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()); // 1 day
      }
      
      toast.success("Login successful");
      onLogin?.();
    }, 1500);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...twoFactorCode];
    newCode[index] = value;
    setTwoFactorCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1600')] bg-cover bg-center opacity-10 blur-sm"></div>
      
      <Card className="w-full max-w-md relative z-10 border-slate-700 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto size-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            {step === 'login' 
              ? "Secure access for authorized personnel" 
              : "Two-Factor Authentication Required"
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'login' ? (
            /* Login Form (Requirement 2.1) */
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                <strong>Single active session policy:</strong> signing in on this device will lock this admin account to one active session and revoke older admin sessions in the production design.
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@halaltourism.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="text-xs p-0 h-auto" type="button">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer font-normal">
                  Remember me for 15 days (Requirement 2.3)
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          ) : (
            /* 2FA Form (Requirement 2.2) */
            <form className="space-y-6" onSubmit={handle2FASubmit}>
              <div className="text-center space-y-2">
                <Smartphone className="size-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit verification code sent to your registered device ending in **88.
                </p>
              </div>

              <div className="flex justify-between gap-2">
                {twoFactorCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Verifying Code...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>

              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => setStep('login')}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="size-4 mr-1" />
                  Back to Login
                </Button>
                <Button variant="link" size="sm" type="button">
                  Resend Code
                </Button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Protected by Enterprise Grade Security.
              <br />
              Supports 100+ concurrent sessions/min.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
