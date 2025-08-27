"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverCardContent = exports.HoverCardTrigger = exports.HoverCard = void 0;
const tslib_1 = require("tslib");
const HoverCardPrimitive = tslib_1.__importStar(require("@radix-ui/react-hover-card"));
const React = tslib_1.__importStar(require("react"));
const utils_1 = require("@/lib/utils");
const HoverCard = HoverCardPrimitive.Root;
exports.HoverCard = HoverCard;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
exports.HoverCardTrigger = HoverCardTrigger;
const HoverCardContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (<HoverCardPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} className={(0, utils_1.cn)("z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props}/>));
exports.HoverCardContent = HoverCardContent;
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;
//# sourceMappingURL=hover-card.js.map