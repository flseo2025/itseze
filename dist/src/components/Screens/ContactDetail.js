"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_react_1 = require("lucide-react");
const useContacts_1 = require("@/hooks/useContacts");
const phoneUtils_1 = require("@/utils/phoneUtils");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const ContactDetail = ({ contact, onBack, onEdit }) => {
    const { updateLastContacted } = (0, useContacts_1.useContacts)();
    const getContactInitials = () => {
        const first = contact.first_name?.[0] || '';
        const last = contact.last_name?.[0] || '';
        return (first + last).toUpperCase();
    };
    const getImportanceColor = (level) => {
        switch (level) {
            case 5: return 'bg-red-500';
            case 4: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 2: return 'bg-blue-500';
            case 1: return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };
    const getImportanceLabel = (level) => {
        switch (level) {
            case 5: return 'Critical';
            case 4: return 'Important';
            case 3: return 'Average';
            case 2: return 'Below Average';
            case 1: return 'Low';
            default: return 'Unknown';
        }
    };
    const handleCall = async () => {
        if (contact.phone_number) {
            window.open(`tel:${contact.phone_number}`, '_self');
            await updateLastContacted(contact.id);
        }
    };
    const handleWhatsApp = async () => {
        if (contact.whatsapp_number) {
            const cleanNumber = contact.whatsapp_number.replace(/[^\d+]/g, '');
            window.open(`https://wa.me/${cleanNumber}`, '_blank');
            await updateLastContacted(contact.id);
        }
    };
    const handleEmail = async () => {
        if (contact.email) {
            window.open(`mailto:${contact.email}`, '_self');
            await updateLastContacted(contact.id);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString)
            return 'Never';
        return new Date(dateString).toLocaleDateString();
    };
    return (<div className="flex flex-col h-full bg-background">
      
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button_1.Button variant="ghost" size="sm" onClick={onBack}>
              <lucide_react_1.ArrowLeft className="w-4 h-4"/>
            </button_1.Button>
            <h1 className="text-2xl font-bold text-foreground">Contact Details</h1>
          </div>
          <button_1.Button onClick={() => onEdit(contact)} size="sm">
            <lucide_react_1.Edit className="w-4 h-4 mr-2"/>
            Edit
          </button_1.Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          
          <card_1.Card>
            <card_1.CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <avatar_1.Avatar className="w-20 h-20">
                    <avatar_1.AvatarImage src={contact.avatar_url}/>
                    <avatar_1.AvatarFallback className="text-xl font-medium">
                      {getContactInitials()}
                    </avatar_1.AvatarFallback>
                  </avatar_1.Avatar>
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getImportanceColor(contact.importance_level)} flex items-center justify-center`} title={`Importance: ${getImportanceLabel(contact.importance_level)}`}>
                    <span className="text-white text-xs font-bold">{contact.importance_level}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{contact.full_name}</h2>
                  {contact.job_title && contact.company && (<p className="text-lg text-muted-foreground mt-1">
                      {contact.job_title} at {contact.company}
                    </p>)}
                  {contact.relationship_type && (<badge_1.Badge variant="secondary" className="mt-2">
                      {contact.relationship_type}
                    </badge_1.Badge>)}
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Quick Actions</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="flex flex-wrap gap-3">
                {contact.phone_number && (<button_1.Button onClick={handleCall} variant="outline">
                    <lucide_react_1.Phone className="w-4 h-4 mr-2"/>
                    Call
                  </button_1.Button>)}
                {contact.whatsapp_number && (<button_1.Button onClick={handleWhatsApp} variant="outline">
                    <lucide_react_1.MessageCircle className="w-4 h-4 mr-2"/>
                    WhatsApp
                  </button_1.Button>)}
                {contact.email && (<button_1.Button onClick={handleEmail} variant="outline">
                    <lucide_react_1.Mail className="w-4 h-4 mr-2"/>
                    Email
                  </button_1.Button>)}
              </div>
            </card_1.CardContent>
          </card_1.Card>

          
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center space-x-2">
                <lucide_react_1.User className="w-5 h-5"/>
                <span>Contact Information</span>
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              {contact.phone_number && (<div className="flex items-center space-x-3">
                  <lucide_react_1.Phone className="w-4 h-4 text-muted-foreground"/>
                  <span>{(0, phoneUtils_1.formatPhoneNumber)(contact.phone_number)}</span>
                </div>)}
              {contact.whatsapp_number && (<div className="flex items-center space-x-3">
                  <lucide_react_1.MessageCircle className="w-4 h-4 text-muted-foreground"/>
                  <span>{(0, phoneUtils_1.formatPhoneNumber)(contact.whatsapp_number)}</span>
                </div>)}
              {contact.email && (<div className="flex items-center space-x-3">
                  <lucide_react_1.Mail className="w-4 h-4 text-muted-foreground"/>
                  <span>{contact.email}</span>
                </div>)}
            </card_1.CardContent>
          </card_1.Card>

          
          {(contact.company || contact.job_title || contact.department) && (<card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center space-x-2">
                  <lucide_react_1.Building className="w-5 h-5"/>
                  <span>Business Information</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-3">
                {contact.company && (<div>
                    <span className="text-sm text-muted-foreground">Company</span>
                    <p className="font-medium">{contact.company}</p>
                  </div>)}
                {contact.job_title && (<div>
                    <span className="text-sm text-muted-foreground">Job Title</span>
                    <p className="font-medium">{contact.job_title}</p>
                  </div>)}
                {contact.department && (<div>
                    <span className="text-sm text-muted-foreground">Department</span>
                    <p className="font-medium">{contact.department}</p>
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>)}

          
          {(contact.address_line1 || contact.city || contact.country) && (<card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center space-x-2">
                  <lucide_react_1.MapPin className="w-5 h-5"/>
                  <span>Address</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-1">
                  {contact.address_line1 && <p>{contact.address_line1}</p>}
                  {contact.address_line2 && <p>{contact.address_line2}</p>}
                  <p>
                    {[contact.city, contact.state_province, contact.postal_code]
                .filter(Boolean)
                .join(', ')}
                  </p>
                  {contact.country && <p>{contact.country}</p>}
                </div>
              </card_1.CardContent>
            </card_1.Card>)}

          
          {contact.tags.length > 0 && (<card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center space-x-2">
                  <lucide_react_1.Tag className="w-5 h-5"/>
                  <span>Tags</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (<badge_1.Badge key={index} variant="outline">
                      {tag}
                    </badge_1.Badge>))}
                </div>
              </card_1.CardContent>
            </card_1.Card>)}

          
          {contact.notes && (<card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Notes</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <p className="whitespace-pre-wrap">{contact.notes}</p>
              </card_1.CardContent>
            </card_1.Card>)}

          
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center space-x-2">
                <lucide_react_1.Calendar className="w-5 h-5"/>
                <span>Activity</span>
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Last Contacted</span>
                <p className="font-medium">{formatDate(contact.last_contacted_at)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Added</span>
                <p className="font-medium">{formatDate(contact.created_at)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status</span>
                <badge_1.Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                  {contact.status}
                </badge_1.Badge>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
    </div>);
};
exports.default = ContactDetail;
//# sourceMappingURL=ContactDetail.js.map