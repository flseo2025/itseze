import { ArrowLeft, Edit, Phone, MessageCircle, Mail, MapPin, Building, User, Tag, Calendar } from 'lucide-react';

import { useContacts } from '@/hooks/useContacts';
import { formatPhoneNumber } from '@/utils/phoneUtils';

import type { Contact } from '@/types/contact';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ContactDetailProps {
  contact: Contact;
  onBack: () => void;
  onEdit: (contact: Contact) => void;
}

const ContactDetail = ({ contact, onBack, onEdit }: ContactDetailProps) => {
  const { updateLastContacted } = useContacts();

  const getContactInitials = () => {
    const first = contact.first_name?.[0] || '';
    const last = contact.last_name?.[0] || '';
    return (first + last).toUpperCase();
  };

  const getImportanceColor = (level: number) => {
    switch (level) {
      case 5: return 'bg-red-500';
      case 4: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 2: return 'bg-blue-500';
      case 1: return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getImportanceLabel = (level: number) => {
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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Contact Details</h1>
          </div>
          <Button onClick={() => onEdit(contact)} size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={contact.avatar_url} />
                    <AvatarFallback className="text-xl font-medium">
                      {getContactInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getImportanceColor(contact.importance_level)} flex items-center justify-center`}
                    title={`Importance: ${getImportanceLabel(contact.importance_level)}`}
                  >
                    <span className="text-white text-xs font-bold">{contact.importance_level}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{contact.full_name}</h2>
                  {contact.job_title && contact.company && (
                    <p className="text-lg text-muted-foreground mt-1">
                      {contact.job_title} at {contact.company}
                    </p>
                  )}
                  {contact.relationship_type && (
                    <Badge variant="secondary" className="mt-2">
                      {contact.relationship_type}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {contact.phone_number && (
                  <Button onClick={handleCall} variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                )}
                {contact.whatsapp_number && (
                  <Button onClick={handleWhatsApp} variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
                {contact.email && (
                  <Button onClick={handleEmail} variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.phone_number && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{formatPhoneNumber(contact.phone_number)}</span>
                </div>
              )}
              {contact.whatsapp_number && (
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span>{formatPhoneNumber(contact.whatsapp_number)}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{contact.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Information */}
          {(contact.company || contact.job_title || contact.department) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Business Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.company && (
                  <div>
                    <span className="text-sm text-muted-foreground">Company</span>
                    <p className="font-medium">{contact.company}</p>
                  </div>
                )}
                {contact.job_title && (
                  <div>
                    <span className="text-sm text-muted-foreground">Job Title</span>
                    <p className="font-medium">{contact.job_title}</p>
                  </div>
                )}
                {contact.department && (
                  <div>
                    <span className="text-sm text-muted-foreground">Department</span>
                    <p className="font-medium">{contact.department}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Address */}
          {(contact.address_line1 || contact.city || contact.country) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {contact.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {contact.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{contact.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
                <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                  {contact.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;