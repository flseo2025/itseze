export interface Contact {
    id: string;
    user_id: string;
    first_name: string;
    last_name?: string | null;
    full_name: string;
    phone_number?: string | null;
    whatsapp_number?: string | null;
    email?: string | null;
    company?: string | null;
    job_title?: string | null;
    department?: string | null;
    linkedin_url?: string | null;
    twitter_url?: string | null;
    instagram_url?: string | null;
    facebook_url?: string | null;
    website_url?: string | null;
    avatar_url?: string | null;
    tags: string[];
    category?: string | null;
    relationship_type?: string | null;
    importance_level: number;
    notes?: string | null;
    source?: string | null;
    referring_contact_id?: string | null;
    status: string;
    last_contacted_at?: string | null;
    contact_frequency_days?: number | null;
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    state_province?: string | null;
    postal_code?: string | null;
    country?: string | null;
    created_at: string;
    updated_at: string;
}
export interface ContactCategory {
    id: string;
    user_id: string;
    name: string;
    color?: string;
    description?: string;
    created_at: string;
    updated_at: string;
}
export interface CreateContactData {
    first_name: string;
    last_name?: string;
    phone_number?: string;
    whatsapp_number?: string;
    email?: string;
    company?: string;
    job_title?: string;
    department?: string;
    linkedin_url?: string;
    twitter_url?: string;
    instagram_url?: string;
    facebook_url?: string;
    website_url?: string;
    avatar_url?: string;
    tags?: string[];
    category?: string;
    relationship_type?: string;
    importance_level?: number;
    notes?: string;
    source?: string;
    referring_contact_id?: string;
    status?: string;
    last_contacted_at?: string;
    contact_frequency_days?: number;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state_province?: string;
    postal_code?: string;
    country?: string;
}
//# sourceMappingURL=contact.d.ts.map