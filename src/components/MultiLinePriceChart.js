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
import { getMarketPriceAPI } from "../api/api";
import DateRangePicker from "react-bootstrap-daterangepicker";
import _ from "lodash";

const MultiLinePriceChart = (props) => {
  const [graphData, setGraphData] = useState(null);
  const [pricesData, setPricesData] = useState(null);
  const svgRef = useRef();

  const handleCallback = (start, end, label) => {
    const startDate = start.format("YYYY-MM-DD");
    const endDate = end.format("YYYY-MM-DD");

    const resultProductData = pricesData.filter((a) => {
      let date = new Date(a.day);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
    TransformedMarketPrice(resultProductData);
  };

  const DrawPricesLineChart = (Data) => {
    let margin = { top: 20, right: 80, bottom: 30, left: 50 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    let parseDate = timeFormat("%d %b");

    let x = scaleBand().rangeRound([0, width]);

    let y = scaleLinear().range([height, 0]);

    let color = scaleOrdinal(schemeCategory10);

    let xAxis = axisBottom(x);

    let yAxis = axisLeft(y);
    // .ticks(10);

    // xData gives an array of distinct 'Weeks' for which trends chart is going to be made.
    let xData = Data[0].WeeklyData.map(function (d) {
      return parseDate(new Date(d.day));
    });

    const myline = line()
      .x(function (d) {
        return x(parseDate(new Date(d.day))) + x.bandwidth() / 2;
      })
      .y(function (d) {
        return y(d.value);
      });

    if (svgRef.current.children[0]) {
      svgRef.current.removeChild(svgRef.current.children[0]);
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

    let valueMax = max(Data, function (r) {
      return max(r.WeeklyData, function (d) {
        return d.value;
      });
    });
    let valueMin = min(Data, function (r) {
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
      .style("text-anchor", "end");

    // Drawing Lines for each segments
    let segment = svg
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
        return {
          name: d.name,
          priceData: d.WeeklyData[d.WeeklyData.length - 1],
        };
      })
      .attr("transform", function (d) {
        let xpos = x(parseDate(new Date(d.priceData.day))) + x.bandwidth() / 2;
        return "translate(" + xpos + "," + y(d.priceData.value) + ")";
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
      let tempId = select(this).attr("Segid");
      let flgVisible = select("#" + tempId).attr("visible");

      let newOpacity = flgVisible == 1 ? 0 : 1;
      flgVisible = flgVisible == 1 ? 0 : 1;

      // Hide or show the elements
      select("#" + tempId)
        .style("opacity", newOpacity)
        .attr("visible", flgVisible);
    });
  };

  const TransformedMarketPrice = (marketPrice) => {
    const graphArray = [];
    const MEAN = {};
    const HIGH = {};
    const LOW = {};

    // Get MEAN values
    MEAN.name = "MEAN";
    MEAN.WeeklyData = _.map(marketPrice, (element) => {
      return {
        day: element.day,
        value: element.mean,
      };
    });
    graphArray.push(MEAN);

    // Get HIGH values
    HIGH.name = "HIGH";
    HIGH.WeeklyData = _.map(marketPrice, (element) => {
      return {
        day: element.day,
        value: element.high,
      };
    });
    graphArray.push(HIGH);

    // Get LOW values
    LOW.name = "LOW";
    LOW.WeeklyData = _.map(marketPrice, (element) => {
      return {
        day: element.day,
        value: element.low,
      };
    });
    graphArray.push(LOW);

    console.log("Final Array: ", graphArray);

    setGraphData(graphArray);
  };

  const getMarketPrice = async () => {
    const { origin, destination } = props;
    try {
      if (origin && destination) {
        const prices = await getMarketPriceAPI(origin, destination);
        if (prices) {
          console.log("Market Price List : ", prices);
          setPricesData(prices);
        } else {
          alert("No values are coming from the api");
        }
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  useEffect(() => {
    if (pricesData) {
      TransformedMarketPrice(pricesData);
    }
  }, [pricesData]);

  useEffect(() => {
    // Calling function
    if (graphData) {
      DrawPricesLineChart(graphData);
    }
  }, [graphData]);

  useEffect(() => {
    getMarketPrice();
  }, [props]);

  return (
    <>
      {graphData ? (
        <>
          <Row className="m-4">
            <Col>
              <form className="col-12">
                <div className="form-row">
                  <label className="col-md-4 col-form-label" for="name">
                    Select a date Range :
                  </label>
                  <DateRangePicker onCallback={handleCallback}>
                    <input className="form-control col-md-4" />
                  </DateRangePicker>
                </div>
              </form>
            </Col>
          </Row>

          <Row>
            <div id="divPriceTrends" ref={svgRef}></div>
          </Row>
        </>
      ) : (
        <Row>
          <div class="alert alert-primary mt-5 text-center" role="alert">
            There is no data to display the chart
          </div>
        </Row>
      )}
    </>
  );
};

export default MultiLinePriceChart;
