import "./App.css";
import Header from "./shared/header";
import Filter from "./shared/filter";
import Home from "./home";
import { Population } from "./population";
import { useState, useMemo } from "react";

function App() {
  let [density, setDensity] = useState([]);
  let [population, setPopulation] = useState([]);
  let [selectedYear, setSelectedYear] = useState({year : null, population : null});
  let formatter = Intl.NumberFormat('en', { notation: 'compact' });

  const filterByYear = (year) => {
    setPopulation(Population.filter((p) => p.Year === year));
    const selectedYearPopulation = density?.find(p=> p.year == year)
    if (selectedYearPopulation) {
      const population = formatter.format(selectedYearPopulation.value)
      setSelectedYear({year, population});
    }

  };

  const groupDataByYear = () => {
    let obj = {};
    const arr = [];
    Population.forEach((a) => {
      if (obj[a.Year]) {
        obj[a.Year] += convertNum(a.Population);
      } else {
        obj[a.Year] = convertNum(a.Population);
      }
    });
    Object.keys(obj).forEach((year) => arr.push({ year, value: obj[year] }));
    console.log(arr);
    return arr;
  };

  function convertNum(num) {
    return typeof num === "number" ? num : Number(num.replace(/\,/g, ""));
  }

  useMemo(() => {
    setDensity(state => state = groupDataByYear());
    filterByYear(new Date().getFullYear() - 1);
  }, []);

  return (
    <div className="App">
      <Header />
      <Filter filter={filterByYear} />
      <Home density={density} population={population} selectedYearData={selectedYear} />
    </div>
  );
}

export default App;
