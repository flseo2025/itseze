"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
const tslib_1 = require("tslib");
const SliderPrimitive = tslib_1.__importStar(require("@radix-ui/react-slider"));
const React = tslib_1.__importStar(require("react"));
const utils_1 = require("@/lib/utils");
const Slider = React.forwardRef(({ className, ...props }, ref) => (<SliderPrimitive.Root ref={ref} className={(0, utils_1.cn)("relative flex w-full touch-none select-none items-center", className)} {...props}>
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary"/>
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"/>
  </SliderPrimitive.Root>));
exports.Slider = Slider;
Slider.displayName = SliderPrimitive.Root.displayName;
//# sourceMappingURL=slider.js.map