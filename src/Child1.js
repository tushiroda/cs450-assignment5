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
    var data = this.props.csv_data;
    var margin = { top: 50, bot: 50, right: 30, left: 30 };
    var w = 700 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bot;

    var container = d3
      .select(".graphContainer")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bot)
      .select(".g1")
      .attr("transform", `translate(${margin.left}, ${0})`);

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
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

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

    // open
    container
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x_scale(d.Date))
      .attr("cy", (d) => y_scale(d.Open))
      .attr("r", 3)
      .style("fill", "green")

    // close
    // container
    //   .selectAll("circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("cx", (d) => x_scale(d.Date))
    //   .attr("cy", (d) => y_scale(d.Close))
    //   .attr("r", 3)
    //   .style("fill", "red");
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

        <svg className="graphContainer">
          <g className="g1"></g>
        </svg>
      </div>
    );
  }
}

export default Child1;
