# ItsEZE™ Claude Flow Design Brief
*Comprehensive design specification for Claude Flow agents - SINGLE SOURCE OF TRUTH*

## 🎯 CRITICAL DESIGN REQUIREMENTS - NON-NEGOTIABLE

### **Brand Identity & Visual Design**
- **App Name**: ItsEZE™ (with trademark symbol)
- **Tagline**: "Your Business Startup App"
- **Company**: "By Fast Forward App ®"
- **Version**: "V 1.0.0"

### **Primary Colors & Design System**
```css
/* Brand Colors (from index.css) */
--app-green: 88 60% 50%;              /* #68C72A */
--app-green-dark: 88 60% 42%;         /* #029100 */  
--app-green-light: 88 60% 58%;        /* Lighter variant */
--app-green-subtle: 88 30% 95%;       /* Very light background */

/* Backgrounds */
--app-background: 160 25% 85%;        /* Light mint background */
--form-background: 0 0% 100%;         /* Pure white for forms */

/* Brand gradients - EXACT SPECIFICATIONS */
.bg-brand-gradient {
  background: linear-gradient(135deg, #68C72A 0%, #029100 100%);
}

.bg-header-gradient {
  background: linear-gradient(to right, hsl(var(--app-green)), hsl(var(--app-green-dark)));
}
```

### **Typography System**
```css
fontFamily: {
  'roboto': ['Roboto', 'sans-serif'],
}
```
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Mobile-first scaling**: text-sm (14px) → text-base (16px) → text-lg (18px) → text-xl (20px) → text-2xl (24px)

---

## 🏗 ESTABLISHED TECHNOLOGY STACK - DO NOT CHANGE

```typescript
Frontend: React 18.3.1 + TypeScript + Vite
UI Framework: Tailwind CSS 3.4.11 + shadcn/ui (Radix UI primitives)
Backend: Supabase (Database, Auth, Edge Functions, Storage)
Mobile: Capacitor (planned for native functionality)
State Management: React Context API (AuthContext, UserContext)
Data Fetching: TanStack React Query 5.56.2
Forms: React Hook Form 7.53.0 + Zod 3.23.8 validation
Router: React Router DOM 6.26.2
Icons: Lucide React 0.462.0
```

### **Critical Dependencies - MAINTAIN VERSIONS**
```json
"@supabase/supabase-js": "^2.53.0"
"@tanstack/react-query": "^5.56.2"  
"react": "^18.3.1"
"react-hook-form": "^7.53.0"
"tailwindcss": "^3.4.11"
"zod": "^3.23.8"
```

---

## 📱 TRADEMARKED NAVIGATION STRUCTURE - NEVER MODIFY

### **Bottom Toolbar (Fixed Order - LEGALLY PROTECTED)**
```typescript
// EXACT ORDER - DO NOT CHANGE
const TOOLBAR_ITEMS = [
  { letter: 'X', name: 'CLOSE', action: 'navigateBack' },
  { letter: 'P', name: 'PROFILE', action: 'viewContactProfile' },  
  { letter: 'H', name: 'HISTORY', action: 'viewContactHistory' },
  { letter: 'N', name: 'NOTES', action: 'manageContactNotes' },
  { letter: 'M', name: 'MESSAGEZE', action: 'sendTemplateMessage' },
  { letter: 'D', name: 'DOCUMENTS', action: 'shareDocuments' },
  { letter: 'B', name: 'BIZ OPPS', action: 'shareBusinessVideos' },
  { letter: 'F', name: 'FOLLOWEZE', action: 'scheduleFollowUp' },
  { letter: 'C', name: 'CALL', action: 'callContact', hasSubmenu: true }
];
```

