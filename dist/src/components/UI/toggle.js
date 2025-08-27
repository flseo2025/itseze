"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleVariants = exports.Toggle = void 0;
const tslib_1 = require("tslib");
const TogglePrimitive = tslib_1.__importStar(require("@radix-ui/react-toggle"));
const class_variance_authority_1 = require("class-variance-authority");
const React = tslib_1.__importStar(require("react"));
const utils_1 = require("@/lib/utils");
const toggleVariants = (0, class_variance_authority_1.cva)("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground", {
    variants: {
        variant: {
            default: "bg-transparent",
            outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        },
        size: {
            default: "h-10 px-3",
            sm: "h-9 px-2.5",
            lg: "h-11 px-5",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
exports.toggleVariants = toggleVariants;
const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (<TogglePrimitive.Root ref={ref} className={(0, utils_1.cn)(toggleVariants({ variant, size, className }))} {...props}/>));
exports.Toggle = Toggle;
Toggle.displayName = TogglePrimitive.Root.displayName;
//# sourceMappingURL=toggle.js.map