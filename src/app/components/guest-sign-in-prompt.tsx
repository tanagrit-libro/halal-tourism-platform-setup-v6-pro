import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface GuestSignInPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function GuestSignInPrompt({
  open,
  onOpenChange,
  onSignIn,
  onCreateAccount,
}: GuestSignInPromptProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to use this feature</DialogTitle>
          <DialogDescription>
            You can continue browsing without an account. Sign in only when you want to save
            favorites, write reviews, manage trips, or use AI Planner quota.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={onSignIn}>Sign in</Button>
          <Button variant="outline" onClick={onCreateAccount}>
            Create account
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Continue browsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
