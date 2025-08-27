"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const BottomNavigation_1 = tslib_1.__importDefault(require("@/components/Layout/BottomNavigation"));
const useContacts_1 = require("@/hooks/useContacts");
const phoneUtils_1 = require("@/utils/phoneUtils");
const avatar_1 = require("@/components/ui/avatar");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const switch_1 = require("@/components/ui/switch");
const ContactList = ({ onSelectContact, onCreateContact, onBack }) => {
    const { contacts, loading } = (0, useContacts_1.useContacts)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [notesVisible, setNotesVisible] = (0, react_1.useState)(false);
    const [expandedContactId, setExpandedContactId] = (0, react_1.useState)(null);
    const [selectedContact, setSelectedContact] = (0, react_1.useState)(null);
    const filteredContacts = contacts.filter(contact => {
        if (!searchTerm)
            return true;
        const q = searchTerm.toLowerCase();
        const first = contact.first_name?.toLowerCase() || '';
        const last = contact.last_name?.toLowerCase() || '';
        const full = contact.full_name?.toLowerCase() || '';
        return first.includes(q) || last.includes(q) || full.includes(q);
    });
    const getContactInitials = (contact) => {
        const first = contact.first_name?.[0] || '';
        const last = contact.last_name?.[0] || '';
        const initials = (first + last).toUpperCase();
        return initials || 'NA';
    };
    const toggleExpand = (contact) => {
        setExpandedContactId(prev => (prev === contact.id ? null : contact.id));
        setSelectedContact(prev => (prev && prev.id === contact.id ? null : contact));
    };
    if (loading) {
        return (<div className="p-4 space-y-3">
        {[...Array(6)].map((_, i) => (<div key={i} className="h-16 bg-muted rounded"/>))}
      </div>);
    }
    return (<div className="flex flex-col h-full bg-background">
      
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <button_1.Button variant="ghost" size="sm" onClick={onBack} className="p-1">
          <lucide_react_1.ArrowLeft className="w-6 h-6"/>
        </button_1.Button>
        <h1 className="text-xl font-bold text-foreground">CONTACT LIST</h1>
        <button_1.Button variant="ghost" size="sm" onClick={onCreateContact} className="p-1">
          <lucide_react_1.Plus className="w-6 h-6"/>
        </button_1.Button>
      </div>

      
      <div className="p-4">
        <div className="relative">
          <lucide_react_1.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"/>
          <input_1.Input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-muted border-0 text-base"/>
        </div>
      </div>

      
      <div className="flex items-center justify-center py-2">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-foreground">Note Visible:</span>
          <span className={`text-sm ${!notesVisible ? 'font-medium text-primary' : 'text-muted-foreground'}`}>No</span>
          <switch_1.Switch checked={notesVisible} onCheckedChange={setNotesVisible}/>
          <span className={`text-sm ${notesVisible ? 'font-medium text-primary' : 'text-muted-foreground'}`}>Yes</span>
        </div>
      </div>

      
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (<div className="text-center py-12">
            <p className="text-muted-foreground">{searchTerm ? 'No contacts found matching your search.' : 'No contacts yet.'}</p>
          </div>) : (<div className="divide-y divide-border">
            {filteredContacts.map((contact) => (<div key={contact.id} className="bg-background">
                <div className="flex items-center p-4">
                  
                  <avatar_1.Avatar className="w-12 h-12 mr-4">
                    <avatar_1.AvatarImage src={contact.avatar_url || ''} alt={contact.full_name || ''}/>
                    <avatar_1.AvatarFallback className="bg-muted text-sm font-medium">
                      {getContactInitials(contact)}
                    </avatar_1.AvatarFallback>
                  </avatar_1.Avatar>

                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-base text-foreground truncate">
                      {contact.full_name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(0, phoneUtils_1.formatPhoneNumber)(contact.phone_number)}
                    </div>
                    {notesVisible && contact.notes && (<div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {contact.notes.length > 120 ? `${contact.notes.substring(0, 120)}...` : contact.notes}
                      </div>)}
                  </div>

                  
                  <button aria-label={expandedContactId === contact.id ? 'Collapse' : 'Expand'} className="ml-4 p-2" onClick={(e) => { e.stopPropagation(); toggleExpand(contact); }}>
                    {expandedContactId === contact.id ? (<lucide_react_1.ChevronUp className="w-5 h-5 text-primary"/>) : (<lucide_react_1.ChevronDown className="w-5 h-5 text-muted-foreground"/>)}
                  </button>
                </div>

                
                {expandedContactId === contact.id && (<div className="border-t border-border">
                    <BottomNavigation_1.default onNavigate={(screen) => {
                        if (screen === 'profile' && onSelectContact) {
                            onSelectContact(contact);
                        }
                    }} isActive={true}/>
                  </div>)}
              </div>))}
          </div>)}
      </div>
    </div>);
};
exports.default = ContactList;
//# sourceMappingURL=ContactList.js.map