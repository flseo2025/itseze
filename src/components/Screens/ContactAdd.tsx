import { useState } from "react";

import ContactSelector from "../UI/ContactSelector";
import MenuList from "../UI/MenuList";

interface ContactAddProps {
  selectedContact: string;
  onContactChange: (contact: string) => void;
}

const ContactAdd = ({ selectedContact, onContactChange }: ContactAddProps) => {
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

  return (
    <div className="flex-1 bg-white">
      <ContactSelector 
        selectedContact={selectedContact}
        onContactChange={onContactChange}
      />
      
      {selectedContact !== "Contact" && (
        <div className="text-center py-2 bg-gray-50 border-b border-gray-200">
          <span className="text-sm text-gray-600 font-medium">then:</span>
        </div>
      )}
      
      <div>
        <MenuList items={addItems} />
        
        <div className="mt-6 mb-4">
          <h3 className="text-center text-lg font-medium text-gray-900">
            Access My:
          </h3>
        </div>
        
        <MenuList items={accessItems} />
      </div>
    </div>
  );
};

export default ContactAdd;