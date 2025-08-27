import { useNavigate } from "react-router-dom";

import MenuList from "../UI/MenuList";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 1, title: "Tutorial" },
    { 
      id: 2, 
      title: "Profile",
      subItems: [
        { id: 1, title: "My Personal Information" },
        { id: 2, title: "My Goal - write it down" },
        { id: 3, title: "App Advancement Requirements" },
        { id: 4, title: "Advancement Status Form" }
      ]
    },
    { id: 3, title: "Mini Checklist" }
  ];

  return (
    <div className="flex-1 bg-white">
      <div>
        <MenuList 
          items={menuItems}
          onItemClick={(item) => {
            if (item?.title === "My Personal Information") {
              navigate("/profile");
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProfileMenu;