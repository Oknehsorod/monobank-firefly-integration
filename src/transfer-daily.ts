import dayjs from 'dayjs';
import dayjsUTCPlugin from 'dayjs/plugin/utc';
import dayjsTimezonePlugin from 'dayjs/plugin/timezone';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import { fetchStatements, createTransaction } from './api';
import { monobankDescriptionToDestinationAccount } from './constants';

dotenv.config();

dayjs.extend(dayjsUTCPlugin);
dayjs.extend(dayjsTimezonePlugin);

(async () => {
  const cacheFolderPath = path.join(__dirname, '..', 'cache');
  if (!fs.existsSync(path.join(cacheFolderPath, 'state.json'))) {
    try {
      fs.mkdirSync(cacheFolderPath);
    } catch (_) {
    } finally {
      fs.writeFileSync(
        path.join(cacheFolderPath, 'state.json'),
        JSON.stringify({}),
      );
    }
  }

  const currentDay = dayjs.tz(new Date(), 'Europe/Kyiv');
  const startOfCurrentDay = currentDay.startOf('day');
  const state = JSON.parse(
    fs.readFileSync(path.join(cacheFolderPath, 'state.json'), 'utf-8'),
  );

  const statements = await fetchStatements(
    startOfCurrentDay.toDate(),
    currentDay.toDate(),
  );

  console.log('statements :>> ', statements);

  await Promise.all(
    statements.map(async ({ description, amount, time }) => {
      if (state[time]) return;
      if (monobankDescriptionToDestinationAccount[description]) {
        const res = await createTransaction(
          monobankDescriptionToDestinationAccount[description],
          monobankDescriptionToDestinationAccount[description],
          Math.abs(amount / 100).toString(),
          new Date(time * 1000),
        );
        console.log('res :>> ', res);
        state[time] = (amount / 100).toFixed(2);
        fs.writeFileSync(
          path.join(cacheFolderPath, 'state.json'),
          JSON.stringify(state),
        );
      }
    }),
  );
})();
