import { Statement } from './types';

export const fetchStatements = (from: Date, to: Date): Promise<Statement[]> =>
  fetch(
    new URL(
      `/personal/statement/0/${+from}/${+to}`,
      process.env.MONOBANK_API_HOST,
    ).toString(),
    {
      headers: {
        'X-Token': process.env.MONOBANK_API_KEY ?? '',
      },
    },
  ).then((res) => res.json());

export const createTransaction = (
  description: string,
  to: string,
  amount: string,
  date: Date,
) =>
  fetch(
    new URL('/api/v1/transactions', process.env.FIREFLY_API_HOST).toString(),
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.FIREFLY_API_KEY}`,
      },
      body: JSON.stringify({
        apply_rules: true,
        transactions: [
          {
            type: 'withdrawal',
            date: date.toISOString(),
            amount,
            description,
            source_name: 'Monobank [UAH]',
            destination_name: to,
          },
        ],
      }),
    },
  ).then((res) => res.json());
