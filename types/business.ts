import { ModuleSettings } from "./modules";

export interface Business {
    business_id: string;
    owner_uid: string;
    business_name: string;
    business_type: string;
    address: string;
    phone: string;
    tax_number: string;
    tax_rate: number;
    currency: string;
    timezone: string;
    enabled_modules: string[];
    module_settings: ModuleSettings;
    is_active: boolean;
}