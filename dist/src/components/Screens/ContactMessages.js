"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const ContactSelector_1 = tslib_1.__importDefault(require("../UI/ContactSelector"));
const MenuList_1 = tslib_1.__importDefault(require("../UI/MenuList"));
const ContactMessages = () => {
    const [selectedContact, setSelectedContact] = (0, react_1.useState)("Contact");
    const messageItems = [
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
    return (<div className="flex-1 bg-white">
      <ContactSelector_1.default selectedContact={selectedContact} onContactChange={setSelectedContact}/>
      
      <div>
        <MenuList_1.default items={messageItems}/>
      </div>
    </div>);
};
exports.default = ContactMessages;
//# sourceMappingURL=ContactMessages.js.map