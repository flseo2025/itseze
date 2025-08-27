import type { Contact } from '@/types/contact';
interface ContactFormProps {
    contact?: Contact;
    onBack: () => void;
    onSave?: (contact: Contact) => void;
}
declare const ContactForm: ({ contact, onBack, onSave }: ContactFormProps) => any;
export default ContactForm;
//# sourceMappingURL=ContactForm.d.ts.map