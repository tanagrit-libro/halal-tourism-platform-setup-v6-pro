import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { HalalLogo } from "../components/halal-logo";

interface TouristRegisterProps {
  onRegister: () => void;
  onNavigate?: (page: string) => void;
}

export function TouristRegister({ onRegister, onNavigate }: TouristRegisterProps) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
      <Card className="w-full max-w-md border-slate-200 shadow-sm">
        <CardHeader className="space-y-4">
          <HalalLogo />
          <div>
            <CardTitle className="text-2xl">Create your GoSafar account</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              A lightweight account helps you save trips, manage favorites, and use AI Planner quota.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={onRegister}>
            <span className="mr-2 font-semibold text-blue-600">G</span>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" />
            or
            <Separator className="flex-1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tourist-name">Full name</Label>
            <Input id="tourist-name" placeholder="Your full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tourist-register-email">Email</Label>
            <Input id="tourist-register-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="tourist-register-password">Password</Label>
              <Input id="tourist-register-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tourist-confirm-password">Confirm password</Label>
              <Input id="tourist-confirm-password" type="password" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tourist-country">Nationality or country of residence (optional)</Label>
            <Input id="tourist-country" placeholder="Thailand, Malaysia, Indonesia..." />
          </div>
          <div className="space-y-2">
            <Label>Preferred language (optional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="th">Thai</SelectItem>
                <SelectItem value="ms">Malay</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox className="mt-0.5" />
            <span>I agree to the terms and privacy policy.</span>
          </label>
          <Button className="w-full" onClick={onRegister}>
            Create account
          </Button>
          <div className="space-y-2 text-center text-sm">
            <button className="text-emerald-700 hover:underline" type="button" onClick={() => onNavigate?.("login")}>
              Already have an account? Sign in
            </button>
            <div>
              <button className="text-muted-foreground hover:text-foreground hover:underline" type="button" onClick={() => onNavigate?.("home")}>
                Continue as guest
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
