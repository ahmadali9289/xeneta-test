import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  select,
  selectAll,
  line,
  timeFormat,
  scaleLinear,
  max,
  min,
  scaleOrdinal,
  scaleBand,
  schemeCategory10,
  axisBottom,
  axisLeft,
} from "d3";
import axios from 'axios';
import DateRangePicker from "react-bootstrap-daterangepicker";
import _ from 'lodash';

const url =
    "https://685rp9jkj1.execute-api.eu-west-1.amazonaws.com/prod/rates";
  const API_KEY = "zSTAhrBZFU19GlvU9DzFUarK0gfW7Tx85rsyaVxV";

  

const MultiLinePriceChart = (props) => {
    const [graphData, setGraphData] = useState(null);
    const [pricesData, setPricesData] = useState(null);
    const svgRef = useRef();

  const handleCallback = (start, end, label) => {
    const startDate = start.format("YYYY-MM-DD");
    const endDate = end.format("YYYY-MM-DD");
    console.log(startDate, endDate);

    const resultProductData = pricesData.filter(a => {
        let date = new Date(a.day);
        return (date >= new Date(startDate) && date <= new Date(endDate));
      });
      console.log(resultProductData);
      TransformedMarketPrice(resultProductData)
  };

  function fnDrawMultiLineChart(Data, DivID, RevenueName) {
    var margin = { top: 20, right: 80, bottom: 30, left: 50 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var parseDate = timeFormat("%d %b");

    var x = scaleBand().rangeRound([0, width]);

    var y = scaleLinear().range([height, 0]);

    var color = scaleOrdinal(schemeCategory10);

    var xAxis = axisBottom(x);

    var yAxis = axisLeft(y);
    // .ticks(10);

    // xData gives an array of distinct 'Weeks' for which trends chart is going to be made.
    var xData = Data[0].WeeklyData.map(function (d) {
      return parseDate(new Date(d.week));
    });

    const myline = line()
      .x(function (d) {
        return x(parseDate(new Date(d.week))) + x.bandwidth() / 2;
      })
      .y(function (d) {
        return y(d.value);
      });

      if (svgRef.current.children[0]) {
        svgRef.current.removeChild(svgRef.current.children[0])
      }
    const svg = select(svgRef.current)
      .insert("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(
      Data.map(function (d) {
        return d.name;
      })
    );

    x.domain(xData);

    var valueMax = max(Data, function (r) {
      return max(r.WeeklyData, function (d) {
        return d.value;
      });
    });
    var valueMin = min(Data, function (r) {
      return min(r.WeeklyData, function (d) {
        return d.value;
      });
    });
    y.domain([valueMin, valueMax]);

    //Drawing X Axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Drawing Y Axis
    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(RevenueName);

    // Drawing Lines for each segments
    var segment = svg
      .selectAll(".segment")
      .data(Data)
      .enter()
      .append("g")
      .attr("class", "segment");

    segment
      .append("path")
      .attr("class", "line")
      .attr("id", function (d) {
        return d.name;
      })
      .attr("visible", 1)
      .attr("d", function (d) {
        return myline(d.WeeklyData);
      })
      .attr("fill", "none")
      // .attr("stroke", "blue")
      .style("stroke", function (d) {
        return color(d.name);
      });
    
    segment
      .append("text")
      .datum(function (d) {
        return { name: d.name, RevData: d.WeeklyData[d.WeeklyData.length - 1] };
      })
      .attr("transform", function (d) {
        var xpos = x(parseDate(new Date(d.RevData.week))) + x.bandwidth() / 2;
        return "translate(" + xpos + "," + y(d.RevData.value) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em")
      .attr("class", "segmentText")
      .attr("Segid", function (d) {
        return d.name;
      })
      .text(function (d) {
        return d.name;
      });

    selectAll(".segmentText").on("click", function (d) {
      var tempId = select(this).attr("Segid");
      var flgVisible = select("#" + tempId).attr("visible");

      var newOpacity = flgVisible == 1 ? 0 : 1;
      flgVisible = flgVisible == 1 ? 0 : 1;

      // Hide or show the elements
      select("#" + tempId)
        .style("opacity", newOpacity)
        .attr("visible", flgVisible);
    });
    
  }

  const TransformedMarketPrice = (marketPrice) => {
    const graphArray = [];
    const MEAN = {};
    const HIGH = {};
    const LOW = {};

    // Get MEAN values
    MEAN.name = "MEAN";
    MEAN.WeeklyData = _.map(marketPrice, (element) => {
        return {
            week: element.day,
            value: element.mean
        }
    });
    graphArray.push(MEAN);
    
    // Get HIGH values
    HIGH.name = "HIGH";
    HIGH.WeeklyData = _.map(marketPrice, (element) => {
        return {
            week: element.day,
            value: element.high
        }
    });
    graphArray.push(HIGH);
    
    // Get LOW values
    LOW.name = "LOW";
    LOW.WeeklyData = _.map(marketPrice, (element) => {
        return {
            week: element.day,
            value: element.low
        }
    });
    graphArray.push(LOW);

    console.log('Final Array: ', graphArray);

    setGraphData(graphArray);
  }

  const getMarketPrice = async () => {
    const prices = await axios.get(url, {
      headers: {
        "Content-type": "application/json",
        "x-api-key": API_KEY,
      },
        params: {
          origin: props.origin,
          destination: props.destination
        }
    });
    console.log("Market Price List : ", prices.data);
    setPricesData(prices.data)
  };

  useEffect(() => {
      if (pricesData) {
          TransformedMarketPrice(pricesData);
      }
  }, [pricesData]);

  useEffect(() => {
    getMarketPrice();
  }, []);


  useEffect(() => {
    // Calling function
    if (graphData){
        fnDrawMultiLineChart(graphData, "divChartTrends", "Revenue Data");
    }
  }, [graphData]);


  return (
    <>
      {graphData && 
      <>
      <Row className="m-4">
        <Col>
          <form className="col-12">
            <div className="form-row">
              <label className="col-md-4 col-form-label" for="name">
                Select a date Range :
              </label>
              <DateRangePicker
                onCallback={handleCallback}
              >
                <input className="form-control col-md-4" />
              </DateRangePicker>
            </div>
          </form>
        </Col>
      </Row>
      
      <Row>
        <div id="divChartTrends" ref={svgRef}></div>
      </Row>
      </>}
    </>
  );
};

export default MultiLinePriceChart;
