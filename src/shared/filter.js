import { Fragment, useState } from "react";

const Filter = (props) => {
  let dropdowns = [];
  const now = new Date().getFullYear() - 1;
  let [ year, setYear ] = useState(now);
  
  const dropdownsOptions = () => {
    let startYear = 1950;
    while (startYear <= now) {
      dropdowns.push(startYear);
      startYear++;
    }
  };
  dropdownsOptions();
  const onChange = (event) => {
    const y = event.target.value
    setYear(() => (year = y));
    props.filter(+y)
  };

  return (
    <Fragment>
      <div className="filter">
        <select onChange={onChange} value={year}>
          {dropdowns.map((d) => (
            <option value={d} key={d}>{d}</option>
          ))}
        </select>
      </div>
    </Fragment>
  );
};

export default Filter;

