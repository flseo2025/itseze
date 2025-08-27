
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SignupSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

const SignupSuccessDialog: React.FC<SignupSuccessDialogProps> = ({
  open,
  onOpenChange,
  email,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check your email</DialogTitle>
          <DialogDescription>
            We’ve sent a confirmation link to{` `}
            <span className="font-medium text-foreground">{email || "your email"}</span>.
            Please confirm your account to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupSuccessDialog;
