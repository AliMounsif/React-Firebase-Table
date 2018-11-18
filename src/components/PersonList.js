
import "./PersonList.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../actions";
import * as M from "materialize-css";
import { Table, Input, Button, Icon } from 'antd';

class PersonList extends Component {
  constructor(props) {
    super(props);
    this.handleInputNameChange = this.handleInputNameChange.bind(this);
    this.handleInputDateChange = this.handleInputDateChange.bind(this);
    this.handleInputEmailChange = this.handleInputEmailChange.bind(this);
    this.handleInputChildrenChange = this.handleInputChildrenChange.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      addFormVisible: false,
      nameValue: "",
      birthDateValue: "",
      emailValue: "",
      numberOfChildrenValue: "0",
      searchName: '',
      searchEmail: '',
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

  // Handling filters in column head (name, email)
  handleRemoveClick(removePersonId) {
    const { removePerson } = this.props;
    removePerson(removePersonId);
  }

  handleSearchName = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchName: selectedKeys[0] });
  }

  handleResetName = clearFilters => () => {
    clearFilters();
    this.setState({ searchName: '' });
  }

  handleSearchEmail = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchEmail: selectedKeys[0] });
  }

  handleResetEmail = clearFilters => () => {
    clearFilters();
    this.setState({ searchEmail: '' });
  }

  // grid columns, setting custom renders for rows and/or headers
  // I am setting also filtering or sorting as required in test documentation
  getColumns() {
    return [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => { return a.name.localeCompare(b.name) },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={this.handleSearchName(selectedKeys, confirm)}
          />
          <Button type="primary" onClick={this.handleSearchName(selectedKeys, confirm)}>Search</Button>
          <Button onClick={this.handleResetName(clearFilters)}>Reset</Button>
        </div>
      ),
      filterIcon: filtered => <Icon type="filter" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => {
            this.searchInput.focus();
          });
        }
      },
      render: (text) => {
        const { searchName } = this.state;
        return searchName ? (
          <span>
            {text.split(new RegExp(`(?<=${searchName})|(?=${searchName})`, 'i')).map((fragment, i) => (
              fragment.toLowerCase() === searchName.toLowerCase()
                ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
            ))}
          </span>
        ) : text;
      },
    }, 
    {
      title: 'Birth date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      sorter: (a, b) => { return a.birthDate.localeCompare(b.birthDate) },
    }, 
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => { return a.email.localeCompare(b.email) },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="Search email"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={this.handleSearchEmail(selectedKeys, confirm)}
          />
          <Button type="primary" onClick={this.handleSearchEmail(selectedKeys, confirm)}>Search</Button>
          <Button onClick={this.handleResetEmail(clearFilters)}>Reset</Button>
        </div>
      ),
      filterIcon: filtered => <Icon type="filter" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => {
            this.searchInput.focus();
          });
        }
      },
      render: (text) => {
        const { searchEmail } = this.state;
        return searchEmail ? (
          <span>
            {text.split(new RegExp(`(?<=${searchEmail})|(?=${searchEmail})`, 'i')).map((fragment, i) => (
              fragment.toLowerCase() === searchEmail.toLowerCase()
                ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
            ))}
          </span>
        ) : text;
      },
    }, 
    {
      title: 'Childrens',
      key: 'numberOfChildren',
      dataIndex: 'numberOfChildren',
      sorter: (a, b) => { return a.numberOfChildren.localeCompare(b.numberOfChildren) },
    }, 
    {
      title: '',
      key: '',
      render: (text, record) => (
        <span
        onClick={() => this.handleRemoveClick(record.key)}
        className="remove-person-item waves-effect waves-light teal lighten-5 teal-text text-darken-4 btn"
        >
          <i className="small material-icons">delete</i>
        </span>
      ),
    }];
  }


  // renders the list if not empty, otherwise a message of no data
  renderTable() {
    const { data } = this.props;

    var arrayData = [];
    _.each(data, (item, index) => {
      item.key = index.toString();
      arrayData.push(item)
    })

    return (
      <div className="col s10 offset-s1 person-list-item">
      {!_.isEmpty(arrayData) ? (
        <Table columns={this.getColumns()} dataSource={arrayData} pagination={{ defaultPageSize: 15 }} />
      ): ''}
        {_.isEmpty(arrayData) ? (
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