export interface CountryPhoneFormat {
    code: string;
    format: string;
    placeholder: string;
    maxLength: number;
}
export declare const phoneFormats: Record<string, CountryPhoneFormat>;
export declare const formatPhoneNumber: (phone: string | null | undefined) => string;
export declare const formatPhoneInput: (value: string, countryCode: string) => string;
export declare const getPhoneFormat: (countryCode: string) => CountryPhoneFormat;
export declare const cleanPhoneNumber: (phone: string) => string;
//# sourceMappingURL=phoneUtils.d.ts.map