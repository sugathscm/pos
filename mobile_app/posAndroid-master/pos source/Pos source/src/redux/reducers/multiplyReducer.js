let count2= 2;
export default function(state=count2, action){
    switch (action.type) {
        case "Multiply": count2= count2 *2;
            console.log("asdasdasd : ", count2);
            break;
    }
    return count2;
}
