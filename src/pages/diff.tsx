import React from 'react';
import * as Api from '../utils/api';
import { calcRemainingTime } from '../utils/calc';

type DiffProps = {
  timeInformations: Api.TimeInformation[];
};

const Diff: React.FC<DiffProps> = (props) => {
  const [diff, setDiff] = React.useState(
    calcRemainingTime(props.timeInformations)
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDiff(calcRemainingTime(props.timeInformations));
    }, 1000 * 30);

    return () => clearInterval(interval);
  }, [props.timeInformations]);

  const isRenderHour = diff.hours > 0;
  const isRenderMinute = isRenderHour || diff.minutes > 0;
  const isRenderSecond = false && (isRenderMinute || diff.seconds > 0);
  return (
    <div className="page-container">
      <div className="description">Guneşin Doğumuna</div>
      <h1>
        {isRenderHour && (
          <span>{diff.hours.toString().padStart(2, '0')} saat </span>
        )}
        {isRenderMinute && (
          <span>{diff.minutes.toString().padStart(2, '0')} dakika </span>
        )}
        {isRenderSecond && (
          <span>{diff.seconds.toString().padStart(2, '0')} saniye</span>
        )}
      </h1>
    </div>
  );
};

export default Diff;
