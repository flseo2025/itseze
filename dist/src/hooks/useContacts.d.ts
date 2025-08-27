import type { CreateContactData } from '@/types/contact';
export declare const useContacts: () => {
    contacts: any;
    categories: any;
    loading: any;
    createContact: (contactData: CreateContactData) => Promise<any>;
    updateContact: (id: string, contactData: Partial<CreateContactData>) => Promise<any>;
    deleteContact: (id: string) => Promise<void>;
    updateLastContacted: (id: string) => Promise<void>;
    refetch: () => void;
};
//# sourceMappingURL=useContacts.d.ts.map