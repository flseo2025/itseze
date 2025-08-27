"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useContacts_1 = require("@/hooks/useContacts");
const ContactSelector = ({ selectedContact, onContactChange }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { contacts, loading } = (0, useContacts_1.useContacts)();
    const contactNames = contacts.map(contact => contact.full_name);
    return (<div className="px-4 md:px-6 lg:px-8 py-4 bg-white border-b border-gray-200">
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
          <span className={`font-medium ${selectedContact === "Contact" ? "text-gray-400" : "text-gray-700"}`}>
            {selectedContact === "Contact" ? "Select your contact" : selectedContact}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
        
        {isOpen && (<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {loading ? (<div className="p-3 text-gray-500">Loading contacts...</div>) : contactNames.length === 0 ? (<div className="p-3 text-gray-500">No contacts available</div>) : (contactNames.map((contact) => (<button key={contact} onClick={() => {
                    onContactChange(contact);
                    setIsOpen(false);
                }} className="w-full text-left p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors">
                  {contact}
                </button>)))}
          </div>)}
      </div>
    </div>);
};
exports.default = ContactSelector;
//# sourceMappingURL=ContactSelector.js.map