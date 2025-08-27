"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_router_dom_1 = require("react-router-dom");
const MenuList_1 = tslib_1.__importDefault(require("../UI/MenuList"));
const ProfileMenu = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const menuItems = [
        { id: 1, title: "Tutorial" },
        {
            id: 2,
            title: "Profile",
            subItems: [
                { id: 1, title: "My Personal Information" },
                { id: 2, title: "My Goal - write it down" },
                { id: 3, title: "App Advancement Requirements" },
                { id: 4, title: "Advancement Status Form" }
            ]
        },
        { id: 3, title: "Mini Checklist" }
    ];
    return (<div className="flex-1 bg-white">
      <div>
        <MenuList_1.default items={menuItems} onItemClick={(item) => {
            if (item?.title === "My Personal Information") {
                navigate("/profile");
            }
        }}/>
      </div>
    </div>);
};
exports.default = ProfileMenu;
//# sourceMappingURL=ProfileMenu.js.map