import { getWeatherIcon, formatDay } from '../utils/utils';

function Day({ day, max, min, code, isToday }) {
  return (
    <li className="day">
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? 'Today' : formatDay(day)}</p>
      <p>
        {Math.floor(min)}&deg; &mdash; <strong> {Math.ceil(max)}&deg; </strong>
      </p>
    </li>
  );
}

export default Day;
