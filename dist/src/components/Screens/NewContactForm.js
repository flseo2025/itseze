"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const useContacts_1 = require("@/hooks/useContacts");
const countryCodes_1 = require("@/utils/countryCodes");
const phoneUtils_1 = require("@/utils/phoneUtils");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const textarea_1 = require("@/components/ui/textarea");
const NewContactForm = ({ onBack }) => {
    const { createContact } = (0, useContacts_1.useContacts)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        whatsapp_number: '',
        notes: '',
        source: 'manual',
        status: 'active',
        importance_level: 3,
        tags: [],
    });
    const [phoneCountryCode, setPhoneCountryCode] = (0, react_1.useState)('+1');
    const [whatsappCountryCode, setWhatsappCountryCode] = (0, react_1.useState)('+1');
    const [wechat, setWechat] = (0, react_1.useState)('');
    const [fbMessenger, setFbMessenger] = (0, react_1.useState)('');
    const [language, setLanguage] = (0, react_1.useState)('');
    const [group, setGroup] = (0, react_1.useState)('');
    const [customGroups, setCustomGroups] = (0, react_1.useState)([]);
    const [showCustomGroupInput, setShowCustomGroupInput] = (0, react_1.useState)(false);
    const [newCustomGroup, setNewCustomGroup] = (0, react_1.useState)('');
    const [notes, setNotes] = (0, react_1.useState)([]);
    const [newNote, setNewNote] = (0, react_1.useState)('');
    const [showNotesForm, setShowNotesForm] = (0, react_1.useState)(false);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handlePhoneChange = (field, value, countryCode) => {
        const formatted = (0, phoneUtils_1.formatPhoneInput)(value, countryCode);
        setFormData(prev => ({ ...prev, [field]: formatted }));
    };
    const addNote = () => {
        if (newNote.trim()) {
            const today = new Date().toLocaleDateString('en-CA');
            setNotes(prev => [...prev, { date: today, note: newNote.trim() }]);
            setNewNote('');
            setShowNotesForm(false);
        }
    };
    const toggleNotesForm = () => {
        setShowNotesForm(!showNotesForm);
    };
    const handleGroupChange = (value) => {
        if (value === 'add-new') {
            setShowCustomGroupInput(true);
        }
        else {
            setGroup(value);
        }
    };
    const addCustomGroup = () => {
        if (newCustomGroup.trim() && !customGroups.includes(newCustomGroup.trim())) {
            const newGroup = newCustomGroup.trim();
            setCustomGroups(prev => [...prev, newGroup]);
            setGroup(newGroup);
            setNewCustomGroup('');
            setShowCustomGroupInput(false);
        }
    };
    const cancelCustomGroup = () => {
        setNewCustomGroup('');
        setShowCustomGroupInput(false);
    };
    const handleSubmit = async () => {
        if (!formData.first_name.trim())
            return;
        setLoading(true);
        try {
            const phoneDigits = formData.phone_number ? formData.phone_number.replace(/\D/g, '') : '';
            const whatsappDigits = formData.whatsapp_number ? formData.whatsapp_number.replace(/\D/g, '') : '';
            const fullPhoneNumber = phoneDigits ? `${phoneCountryCode}${phoneDigits}` : '';
            const fullWhatsappNumber = whatsappDigits ? `${whatsappCountryCode}${whatsappDigits}` : '';
            const allNotes = notes.map(n => `${n.date}: ${n.note}`).join('\n');
            await createContact({
                ...formData,
                phone_number: fullPhoneNumber,
                whatsapp_number: fullWhatsappNumber,
                notes: allNotes,
            });
            onBack();
        }
        catch (error) {
            console.error('Error saving contact:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const languages = [
        'English', 'Spanish', 'Mandarin', 'French'
    ];
    const baseGroups = [
        'Family', 'Friends', 'Work', 'Prospects'
    ];
    const allGroups = [...baseGroups, ...customGroups];
    return (<div className="flex flex-col h-full bg-background">
      
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-center space-x-4">
          <button_1.Button variant="ghost" size="sm" onClick={onBack} className="absolute left-4 text-foreground hover:bg-muted">
            <lucide_react_1.ArrowLeft className="w-5 h-5"/>
          </button_1.Button>
          <h1 className="text-xl font-bold text-foreground uppercase tracking-wider">
            NEW CONTACT
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        <div className="space-y-4">
          <div>
            <input_1.Input placeholder="First Name" value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} className="bg-muted border-0 text-base"/>
          </div>
          
          <div>
            <input_1.Input placeholder="Last Name" value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} className="bg-muted border-0 text-base"/>
          </div>
          
          <div>
            <input_1.Input placeholder="Email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="bg-muted border-0 text-base"/>
          </div>
          
          
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
            <input_1.Input placeholder={(0, phoneUtils_1.getPhoneFormat)(phoneCountryCode).placeholder} type="tel" value={formData.phone_number} onChange={(e) => handlePhoneChange('phone_number', e.target.value, phoneCountryCode)} className="flex-1 bg-muted border-0 text-base" maxLength={(0, phoneUtils_1.getPhoneFormat)(phoneCountryCode).maxLength + 5}/>
          </div>
          
          
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
            <input_1.Input placeholder={(0, phoneUtils_1.getPhoneFormat)(whatsappCountryCode).placeholder} type="tel" value={formData.whatsapp_number} onChange={(e) => handlePhoneChange('whatsapp_number', e.target.value, whatsappCountryCode)} className="flex-1 bg-muted border-0 text-base" maxLength={(0, phoneUtils_1.getPhoneFormat)(whatsappCountryCode).maxLength + 5}/>
          </div>
          
          <div>
            <input_1.Input placeholder="WeChat" value={wechat} onChange={(e) => setWechat(e.target.value)} className="bg-muted border-0 text-base"/>
          </div>
          
          <div>
            <input_1.Input placeholder="FB Messenger" value={fbMessenger} onChange={(e) => setFbMessenger(e.target.value)} className="bg-muted border-0 text-base"/>
          </div>
          
          
          <div>
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
            {showCustomGroupInput ? (<div className="space-y-2">
                <input_1.Input placeholder="Enter group name" value={newCustomGroup} onChange={(e) => setNewCustomGroup(e.target.value)} className="bg-muted border-0 text-base"/>
                <div className="flex justify-end space-x-2">
                  <button_1.Button onClick={cancelCustomGroup} variant="outline" size="sm">
                    Cancel
                  </button_1.Button>
                  <button_1.Button onClick={addCustomGroup} disabled={!newCustomGroup.trim()} size="sm" className="bg-brand-gradient hover:bg-app-green-dark text-primary-foreground">
                    Add Group
                  </button_1.Button>
                </div>
              </div>) : (<select_1.Select value={group} onValueChange={handleGroupChange}>
                <select_1.SelectTrigger className="bg-brand-gradient text-primary-foreground border-0">
                  <select_1.SelectValue placeholder="Group"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {allGroups.map((grp) => (<select_1.SelectItem key={grp} value={grp}>
                      {grp}
                    </select_1.SelectItem>))}
                  <select_1.SelectItem value="add-new" className="text-primary font-medium">
                    + Add New Group
                  </select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>)}
          </div>
        </div>

        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-foreground">
              <div className="w-6 h-6 bg-brand-gradient rounded flex items-center justify-center">
                <span className="text-primary-foreground text-xs">📝</span>
              </div>
              <span className="font-medium uppercase tracking-wider">NOTES</span>
            </div>
            <button_1.Button onClick={toggleNotesForm} size="sm" className="bg-brand-gradient hover:bg-app-green-dark text-primary-foreground rounded-full w-8 h-8 p-0">
              <lucide_react_1.Plus className="w-4 h-4"/>
            </button_1.Button>
          </div>
          
          
          {showNotesForm && (<div className="mb-4">
              <textarea_1.Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="bg-muted border-0 resize-none" rows={2}/>
              <div className="flex justify-end mt-2 space-x-2">
                <button_1.Button onClick={() => setShowNotesForm(false)} variant="outline" size="sm">
                  Cancel
                </button_1.Button>
                <button_1.Button onClick={addNote} disabled={!newNote.trim()} size="sm" className="bg-brand-gradient hover:bg-app-green-dark text-primary-foreground">
                  Add Note
                </button_1.Button>
              </div>
            </div>)}
          
          
          {notes.length > 0 && (<div className="bg-primary/10 rounded-lg mb-4">
              <div className="grid grid-cols-2 bg-brand-gradient text-primary-foreground p-3 rounded-t-lg">
                <div className="font-medium uppercase text-sm">DATE</div>
                <div className="font-medium uppercase text-sm">NOTE</div>
              </div>
              <div className="divide-y divide-border">
                {notes.map((note, index) => (<div key={index} className="grid grid-cols-2 p-3">
                    <div className="text-sm text-muted-foreground">{note.date}</div>
                    <div className="text-sm">{note.note}</div>
                  </div>))}
              </div>
            </div>)}
        </div>

        
        <button_1.Button onClick={handleSubmit} disabled={loading || !formData.first_name.trim()} className="w-full bg-brand-gradient hover:bg-app-green-dark text-primary-foreground py-6 text-lg font-medium rounded-full mt-6">
          {loading ? 'Saving...' : 'Finish Contact'}
        </button_1.Button>
      </div>
    </div>);
};
exports.default = NewContactForm;
//# sourceMappingURL=NewContactForm.js.map