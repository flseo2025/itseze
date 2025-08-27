"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("@/contexts/AuthContext");
const ProtectedRoute = ({ children }) => {
    const { session, loading } = (0, AuthContext_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>);
    }
    if (!session) {
        return <react_router_dom_1.Navigate to="/auth" replace state={{ from: location }}/>;
    }
    return <>{children}</>;
};
exports.default = ProtectedRoute;
//# sourceMappingURL=ProtectedRoute.js.map