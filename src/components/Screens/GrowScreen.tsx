import ContactSelector from "@/components/UI/ContactSelector";
import MenuList from "@/components/UI/MenuList";

interface GrowScreenProps {
  selectedContact: string;
  onContactChange: (contact: string) => void;
}

const GrowScreen = ({ selectedContact, onContactChange }: GrowScreenProps) => {
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

  const handleItemClick = (item: any) => {
    console.log('Menu item clicked:', item);
  };

  return (
    <div className="bg-white min-h-full">
      <ContactSelector 
        selectedContact={selectedContact}
        onContactChange={onContactChange}
      />
      
      <MenuList items={menuItems} onItemClick={handleItemClick} />
    </div>
  );
};

export default GrowScreen;