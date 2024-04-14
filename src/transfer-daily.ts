import dayjs from 'dayjs';
import dayjsUTCPlugin from 'dayjs/plugin/utc';
import dayjsTimezonePlugin from 'dayjs/plugin/timezone';
import dotenv from 'dotenv';
import { fsStorage } from './classes/FSStorage';

import { fetchStatements, createTransaction } from './api';
import {
  logFailedTransaction,
  logMonobankTransactionDeposit,
  logMonobankTransactionWithdrawal,
  logSuccessfullTransaction,
  promptFrom,
  promptTo,
} from './log';

dotenv.config();

dayjs.extend(dayjsUTCPlugin);
dayjs.extend(dayjsTimezonePlugin);

(async () => {
  const currentDay = dayjs
    .tz(new Date(), 'Europe/Kyiv')
    .subtract(1, 'day')
    .endOf('day');
  const startOfCurrentDay = currentDay.startOf('day');

  let savedTransactions = fsStorage.get<string[]>('savedTransaction') ?? [];
  let savedFrom = fsStorage.get<Record<string, string>>('savedFrom') ?? {};
  let savedTo = fsStorage.get<Record<string, string>>('savedTo') ?? {};

  const statements = await fetchStatements(
    startOfCurrentDay.toDate(),
    currentDay.toDate(),
  );
  statements.reverse();

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const { id, amount, description, time } = statement;
    if (savedTransactions.includes(id)) continue;

    const isWithdrawal = amount < 0;
    const isDeposit = amount > 0;

    if (isWithdrawal) logMonobankTransactionWithdrawal(statement);
    if (isDeposit) logMonobankTransactionDeposit(statement);

    let from = isWithdrawal
      ? process.env.FIREFLY_ACCOUNT_NAME
      : savedFrom[description];

    if (!from) {
      const { value, isNeedToBeSaved } = promptFrom();
      from = value;
      if (isNeedToBeSaved) {
        fsStorage.set('savedFrom', { ...savedFrom, [description]: from });
        savedFrom = fsStorage.get('savedFrom') ?? {};
      }
    }

    let to = isDeposit
      ? process.env.FIREFLY_ACCOUNT_NAME
      : savedTo[description];

    if (!to) {
      const { value, isNeedToBeSaved } = promptTo();
      to = value;
      if (isNeedToBeSaved) {
        fsStorage.set('savedTo', { ...savedTo, [description]: to });
        savedTo = fsStorage.get('savedTo') ?? {};
      }
    }

    const response = await createTransaction({
      date: new Date(time * 1000),
      amount: Math.abs(amount / 100).toFixed(2),
      from,
      to,
      description,
      type: isWithdrawal ? 'withdrawal' : 'deposit',
    });

    if (response.ok) {
      fsStorage.set('savedTransaction', [...savedTransactions, id]);
      savedTransactions = fsStorage.get('savedTransaction') ?? [];
      logSuccessfullTransaction(statement);
    } else {
      logFailedTransaction(statement, await response.json());
    }
  }
})();
