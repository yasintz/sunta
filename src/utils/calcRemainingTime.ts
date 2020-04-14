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

function calcRemainingTime(
  prayerTimes: Api.TimeInformation[],
  date = new Date(),
  sunriseDate = date
): { hours: number; minutes: number; seconds: number } {
  const currentDateDayjs = dayjs(date);

  const currentSunriseTimeDayjs = dayjs(
    getByDate(prayerTimes, sunriseDate).sunriseTime
  );

  const diff = currentDateDayjs.diff(currentSunriseTimeDayjs);

  const isSunBorn = diff >= 0;
  if (isSunBorn) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + 1);

    return calcRemainingTime(prayerTimes, date, dateCopy);
  }
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

export default calcRemainingTime;
