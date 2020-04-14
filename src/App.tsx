import React from 'react';
import Home from './home';
import * as Api from './utils/api';

const DEFAULT_DISTRIC_ID = '9479';
const HomeWrapper: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [timeInformations, setTimeInformations] = React.useState<
    Api.TimeInformation[] | undefined
  >(undefined);

  React.useEffect(() => {
    async function handleApi() {
      try {
        setTimeInformations(
          await Api.requests.getPrayerTimes(DEFAULT_DISTRIC_ID)
        );
      } catch (error) {
        setHasError(true);
      }
      setIsLoading(false);
    }
    handleApi();
  }, []);

  const loadingComponent = <span>Loading...</span>;

  if (isLoading) {
    return loadingComponent;
  }
  if (hasError) {
    return <span>Error !</span>;
  }

  if (timeInformations) {
    return (
      <>
        <Home timeInformations={timeInformations} />
      </>
    );
  }

  return loadingComponent;
};

export default HomeWrapper;
