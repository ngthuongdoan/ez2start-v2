// Employee type definition
export interface Employee {
  id?: string;
  name: string;
  phone: string;
  address: string;
  username: string;
  birth: string; // ISO date string
  position: string;
  salaryRate: number;
  assignedShift: string;
}
