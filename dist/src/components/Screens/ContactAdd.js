"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ContactSelector_1 = tslib_1.__importDefault(require("../UI/ContactSelector"));
const MenuList_1 = tslib_1.__importDefault(require("../UI/MenuList"));
const ContactAdd = ({ selectedContact, onContactChange }) => {
    const addItems = [
        { id: 1, title: "Register New Distributor" },
        { id: 2, title: "Register New Affiliate" },
        { id: 3, title: "Register Product Buyer" },
        { id: 4, title: "Send Buy Link" },
        { id: 5, title: "Send My Nu Xtrax Website Link" }
    ];
    const accessItems = [
        { id: 6, title: "Nu Xtrax Website" },
        { id: 7, title: "Back Office" }
    ];
    return (<div className="flex-1 bg-white">
      <ContactSelector_1.default selectedContact={selectedContact} onContactChange={onContactChange}/>
      
      {selectedContact !== "Contact" && (<div className="text-center py-2 bg-gray-50 border-b border-gray-200">
          <span className="text-sm text-gray-600 font-medium">then:</span>
        </div>)}
      
      <div>
        <MenuList_1.default items={addItems}/>
        
        <div className="mt-6 mb-4">
          <h3 className="text-center text-lg font-medium text-gray-900">
            Access My:
          </h3>
        </div>
        
        <MenuList_1.default items={accessItems}/>
      </div>
    </div>);
};
exports.default = ContactAdd;
//# sourceMappingURL=ContactAdd.js.map