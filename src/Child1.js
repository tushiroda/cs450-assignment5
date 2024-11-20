import React, { Component, setState } from "react";
import "./Child1.css";
import * as d3 from "d3";

class Child1 extends Component {
  state = {
    company: "Apple", // Default Company
    selectedMonth: "November", //Default Month
  };

  componentDidMount() {
    console.log(this.props.csv_data); // Use this data as default. When the user will upload data this props will provide you the updated data
  }

  componentDidUpdate() {
    console.log(this.props.csv_data);
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
        </svg>
      </div>
    );
  }
}

export default Child1;
