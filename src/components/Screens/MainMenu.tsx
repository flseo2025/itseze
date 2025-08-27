import MenuList from "../UI/MenuList";

const MainMenu = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const menuItems = [
    { id: 1, title: "New Contact" },
    { id: 2, title: "Contact List" },
    { id: 3, title: "My Score - How am I doing?" }
  ];

  return (
    <div className="flex-1 bg-white">
      <div>
        <MenuList
          items={menuItems}
          onItemClick={(item) => {
            switch(item.id) {
              case 1:
                onNavigate('newContact');
                break;
              case 2:
                onNavigate('contactList');
                break;
              case 3:
                onNavigate('myScore');
                break;
            }
          }}
        />
      </div>
      
      <div className="absolute bottom-32 left-0 right-0 text-center">
        <div className="text-lg font-medium text-gray-700 italic">
          Gateway to building my Business
        </div>
      </div>
    </div>
  );
};

export default MainMenu;