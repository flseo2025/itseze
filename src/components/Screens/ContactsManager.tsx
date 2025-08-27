import { useState } from 'react';

import ContactDetail from './ContactDetail';
import ContactForm from './ContactForm';
import ContactList from './ContactList';

import type { Contact } from '@/types/contact';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

const ContactsManager = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setViewMode('detail');
  };

  const handleCreateContact = () => {
    setSelectedContact(null);
    setViewMode('create');
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setViewMode('edit');
  };

  const handleBackToList = () => {
    setSelectedContact(null);
    setViewMode('list');
  };

  const handleSaveContact = (contact: Contact) => {
    setSelectedContact(contact);
    setViewMode('detail');
  };
  switch (viewMode) {
    case 'create':
      return (
        <ContactForm
          onBack={handleBackToList}
          onSave={handleSaveContact}
        />
      );
    
    case 'edit':
      return (
        <ContactForm
          contact={selectedContact || undefined}
          onBack={handleBackToList}
          onSave={handleSaveContact}
        />
      );
    
    case 'detail':
      return (
        <ContactDetail
          contact={selectedContact!}
          onBack={handleBackToList}
          onEdit={handleEditContact}
        />
      );
    
    case 'list':
    default:
      return (
        <ContactList
          onSelectContact={handleSelectContact}
          onCreateContact={handleCreateContact}
        />
      );
  }
};

export default ContactsManager;