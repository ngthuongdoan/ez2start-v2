import { BaseDocument } from "./core";

/**
 * Financial Management Types
 */

// Basic financial record types
export interface FinancialRecord extends BaseDocument {
  business_id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description?: string;
  date: Date;
  reference_number?: string;
  account_id: string; // Reference to financial account
  transaction_id?: string; // Optional link to sales transaction
  payment_method?: string;
  tax_deductible?: boolean;
  receipt_url?: string;
  entered_by: string; // Employee who entered record
}

export interface FinancialAccount extends BaseDocument {
  business_id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit' | 'savings' | 'other';
  currency: string;
  opening_balance: number;
  current_balance: number;
  description?: string;
  account_number?: string; // For external reference
  is_primary: boolean;
}

export interface ExpenseCategory extends BaseDocument {
  business_id: string;
  name: string;
  description?: string;
  budget_monthly?: number;
  is_tax_deductible: boolean;
  parent_category_id?: string; // For hierarchical categories
}

export interface Budget extends BaseDocument {
  business_id: string;
  name: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: Date;
  end_date: Date;
  categories: BudgetCategory[];
  notes?: string;
}

export interface BudgetCategory {
  category_id: string;
  category_name: string;
  allocated_amount: number;
  actual_amount?: number; // Calculated from actual expenses
}

// Invoice management
export interface Invoice extends BaseDocument {
  business_id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  issue_date: Date;
  due_date: Date;
  payment_terms?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_link?: string;
  sent_date?: Date;
  paid_date?: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
  product_id?: string;
}

export interface Payment extends BaseDocument {
  business_id: string;
  amount: number;
  date: Date;
  method: string;
  reference_number?: string;
  notes?: string;
  
  // Can link to different record types
  invoice_id?: string;
  expense_id?: string;
  transaction_id?: string;
}

// Financial reporting types
export interface FinancialPeriod {
  start_date: Date;
  end_date: Date;
  label: string;
}

export interface CashFlowReport {
  period: FinancialPeriod;
  starting_balance: number;
  ending_balance: number;
  total_inflow: number;
  total_outflow: number;
  net_cash_flow: number;
  income_categories: CategoryBreakdown[];
  expense_categories: CategoryBreakdown[];
}

export interface ProfitLossReport {
  period: FinancialPeriod;
  total_revenue: number;
  total_expenses: number;
  gross_profit: number;
  net_profit: number;
  income_categories: CategoryBreakdown[];
  expense_categories: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number; // Of total
}

// Form Data Types
export interface ExpenseFormData {
  amount: number;
  category: string;
  description?: string;
  date: Date | string;
  reference_number?: string;
  account_id: string;
  payment_method?: string;
  tax_deductible?: boolean;
  receipt?: File;
}

export interface InvoiceFormData {
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  issue_date: Date | string;
  due_date: Date | string;
  payment_terms?: string;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    product_id?: string;
  }[];
  discount_amount?: number;
}
