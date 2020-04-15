import * as Api from './api';
import dayjs from './dayjs';

function getByDate(
  prayerTimes: Api.TimeInformation[],
  date: Date
): Api.TimeInformation {
  return prayerTimes.find(
    (item) =>
      dayjs(item.date).format('DD/MM/YYYY') === dayjs(date).format('DD/MM/YYYY')
  ) as Api.TimeInformation;
}

function getSunriseDayjs(
  prayerTimes: Api.TimeInformation[],
  date = new Date(),
  sunriseDate = date
): dayjs.Dayjs {
  const currentDateDayjs = dayjs(date);

  const currentSunriseTimeDayjs = dayjs(
    getByDate(prayerTimes, sunriseDate).sunriseTime
  );

  const diff = currentDateDayjs.diff(currentSunriseTimeDayjs);

  const isSunBorn = diff >= 0;
  if (isSunBorn) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + 1);

    return getSunriseDayjs(prayerTimes, date, dateCopy);
  }

  return currentSunriseTimeDayjs;
}

export function calcRemainingTime(
  prayerTimes: Api.TimeInformation[]
): { hours: number; minutes: number; seconds: number } {
  const currentDateDayjs = dayjs();
  const currentSunriseTimeDayjs = getSunriseDayjs(prayerTimes);
  const duration = dayjs.duration(
    currentSunriseTimeDayjs.diff(currentDateDayjs)
  );

  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return {
    hours,
    minutes: minutes - hours * 60,
    seconds: seconds - minutes * 60,
  };
}

export function getClock(prayerTimes: Api.TimeInformation[]): string {
  const currentSunriseTimeDayjs = getSunriseDayjs(prayerTimes);
  return currentSunriseTimeDayjs.format('hh:mm');
}
