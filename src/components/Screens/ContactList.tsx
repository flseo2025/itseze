import { Search, Plus, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import BottomNavigation from '@/components/Layout/BottomNavigation';
import { useContacts } from '@/hooks/useContacts';
import { formatPhoneNumber } from '@/utils/phoneUtils';

import type { Contact } from '@/types/contact';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';



interface ContactListProps {
  onSelectContact?: (contact: Contact) => void;
  onCreateContact?: () => void;
  onBack?: () => void; // navigate to previous screen
}

const ContactList = ({ onSelectContact, onCreateContact, onBack }: ContactListProps) => {
  const { contacts, loading } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [notesVisible, setNotesVisible] = useState(false);
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const first = contact.first_name?.toLowerCase() || '';
    const last = contact.last_name?.toLowerCase() || '';
    const full = contact.full_name?.toLowerCase() || '';
    return first.includes(q) || last.includes(q) || full.includes(q);
  });

  const getContactInitials = (contact: Contact) => {
    const first = contact.first_name?.[0] || '';
    const last = contact.last_name?.[0] || '';
    const initials = (first + last).toUpperCase();
    return initials || 'NA';
  };

  const toggleExpand = (contact: Contact) => {
    setExpandedContactId(prev => (prev === contact.id ? null : contact.id));
    setSelectedContact(prev => (prev && prev.id === contact.id ? null : contact));
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">CONTACT LIST</h1>
        <Button variant="ghost" size="sm" onClick={onCreateContact} className="p-1">
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted border-0 text-base"
          />
        </div>
      </div>

      {/* Notes Visible toggle */}
      <div className="flex items-center justify-center py-2">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-foreground">Note Visible:</span>
          <span className={`text-sm ${!notesVisible ? 'font-medium text-primary' : 'text-muted-foreground'}`}>No</span>
          <Switch checked={notesVisible} onCheckedChange={setNotesVisible} />
          <span className={`text-sm ${notesVisible ? 'font-medium text-primary' : 'text-muted-foreground'}`}>Yes</span>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{searchTerm ? 'No contacts found matching your search.' : 'No contacts yet.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="bg-background">
                <div className="flex items-center p-4">
                  {/* Avatar */}
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={contact.avatar_url || ''} alt={contact.full_name || ''} />
                    <AvatarFallback className="bg-muted text-sm font-medium">
                      {getContactInitials(contact)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-base text-foreground truncate">
                      {contact.full_name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatPhoneNumber(contact.phone_number)}
                    </div>
                    {notesVisible && contact.notes && (
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {contact.notes.length > 120 ? `${contact.notes.substring(0, 120)}...` : contact.notes}
                      </div>
                    )}
                  </div>

                  {/* Chevron */}
                  <button
                    aria-label={expandedContactId === contact.id ? 'Collapse' : 'Expand'}
                    className="ml-4 p-2"
                    onClick={(e) => { e.stopPropagation(); toggleExpand(contact); }}
                  >
                    {expandedContactId === contact.id ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Contact-scoped toolbar */}
                {expandedContactId === contact.id && (
                  <div className="border-t border-border">
                    <BottomNavigation 
                      onNavigate={(screen) => {
                        if (screen === 'profile' && onSelectContact) {
                          onSelectContact(contact);
                        }
                      }} 
                      isActive={true} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
