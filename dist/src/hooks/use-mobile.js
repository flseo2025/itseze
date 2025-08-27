"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsMobile = useIsMobile;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(undefined);
    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, []);
    return !!isMobile;
}
//# sourceMappingURL=use-mobile.js.map