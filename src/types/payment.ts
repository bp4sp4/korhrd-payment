export interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "bank" | "mobile";
  icon: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  period: "monthly" | "yearly";
  features: string[];
  popular?: boolean;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  method: string;
  date: Date;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  subscription?: {
    plan: string;
    status: "active" | "inactive" | "cancelled";
    nextBilling: Date;
  };
}
