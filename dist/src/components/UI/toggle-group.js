"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleGroupItem = exports.ToggleGroup = void 0;
const tslib_1 = require("tslib");
const ToggleGroupPrimitive = tslib_1.__importStar(require("@radix-ui/react-toggle-group"));
const React = tslib_1.__importStar(require("react"));
const toggle_1 = require("@/components/ui/toggle");
const utils_1 = require("@/lib/utils");
const ToggleGroupContext = React.createContext({
    size: "default",
    variant: "default",
});
const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (<ToggleGroupPrimitive.Root ref={ref} className={(0, utils_1.cn)("flex items-center justify-center gap-1", className)} {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>));
exports.ToggleGroup = ToggleGroup;
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    return (<ToggleGroupPrimitive.Item ref={ref} className={(0, utils_1.cn)((0, toggle_1.toggleVariants)({
            variant: context.variant || variant,
            size: context.size || size,
        }), className)} {...props}>
      {children}
    </ToggleGroupPrimitive.Item>);
});
exports.ToggleGroupItem = ToggleGroupItem;
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
//# sourceMappingURL=toggle-group.js.map