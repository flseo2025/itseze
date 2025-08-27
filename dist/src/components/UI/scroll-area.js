"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollBar = exports.ScrollArea = void 0;
const tslib_1 = require("tslib");
const ScrollAreaPrimitive = tslib_1.__importStar(require("@radix-ui/react-scroll-area"));
const React = tslib_1.__importStar(require("react"));
const utils_1 = require("@/lib/utils");
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (<ScrollAreaPrimitive.Root ref={ref} className={(0, utils_1.cn)("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>));
exports.ScrollArea = ScrollArea;
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (<ScrollAreaPrimitive.ScrollAreaScrollbar ref={ref} orientation={orientation} className={(0, utils_1.cn)("flex touch-none select-none transition-colors", orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]", className)} {...props}>
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border"/>
  </ScrollAreaPrimitive.ScrollAreaScrollbar>));
exports.ScrollBar = ScrollBar;
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
//# sourceMappingURL=scroll-area.js.map