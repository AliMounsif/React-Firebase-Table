
import "./PersonList.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../actions";
import PersonListItem from "./PersonListItem";
import * as M from "materialize-css";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter, 
  TablePagination, 
} from '@material-ui/core'

class PersonList extends Component {
  constructor(props) {
    super(props);
    this.handleInputNameChange = this.handleInputNameChange.bind(this);
    this.handleInputDateChange = this.handleInputDateChange.bind(this);
    this.handleInputEmailChange = this.handleInputEmailChange.bind(this);
    this.handleInputChildrenChange = this.handleInputChildrenChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      addFormVisible: false,
      nameValue: "",
      birthDateValue: "",
      emailValue: "",
      numberOfChildrenValue: "0",
      page: 0,
      rowsPerPage: 5,
    };
  }
  
  componentDidUpdate() {
    // init materialize datepicker
    var elems = document.querySelectorAll('.datepicker');
    var options = {
      onSelect: this.handleInputDateChange,
      format: 'dd/mm/yyyy',
      yearRange: 130,
    };
    M.Datepicker.init(elems, options);
  }

  // Handling fields changes 
  handleInputNameChange(e) {
    this.setState({ nameValue: e.target.value });
  }

  handleInputDateChange(value) {
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    this.setState({ birthDateValue: new Date(value).toLocaleDateString("en-GB", options) });
  }

  handleInputEmailChange(e) {
    this.setState({ emailValue: e.target.value });
  }

  handleInputChildrenChange(e) {
    this.setState({ numberOfChildrenValue: e.target.value });
  }

  // submit Form only if fields are valorized
  handleFormSubmit(e) {
    const { nameValue, birthDateValue, emailValue, numberOfChildrenValue } = this.state;
    const { addPerson } = this.props;
    e.preventDefault();
    addPerson({ name: nameValue, birthDate: birthDateValue, email: emailValue, numberOfChildren: numberOfChildrenValue });
    this.setState({ nameValue: "", birthDateValue: "", emailValue: "", numberOfChildrenValue: "0" });
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  // rendering the form on click of add button, in absolute position bottom the window 
  renderAddForm() {
    const { addFormVisible, nameValue, birthDateValue, emailValue, numberOfChildrenValue } = this.state;
    let submitBtnClass = _.isEmpty(nameValue) || _.isEmpty(birthDateValue) || _.isEmpty(emailValue) 
      ? "btn disabled waves-effect waves-light" : `btn waves-effect waves-light`;
    if (addFormVisible) {
      return (
        <div id="person-add-form" className="col s10 offset-s1">
          <form onSubmit={this.handleFormSubmit} onReset={() => {
            this.setState({ nameValue: "", birthDateValue: "", emailValue: "", numberOfChildrenValue: "0" });
          }}>
            <div className="row">
              <div className="input-field col s5">
                <i className="material-icons prefix">person</i>
                <input
                  value={nameValue}
                  onChange={this.handleInputNameChange}
                  id="personName"
                  type="text"
                />
                <label htmlFor="personName">Name</label>
              </div>   
              <div className="input-field col s4">
                <i className="material-icons prefix">date_range</i>
                <input
                  value={birthDateValue}
                  id="birthDate"
                  type="text"
                  className="datepicker"
                />
                <label htmlFor="birthDate">Birth date</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s5">
                <i className="material-icons prefix">email</i>
                <input
                  value={emailValue}
                  onChange={this.handleInputEmailChange}
                  id="email"
                  type="email"
                  className="validate" 
                />
                <label htmlFor="email">Email</label>
                <span className="helper-text" data-error="wrong" data-success="right"/>
              </div>
              <div className="input-field col s4">
                <i className="material-icons prefix">child_care</i>
                <input
                  value={numberOfChildrenValue}
                  onChange={this.handleInputChildrenChange}
                  min="0"
                  max="20"
                  id="numberOfChildren"
                  type="number"
                />
                <label htmlFor="numberOfChildren">N° of children</label>
              </div>
            </div>
            <div className="row">
              <div className="col s4 offset-s8">
                <button className="btn waves-effect waves-light" type="reset" name="action">Reset</button>
                {' '}
                <button className={submitBtnClass} type="submit" name="action">Submit</button>
              </div>
            </div>
          </form>
        </div>
      );
    }
  }

  // renders the list if not empty, otherwise a message of no data
  renderTable() {
    const { data } = this.props;
    const { rowsPerPage, page } = this.state;
    const people = _.map(data, (value, key) => {
      return <PersonListItem key={key} personId={key} person={value} />;
    });

    /**
     * try this https://github.com/carlosrocha/react-data-components
     * and remove unnecessary dependencies
     */

    return (
      <div className="col s10 offset-s1 person-list-item">
        <Table>
          <TableHead id="peopleList">
            <TableRow>
              <TableCell className="with-input">
                <div className="input-field">                  
                  <input type="text" id="filterName" onChange={(e) => {
                      this.props.filterPeople(e.target.value, 'name');;
                    }} 
                  />
                  <i className="small material-icons prefix">filter_list</i>
                </div>
                <span>Name</span>
              </TableCell>
              <TableCell>
                <span className="with-top">Birth date</span>
              </TableCell>
              <TableCell className="with-input">
                <div className="input-field">                  
                  <input type="text" id="filterEmail" onChange={(e) => {
                      this.props.filterPeople(e.target.value, 'email');;
                    }} 
                  />
                  <i className="small material-icons prefix">filter_list</i>
                </div>
                <span>Email</span>
              </TableCell>
              <TableCell numeric={true}>
                <span className="with-top">N° of children</span>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {people}
          </TableBody>
          <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={people.length}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={15}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
          </TableFooter>
        </Table>
        {_.isEmpty(people) ? (
            <div className="col s10 offset-s1 center-align">
            {/* image stored on firebase */}
              <img
                alt="Nothing was found"
                id="nothing-was-found"
                src="https://firebasestorage.googleapis.com/v0/b/tabular-data-test.appspot.com/o/nothing.png?alt=media&token=00e3b077-b799-4745-a37b-dae244c16150"
              />
              <h4>No data available</h4>
            </div>
          ) 
          : 
            ''
        }
      </div>
    );
  }

  // fetching table data from firebase and dispatch changes
  componentDidMount() {
    this.props.fetchPeople();
  }

  render() {
    const { addFormVisible } = this.state;
    const { data } = this.props;
    return (
      <div className="person-list-container">
        <div className="row">
          {this.renderAddForm()}
          {this.renderTable()}
        </div>
        <div className="fixed-action-btn">
          {_.isEmpty(data) ? <label>Click the button to START!</label> : ''}        
          <button
            onClick={() => this.setState({ addFormVisible: !addFormVisible })}
            className="btn-floating btn-large"
          >
            {addFormVisible ? (
              <i className="large material-icons">close</i>
            ) : (
              <i className="large material-icons">add</i>
            )}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ data }) => {
  return {
    data
  };
};

export default connect(mapStateToProps, actions)(PersonList);