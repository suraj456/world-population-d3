import { Fragment, useEffect, useState } from "react";
import DensityChart from "./shared/density.chart";
import ScatterPlotChart from "./shared/scatter-plot.chart";

const Home = (props) => {
  return (
    <Fragment>
      <div className="grid">
        <div className="overview">
          <div className="totalPopulation">
            <h4>World Population </h4>
            <h4>({props.selectedYearData.year})</h4>
            <h1>{props.selectedYearData.population}</h1>
          </div>
          <div className="density">
          <h4>Population Growth </h4>
            <DensityChart data={props.density} />
          </div>
        </div>
        <div className="scatterPlot">
          <h3>Population Growth Vs Density Correlation</h3>
          <ScatterPlotChart data={props.population} />
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
