"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarFallback = exports.AvatarImage = exports.Avatar = void 0;
const tslib_1 = require("tslib");
const AvatarPrimitive = tslib_1.__importStar(require("@radix-ui/react-avatar"));
const React = tslib_1.__importStar(require("react"));
const utils_1 = require("@/lib/utils");
const Avatar = React.forwardRef(({ className, ...props }, ref) => (<AvatarPrimitive.Root ref={ref} className={(0, utils_1.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}/>));
exports.Avatar = Avatar;
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (<AvatarPrimitive.Image ref={ref} className={(0, utils_1.cn)("aspect-square h-full w-full", className)} {...props}/>));
exports.AvatarImage = AvatarImage;
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (<AvatarPrimitive.Fallback ref={ref} className={(0, utils_1.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted", className)} {...props}/>));
exports.AvatarFallback = AvatarFallback;
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
//# sourceMappingURL=avatar.js.map