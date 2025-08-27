/**
 * ItsEZE App Design System Utilities
 * Provides consistent styling patterns and validation functions
 */

// Brand color validation
export const BRAND_COLORS = {
  primary: 'hsl(var(--app-green))',
  primaryDark: 'hsl(var(--app-green-dark))',
  primaryLight: 'hsl(var(--app-green-light))',
  background: 'hsl(var(--app-background))',
  formBackground: 'hsl(var(--form-background))',
} as const;

// Common gradient patterns
export const BRAND_GRADIENTS = {
  primary: 'linear-gradient(135deg, #68C72A 0%, #029100 100%)',
  header: 'linear-gradient(to right, var(--app-green), var(--app-green-dark))',
} as const;

// Standard component height scales
export const COMPONENT_HEIGHTS = {
  mobile: 'h-10', // 40px
  base: 'h-12', // 48px
  medium: 'h-14', // 56px
  large: 'h-16', // 64px
} as const;

// Consistent spacing patterns
export const SPACING_PATTERNS = {
  menuGap: 'space-y-0.5',
  contentGap: 'space-y-3',
  sectionGap: 'space-y-4',
} as const;

/**
 * Generates responsive height classes for navigation elements
 */
export const getResponsiveHeight = () => {
  return `${COMPONENT_HEIGHTS.base} md:${COMPONENT_HEIGHTS.medium} lg:${COMPONENT_HEIGHTS.large}`;
};

/**
 * Standard button variant classes
 */
export const BUTTON_VARIANTS = {
  primary: 'bg-app-green hover:bg-app-green-dark text-white',
  secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  outline: 'border border-app-green text-app-green hover:bg-app-green hover:text-white',
} as const;

/**
 * Menu item styling pattern
 */
export const MENU_ITEM_CLASSES = {
  container:
    'bg-white hover:bg-gray-50 transition-colors min-h-[49px] flex items-center shadow-sm border border-gray-100 rounded-sm',
  numberSection:
    'w-[25px] flex-shrink-0 flex items-center justify-center text-black text-lg font-roboto select-none',
  divider: 'w-px bg-black opacity-71 self-stretch mx-0',
  textSection: 'flex-1 px-4 py-3 flex items-center',
  text: 'text-lg font-roboto text-black select-none break-words leading-tight',
} as const;

/**
 * Header styling pattern
 */
export const HEADER_CLASSES = {
  container: 'bg-gradient-to-r from-app-green to-app-green-dark text-white p-4',
  title: 'text-white font-bold text-lg',
} as const;

/**
 * Dialog styling pattern
 */
export const DIALOG_CLASSES = {
  content: 'max-w-md mx-auto bg-white',
  header: 'bg-gradient-to-r from-app-green to-app-green-dark text-white p-4 -m-6 mb-4',
  title: 'text-white font-bold text-lg',
} as const;

/**
 * Validates if a component follows edge-to-edge layout principles
 */
export const validateEdgeToEdgeLayout = (className: string): boolean => {
  const problematicClasses = ['px-', 'mx-', 'ml-', 'mr-'];
  return !problematicClasses.some(cls => className.includes(cls));
};

/**
 * Common interface for menu items
 */
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

/**
 * Standard props for screen components
 */
export interface ScreenProps {
  onNavigate?: (screen: string) => void;
  currentScreen?: string;
}

/**
 * Navigation item interface
 */
export interface NavigationItem {
  letter: string;
  screen: string;
  hasArrow?: boolean;
}
