import { peopleRef } from "../config/firebase";
import { FETCH_PEOPLE, FILTER_PEOPLE } from "./types";
import * as _ from 'underscore';

// add a person to db
export const addPerson = newPerson => async => {
  peopleRef.push().set(newPerson);
};

// delete a person from db
export const removePerson = id => async => {
  peopleRef.child(id).remove();
};

// filter people by name 
export const filterPeople = (string, field) => async dispatch => {
  peopleRef.once("value", snapshot => {
    dispatch({
      type: FILTER_PEOPLE,
      payload: _.filter(snapshot.val(), item => {
        // strings to lower case
        return (item[field].toLowerCase()).includes(string.toLowerCase())
      })
    });
  });
};

export const fetchPeople = () => async dispatch => {
  // on() continues to listen for changes to the data on firebase
  peopleRef.on("value", snapshot => {
    dispatch({
      type: FETCH_PEOPLE,
      payload: snapshot.val()
    });
  });
};