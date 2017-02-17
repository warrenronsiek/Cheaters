/**
 * Created by warren on 2/14/17.
 */
import * as d3 from 'd3';
import {geoKavrayskiy7} from 'd3-geo-projection';
import D3wrap from 'react-d3-wrap';
import React, {Component} from 'react';
import * as topojson from 'topojson';
const topoData = require('../static/topo_world.json');
require('../css/cheating.css');
const kmeans = require('../static/kmeansCollected.json');
import CheatingButton from './infoButtons/CheatingButton';

const D3CheaterWrap = D3wrap({
  initialize(svg, data, options) {
    const width = svg.width.animVal.value, height = svg.height.animVal.value;

    const projection = geoKavrayskiy7()
      .scale(250)
      .translate([width / 2, height / 2 + 40]);

    const path = d3.geoPath().projection(projection);

    const d3svg = d3.select(svg);

    const g = d3svg.append("g");

    const graticule = d3.geoGraticule();

    const drawWorld = function (world) {
      g.selectAll('path')
        .data(topojson.feature(world, world.objects.world).features)
        .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", "#e4e4e4");
    }(data);
  },

  update(svg, data, options) {
    const width = svg.width.animVal.value, height = svg.height.animVal.value;

    const d3svg = d3.select(svg);

    const g = d3svg.select("g");

    const projection = geoKavrayskiy7()
      .scale(250)
      .translate([width / 2, height / 2 + 40]);

    let radHigh = 50;
    let radLow = 1;
    const radius = d3.scalePow(1 / 4)
      .range([radLow, radHigh]);

    const color = d3.scaleOrdinal()
      .range(["#86d8f7", "#ff9eb5"]);

    const arc = d3.arc()
      .padRadius(50);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.pop);

    const drawDonuts = function (donutData) {
      const formatted = donutData.map(item => {
        return {
          total: item.male + item.female,
          longitude: item.longitude,
          latitude: item.latitude,
          pops: [{gender: "male", pop: +item.male}, {gender: "female", pop: +item.female}]
        }
      });

      radius.domain([0, d3.max(formatted, d => d.total)]);
      color.domain(["male", "female"]);

      const piesvg = g.selectAll(".pie")
        .data(formatted.sort((a, b) => a.total - b.total))
        .enter()
        .append("svg")
        .attr("class", "pie")
        .each(multiple)
        .select("g");

      function multiple(d) {
        let r = radius(d.total);
        let long = projection([d.longitude, d.latitude])[0], lat = projection([d.longitude, d.latitude])[1];

        let rendersvg = d3.select(this)
          .attr("width", width * 3)
          .attr("height", height * 3)
          .append("g")
          .attr("transform", "translate(" + long + "," + lat + ")");

        rendersvg.selectAll(".arc")
          .data(d => pie(d.pops))
          .enter()
          .append("path")
          .attr("class", "arc")
          .attr("d", arc.outerRadius(r).innerRadius(0))
          .style("fill", d => color(d.data.gender))
          .attr("opacity", ".7")
      }
    };

    drawDonuts(options.cheatingData);

    d3svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .style("stroke-width", "1")
      .style("stroke", "grey")
      .call(d3.zoom()
        .scaleExtent([1 / 2, 10])
        .on("zoom", zoomed));

    function zoomed() {
      radius.range([radLow  * (d3.event.transform.k), radHigh / (d3.event.transform.k)]);
      g.selectAll('svg.pie').remove();
      drawDonuts(options.cheatingData);
      g.attr("transform", d3.event.transform);
    }

  }
});

export default class Cheaters extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <D3CheaterWrap data={topoData}
                       width={document.documentElement.clientWidth - 250}
                       height={document.documentElement.clientHeight - 150}
                       options={{cheatingData: kmeans}}/>
        <CheatingButton/>
      </div>
    )
  }
}