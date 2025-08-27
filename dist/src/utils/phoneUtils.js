"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanPhoneNumber = exports.getPhoneFormat = exports.formatPhoneInput = exports.formatPhoneNumber = exports.phoneFormats = void 0;
exports.phoneFormats = {
    '+1': {
        code: '+1',
        format: '###-###-####',
        placeholder: '123-456-7890',
        maxLength: 10,
    },
    '+44': {
        code: '+44',
        format: '#### ### ####',
        placeholder: '1234 567 8901',
        maxLength: 11,
    },
    '+33': {
        code: '+33',
        format: '## ## ## ## ##',
        placeholder: '12 34 56 78 90',
        maxLength: 10,
    },
    '+49': {
        code: '+49',
        format: '### ### ####',
        placeholder: '123 456 7890',
        maxLength: 11,
    },
    '+81': {
        code: '+81',
        format: '##-####-####',
        placeholder: '12-3456-7890',
        maxLength: 11,
    },
    '+86': {
        code: '+86',
        format: '### #### ####',
        placeholder: '123 4567 8901',
        maxLength: 11,
    },
    '+91': {
        code: '+91',
        format: '##### #####',
        placeholder: '12345 67890',
        maxLength: 10,
    },
    '+61': {
        code: '+61',
        format: '### ### ###',
        placeholder: '123 456 789',
        maxLength: 9,
    },
    '+55': {
        code: '+55',
        format: '(##) #####-####',
        placeholder: '(12) 34567-8901',
        maxLength: 11,
    },
    '+52': {
        code: '+52',
        format: '### ### ####',
        placeholder: '123 456 7890',
        maxLength: 10,
    },
};
const formatPhoneNumber = (phone) => {
    if (!phone)
        return '';
    let countryCode = '';
    let rest = '';
    if (phone.startsWith('+')) {
        const knownCodes = Object.keys(exports.phoneFormats).sort((a, b) => b.length - a.length);
        const found = knownCodes.find(code => phone.startsWith(code));
        if (found) {
            countryCode = found;
            rest = phone.slice(found.length);
        }
        else {
            const m = phone.match(/^(\+\d{1,4})(.*)$/);
            if (!m)
                return phone;
            countryCode = m[1];
            rest = m[2];
        }
    }
    else {
        return phone;
    }
    const digits = rest.replace(/\D/g, '');
    const format = exports.phoneFormats[countryCode];
    if (!format) {
        if (digits.length >= 10) {
            return `${countryCode} ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
        return `${countryCode} ${digits}`;
    }
    let formatted = '';
    let digitIndex = 0;
    for (const char of format.format) {
        if (char === '#' && digitIndex < digits.length) {
            formatted += digits[digitIndex];
            digitIndex++;
        }
        else if (char !== '#') {
            formatted += char;
        }
    }
    return `${countryCode} ${formatted}`;
};
exports.formatPhoneNumber = formatPhoneNumber;
const formatPhoneInput = (value, countryCode) => {
    const format = exports.phoneFormats[countryCode];
    if (!format)
        return value;
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    let digitIndex = 0;
    for (const char of format.format) {
        if (char === '#' && digitIndex < digits.length && digitIndex < format.maxLength) {
            formatted += digits[digitIndex];
            digitIndex++;
        }
        else if (char !== '#' && digitIndex > 0) {
            formatted += char;
        }
    }
    return formatted;
};
exports.formatPhoneInput = formatPhoneInput;
const getPhoneFormat = (countryCode) => {
    return (exports.phoneFormats[countryCode] || {
        code: countryCode,
        format: '##########',
        placeholder: 'Phone number',
        maxLength: 15,
    });
};
exports.getPhoneFormat = getPhoneFormat;
const cleanPhoneNumber = (phone) => {
    return phone.replace(/\D/g, '');
};
exports.cleanPhoneNumber = cleanPhoneNumber;
//# sourceMappingURL=phoneUtils.js.map