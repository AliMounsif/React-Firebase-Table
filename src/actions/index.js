import { peopleRef } from "../config/firebase";
import { FETCH_PEOPLE } from "./types";

// add a person to db
export const addPerson = newPerson => async dispatch => {
  peopleRef.push().set(newPerson);
};

// delete a person from db
export const removePerson = id => async dispatch => {
  peopleRef.child(id).remove();
};

// filter people by name 
// export const filterPeopleByName = string => async dispatch => {
//   peopleRef.chi;
// };

export const fetchPeople = () => async dispatch => {
  // on() continues to listen for changes to the data on firebase
  peopleRef.on("value", snapshot => {
    dispatch({
      type: FETCH_PEOPLE,
      payload: snapshot.val()
    });
  });
};