### **Header Navigation (GO/ADD/GROW/HOW)**
```typescript
// Main navigation buttons in header
const HEADER_NAVIGATION = {
  GO: { 
    screen: 'main',
    actions: ['New Contact', 'Contact List', 'My Score'] 
  },
  ADD: { 
    screen: 'add',
    actions: ['Register Distributor', 'Register Customer', 'Send Links'] 
  },
  GROW: { 
    screen: 'grow',
    actions: ['Welcome Templates', 'Affiliate Links', 'Thank You Messages'] 
  },
  HOW: { 
    screen: 'how',
    actions: ['Tutorial', 'Profile Management', 'Mini Checklist'] 
  }
};
```

### **CRITICAL NAVIGATION RULE - CONTACT SCOPING**
```typescript
// Bottom toolbar is ALWAYS scoped to currently selected contact
// Toolbar actions operate on that contact ONLY
// User's profile (/profile) accessed via Slide-Out Menu ONLY
// Contact selection activates toolbar (gray → active state)

// ❌ WRONG - Don't make contact-scoped actions affect user profile
function handleProfileAction() {
  navigate('/profile'); // This is WRONG for contact-scoped toolbar
}

// ✅ CORRECT - Contact-scoped profile action
function handleContactProfileAction(selectedContact) {
  showContactProfile(selectedContact); // Operates on selected contact
}
```

---

## 🗄 DATA ARCHITECTURE - ESTABLISHED INTERFACES

### **Contact Interface (EXACT STRUCTURE)**
```typescript
export interface Contact {
  id: string;
  user_id: string;
  first_name: string;
  last_name?: string | null;
  full_name: string;
  phone_number?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  company?: string | null;
  job_title?: string | null;
  department?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;      // Used for WeChat storage
  instagram_url?: string | null;
  facebook_url?: string | null;     // Used for FB Messenger storage
  website_url?: string | null;
  avatar_url?: string | null;
  tags: string[];
  category?: string | null;         // Used for Groups
  relationship_type?: string | null;
  importance_level: number;
  notes?: string | null;
  source?: string | null;
  referring_contact_id?: string | null;
  status: string;
  last_contacted_at?: string | null;
  contact_frequency_days?: number | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state_province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  created_at: string;
  updated_at: string;
}
```

### **User Interface (EXACT STRUCTURE)**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accountType: 'user' | 'admin' | 'super_admin';
  language: 'en' | 'es' | 'fr';
}
```

---

## 🎨 COMPONENT PATTERNS - ESTABLISHED STANDARDS

### **SVGMenuItem Pattern (EXACT IMPLEMENTATION)**
```tsx
// This is the STANDARD menu item pattern - DO NOT MODIFY
<div className="bg-white hover:bg-gray-50 transition-colors min-h-[49px] flex items-center shadow-sm border border-gray-100 rounded-sm">
  {/* Number section - EXACT WIDTH */}
  <div className="w-[25px] flex-shrink-0 flex items-center justify-center text-black text-lg font-roboto select-none">
    {id}
  </div>
  
  {/* Vertical divider - EXACT STYLING */}
  <div className="w-px bg-black opacity-71 self-stretch mx-0"></div>
  
  {/* Text section */}
  <div className="flex-1 px-4 py-3 flex items-center">
    <span className="text-lg font-roboto text-black select-none break-words leading-tight">
      {title}
    </span>
  </div>
</div>
```

### **MenuList Pattern (EXACT SPACING)**
```tsx
// Always use this exact spacing pattern
<div className="space-y-0.5">
  {items.map((item) => (
    <SVGMenuItem key={item.id} {...item} />
  ))}
</div>
```

### **ContactSelector Pattern**
```tsx
// Always place above content sections
<ContactSelector 
  selectedContact={selectedContact}
  onContactChange={setSelectedContact}
/>
```

### **Header Pattern (EXACT GRADIENT)**
```tsx
<header className="px-4 md:px-6 lg:px-8 py-3 text-white" 
        style={{ background: 'linear-gradient(135deg, #68C72A 0%, #029100 100%)' }}>
  {/* Header content */}
