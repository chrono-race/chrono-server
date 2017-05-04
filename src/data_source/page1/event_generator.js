import winston from 'winston';
import page1ChangeDetector from './change_detector';
import { createDriverRow } from './create_driver_row';

function initialise() {
  let lastGaps;
  let lastPage1;
  return {
    updateWith: (gaps, page1) => {
      const isInitialUpdate = lastPage1 === undefined || lastGaps === undefined;
      const prevPage1 = lastPage1;
      if (gaps !== undefined && gaps !== null) {
        lastGaps = gaps;
      }
      if (page1 !== undefined && page1 !== null) {
        lastPage1 = page1;
      }
      if (lastPage1 === undefined && lastGaps === undefined) {
        winston.warn('Neither page 1 nor gaps received yet');
        return [];
      }
      if (lastPage1 !== undefined && lastGaps === undefined) {
        winston.warn('Page 1 received but no gaps received yet');
        return [];
      }
      if (lastPage1 === undefined && lastGaps !== undefined) {
        winston.warn('Gaps received but no page 1 received yet');
        return [];
      }
      const driverRows = Object.keys(lastPage1)
        .map(driver => createDriverRow(driver, lastGaps, lastPage1));
      if (isInitialUpdate) {
        return driverRows;
      }
      return driverRows.filter(row => page1ChangeDetector.isChanged(prevPage1[row.driver], row));
    },
  };
}

module.exports = { initialise };
