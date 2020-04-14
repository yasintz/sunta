import React from 'react';
import * as Api from '../utils/api';
import { getClock } from '../utils/calc';

type ClockProps = {
  timeInformations: Api.TimeInformation[];
};
const Clock: React.FC<ClockProps> = (props) => {
  const clock = React.useMemo(() => getClock(props.timeInformations), [
    props.timeInformations,
  ]);

  return (
    <>
      <div className="description">Gunesin Dogum Saati</div>
      <h1>{clock}</h1>
    </>
  );
};

export default Clock;
