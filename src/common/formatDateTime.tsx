import { DateTime } from 'luxon';

const FORMAT = DateTime.DATETIME_SHORT;

const fromISO = (text: string | undefined, formatOpts?: Intl.DateTimeFormatOptions) => {
  if (text === undefined || text === null || text === '') {
    return;
  }
  return DateTime.fromISO(text, { zone: 'utc' })
    .toLocal()
    .toLocaleString({
      ...FORMAT,
      ...formatOpts,
    });
};

export default { fromISO };
