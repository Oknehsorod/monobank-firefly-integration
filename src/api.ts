import { Statement, TransationBody } from './types';

export const fetchCurrentFireflyBalance = (): Promise<number> =>
  fetch(new URL('/api/v1/accounts', process.env.FIREFLY_API_HOST).toString(), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FIREFLY_API_KEY}`,
    },
  })
    .then((res) => res.json())
    .then(
      (body) =>
        +body.data.find(
          (account: any) =>
            account.attributes.name === process.env.FIREFLY_ACCOUNT_NAME,
        )?.attributes.current_balance ?? 0,
    );

export const fetchCurrentMonobankBalance = (): Promise<number> =>
  fetch(
    new URL(`/personal/client-info`, process.env.MONOBANK_API_HOST).toString(),
    {
      headers: {
        'X-Token': process.env.MONOBANK_API_KEY ?? '',
      },
    },
  )
    .then((res) => res.json())
    .then(
      (body) =>
        body.accounts.find((account: any) => account.currencyCode === 980)
          .balance / 100,
    );

export const fetchStatements = (from: Date, to: Date): Promise<Statement[]> =>
  fetch(
    new URL(
      `/personal/statement/${process.env.MONOBANK_ACCOUNT}/${+from}/${+to}`,
      process.env.MONOBANK_API_HOST,
    ).toString(),
    {
      headers: {
        'X-Token': process.env.MONOBANK_API_KEY ?? '',
      },
    },
  ).then((res) => res.json());

export const createTransaction = ({
  date,
  amount,
  from,
  to,
  description,
  type,
}: TransationBody) =>
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
            type,
            date: date.toISOString(),
            amount,
            description,
            source_name: from,
            destination_name: to,
          },
        ],
      }),
    },
  );
