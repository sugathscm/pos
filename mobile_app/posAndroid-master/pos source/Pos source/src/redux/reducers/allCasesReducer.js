let userData = {
    loginData : {},
    userData : {},
    allCases : [],
    allDiscounts :[],
    allCategories : [],
    allItems : [],
    allReceipts : [],
    allCustomers : []
};
export default function(state=userData, action){
    switch (action.type) {
        case "setAllCases":
            console.log("Dataaaaaaaaaa :: ", action.value);
            userData = {...userData,
                allCases : action.value,
                allCategories : action.value.document.category ? action.value.document.category : [],
                allDiscounts : action.value.document.discounts ? action.value.document.discounts :[],
                allItems : action.value.document.item ? action.value.document.item : [] ,
                allReceipts : action.value.document.receipt ? action.value.document.receipt : [],
                allCustomers : action.value.document.customers ? action.value.document.customers : []
            }
            console.log("setting all cases in state..",userData.allItems);
            break;

            case "setLoginData":
                userData = {...userData,
                    loginData : action.value.document.loginAttempt,
                    userData : action.value.document.userObject,
                   
                };
                console.log("setting login data in state..", userData);
                break;
            
            case "setNewCategory":
                userData = {...userData,
                    allCategories : action.value,
                };
                console.log("setting new category data in state..", userData);
                break;
    }
    return userData;
}
