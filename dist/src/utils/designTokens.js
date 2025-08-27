"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEdgeToEdgeLayout = exports.DIALOG_CLASSES = exports.HEADER_CLASSES = exports.MENU_ITEM_CLASSES = exports.BUTTON_VARIANTS = exports.getResponsiveHeight = exports.SPACING_PATTERNS = exports.COMPONENT_HEIGHTS = exports.BRAND_GRADIENTS = exports.BRAND_COLORS = void 0;
exports.BRAND_COLORS = {
    primary: 'hsl(var(--app-green))',
    primaryDark: 'hsl(var(--app-green-dark))',
    primaryLight: 'hsl(var(--app-green-light))',
    background: 'hsl(var(--app-background))',
    formBackground: 'hsl(var(--form-background))',
};
exports.BRAND_GRADIENTS = {
    primary: 'linear-gradient(135deg, #68C72A 0%, #029100 100%)',
    header: 'linear-gradient(to right, var(--app-green), var(--app-green-dark))',
};
exports.COMPONENT_HEIGHTS = {
    mobile: 'h-10',
    base: 'h-12',
    medium: 'h-14',
    large: 'h-16',
};
exports.SPACING_PATTERNS = {
    menuGap: 'space-y-0.5',
    contentGap: 'space-y-3',
    sectionGap: 'space-y-4',
};
const getResponsiveHeight = () => {
    return `${exports.COMPONENT_HEIGHTS.base} md:${exports.COMPONENT_HEIGHTS.medium} lg:${exports.COMPONENT_HEIGHTS.large}`;
};
exports.getResponsiveHeight = getResponsiveHeight;
exports.BUTTON_VARIANTS = {
    primary: 'bg-app-green hover:bg-app-green-dark text-white',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    outline: 'border border-app-green text-app-green hover:bg-app-green hover:text-white',
};
exports.MENU_ITEM_CLASSES = {
    container: 'bg-white hover:bg-gray-50 transition-colors min-h-[49px] flex items-center shadow-sm border border-gray-100 rounded-sm',
    numberSection: 'w-[25px] flex-shrink-0 flex items-center justify-center text-black text-lg font-roboto select-none',
    divider: 'w-px bg-black opacity-71 self-stretch mx-0',
    textSection: 'flex-1 px-4 py-3 flex items-center',
    text: 'text-lg font-roboto text-black select-none break-words leading-tight',
};
exports.HEADER_CLASSES = {
    container: 'bg-gradient-to-r from-app-green to-app-green-dark text-white p-4',
    title: 'text-white font-bold text-lg',
};
exports.DIALOG_CLASSES = {
    content: 'max-w-md mx-auto bg-white',
    header: 'bg-gradient-to-r from-app-green to-app-green-dark text-white p-4 -m-6 mb-4',
    title: 'text-white font-bold text-lg',
};
const validateEdgeToEdgeLayout = (className) => {
    const problematicClasses = ['px-', 'mx-', 'ml-', 'mr-'];
    return !problematicClasses.some(cls => className.includes(cls));
};
exports.validateEdgeToEdgeLayout = validateEdgeToEdgeLayout;
//# sourceMappingURL=designTokens.js.map