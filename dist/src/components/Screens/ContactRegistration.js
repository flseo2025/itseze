"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const ContactSelector_1 = tslib_1.__importDefault(require("../UI/ContactSelector"));
const MenuList_1 = tslib_1.__importDefault(require("../UI/MenuList"));
const ContactRegistration = () => {
    const [selectedContact, setSelectedContact] = (0, react_1.useState)("George Gonzalez");
    const registrationItems = [
        { id: 1, title: "Register New Distributor" },
        { id: 2, title: "Register New Affiliate" },
        { id: 3, title: "Register Product Buyer" },
        { id: 4, title: "Send Buy Link" },
        { id: 5, title: "Send My Jeunesse Website Link" }
    ];
    const accessItems = [
        { id: 6, title: "Jeunesse Website" },
        { id: 7, title: "Back Office" }
    ];
    return (<div className="flex-1 bg-white">
      <ContactSelector_1.default selectedContact={selectedContact} onContactChange={setSelectedContact}/>
      
      <div>
        <MenuList_1.default items={registrationItems}/>
        
        <div className="mt-6 mb-4">
          <h3 className="text-center text-lg font-medium text-gray-900">
            Access My:
          </h3>
        </div>
        
        <MenuList_1.default items={accessItems}/>
      </div>
    </div>);
};
exports.default = ContactRegistration;
//# sourceMappingURL=ContactRegistration.js.map