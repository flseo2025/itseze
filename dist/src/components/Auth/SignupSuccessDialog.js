"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const SignupSuccessDialog = ({ open, onOpenChange, email, }) => {
    return (<dialog_1.Dialog open={open} onOpenChange={onOpenChange}>
      <dialog_1.DialogContent className="sm:max-w-md">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Check your email</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            We’ve sent a confirmation link to{` `}
            <span className="font-medium text-foreground">{email || "your email"}</span>.
            Please confirm your account to continue.
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>
        <dialog_1.DialogFooter>
          <button_1.Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Got it
          </button_1.Button>
        </dialog_1.DialogFooter>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
};
exports.default = SignupSuccessDialog;
//# sourceMappingURL=SignupSuccessDialog.js.map