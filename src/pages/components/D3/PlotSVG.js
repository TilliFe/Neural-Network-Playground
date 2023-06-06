import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';

export default function PlotSVG() {
  const ref = useRef(null);

  const [data, setData] = useState([]);
  const predVals = useSelector((state) => state.computeGraph.predVals);
  const trueVals = useSelector((state) => state.computeGraph.trueVals);
  const xVals = useSelector((state) => state.computeGraph.xVals);

  const width = 230;
  const height = 230;
  const margin = {
    top: 20,
    right: 10,
    bottom: 20,
    left: 20,
  };

  useEffect(() => {
    if (xVals.length == 0) {
      return;
    }
    const newData = [];
    for (let i = 0; i < xVals.length; ++i) {
      let entry = { x: xVals[i], y: predVals[i], y_true: trueVals[i] };
      newData.push(entry);
    }
    newData.sort((a, b) => a.x - b.x);
    setData(newData);
  }, [xVals]);

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Remove any existing SVG elements
    svg.selectAll('*').remove();

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y_true))
      .range([height - margin.bottom, margin.top]);

    // Create line generator for true values
    const lineGenerator_true = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y_true));

    // Append path element
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(20,140,250)')
      .attr('stroke-width', 1)
      .attr('d', lineGenerator_true);

    // Create line generator
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    // Append path element
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(250,150,20)')
      .attr('stroke-width', 3)
      .attr('d', lineGenerator);

    // Append x-axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .attr('stroke-width', '0.5')
      .style('font', '7px sans-serif')
      .call(d3.axisBottom(xScale));

    // Append y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('stroke-width', '0.5')
      .style('font', '7px sans-serif')
      .call(d3.axisLeft(yScale));
  }, [data]);

  return <svg ref={ref} width={width} height={height} />;
}
