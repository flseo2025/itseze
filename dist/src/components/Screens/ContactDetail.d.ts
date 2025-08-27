import type { Contact } from '@/types/contact';
interface ContactDetailProps {
    contact: Contact;
    onBack: () => void;
    onEdit: (contact: Contact) => void;
}
declare const ContactDetail: ({ contact, onBack, onEdit }: ContactDetailProps) => any;
export default ContactDetail;
//# sourceMappingURL=ContactDetail.d.ts.map