</header>
```

### **Bottom Navigation Pattern (EXACT IMPLEMENTATION)**
```tsx
<div className={isActive ? '' : 'bg-[#DEDEDE]'} 
     style={isActive ? { background: 'linear-gradient(135deg, #68C72A 0%, #029100 100%)' } : {}}>
  <div className="flex items-center h-12 md:h-14 lg:h-16">
    {/* Toolbar buttons */}
  </div>
</div>
```

---

## 🔒 SECURITY ARCHITECTURE - NON-NEGOTIABLE

### **Database Security (IMPLEMENTED)**
```sql
-- Field-level encryption for sensitive data
profiles (encrypted: first_name, last_name, username, phone, email)
contacts (encrypted: first_name, last_name, email, cell_number, whatsapp, wechat, fb_messenger, notes)

-- Row Level Security (RLS) on ALL tables
-- User data isolation (users only see their own data)
-- JWT-based authentication via Supabase
-- Organization-scoped multi-tenancy with role hierarchy:
--   super_admin > admin > user
```

### **Encryption Requirements**
- ALL sensitive contact fields must be encrypted
- ALL sensitive profile fields must be encrypted
- Use Supabase encryption functions in database
- Never store sensitive data in plain text
- Maintain data isolation between users

---

## 📋 CONTENT MANAGEMENT SYSTEM SPECIFICATIONS

### **Messageze System**
- WYSIWYG message templates with variable substitution
- Variables: [First_Name], [Last_Name], [Email], [Phone_Number], etc.
- Multi-select categorization for filtering
- Admin interface with drag-drop sorting

### **Documents System**
- Upload with auto-screenshot generation
- Template system with variable substitution
- Category management with multi-select
- Document sharing with tracking

### **Biz Opps System**
- Video content with blob storage
- URL variables for personalization
- Category management
- View tracking and analytics

### **Follow-up System (Followeze)**
- One-time follow-ups per contact (new replaces existing)
- Calendar integration with reminders
- Template-based follow-up workflows
- Completion tracking and analytics

---

## 📱 RESPONSIVE DESIGN REQUIREMENTS

### **Mobile-First Approach**
```css
/* Breakpoint strategy */
base: 320px+    /* Mobile */
md: 768px+      /* Tablet */
lg: 1024px+     /* Desktop */
xl: 1280px+     /* Large Desktop */

/* Height scaling for navigation */
h-10: 40px      /* Mobile */
h-12: 48px      /* Base */
h-14: 56px      /* Medium */
h-16: 64px      /* Large */
```

### **Edge-to-Edge Layout Strategy**
```tsx
// ✅ CORRECT - Interactive components full width
<div className="space-y-0.5">
  {items.map(...)}
</div>

// ❌ WRONG - Don't add padding to full-width components
<div className="space-y-0.5 px-4">
  {items.map(...)}
