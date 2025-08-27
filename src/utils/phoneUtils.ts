// Phone number formatting utilities

export interface CountryPhoneFormat {
  code: string;
  format: string;
  placeholder: string;
  maxLength: number;
}

// Common phone formats by country code
export const phoneFormats: Record<string, CountryPhoneFormat> = {
  '+1': {
    // US/Canada
    code: '+1',
    format: '###-###-####',
    placeholder: '123-456-7890',
    maxLength: 10,
  },
  '+44': {
    // UK
    code: '+44',
    format: '#### ### ####',
    placeholder: '1234 567 8901',
    maxLength: 11,
  },
  '+33': {
    // France
    code: '+33',
    format: '## ## ## ## ##',
    placeholder: '12 34 56 78 90',
    maxLength: 10,
  },
  '+49': {
    // Germany
    code: '+49',
    format: '### ### ####',
    placeholder: '123 456 7890',
    maxLength: 11,
  },
  '+81': {
    // Japan
    code: '+81',
    format: '##-####-####',
    placeholder: '12-3456-7890',
    maxLength: 11,
  },
  '+86': {
    // China
    code: '+86',
    format: '### #### ####',
    placeholder: '123 4567 8901',
    maxLength: 11,
  },
  '+91': {
    // India
    code: '+91',
    format: '##### #####',
    placeholder: '12345 67890',
    maxLength: 10,
  },
  '+61': {
    // Australia
    code: '+61',
    format: '### ### ###',
    placeholder: '123 456 789',
    maxLength: 9,
  },
  '+55': {
    // Brazil
    code: '+55',
    format: '(##) #####-####',
    placeholder: '(12) 34567-8901',
    maxLength: 11,
  },
  '+52': {
    // Mexico
    code: '+52',
    format: '### ### ####',
    placeholder: '123 456 7890',
    maxLength: 10,
  },
};

export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return '';

  // Extract country code and number using known prefixes to avoid eating the area code (e.g. "+1636...")
  let countryCode = '';
  let rest = '';
  if (phone.startsWith('+')) {
    const knownCodes = Object.keys(phoneFormats).sort((a, b) => b.length - a.length);
    const found = knownCodes.find(code => phone.startsWith(code));
    if (found) {
      countryCode = found;
      rest = phone.slice(found.length);
    } else {
      const m = phone.match(/^(\+\d{1,4})(.*)$/);
      if (!m) return phone;
      countryCode = m[1];
      rest = m[2];
    }
  } else {
    return phone;
  }

  const digits = rest.replace(/\D/g, '');

  const format = phoneFormats[countryCode];
  if (!format) {
    // Default formatting for unknown country codes
    if (digits.length >= 10) {
      return `${countryCode} ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return `${countryCode} ${digits}`;
  }

  // Apply country-specific formatting
  let formatted = '';
  let digitIndex = 0;

  for (const char of format.format) {
    if (char === '#' && digitIndex < digits.length) {
      formatted += digits[digitIndex];
      digitIndex++;
    } else if (char !== '#') {
      formatted += char;
    }
  }

  return `${countryCode} ${formatted}`;
};

export const formatPhoneInput = (value: string, countryCode: string): string => {
  const format = phoneFormats[countryCode];
  if (!format) return value;

  const digits = value.replace(/\D/g, '');
  let formatted = '';
  let digitIndex = 0;

  for (const char of format.format) {
    if (char === '#' && digitIndex < digits.length && digitIndex < format.maxLength) {
      formatted += digits[digitIndex];
      digitIndex++;
    } else if (char !== '#' && digitIndex > 0) {
      formatted += char;
    }
  }

  return formatted;
};

export const getPhoneFormat = (countryCode: string): CountryPhoneFormat => {
  return (
    phoneFormats[countryCode] || {
      code: countryCode,
      format: '##########',
      placeholder: 'Phone number',
      maxLength: 15,
    }
  );
};

export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
