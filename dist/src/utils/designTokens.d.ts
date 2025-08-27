export declare const BRAND_COLORS: {
    readonly primary: "hsl(var(--app-green))";
    readonly primaryDark: "hsl(var(--app-green-dark))";
    readonly primaryLight: "hsl(var(--app-green-light))";
    readonly background: "hsl(var(--app-background))";
    readonly formBackground: "hsl(var(--form-background))";
};
export declare const BRAND_GRADIENTS: {
    readonly primary: "linear-gradient(135deg, #68C72A 0%, #029100 100%)";
    readonly header: "linear-gradient(to right, var(--app-green), var(--app-green-dark))";
};
export declare const COMPONENT_HEIGHTS: {
    readonly mobile: "h-10";
    readonly base: "h-12";
    readonly medium: "h-14";
    readonly large: "h-16";
};
export declare const SPACING_PATTERNS: {
    readonly menuGap: "space-y-0.5";
    readonly contentGap: "space-y-3";
    readonly sectionGap: "space-y-4";
};
export declare const getResponsiveHeight: () => string;
export declare const BUTTON_VARIANTS: {
    readonly primary: "bg-app-green hover:bg-app-green-dark text-white";
    readonly secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
    readonly outline: "border border-app-green text-app-green hover:bg-app-green hover:text-white";
};
export declare const MENU_ITEM_CLASSES: {
    readonly container: "bg-white hover:bg-gray-50 transition-colors min-h-[49px] flex items-center shadow-sm border border-gray-100 rounded-sm";
    readonly numberSection: "w-[25px] flex-shrink-0 flex items-center justify-center text-black text-lg font-roboto select-none";
    readonly divider: "w-px bg-black opacity-71 self-stretch mx-0";
    readonly textSection: "flex-1 px-4 py-3 flex items-center";
    readonly text: "text-lg font-roboto text-black select-none break-words leading-tight";
};
export declare const HEADER_CLASSES: {
    readonly container: "bg-gradient-to-r from-app-green to-app-green-dark text-white p-4";
    readonly title: "text-white font-bold text-lg";
};
export declare const DIALOG_CLASSES: {
    readonly content: "max-w-md mx-auto bg-white";
    readonly header: "bg-gradient-to-r from-app-green to-app-green-dark text-white p-4 -m-6 mb-4";
    readonly title: "text-white font-bold text-lg";
};
export declare const validateEdgeToEdgeLayout: (className: string) => boolean;
export interface MenuItemProps {
    id: number;
    title: string;
    subtitle?: string;
    hasDropdown?: boolean;
    subItems?: Array<{
        id: number;
        title: string;
    }>;
}
export interface ScreenProps {
    onNavigate?: (screen: string) => void;
    currentScreen?: string;
}
export interface NavigationItem {
    letter: string;
    screen: string;
    hasArrow?: boolean;
}
//# sourceMappingURL=designTokens.d.ts.map