</div>
```

---

## 🔧 CLAUDE FLOW AGENT INSTRUCTIONS

### **SPARC Architect Mode Requirements**
- MUST use existing database schema as foundation
- MUST maintain React + TypeScript + Supabase architecture
- MUST follow established component patterns exactly
- MUST respect contact-scoped vs user-scoped action boundaries
- MUST use design system tokens, never hardcoded colors

### **SPARC TDD Mode Requirements**
- MUST implement features according to established Contact/User interfaces
- MUST use established hooks pattern (useContacts, useAuth, useUser)
- MUST follow shadcn/ui component library standards
- MUST maintain field-level encryption requirements
- MUST write tests that validate design system compliance

### **SPARC Security-Review Mode Requirements**
- MUST validate against established RLS policies
- MUST ensure contact data isolation between users
- MUST verify encryption implementation for sensitive fields
- MUST check role-based access control (super_admin, admin, user)
- MUST validate JWT authentication flows

### **Swarm Coordination Requirements**
- **Backend-dev agent**: MUST follow Supabase Edge Functions patterns
- **Mobile-dev agent**: MUST maintain React + Capacitor integration plan
- **System-architect agent**: MUST respect established multi-tenant organization structure
- **Coder agent**: MUST use existing TypeScript interfaces and type definitions

---

## ⚠️ CRITICAL "DO NOT" RULES - VIOLATING THESE BREAKS THE APP

### **Navigation Rules**
❌ **NEVER** change the trademarked bottom toolbar order (X,P,H,N,M,D,B,F,C)
❌ **NEVER** make contact-scoped actions affect the logged-in user's profile
❌ **NEVER** access user profile via bottom toolbar (use Slide-Out Menu only)
❌ **NEVER** break the contact selection → toolbar activation pattern

### **Design System Rules**
❌ **NEVER** use hardcoded colors (use CSS custom properties only)
❌ **NEVER** modify the brand colors or gradients without approval
❌ **NEVER** break the established component patterns (SVGMenuItem, MenuList, etc.)
❌ **NEVER** create non-responsive components (must be mobile-first)

### **Architecture Rules**
❌ **NEVER** break the React + TypeScript + Supabase architecture
❌ **NEVER** bypass field-level encryption for sensitive contact/profile data
❌ **NEVER** break contact data isolation between users
❌ **NEVER** modify the established database schema without approval

### **Component Rules**
❌ **NEVER** add padding to edge-to-edge components
❌ **NEVER** modify the SVGMenuItem pattern (exact dimensions required)
❌ **NEVER** use space-y values other than 0.5 for menu lists
❌ **NEVER** hardcode the brand gradient (use established CSS classes)

---

## ✅ SUCCESS CRITERIA FOR ALL CLAUDE FLOW AGENTS

### **Visual Consistency**
- All new components match established design patterns exactly
- Brand colors and gradients used consistently
- Typography follows Roboto font system
- Mobile-first responsive design maintained

### **Functional Consistency**
- Contact management follows established data interfaces
- Navigation respects contact-scoped vs user-scoped boundaries
- All actions properly logged with contact context
- Security requirements met with proper encryption and RLS

### **Performance Standards**
- Page load times < 2 seconds
- API responses < 500ms
- 60fps animations maintained
- Offline capability preserved

### **Code Quality Standards**
- TypeScript interfaces strictly followed
- shadcn/ui components used exclusively for UI primitives
- Tailwind CSS classes used exclusively (no custom CSS)
- Design system tokens used for all colors and spacing

---

## 🎯 IMPLEMENTATION CHECKLIST

Before implementing any new feature, ALL Claude Flow agents must verify:

- [ ] Uses established Contact/User TypeScript interfaces
- [ ] Follows SVGMenuItem pattern for menu items
- [ ] Uses space-y-0.5 for menu list spacing
- [ ] Implements proper contact scoping for toolbar actions
- [ ] Uses CSS custom properties for all colors
- [ ] Maintains mobile-first responsive design
- [ ] Includes proper field-level encryption for sensitive data
- [ ] Validates user data isolation with RLS
- [ ] Follows established component patterns exactly
- [ ] Includes proper error handling and loading states

---

## 📚 REFERENCE FILES

### **Essential Files for Context**
- `src/types/contact.ts` - Contact data structure (NEVER MODIFY)
- `src/types/user.ts` - User data structure (NEVER MODIFY) 
- `src/components/UI/SVGMenuItem.tsx` - Standard menu item pattern
- `src/components/UI/MenuList.tsx` - Menu container pattern
- `src/components/Layout/BottomNavigation.tsx` - Toolbar implementation
- `src/index.css` - Design system tokens and CSS custom properties
- `tailwind.config.ts` - Extended Tailwind configuration
- `PROJECT_SPECIFICATION.md` - Complete 90-page specification

### **Component Library Dependencies**
- Use shadcn/ui components exclusively for UI primitives
- Use Lucide React for all icons
- Use React Hook Form + Zod for all form validation
- Use TanStack React Query for all data fetching

---

*This design brief serves as the SINGLE SOURCE OF TRUTH for all Claude Flow agents working on the ItsEZE™ application. Any deviation from these specifications must be explicitly approved and this document updated accordingly.*

**Version**: 1.0.0 | **Last Updated**: August 2025 | **Status**: Active Production Standard