"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const ContactDetail_1 = tslib_1.__importDefault(require("./ContactDetail"));
const ContactForm_1 = tslib_1.__importDefault(require("./ContactForm"));
const ContactList_1 = tslib_1.__importDefault(require("./ContactList"));
const ContactsManager = () => {
    const [viewMode, setViewMode] = (0, react_1.useState)('list');
    const [selectedContact, setSelectedContact] = (0, react_1.useState)(null);
    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
        setViewMode('detail');
    };
    const handleCreateContact = () => {
        setSelectedContact(null);
        setViewMode('create');
    };
    const handleEditContact = (contact) => {
        setSelectedContact(contact);
        setViewMode('edit');
    };
    const handleBackToList = () => {
        setSelectedContact(null);
        setViewMode('list');
    };
    const handleSaveContact = (contact) => {
        setSelectedContact(contact);
        setViewMode('detail');
    };
    switch (viewMode) {
        case 'create':
            return (<ContactForm_1.default onBack={handleBackToList} onSave={handleSaveContact}/>);
        case 'edit':
            return (<ContactForm_1.default contact={selectedContact || undefined} onBack={handleBackToList} onSave={handleSaveContact}/>);
        case 'detail':
            return (<ContactDetail_1.default contact={selectedContact} onBack={handleBackToList} onEdit={handleEditContact}/>);
        case 'list':
        default:
            return (<ContactList_1.default onSelectContact={handleSelectContact} onCreateContact={handleCreateContact}/>);
    }
};
exports.default = ContactsManager;
//# sourceMappingURL=ContactsManager.js.map