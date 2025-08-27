import { useState, useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';

import type { Contact, CreateContactData, ContactCategory } from '@/types/contact';

import { supabase } from '@/integrations/supabase/client';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<ContactCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setContacts((data || []) as Contact[]);
    } catch (error) {
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
      const { data, error } = await supabase
        .from('contact_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createContact = async (contactData: CreateContactData) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{ 
          ...contactData,
          user_id: (await supabase.auth.getUser()).data.user?.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      setContacts(prev => [...prev, data as Contact]);
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: "Error",
        description: "Failed to create contact",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateContact = async (id: string, contactData: Partial<CreateContactData>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(contactData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setContacts(prev => prev.map(contact => 
        contact.id === id ? data as Contact : contact
      ));
      
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setContacts(prev => prev.filter(contact => contact.id !== id));
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateLastContacted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ last_contacted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      await fetchContacts(); // Refresh the contacts list
    } catch (error) {
      console.error('Error updating last contacted:', error);
    }
  };

  useEffect(() => {
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