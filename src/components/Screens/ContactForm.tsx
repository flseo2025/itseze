import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { useContacts } from '@/hooks/useContacts';
import { countryCodes } from '@/utils/countryCodes';
import { formatPhoneInput, getPhoneFormat } from '@/utils/phoneUtils';

import type { CreateContactData, Contact } from '@/types/contact';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



interface ContactFormProps {
  contact?: Contact;
  onBack: () => void;
  onSave?: (contact: Contact) => void;
}

const ContactForm = ({ contact, onBack, onSave }: ContactFormProps) => {
  const { updateContact, deleteContact } = useContacts();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateContactData>({
    first_name: contact?.first_name || '',
    last_name: contact?.last_name || '',
    phone_number: contact?.phone_number?.replace(/^\+\d+/, '') || '', // Remove country code for display
    whatsapp_number: contact?.whatsapp_number?.replace(/^\+\d+/, '') || '', // Remove country code for display
    email: contact?.email || '',
    company: contact?.company || '',
    job_title: contact?.job_title || '',
    department: contact?.department || '',
    linkedin_url: contact?.linkedin_url || '',
    twitter_url: contact?.twitter_url || '',
    instagram_url: contact?.instagram_url || '',
    facebook_url: contact?.facebook_url || '',
    website_url: contact?.website_url || '',
    category: contact?.category || '',
    relationship_type: contact?.relationship_type,
    importance_level: contact?.importance_level || 3,
    notes: contact?.notes || '',
    source: contact?.source || 'manual',
    status: contact?.status || 'active',
    contact_frequency_days: contact?.contact_frequency_days,
    address_line1: contact?.address_line1 || '',
    address_line2: contact?.address_line2 || '',
    city: contact?.city || '',
    state_province: contact?.state_province || '',
    postal_code: contact?.postal_code || '',
    country: contact?.country || '',
    tags: contact?.tags || [],
  });

  // Extract country codes from existing phone numbers or default to +1
  const getCountryCodeFromPhone = (phone: string) => {
    if (!phone) return '+1';
    const match = phone.match(/^(\+\d+)/);
    return match ? match[1] : '+1';
  };

  const [phoneCountryCode, setPhoneCountryCode] = useState(
    getCountryCodeFromPhone(contact?.phone_number || '')
  );
  const [whatsappCountryCode, setWhatsappCountryCode] = useState(
    getCountryCodeFromPhone(contact?.whatsapp_number || '')
  );
  const [wechat, setWechat] = useState(contact?.twitter_url || ''); // Using twitter_url for WeChat
  const [fbMessenger, setFbMessenger] = useState(contact?.facebook_url || ''); // Using facebook_url for FB Messenger
  const [language, setLanguage] = useState(''); // Will add a proper field for this
  const [group, setGroup] = useState(contact?.category || ''); // Using category for group

  const handleInputChange = (field: keyof CreateContactData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (field: 'phone_number' | 'whatsapp_number', value: string, countryCode: string) => {
    const formatted = formatPhoneInput(value, countryCode);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const handleUpdate = async () => {
    if (!contact) return;
    
    setLoading(true);
    try {
      // Combine phone numbers with country codes
      const phoneDigits = formData.phone_number ? formData.phone_number.replace(/\D/g, '') : '';
      const whatsappDigits = formData.whatsapp_number ? formData.whatsapp_number.replace(/\D/g, '') : '';
      const fullPhoneNumber = phoneDigits ? `${phoneCountryCode}${phoneDigits}` : '';
      const fullWhatsappNumber = whatsappDigits ? `${whatsappCountryCode}${whatsappDigits}` : '';

      const updatedContact = await updateContact(contact.id, {
        ...formData,
        phone_number: fullPhoneNumber,
        whatsapp_number: fullWhatsappNumber,
        twitter_url: wechat, // Store WeChat in twitter_url
        facebook_url: fbMessenger, // Store FB Messenger in facebook_url
        category: group, // Store group in category
      });
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
      onSave?.(updatedContact);
      onBack();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setLoading(true);
      try {
        await deleteContact(contact.id);
        toast({
          title: "Success",
          description: "Contact deleted successfully",
        });
        onBack();
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast({
          title: "Error",
          description: "Failed to delete contact",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const languages = [
    'English', 'Spanish', 'Mandarin', 'French'
  ];

  const baseGroups = [
    'Family', 'Friends', 'Work', 'Prospects'
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">PROFILE</h1>
          <p className="text-lg text-foreground">{contact?.full_name || `${formData.first_name} ${formData.last_name}`.trim()}</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
          <Input
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
          <Input
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Cell Number with Country Code */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Cell Number</label>
          <div className="flex space-x-2">
            <Select value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
              <SelectTrigger className="w-20 bg-brand-gradient text-primary-foreground border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.slice(0, 10).map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={getPhoneFormat(phoneCountryCode).placeholder}
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handlePhoneChange('phone_number', e.target.value, phoneCountryCode)}
              className="flex-1"
              maxLength={getPhoneFormat(phoneCountryCode).maxLength + 5}
            />
          </div>
        </div>

        {/* WhatsApp with Country Code */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
          <div className="flex space-x-2">
            <Select value={whatsappCountryCode} onValueChange={setWhatsappCountryCode}>
              <SelectTrigger className="w-20 bg-brand-gradient text-primary-foreground border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.slice(0, 10).map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={getPhoneFormat(whatsappCountryCode).placeholder}
              type="tel"
              value={formData.whatsapp_number}
              onChange={(e) => handlePhoneChange('whatsapp_number', e.target.value, whatsappCountryCode)}
              className="flex-1"
              maxLength={getPhoneFormat(whatsappCountryCode).maxLength + 5}
            />
          </div>
        </div>

        {/* WeChat */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">WeChat</label>
          <Input
            value={wechat}
            onChange={(e) => setWechat(e.target.value)}
            className="w-full"
          />
        </div>

        {/* FB Messenger */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">FB Messenger</label>
          <Input
            value={fbMessenger}
            onChange={(e) => setFbMessenger(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="bg-brand-gradient text-primary-foreground border-0">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Groups */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Groups</label>
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="bg-brand-gradient text-primary-foreground border-0">
              <SelectValue placeholder="Group" />
            </SelectTrigger>
            <SelectContent>
              {baseGroups.map((grp) => (
                <SelectItem key={grp} value={grp}>
                  {grp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <Button
          onClick={handleUpdate}
          disabled={loading || !formData.first_name}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 font-bold"
        >
          {loading ? 'UPDATING...' : 'UPDATE'}
        </Button>
        
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="destructive"
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full py-3 font-bold"
        >
          DELETE
        </Button>
      </div>
    </div>
  );
};
export default ContactForm;