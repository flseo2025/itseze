"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_query_1 = require("@tanstack/react-query");
const react_router_dom_1 = require("react-router-dom");
const ProtectedRoute_1 = tslib_1.__importDefault(require("@/components/Auth/ProtectedRoute"));
const AuthContext_1 = require("@/contexts/AuthContext");
const UserContext_1 = require("@/contexts/UserContext");
const Auth_1 = tslib_1.__importDefault(require("@/pages/Auth"));
const ResetPassword_1 = tslib_1.__importDefault(require("@/pages/ResetPassword"));
const Index_1 = tslib_1.__importDefault(require("./pages/Index"));
const NotFound_1 = tslib_1.__importDefault(require("./pages/NotFound"));
const Profile_1 = tslib_1.__importDefault(require("./pages/Profile"));
const sonner_1 = require("@/components/ui/sonner");
const toaster_1 = require("@/components/ui/toaster");
const tooltip_1 = require("@/components/ui/tooltip");
const queryClient = new react_query_1.QueryClient();
const App = () => (<react_query_1.QueryClientProvider client={queryClient}>
    <tooltip_1.TooltipProvider>
      <toaster_1.Toaster />
      <sonner_1.Toaster />
      <react_router_dom_1.BrowserRouter>
        <AuthContext_1.AuthProvider>
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/auth" element={<Auth_1.default />}/>
            <react_router_dom_1.Route path="/reset-password" element={<ResetPassword_1.default />}/>
            <react_router_dom_1.Route path="/profile" element={<ProtectedRoute_1.default>
                  <UserContext_1.UserProvider>
                    <Profile_1.default />
                  </UserContext_1.UserProvider>
                </ProtectedRoute_1.default>}/>
            <react_router_dom_1.Route path="/" element={<ProtectedRoute_1.default>
                  <Index_1.default />
                </ProtectedRoute_1.default>}/>
            
            <react_router_dom_1.Route path="*" element={<NotFound_1.default />}/>
          </react_router_dom_1.Routes>
        </AuthContext_1.AuthProvider>
      </react_router_dom_1.BrowserRouter>
    </tooltip_1.TooltipProvider>
  </react_query_1.QueryClientProvider>);
exports.default = App;
//# sourceMappingURL=App.js.map