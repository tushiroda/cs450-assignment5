import React, { Component } from "react";
import "./Child1.css";
import * as d3 from "d3";

class Child1 extends Component {
  state = {
    company: "Apple", // Default Company
    selectedMonth: "November", //Default Month
  };

  componentDidMount() {
    console.log(this.props.csv_data); // Use this data as default. When the user will upload data this props will provide you the updated data
    this.setState({ ...this.state });
  }

  componentDidUpdate() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]; // Use this data to create dropdown
    var data = this.props.csv_data.filter(
      (d) =>
        d.Company === this.state.company &&
        months[d.Date.getMonth()] === this.state.selectedMonth
    );
    var margin = { top: 50, bot: 50, right: 30, left: 30 };
    var w = 500 - margin.left - margin.right;
    var h = 400 - margin.top - margin.bot;

    var container = d3
      .select(".graphContainer")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bot)
      .select(".g1")
      .attr("transform", `translate(${margin.left}, 0)`);

    // x-axis
    var x_data = data.map((item) => item.Date);
    const x_scale = d3
      .scaleTime()
      .domain([d3.min(x_data), d3.max(x_data)])
      .range([margin.left, w]);
    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h + 5})`)
      .call(d3.axisBottom(x_scale))
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", "5px")
      .attr("dy", "5px")
      .attr("transform", "rotate(45)");

    // y-axis
    var y_open = data.map((item) => item.Open);
    var y_close = data.map((item) => item.Close);
    const y_scale = d3
      .scaleLinear()
      .domain([d3.max(y_open.concat(y_close)), d3.min(y_open.concat(y_close))])
      .range([margin.top, h]);
    container
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left - 5}, 0)`)
      .call(d3.axisLeft(y_scale));

    // open points
    container
      .selectAll(".open")
      .data(data)
      .join("circle")
      .attr("class", "open")
      .attr("cx", (d) => x_scale(d.Date))
      .attr("cy", (d) => y_scale(d.Open))
      .attr("r", 4)
      .style("fill", "#b2df8a");

    // open line
    var openLine = d3
      .line()
      .x((d) => x_scale(d.Date))
      .y((d) => y_scale(d.Open))
      .curve(d3.curveCardinal);
    container
      .selectAll(".openPath")
      .data([0])
      .join("path")
      .attr("d", openLine(data))
      .attr("class", "openPath")
      .attr("stroke", "#b2df8a")
      .attr("fill", "none");

    // close
    container
      .selectAll(".close")
      .data(data)
      .join("circle")
      .attr("class", "close")
      .attr("cx", (d) => x_scale(d.Date))
      .attr("cy", (d) => y_scale(d.Close))
      .attr("r", 4)
      .style("fill", "#e41a1c");

    // close points
    var closeLine = d3
      .line()
      .x((d) => x_scale(d.Date))
      .y((d) => y_scale(d.Close))
      .curve(d3.curveCardinal);
    container
      .selectAll(".closepath")
      .data([0])
      .join("path")
      .attr("class", "closepath")
      .attr("d", closeLine(data))
      .attr("stroke", "#e41a1c")
      .attr("fill", "none");

    // tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    var timeFormat = d3.timeFormat("%m/%d/%Y");

    d3.selectAll("circle")
      // .on("mouseover", function () {
      //   return tooltip.style("visibility", "visible");
      // })
      .on("mousemove", function (event, d) {
        return tooltip
          .style("top", event.pageY + 5 + "px")
          .style("left", event.pageX + 5 + "px")
          .style("visibility", "visible")
          .text(
            `Date: ${timeFormat(d.Date)}\nOpen: ${d.Open}\nClose: ${
              d.Close
            }\nDifference: ${(d.Close - d.Open).toFixed(2)}`
          );
      })
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });
  }

  radioChange = (event) => {
    this.setState({ company: event.target.value });
  };

  dropdownChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  render() {
    const options = ["Apple", "Microsoft", "Amazon", "Google", "Meta"]; // Use this data to create radio button
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]; // Use this data to create dropdown

    return (
      <div className="child1">
        <form className="radio">
          Company:
          {options.map((company) => {
            return (
              <label>
                <input
                  type="radio"
                  value={company}
                  checked={this.state.company === company}
                  onChange={this.radioChange}
                />
                {company}
              </label>
            );
          })}
        </form>

        <form className="dropdown">
          Month:
          <select
            value={this.state.selectedMonth}
            onChange={this.dropdownChange}
          >
            {months.map((m) => {
              return <option value={m}>{m}</option>;
            })}
          </select>
        </form>

        <div className="graph">
          <svg className="graphContainer">
            <g className="g1"></g>
          </svg>

          <div className="legend">
            <div className="legendOpen">
              <div
                className="box"
                style={{ backgroundColor: "#b2df8a", margin: 3 }}
              ></div>
              Open
            </div>
            <div className="legendClose">
              <div
                className="box"
                style={{ backgroundColor: "#e41a1c", margin: 3 }}
              ></div>
              Close
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Child1;
