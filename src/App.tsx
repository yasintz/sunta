import React from 'react';
import * as Api from './utils/api';
import SwipeableViews from 'react-swipeable-views';

import Diff from './pages/diff';
import Clock from './pages/clock';
import { LocalStrategy } from './utils/strategy';
import useStrategy from './hooks/useLocalStorage';
import Settings from './pages/settings';
import useWatch from './hooks/useWatch';

const districLocalStrategy = new LocalStrategy('district', '9479');
const countryLocalStrategy = new LocalStrategy('country', '2');
const cityLocalStrategy = new LocalStrategy('city', '532');
const swipeableIndexLocalStrategy = new LocalStrategy('swipeableIndex', 0);

function App() {
  const [countryId, setCountryId] = useStrategy(countryLocalStrategy);
  const [cityId, setCityId] = useStrategy(cityLocalStrategy);
  const [districtId, setDistrictId] = useStrategy(districLocalStrategy);
  const [isShownSettings, setIsShownSettings] = React.useState(false);

  const [swipeableIndex, setSwipeableIndex] = useStrategy(
    swipeableIndexLocalStrategy
  );

  const loadingCountRef = React.useRef(0);

  const [hasError, setHasError] = React.useState(false);

  const [countries, setCountries] = React.useState<Api.Place[] | undefined>(
    undefined
  );

  const [cities, setCities] = React.useState<Api.Place[] | undefined>(
    undefined
  );
  const [districts, setDistricts] = React.useState<Api.Place[] | undefined>(
    undefined
  );

  const [timeInformations, setTimeInformations] = React.useState<
    Api.TimeInformation[] | undefined
  >(undefined);

  const isLoading = loadingCountRef.current > 0;

  const handleApi = React.useCallback(async (fn: () => Promise<any>) => {
    loadingCountRef.current++;
    try {
      fn();
    } catch (error) {
      setHasError(true);
    }
    loadingCountRef.current--;
  }, []);

  React.useEffect(() => {
    handleApi(async () => {
      setCountries(await Api.requests.getCountries());
    });
  }, [handleApi]);

  useWatch(
    () => {
      handleApi(async () => {
        const newCities = await Api.requests.getCities(countryId);
        const hasCityIdInCities = Boolean(
          newCities.find((city) => city.id === cityId)
        );
        const selectedCityId = hasCityIdInCities ? cityId : newCities[0].id;

        setCityId(selectedCityId);

        setCities(newCities);
      });
    },
    countryId,
    true
  );

  useWatch(
    () => {
      handleApi(async () => {
        const newDistricts = await Api.requests.getDistricts(cityId);

        const hasDistrictIdInDistricts = Boolean(
          newDistricts.find((district) => district.id === districtId)
        );
        const selectedDistrictId = hasDistrictIdInDistricts
          ? districtId
          : newDistricts[0].id;

        setDistrictId(selectedDistrictId);

        setDistricts(newDistricts);
      });
    },
    cityId,
    true
  );

  useWatch(
    () => {
      handleApi(async () => {
        setTimeInformations(await Api.requests.getPrayerTimes(districtId));
      });
    },
    districtId,
    true
  );

  useWatch(
    () => {
      if (swipeableIndex === 3) {
        setTimeout(() => {
          setIsShownSettings(true);
        }, 1500);
      }
    },
    swipeableIndex,
    true
  );

  const loadingComponent = (
    <div className="page-container">
      <span>Loading...</span>
    </div>
  );

  if (isLoading) {
    return loadingComponent;
  }

  if (hasError) {
    return (
      <div className="page-container">
        <span>Error !</span>
      </div>
    );
  }

  if (timeInformations && countries && cities && districts) {
    const apps = [
      <Diff timeInformations={timeInformations} />,
      <Clock timeInformations={timeInformations} />,
      isShownSettings ? (
        <Settings
          countries={countries}
          cities={cities}
          districts={districts}
          selectedCountryId={countryId}
          selectedCityId={cityId}
          selectedDistrictId={districtId}
          setSelectedCountryId={setCountryId}
          setSelectedCityId={setCityId}
          setSelectedDistrictId={setDistrictId}
        />
      ) : (
        <span>Loading...</span>
      ),
    ];
    return (
      <SwipeableViews
        enableMouseEvents
        index={swipeableIndex}
        onChangeIndex={setSwipeableIndex}
      >
        {apps.map((app, index) => (
          <div className="page-container" key={index}>
            {app}
          </div>
        ))}
      </SwipeableViews>
    );
  }

  return loadingComponent;
}

export default App;
