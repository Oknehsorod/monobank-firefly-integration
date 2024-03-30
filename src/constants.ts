export enum DestinationAccounts {
  Medicine = 'Medicine',
  Taxi = 'Taxi',
  Cosmetics = 'Cosmetics',
  Clothes = 'Clothes',
}

export const monobankDescriptionToDestinationAccount: Record<string, string> = {
  EKSPRES_APTEKA_38: DestinationAccounts.Medicine,
  Uklon: DestinationAccounts.Taxi,
  Аврора: DestinationAccounts.Cosmetics,
  Mida: DestinationAccounts.Clothes,
};
