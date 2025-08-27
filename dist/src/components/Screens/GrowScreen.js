"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ContactSelector_1 = tslib_1.__importDefault(require("@/components/UI/ContactSelector"));
const MenuList_1 = tslib_1.__importDefault(require("@/components/UI/MenuList"));
const GrowScreen = ({ selectedContact, onContactChange }) => {
    const menuItems = [
        {
            id: 1,
            title: "Distributor Welcome Letter and ItsEZE App Registration"
        },
        {
            id: 2,
            title: "Affiliate Link - What is it and Join"
        },
        {
            id: 3,
            title: "Affiliate Welcome Letter and ItsEZE App Registration"
        },
        {
            id: 4,
            title: "Thank you for your Product Purchase"
        }
    ];
    const handleItemClick = (item) => {
        console.log('Menu item clicked:', item);
    };
    return (<div className="bg-white min-h-full">
      <ContactSelector_1.default selectedContact={selectedContact} onContactChange={onContactChange}/>
      
      <MenuList_1.default items={menuItems} onItemClick={handleItemClick}/>
    </div>);
};
exports.default = GrowScreen;
//# sourceMappingURL=GrowScreen.js.map