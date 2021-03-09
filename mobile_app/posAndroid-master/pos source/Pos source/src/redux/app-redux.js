import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as firebaseApp from "firebase";
import axios from "axios";
import * as urlsName from "../store/actions/urlsNames";
import {fetchUserFailed, fetchUserSuccess} from "../store/actions/user";


// tutorial from https://itnext.io/simple-firebase-redux-integration-in-react-native-32f848deff3a


const ApiBaseUrl = 'http://mayalawyers.herokuapp.com/';
//
// Initial State...
//

const initialState = {
    userData : {},
    appData : {},
    user : {
        _id : '',
        email : '',
        name : '',
        firebaseObj : {},
        auth : false
    },
    DB : {},
    courts : [],
    personData: {
        data : {}
    },
}


/*********** Reducer ***********/

const reducer = (state = initialState, action) => {
    switch(action.type) {

        case "setUserData":
            console.log("aaaaaaa 22", JSON.stringify(action.value));
            getUserDataFromDB(action.value.document.uid);
            return  { ...state,
                user: {
                    _id : action.value.document.uid,
                    email : action.value.document.email,
                    name : action.value.document.name,
                    firebaseObj : action.value.document.firebaseObject,
                    auth : true
                }
            };

        case "getDatabaseData":

            console.log("ACTIONnnnnnn 2", JSON.stringify(action.value));
            state.userData = {};
            state.appData = {};
            return { ...state,
                userData : action.value[0],
                appData : action.value[1]
            };

        case "loadUserData":

            console.log("loadUserData reducer", JSON.stringify(action.value));
            return { ...state,
                userData : action.value[0],
                appData : action.value[1]
            };

        case "fetchUserSuccess":
            return { ...state,
                user: action.value
            };

        case "useUserInDB":

            saveUserInDB(action.value);
            return;

        case "fetchUserDBSuccess":
            return { ...state,
                user: action.value
            };

        case "getCourts":
            return { ...state,
                courts: action.value
            };

        case "setPersonData":
            return { ...state, personData: action.value };

        default:
            return state;
    }
};

//
// Store...
//

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export { store };

//
// Action Creators
//

const setPersonData = (personData) => {
    return {
        type: "setPersonData",
        value: personData
    };
};

const watchPersonData = () => {
    return function(dispatch) {
        firebaseApp.database().ref('users/userId1').on("value", function(snapshot) {

            let personData = snapshot.val();
            console.log("personData", personData);
            console.log("personData", JSON.stringify(personData));

            var actionSetPersonData = setPersonData(personData);
            dispatch(actionSetPersonData);

        }, function(error) { console.log(error); });
        //dispatch({data : "sample 11"});
    }
};


const getUserDataFromDB = (uid) => {
    console.log("in watch DB Global state");

   // function sample(dispatch) {
        console.log("test 11");
        firebaseApp.database().ref('users/' + uid).on("value", function(snapshot) {

            let data = snapshot.val();
            console.log("User Data from DB ", JSON.stringify(data));
            let userData = data;

            firebaseApp.database().ref('appData').on("value", function(snapshot) {

                let data = snapshot.val();
                console.log("Other Data from DB", JSON.stringify(data));
                let appData = data;

                let actionGetDatabaseData = {
                    type: "getDatabaseData",
                    value: [userData,appData]
                };

                return store.dispatch(actionGetDatabaseData);

            }, function(error) { console.log(error); });
        }.bind(this), function(error) { console.log(error); });
   // }
    console.log("test 22");
};


// Action Creator
const loadUserData = () => {
    console.log("load user data start 1");
    /*return function(dispatch) {
        console.log("22");

    };*/

    firebaseApp.database().ref('users/5d1779a7ad63cd087e1a1520').on("value", function(snapshot) {

        let data = snapshot.val();
        console.log("User Data from DB ", JSON.stringify(data));
        let userData = data;

        firebaseApp.database().ref('appData').on("value", function(snapshot) {

            let data = snapshot.val();
            console.log("Other Data from DB", JSON.stringify(data));
            let appData = data;

            let actionLoadUserData = {
                type: "loadUserData",
                value: [userData,appData]
            };

            store.dispatch(actionLoadUserData);

        }, function(error) { console.log(error); });
    }, function(error) { console.log(error); });

};

const saveUserInDB = (userData) => {
    console.log("user OBJECTttttt", userData);
    return function() {

    }
};

const watchCourtData = () => {
    return function(dispatch) {
        firebaseApp.database().ref('courts').on("value", function(snapshot) {

            let data = snapshot.val();
            //console.log("DB DATA", data);
            console.log("DBDATA courts ", JSON.stringify(data));

            let actionGetCourtsData = {
                type: "getCourts",
                value: data
            };
            dispatch(actionGetCourtsData);

        }, function(error) { console.log(error); });
    }
};


const setUserData = (userData) => {
    return {
        type: "setUserData",
        value: userData
    };
};

/*
const watchUserData = () => {

    var actionSetUserData = setUserData({userId : '123123'});
    dispatch(actionSetUserData);

    /!*return function(dispatch) {
        firebaseApp.database().ref('users/userId1').on("value", function(snapshot) {

            let personData = snapshot.val();
            console.log("personData", personData);
            console.log("personData", JSON.stringify(personData));

            var actionSetPersonData = setPersonData(personData);
            dispatch(actionSetPersonData);

        }, function(error) { console.log(error); });
        //dispatch({data : "sample 11"});
    }*!/
};
*/


export {loadUserData, setPersonData, watchPersonData, setUserData, watchCourtData };
