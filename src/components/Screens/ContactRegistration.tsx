import { useState } from "react";

import ContactSelector from "../UI/ContactSelector";
import MenuList from "../UI/MenuList";

const ContactRegistration = () => {
  const [selectedContact, setSelectedContact] = useState("George Gonzalez");
  
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

  return (
    <div className="flex-1 bg-white">
      <ContactSelector 
        selectedContact={selectedContact}
        onContactChange={setSelectedContact}
      />
      
      <div>
        <MenuList items={registrationItems} />
        
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

export default ContactRegistration;