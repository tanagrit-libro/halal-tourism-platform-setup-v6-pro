import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { HalalLogo } from "../components/halal-logo";

interface TouristLoginProps {
  onLogin: () => void;
  onNavigate?: (page: string) => void;
}

export function TouristLogin({ onLogin, onNavigate }: TouristLoginProps) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
      <Card className="w-full max-w-md border-slate-200 shadow-sm">
        <CardHeader className="space-y-4">
          <HalalLogo />
          <div>
            <CardTitle className="text-2xl">Sign in to GoSafar Thailand</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Save favorites, write reviews, manage trips, and use your AI Planner quota.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={onLogin}>
            <span className="mr-2 font-semibold text-blue-600">G</span>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" />
            or
            <Separator className="flex-1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tourist-email">Email</Label>
            <Input id="tourist-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="tourist-password">Password</Label>
              <button className="text-xs text-emerald-700 hover:underline" type="button">
                Forgot password?
              </button>
            </div>
            <Input id="tourist-password" type="password" placeholder="Enter your password" />
          </div>
          <Button className="w-full" onClick={onLogin}>
            Sign in
          </Button>
          <div className="space-y-2 text-center text-sm">
            <button className="text-emerald-700 hover:underline" type="button" onClick={() => onNavigate?.("register")}>
              Create an account
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
