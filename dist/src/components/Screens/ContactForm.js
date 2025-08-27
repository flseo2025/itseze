"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const use_toast_1 = require("@/hooks/use-toast");
const useContacts_1 = require("@/hooks/useContacts");
const countryCodes_1 = require("@/utils/countryCodes");
const phoneUtils_1 = require("@/utils/phoneUtils");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const ContactForm = ({ contact, onBack, onSave }) => {
    const { updateContact, deleteContact } = (0, useContacts_1.useContacts)();
    const { toast } = (0, use_toast_1.useToast)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({
        first_name: contact?.first_name || '',
        last_name: contact?.last_name || '',
        phone_number: contact?.phone_number?.replace(/^\+\d+/, '') || '',
        whatsapp_number: contact?.whatsapp_number?.replace(/^\+\d+/, '') || '',
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
    const getCountryCodeFromPhone = (phone) => {
        if (!phone)
            return '+1';
        const match = phone.match(/^(\+\d+)/);
        return match ? match[1] : '+1';
    };
    const [phoneCountryCode, setPhoneCountryCode] = (0, react_1.useState)(getCountryCodeFromPhone(contact?.phone_number || ''));
    const [whatsappCountryCode, setWhatsappCountryCode] = (0, react_1.useState)(getCountryCodeFromPhone(contact?.whatsapp_number || ''));
    const [wechat, setWechat] = (0, react_1.useState)(contact?.twitter_url || '');
    const [fbMessenger, setFbMessenger] = (0, react_1.useState)(contact?.facebook_url || '');
    const [language, setLanguage] = (0, react_1.useState)('');
    const [group, setGroup] = (0, react_1.useState)(contact?.category || '');
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handlePhoneChange = (field, value, countryCode) => {
        const formatted = (0, phoneUtils_1.formatPhoneInput)(value, countryCode);
        setFormData(prev => ({ ...prev, [field]: formatted }));
    };
    const handleUpdate = async () => {
        if (!contact)
            return;
        setLoading(true);
        try {
            const phoneDigits = formData.phone_number ? formData.phone_number.replace(/\D/g, '') : '';
            const whatsappDigits = formData.whatsapp_number ? formData.whatsapp_number.replace(/\D/g, '') : '';
            const fullPhoneNumber = phoneDigits ? `${phoneCountryCode}${phoneDigits}` : '';
            const fullWhatsappNumber = whatsappDigits ? `${whatsappCountryCode}${whatsappDigits}` : '';
            const updatedContact = await updateContact(contact.id, {
                ...formData,
                phone_number: fullPhoneNumber,
                whatsapp_number: fullWhatsappNumber,
                twitter_url: wechat,
                facebook_url: fbMessenger,
                category: group,
            });
            toast({
                title: "Success",
                description: "Contact updated successfully",
            });
            onSave?.(updatedContact);
            onBack();
        }
        catch (error) {
            console.error('Error updating contact:', error);
            toast({
                title: "Error",
                description: "Failed to update contact",
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (!contact)
            return;
        if (window.confirm('Are you sure you want to delete this contact?')) {
            setLoading(true);
            try {
                await deleteContact(contact.id);
                toast({
                    title: "Success",
                    description: "Contact deleted successfully",
                });
                onBack();
            }
            catch (error) {
                console.error('Error deleting contact:', error);
                toast({
                    title: "Error",
                    description: "Failed to delete contact",
                    variant: "destructive",
                });
            }
            finally {
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
    return (<div className="flex flex-col h-full bg-background">
      
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <button_1.Button variant="ghost" size="sm" onClick={onBack} className="p-1">
          <lucide_react_1.ArrowLeft className="w-6 h-6"/>
        </button_1.Button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">PROFILE</h1>
          <p className="text-lg text-foreground">{contact?.full_name || `${formData.first_name} ${formData.last_name}`.trim()}</p>
        </div>
        <div className="w-10"/> 
      </div>

      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
          <input_1.Input value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} className="w-full"/>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
          <input_1.Input value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} className="w-full"/>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input_1.Input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full"/>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Cell Number</label>
          <div className="flex space-x-2">
            <select_1.Select value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
              <select_1.SelectTrigger className="w-20 bg-brand-gradient text-primary-foreground border-0">
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {countryCodes_1.countryCodes.slice(0, 10).map((country) => (<select_1.SelectItem key={country.code} value={country.code}>
                    {country.code}
                  </select_1.SelectItem>))}
              </select_1.SelectContent>
            </select_1.Select>
            <input_1.Input placeholder={(0, phoneUtils_1.getPhoneFormat)(phoneCountryCode).placeholder} type="tel" value={formData.phone_number} onChange={(e) => handlePhoneChange('phone_number', e.target.value, phoneCountryCode)} className="flex-1" maxLength={(0, phoneUtils_1.getPhoneFormat)(phoneCountryCode).maxLength + 5}/>
          </div>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
          <div className="flex space-x-2">
            <select_1.Select value={whatsappCountryCode} onValueChange={setWhatsappCountryCode}>
              <select_1.SelectTrigger className="w-20 bg-brand-gradient text-primary-foreground border-0">
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {countryCodes_1.countryCodes.slice(0, 10).map((country) => (<select_1.SelectItem key={country.code} value={country.code}>
                    {country.code}
                  </select_1.SelectItem>))}
              </select_1.SelectContent>
            </select_1.Select>
            <input_1.Input placeholder={(0, phoneUtils_1.getPhoneFormat)(whatsappCountryCode).placeholder} type="tel" value={formData.whatsapp_number} onChange={(e) => handlePhoneChange('whatsapp_number', e.target.value, whatsappCountryCode)} className="flex-1" maxLength={(0, phoneUtils_1.getPhoneFormat)(whatsappCountryCode).maxLength + 5}/>
          </div>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">WeChat</label>
          <input_1.Input value={wechat} onChange={(e) => setWechat(e.target.value)} className="w-full"/>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">FB Messenger</label>
          <input_1.Input value={fbMessenger} onChange={(e) => setFbMessenger(e.target.value)} className="w-full"/>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Language</label>
          <select_1.Select value={language} onValueChange={setLanguage}>
            <select_1.SelectTrigger className="bg-brand-gradient text-primary-foreground border-0">
              <select_1.SelectValue placeholder="Language"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {languages.map((lang) => (<select_1.SelectItem key={lang} value={lang}>
                  {lang}
                </select_1.SelectItem>))}
            </select_1.SelectContent>
          </select_1.Select>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Groups</label>
          <select_1.Select value={group} onValueChange={setGroup}>
            <select_1.SelectTrigger className="bg-brand-gradient text-primary-foreground border-0">
              <select_1.SelectValue placeholder="Group"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {baseGroups.map((grp) => (<select_1.SelectItem key={grp} value={grp}>
                  {grp}
                </select_1.SelectItem>))}
            </select_1.SelectContent>
          </select_1.Select>
        </div>
      </div>

      
      <div className="p-4 space-y-3">
        <button_1.Button onClick={handleUpdate} disabled={loading || !formData.first_name} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 font-bold">
          {loading ? 'UPDATING...' : 'UPDATE'}
        </button_1.Button>
        
        <button_1.Button onClick={handleDelete} disabled={loading} variant="destructive" className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full py-3 font-bold">
          DELETE
        </button_1.Button>
      </div>
    </div>);
};
exports.default = ContactForm;
//# sourceMappingURL=ContactForm.js.map