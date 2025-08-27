import { useState } from "react";

import ContactSelector from "../UI/ContactSelector";
import MenuList from "../UI/MenuList";

const ContactMessages = () => {
  const [selectedContact, setSelectedContact] = useState("Contact");
  
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

  return (
    <div className="flex-1 bg-white">
      <ContactSelector 
        selectedContact={selectedContact}
        onContactChange={setSelectedContact}
      />
      
      <div>
        <MenuList items={messageItems} />
      </div>
    </div>
  );
};

export default ContactMessages;