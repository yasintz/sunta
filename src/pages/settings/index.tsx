import * as React from 'react';
import * as Api from '../../utils/api';
import SettingsSelect from './select';

type SettingsProps = {
  countries: Api.Place[];
  cities: Api.Place[];
  districts: Api.Place[];
  selectedCountryId: string;
  selectedCityId: string;
  selectedDistrictId: string;
  setSelectedCountryId: (id: string) => void;
  setSelectedCityId: (id: string) => void;
  setSelectedDistrictId: (id: string) => void;
};

const Settings: React.FC<SettingsProps> = (props) => {
  return (
    <>
      <SettingsSelect
        items={props.countries}
        selectedId={props.selectedCountryId}
        onChange={props.setSelectedCountryId}
      />
      <SettingsSelect
        items={props.cities}
        selectedId={props.selectedCityId}
        onChange={props.setSelectedCityId}
      />
      <SettingsSelect
        items={props.districts}
        selectedId={props.selectedDistrictId}
        onChange={props.setSelectedDistrictId}
      />
    </>
  );
};

export default Settings;
