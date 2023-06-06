import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import * as d3Voronoi from 'd3-voronoi';

// get an array of size
const oneHot = (x, y) => {
  if (x > y) {
    return 1;
  } else {
    return 0;
  }
};

const ClassifyPlot = () => {
  const ref = useRef();

  const [data, setData] = useState([]);
  const [dataPred, setDataPred] = useState([]);

  const predVals = useSelector((state) => state.computeGraph.predVals);
  const trueVals = useSelector((state) => state.computeGraph.trueVals);
  const xVals = useSelector((state) => state.computeGraph.xVals);

  // console.log(predVals);

  const width = 220;
  const height = 220;

  useEffect(() => {
    if (xVals.length == 0) {
      return;
    }
    const newData = [];
    const newDataPred = [];
    for (let i = 0; i < predVals.length / 2; i++) {
      let entryTrue = {
        x: Math.floor(xVals[2 * i] * width),
        y: Math.floor(xVals[2 * i + 1] * height),
        z: oneHot(trueVals[2 * i], trueVals[2 * i + 1]),
      };
      let entryPred = {
        x: Math.floor(xVals[2 * i] * width),
        y: Math.floor(xVals[2 * i + 1] * height),
        z: oneHot(predVals[2 * i], predVals[2 * i + 1]),
      };
      if (entryTrue && entryPred) {
        newData.push(entryTrue);
        newDataPred.push(entryPred);
      }
    }
    setData(newData);
    setDataPred(newDataPred);
  }, [xVals]);

  useEffect(() => {
    if (data.length == 0 || dataPred.length == 0) {
      return;
    }
    const svg = d3.select(ref.current);

    const voronoi = d3Voronoi
      .voronoi()
      .x((d) => d.x)
      .y((d) => d.y)
      .extent([
        [0, 0],
        [width, height],
      ]);

    svg.selectAll('*').remove();

    const polygons = voronoi.polygons(data);

    svg
      .selectAll('path')
      .data(polygons)
      .enter()
      .append('path')
      .attr('d', (d) => (d ? `M${d.join('L')}Z` : ''))
      .style('fill', (d) =>
        d && d.data.z == 1 ? 'rgba(255,100,0,0.2)' : 'rgba(0,60,255,0.3)'
      );

    svg
      .selectAll('circle')
      .data(dataPred)
      .enter()
      .append('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 3)
      .style('fill', (d) =>
        d.z === 1 ? 'rgba(255,100,0,1.0)' : 'rgba(0,60,255,1.0)'
      );
  }, [dataPred]);

  return <svg ref={ref} width={width} height={height} />;
};

export default ClassifyPlot;
