export interface Statement {
  id: string;
  time: number;
  description: string;
  mcc: number;
  originalMcc: number;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  hold: boolean;
  receiptId: string;
}

export interface TransationBody {
  from: string;
  to: string;
  amount: string;
  date: Date;
  type: 'withdrawal' | 'deposit';
  description: string;
}

export enum DestinationAccounts {
  Medicine = 'Medicine',
  Taxi = 'Taxi',
  Cosmetics = 'Cosmetics',
  Clothes = 'Clothes',
  Services = 'Services',
  Games = 'Games',
  Building = 'Building',
  Food = 'Food',
}

export interface PromptDestinationAnswers {
  value: string;
  isNeedToBeSaved: boolean;
}
