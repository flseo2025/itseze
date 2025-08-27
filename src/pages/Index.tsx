import { useState } from "react";

import AppHeader from "@/components/Layout/AppHeader";
import BottomNavigation from "@/components/Layout/BottomNavigation";
import Legend from "@/components/Layout/Legend";
import ContactAdd from "@/components/Screens/ContactAdd";
import ContactForm from "@/components/Screens/ContactForm";
import ContactList from "@/components/Screens/ContactList";
import ContactMessages from "@/components/Screens/ContactMessages";
import ContactRegistration from "@/components/Screens/ContactRegistration";
import GrowScreen from "@/components/Screens/GrowScreen";
import HowScreen from "@/components/Screens/HowScreen";
import MainMenu from "@/components/Screens/MainMenu";
import NewContactForm from "@/components/Screens/NewContactForm";
import NotificationScreen from "@/components/Screens/NotificationScreen";
import ProfileMenu from "@/components/Screens/ProfileMenu";
import { UserProvider } from "@/contexts/UserContext";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [selectedContact, setSelectedContact] = useState('Contact');
  const [contactToEdit, setContactToEdit] = useState(null);

  const renderCurrentScreen = () => {
    switch(currentScreen) {
      case 'main':
        return <MainMenu onNavigate={setCurrentScreen} />;
      case 'add':
        return <ContactAdd selectedContact={selectedContact} onContactChange={setSelectedContact} />;
      case 'grow':
        return <GrowScreen selectedContact={selectedContact} onContactChange={setSelectedContact} />;
      case 'how':
        return <HowScreen />;
      case 'newContact':
        return <NewContactForm onBack={() => setCurrentScreen('main')} />;
      case 'contactRegistration':
        return <ContactRegistration />;
      case 'contactMessages':
        return <ContactMessages />;
      case 'profile':
        return <ProfileMenu />;
      case 'notifications':
        return <NotificationScreen onBack={() => setCurrentScreen('main')} />;
      case 'contactList':
        return (
          <ContactList
            onBack={() => setCurrentScreen('main')}
            onCreateContact={() => setCurrentScreen('newContact')}
            onSelectContact={(contact) => {
              setContactToEdit(contact);
              setCurrentScreen('editContact');
            }}
          />
        );
      case 'editContact':
        return (
          <ContactForm
            contact={contactToEdit}
            onBack={() => {
              setContactToEdit(null);
              setCurrentScreen('contactList');
            }}
          />
        );
      default:
        return <MainMenu onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-[#68C72A]/60 flex flex-col max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto border-l border-r border-gray-200">
        <AppHeader currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        
        <div className="flex-1 overflow-y-auto">
          {renderCurrentScreen()}
        </div>
        
        {currentScreen !== 'contactList' && (
          <BottomNavigation onNavigate={setCurrentScreen} isActive={selectedContact !== 'Contact'} />
        )}
        <Legend />
      </div>
    </UserProvider>
  );
};

export default Index;
