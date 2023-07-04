import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';

export default function LossPLot() {
  const ref = useRef(null);

  const width = 230;
  const height = 230;
  const margin = {
    top: 10,
    right: 20,
    bottom: 20,
    left: 30,
  };
  const avgError = useSelector((state) => state.computeGraph.avgError);
  const edgesActive = useSelector((state) => state.computeGraph.edgesActive);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!edgesActive) {
      setData([]); // set the array to an empty array
    }
  }, [edgesActive]);

  useEffect(() => {
    let newError;
    if (data.length > 0) {
      const lastYValues = data.slice(-5).map((d) => d.y);
      const avgY = d3.mean([...lastYValues, Math.min(avgError, 1.0)]);
      newError = { x: data.length, y: avgY };
    } else {
      newError = { x: data.length, y: Math.min(avgError, 1.0) };
    }
    setData((data) => [...data, newError]); // spread the old array and add the new object
  }, [avgError]);

  const framerate = 20; // keep in mind that this value has to be the same as in the GPUTraining.js component !

  useEffect(() => {
    if (data.length < 5) {
      return;
    }
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
      .domain(d3.extent(data, (d) => d.y))
      .range([height - margin.bottom, margin.top]);

    // Create line generator for true values
    const lineGenerator_true = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveBasis);

    // Append path element
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(20,20,20)')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator_true);

    // Append x-axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .attr('stroke-width', '0.5')
      .style('font', '7px sans-serif')
      .call(
        d3.axisBottom(xScale).tickFormat((d) => {
          // Format the tick value based on batchSize
          return d * framerate;
        })
      );

    // Append y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('stroke-width', '0.5')
      .style('font', '7px sans-serif')
      .call(
        d3.axisLeft(yScale).tickFormat((d) => {
          // Use custom tick format function
          if (d === 1) {
            return '>1';
          } else {
            return d;
          }
        })
      );
  }, [data]);

  return (
    <>
      <svg ref={ref} width={width} height={height} />
      <div style={{ display: 'flex', marginLeft: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: 24,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              backgroundColor: 'rgb(0,0,0)',
              margin: 4,
              marginLeft: 0,
            }}
          />
          <span style={{ fontSize: '10px' }}>Average Loss per Iteration</span>
        </div>
      </div>
    </>
  );
}
