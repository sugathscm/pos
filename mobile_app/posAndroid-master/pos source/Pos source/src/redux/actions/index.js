import axios from "axios";
import * as AppURLS from "../urls";
import signUpStrings from "../../localization/signUpStrings";


export function updateCurrentTicket(ticketData) {
    return {
        type: "UpdateTicket"
    };
}

export function increment() {
    return {
        type: "Increment"
    };
}
export function decrement() {
    console.log("decrement calling....");
    return {
        type: "Decrement"
    };
}
export function multiply() {
    return {
        type: "Multiply"
    };
}

export function setLoginData(userData) {
    console.log("running set login data function...", userData);
    return {
        type: "setLoginData",
        value: userData
    };
}

export function setUpdatedCategoryData(updatedCategoryData) {
    console.log("running set updated category function...", updatedCategoryData);
    //updateCategoryData(updatedCategoryData);
    console.log("aaaaaaaaaa")
    return {
        type: "setNewCategory",
        value: updatedCategoryData
    };


    // return dispatch => {
    //     console.log("dispatching update category data..");

    // }
}

const updateCategoryData = data => ({
    type: "setNewCategory",
    value: data
});


export function getCases(data) {
    console.log("calling getCases with.. ", data);
    return dispatch => {

        console.log("GET CASE STARTED 1");
        dispatch(getCasesStarted());
        console.log("User language" , data.userData.language);
        signUpStrings.setLanguage(data.userData.language);

        console.log("GET CASE STARTED 2");
        axios
            .post(AppURLS.ApiBaseUrl + 'main/mobileSync', {}, { params: { companyId: data.userData.companyId } })
            .then(response => {
                console.log("GET CASE STARTED 3");
                console.log("backend auth data", JSON.stringify(response.data));
                if (response.data.success) {
                    console.log("got cases to display..");
                    dispatch(getCasesSuccess(response.data));
                    return {
                        type: "setAllCases",
                        value: response.data
                    };
                } else {
                    console.log("auth failed..");
                    return {
                        type: "setAllCases",
                        value: {}
                    }
                }
            })
            .catch(error => {
                console.log("GET CASE STARTED 4");
                console.log("get all cases failed..", error);
                dispatch(getCasesFailure(error.message));
            });

        console.log("GET CASE STARTED 5");
    }

}

const getCasesSuccess = data => ({
    type: "setAllCases",
    value: data
});

const getCasesStarted = () => ({
    type: "getCasesStarted"
});

const getCasesFailure = error => ({
    type: "getCasesFailure",
    payload: {
        error
    }
});
