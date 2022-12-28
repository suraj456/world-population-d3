import { useEffect, useRef, useState, useLayoutEffect } from "react";
import * as d3 from "d3";

const ScatterPlotChart = (props) => {
  let svg,
    x,
    y,
    margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const scatterPlotRef = useRef();
  let [width, setWidth] = useState(null);
  let [height, setHeight] = useState(null);

  const colors = {
    Africa: "orange",
    "North America": "blue",
    "South America": "red",
    Asia: "brown",
    Europe: "purple",
    Australia: "violet",
    Oceania: "pink",
  };

  useEffect(() => {
    return () => clearChart();
  }, []);

  useLayoutEffect(() => {
    console.log("scatter ren");
    renderChart();
  }, [width, props?.data]);

  function getDimension() {
    setWidth(
      (w) => (w = scatterPlotRef.current?.getBoundingClientRect().width)
    );
    setHeight(
      (h) => (h = scatterPlotRef.current?.getBoundingClientRect().height)
    );
  }

  function renderChart() {
    let { data } = props;
    clearChart();
    getDimension();
    if (data.length > 0 && width && height) {
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;
      createSvg();
      addAxisLabels();
      createAxis();
      createDotsAndTooltip(data);
    }
  }

  function createSvg() {
    svg = d3
      .select("#scatterPlot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select(window).on("resize", () => renderChart());
  }

  function addAxisLabels() {
    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -50)
      .attr("x", -50)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Population Growth (%)");

    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + 30)
      .attr("y", height + 30)
      .text("Population Density");
  }

  function createAxis() {
    x = d3.scaleLinear().domain([-5, 10]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    y = d3.scaleLinear().domain([-100, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
  }

  function createDotsAndTooltip(data) {
    try {
      let tooltip = d3
        .select("#scatterPlot")
        .append("div")
        .attr("id", "scatterPlotTooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.6)")
        .style("color", "#fff")
        .style("padding", "1rem")
        .style("visibility", "hidden");

      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "plotcircle")
        .attr("cx", (d) => x(d.Population_Growth_Rate))
        .attr("cy", (d) => y(d.Population_Density))
        .attr("r", (d) =>
          !isNaN(d.Population_Growth_Rate)
            ? 2 * Math.round(d.Population_Growth_Rate)
            : d.Population_Growth_Rate
        )
        .style("fill", (d) => colors[d.region])
        .on("mouseover", (d) => {
          tooltip.transition().duration(500);
          tooltip.transition().duration(200).style("visibility", "visible");
          tooltip
            .html(
              `<span>Region</span>
              <strong>${d.target.__data__.region}</strong>
              <br/>
              <span>Country</span>
              <strong>${d.target.__data__.Country}</strong>
              <br/>
              <span>Population</span>
              <strong>${d.target.__data__.Population}</strong>
              `
            )
            .style("left", d.x + "px")
            .style("top", d.y - 28 + "px");
        })
        .on("mouseout", ()=> tooltip.style("visibility", "hidden"))
    } catch (err) {
      console.warn(err);
    }
  }

  function clearChart() {
    d3.selectAll("#scatterPlot svg").remove();
    d3.select("#scatterPlotTooltip").remove();
  }

  return (
    <div
      ref={scatterPlotRef}
      id="scatterPlot"
      style={{ height: "400px" }}
    ></div>
  );
};

export default ScatterPlotChart;
