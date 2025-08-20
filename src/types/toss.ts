export interface TossPaymentRequest {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
  successUrl: string;
  failUrl: string;
  method?: string; // v2 API에서는 단일 문자열로 지원
  virtualAccount?: {
    dueDate: string;
  };
}

export interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
  status:
    | "READY"
    | "IN_PROGRESS"
    | "WAITING_FOR_DEPOSIT"
    | "DONE"
    | "CANCELED"
    | "PARTIAL_CANCELED"
    | "ABORTED"
    | "FAILED";
  method: string;
  requestedAt: string;
  approvedAt?: string;
  useEscrow: boolean;
  currency: string;
  receiptUrl?: string;
  card?: {
    company: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
    approveNo: string;
    useCardPoint: boolean;
    cardType: string;
    ownerType: string;
    acquireStatus: string;
    amount: number;
  };
  virtualAccount?: {
    accountNumber: string;
    accountType: string;
    bankCode: string;
    customerName: string;
    dueDate: string;
    refundStatus: string;
    expired: boolean;
    settlementStatus: string;
  };
  transfer?: {
    bankCode: string;
    settlementStatus: string;
  };
  mobilePhone?: {
    customerMobilePhone: string;
    settlementStatus: string;
    receiptUrl: string;
  };
  giftCertificate?: {
    approveNo: string;
    settlementStatus: string;
  };
  foreignEasyPay?: {
    provider: string;
    amount: number;
    currency: string;
    exchangeRate: number;
    receiptUrl: string;
  };
  discount?: {
    amount: number;
  };
  cancels?: Array<{
    cancelAmount: number;
    cancelReason: string;
    taxFreeAmount: number;
    taxAmount: number;
    refundableAmount: number;
    easyPayDiscountAmount: number;
    canceledAt: string;
    transactionKey: string;
    receiptKey: string;
  }>;
  isPartialCancelable: boolean;
  cardDiscountAmount: number;
  balanceAmount: number;
  totalDiscountAmount: number;
  vat: number;
  taxFreeAmount: number;
  productName: string;
  bank: string;
  easyPay: string;
  country: string;
  failure: {
    code: string;
    message: string;
  };
  cashReceipts: Array<{
    receiptKey: string;
    orderId: string;
    orderName: string;
    type: string;
    issueNumber: string;
    receiptUrl: string;
    businessNumber: string;
    transactionType: string;
    amount: number;
    taxFreeAmount: number;
    issueStatus: string;
    failure: {
      code: string;
      message: string;
    };
    customerIdentityNumber: string;
    requestedAt: string;
  }>;
}
