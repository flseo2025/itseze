"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContacts = void 0;
const react_1 = require("react");
const use_toast_1 = require("@/hooks/use-toast");
const client_1 = require("@/integrations/supabase/client");
const useContacts = () => {
    const [contacts, setContacts] = (0, react_1.useState)([]);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const { toast } = (0, use_toast_1.useToast)();
    const fetchContacts = async () => {
        try {
            const { data, error } = await client_1.supabase
                .from('contacts')
                .select('*')
                .order('full_name');
            if (error)
                throw error;
            setContacts((data || []));
        }
        catch (error) {
            console.error('Error fetching contacts:', error);
            toast({
                title: "Error",
                description: "Failed to fetch contacts",
                variant: "destructive",
            });
        }
    };
    const fetchCategories = async () => {
        try {
            const { data, error } = await client_1.supabase
                .from('contact_categories')
                .select('*')
                .order('name');
            if (error)
                throw error;
            setCategories(data || []);
        }
        catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    const createContact = async (contactData) => {
        try {
            const { data, error } = await client_1.supabase
                .from('contacts')
                .insert([{
                    ...contactData,
                    user_id: (await client_1.supabase.auth.getUser()).data.user?.id
                }])
                .select()
                .single();
            if (error)
                throw error;
            setContacts(prev => [...prev, data]);
            toast({
                title: "Success",
                description: "Contact created successfully",
            });
            return data;
        }
        catch (error) {
            console.error('Error creating contact:', error);
            toast({
                title: "Error",
                description: "Failed to create contact",
                variant: "destructive",
            });
            throw error;
        }
    };
    const updateContact = async (id, contactData) => {
        try {
            const { data, error } = await client_1.supabase
                .from('contacts')
                .update(contactData)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            setContacts(prev => prev.map(contact => contact.id === id ? data : contact));
            toast({
                title: "Success",
                description: "Contact updated successfully",
            });
            return data;
        }
        catch (error) {
            console.error('Error updating contact:', error);
            toast({
                title: "Error",
                description: "Failed to update contact",
                variant: "destructive",
            });
            throw error;
        }
    };
    const deleteContact = async (id) => {
        try {
            const { error } = await client_1.supabase
                .from('contacts')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            setContacts(prev => prev.filter(contact => contact.id !== id));
            toast({
                title: "Success",
                description: "Contact deleted successfully",
            });
        }
        catch (error) {
            console.error('Error deleting contact:', error);
            toast({
                title: "Error",
                description: "Failed to delete contact",
                variant: "destructive",
            });
            throw error;
        }
    };
    const updateLastContacted = async (id) => {
        try {
            const { error } = await client_1.supabase
                .from('contacts')
                .update({ last_contacted_at: new Date().toISOString() })
                .eq('id', id);
            if (error)
                throw error;
            await fetchContacts();
        }
        catch (error) {
            console.error('Error updating last contacted:', error);
        }
    };
    (0, react_1.useEffect)(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchContacts(), fetchCategories()]);
            setLoading(false);
        };
        loadData();
    }, []);
    return {
        contacts,
        categories,
        loading,
        createContact,
        updateContact,
        deleteContact,
        updateLastContacted,
        refetch: () => {
            fetchContacts();
            fetchCategories();
        }
    };
};
exports.useContacts = useContacts;
//# sourceMappingURL=useContacts.js.map