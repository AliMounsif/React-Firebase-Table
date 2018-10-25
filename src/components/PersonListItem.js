import React, { Component } from "react";
import { connect } from "react-redux";
import { removePerson } from "../actions";

class PersonListItem extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
  }

  handleRemoveClick(removePersonId) {
    const { removePerson } = this.props;
    removePerson(removePersonId);
  }

  render() {
    const { personId, person } = this.props;
    return (
      <tr key={personId}>
        <td>{person.name}</td>
        <td>{person.birthDate}</td>
        <td>{person.email}</td>
        <td>{person.numberOfChildren}</td>
        <td>
          <span
            onClick={() => this.handleRemoveClick(personId)}
            className="remove-person-item waves-effect waves-light teal lighten-5 teal-text text-darken-4 btn"
          >
            <i className="small material-icons">delete</i>
          </span>
        </td>
      </tr>
    );
  }
}
// {/* <div key="personName" className="col s10 offset-s1 person-list-item teal"></div> */}
export default connect(null, { removePerson })(PersonListItem);