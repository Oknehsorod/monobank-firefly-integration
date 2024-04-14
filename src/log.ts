import chalk from 'chalk';
import cc from 'currency-codes';
import promptSync from 'prompt-sync';

import { PromptDestinationAnswers, Statement } from './types';

const prompt = promptSync();

export const logMonobankTransactionWithdrawal = ({
  amount,
  description,
  currencyCode,
  time,
}: Statement) =>
  console.info(
    'Transaction',
    chalk.red('[WITHDRAWAL]'),
    '>>',
    'To:',
    chalk.yellow(description),
    'Amount:',
    chalk.red(
      (amount / 100).toFixed(2) +
        ' ' +
        (cc.number(currencyCode.toString())?.code ?? 'UAH'),
    ),
    'Date:',
    chalk.blue(new Date(time * 1000).toISOString()),
  );

export const logMonobankTransactionDeposit = ({
  amount,
  description,
  currencyCode,
  time,
}: Statement) =>
  console.info(
    'Transaction',
    chalk.green('[DEPOSIT]'),
    '>>',
    'From:',
    chalk.yellow(description),
    'Amount:',
    chalk.green(
      (amount / 100).toFixed(2) +
        ' ' +
        (cc.number(currencyCode.toString())?.code ?? 'UAH'),
    ),
    'Date:',
    chalk.blue(new Date(time * 1000).toISOString()),
  );

export const logSuccessfullTransaction = ({ description }: Statement) =>
  console.info(chalk.green(`Transation ${description} successfully created`));

export const logFailedTransaction = (
  { description }: Statement,
  body: object,
) =>
  console.info(
    chalk.red(`Failed to create transaction ${description}`),
    JSON.stringify(body),
  );

export const promptFrom = (): PromptDestinationAnswers => {
  const [value, isNeedToBeSavedRaw] = prompt('Input from/save(y/n): ').split(
    '/',
  );
  return {
    value,
    isNeedToBeSaved: isNeedToBeSavedRaw === 'y',
  };
};
export const promptTo = (): PromptDestinationAnswers => {
  const [value, isNeedToBeSavedRaw] = prompt('Input to/save(y/n): ').split('/');
  return {
    value,
    isNeedToBeSaved: isNeedToBeSavedRaw === 'y',
  };
};
