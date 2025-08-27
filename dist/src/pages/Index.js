"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const AppHeader_1 = tslib_1.__importDefault(require("@/components/Layout/AppHeader"));
const BottomNavigation_1 = tslib_1.__importDefault(require("@/components/Layout/BottomNavigation"));
const Legend_1 = tslib_1.__importDefault(require("@/components/Layout/Legend"));
const ContactAdd_1 = tslib_1.__importDefault(require("@/components/Screens/ContactAdd"));
const ContactForm_1 = tslib_1.__importDefault(require("@/components/Screens/ContactForm"));
const ContactList_1 = tslib_1.__importDefault(require("@/components/Screens/ContactList"));
const ContactMessages_1 = tslib_1.__importDefault(require("@/components/Screens/ContactMessages"));
const ContactRegistration_1 = tslib_1.__importDefault(require("@/components/Screens/ContactRegistration"));
const GrowScreen_1 = tslib_1.__importDefault(require("@/components/Screens/GrowScreen"));
const HowScreen_1 = tslib_1.__importDefault(require("@/components/Screens/HowScreen"));
const MainMenu_1 = tslib_1.__importDefault(require("@/components/Screens/MainMenu"));
const NewContactForm_1 = tslib_1.__importDefault(require("@/components/Screens/NewContactForm"));
const NotificationScreen_1 = tslib_1.__importDefault(require("@/components/Screens/NotificationScreen"));
const ProfileMenu_1 = tslib_1.__importDefault(require("@/components/Screens/ProfileMenu"));
const UserContext_1 = require("@/contexts/UserContext");
const Index = () => {
    const [currentScreen, setCurrentScreen] = (0, react_1.useState)('main');
    const [selectedContact, setSelectedContact] = (0, react_1.useState)('Contact');
    const [contactToEdit, setContactToEdit] = (0, react_1.useState)(null);
    const renderCurrentScreen = () => {
        switch (currentScreen) {
            case 'main':
                return <MainMenu_1.default onNavigate={setCurrentScreen}/>;
            case 'add':
                return <ContactAdd_1.default selectedContact={selectedContact} onContactChange={setSelectedContact}/>;
            case 'grow':
                return <GrowScreen_1.default selectedContact={selectedContact} onContactChange={setSelectedContact}/>;
            case 'how':
                return <HowScreen_1.default />;
            case 'newContact':
                return <NewContactForm_1.default onBack={() => setCurrentScreen('main')}/>;
            case 'contactRegistration':
                return <ContactRegistration_1.default />;
            case 'contactMessages':
                return <ContactMessages_1.default />;
            case 'profile':
                return <ProfileMenu_1.default />;
            case 'notifications':
                return <NotificationScreen_1.default onBack={() => setCurrentScreen('main')}/>;
            case 'contactList':
                return (<ContactList_1.default onBack={() => setCurrentScreen('main')} onCreateContact={() => setCurrentScreen('newContact')} onSelectContact={(contact) => {
                        setContactToEdit(contact);
                        setCurrentScreen('editContact');
                    }}/>);
            case 'editContact':
                return (<ContactForm_1.default contact={contactToEdit} onBack={() => {
                        setContactToEdit(null);
                        setCurrentScreen('contactList');
                    }}/>);
            default:
                return <MainMenu_1.default onNavigate={setCurrentScreen}/>;
        }
    };
    return (<UserContext_1.UserProvider>
      <div className="min-h-screen bg-[#68C72A]/60 flex flex-col max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto border-l border-r border-gray-200">
        <AppHeader_1.default currentScreen={currentScreen} onNavigate={setCurrentScreen}/>
        
        <div className="flex-1 overflow-y-auto">
          {renderCurrentScreen()}
        </div>
        
        {currentScreen !== 'contactList' && (<BottomNavigation_1.default onNavigate={setCurrentScreen} isActive={selectedContact !== 'Contact'}/>)}
        <Legend_1.default />
      </div>
    </UserContext_1.UserProvider>);
};
exports.default = Index;
//# sourceMappingURL=Index.js.map