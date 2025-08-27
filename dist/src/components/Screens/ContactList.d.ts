import type { Contact } from '@/types/contact';
interface ContactListProps {
    onSelectContact?: (contact: Contact) => void;
    onCreateContact?: () => void;
    onBack?: () => void;
}
declare const ContactList: ({ onSelectContact, onCreateContact, onBack }: ContactListProps) => any;
export default ContactList;
//# sourceMappingURL=ContactList.d.ts.map