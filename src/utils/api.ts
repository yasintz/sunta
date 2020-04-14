import uniqBy from 'lodash.uniqby';
import axiosGet from './axios';
import dayjs from './dayjs';
import renameKeys from './renameKeys';

export interface Place {
  id: string;
  text: string;
}

export interface TimeInformation {
  date: string;
  sunriseTime: string;
}

class Requests {
  getCountries = () =>
    axiosGet<any[]>('/ulkeler').then((items) =>
      items.map((item) =>
        renameKeys<Place>(item, {
          UlkeID: 'id',
          UlkeAdi: 'text',
        })
      )
    );

  getCities = (countryId: string) =>
    axiosGet<any[]>(`/sehirler?ulke=${countryId}`).then((items) =>
      items.map((item) =>
        renameKeys<Place>(item, {
          SehirID: 'id',
          SehirAdi: 'text',
        })
      )
    );

  getDistricts = (cityId: string) =>
    axiosGet<any[]>(`/ilceler?sehir=${cityId}`).then((items) =>
      items.map((item) =>
        renameKeys<Place>(item, {
          IlceID: 'id',
          IlceAdi: 'text',
        })
      )
    );

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
