import { serverTimestamp } from "firebase/firestore";

export interface Employee {
  employee_id: string;
  business_id: string;
  user_uid: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  hourly_rate: number;
  is_active: boolean;
  username?: string;
  position?: string;
  assigned_shift?: string;
  dob?: string; // Date of Birth
  address?: string; // Optional address field
}