import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";

const DensityChart = (props) => {
  let svg,
    x,
    y,
    margin = { top: 40, right: 0, bottom: 40, left: 0 };

  const densityChartRef = useRef();
  let [width, setWidth] = useState(null);
  let [height, setHeight] = useState(null);

  useEffect(() => {
    console.log('densi ren')
    return () => clearChart();
  }, [props.data]);

  useLayoutEffect(()=>{
    renderChart();
  },[width])

  function getDimension() {
    setWidth(w=> w = densityChartRef.current?.getBoundingClientRect().width);
    setHeight(h=> h = densityChartRef.current?.getBoundingClientRect().height);
  }

  function renderChart() {
    let data = props.data;
    getDimension();
    clearChart();
    if (data.length > 0) {
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;
      createSvg();
      createAxis(data);
      createArea(data);
    }

    function createSvg() {
      svg = d3
        .select("#density_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top - 40 + ")");

        d3.select(window).on("resize", () => renderChart())
    }

    function createAxis(data) {
      x = d3
        .scaleLinear()
        .domain(
          d3.extent(data, (d)=> d.year)
        )
        .range([0, width]);

      y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, (d)=> +d.value)
        ])
        .range([height, 0]);
    }

    function createArea(data) {
      svg
        .append("path")
        .datum(data)
        .attr("fill", "#f9c32e")
        .attr("stroke", "#ffcc3e")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .area()
            .x((d) => x(d.year))
            .y0(y(0))
            .y1((d)=> y(d.value))
        );
    }
  }

  function clearChart() {
    d3.selectAll("#density_chart svg").remove();
  }

  return <div id="density_chart" ref={densityChartRef}></div>;
};

export default DensityChart;
