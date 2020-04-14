import uniqBy from 'lodash.uniqby';
import axiosGet from './axios';
import dayjs from './dayjs';
import renameKeys from './renameKeys';

export interface Country {
  UlkeAdi: string;
  UlkeAdiEn: string;
  UlkeID: string;
}

export interface City {
  SehirAdi: string;
  SehirAdiEn: string;
  SehirID: string;
}

export interface District {
  IlceAdi: string;
  IlceAdiEn: string;
  IlceID: string;
}

export interface TimeInformation {
  date: string;
  sunriseTime: string;
}

class Requests {
  getCountries = () => axiosGet<Country[]>('/ulkeler');

  getCities = (countryId: string) =>
    axiosGet<City>(`/sehirler?ulke=${countryId}`);

  getDistricts = (cityId: string) =>
    axiosGet<District>(`/ilceler?sehir=${cityId}`);

  getPrayerTimes = async (districtId: string) => {
    const prayerTimeObject = await axiosGet<any[], string>(
      `/vakitler?ilce=${districtId}`,
      dayjs().format('DD/MM/YYYY')
    );
    const prayerTimes: any[] = [];
    Object.values(prayerTimeObject).forEach((item) => {
      prayerTimes.push(...item);
    });

    return uniqBy(prayerTimes, 'MiladiTarihKisa').map((item: any) =>
      renameKeys<TimeInformation>(item, {
        MiladiTarihUzunIso8601: {
          key: 'date',
          map: (item) => new Date(item).toString(),
        },
        Gunes: {
          key: 'sunriseTime',
          map: (item, obj) => {
            const date = new Date(obj.MiladiTarihUzunIso8601);
            const [hours, minutes] = item.split(':');
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            return date.toString();
          },
        },
      })
    );
  };
}

export const requests = new Requests();
