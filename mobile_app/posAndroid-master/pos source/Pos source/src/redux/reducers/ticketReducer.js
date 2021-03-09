let ticketObj = {
    ticketCount : 0,
};
export default function(state=ticketObj, action){
    switch (action.type) {
        case "UpdateTicket": ticketObj = action.value;
            console.log("Ticket Updated : ", ticketObj);
            break;
    }
    return ticketObj;
}
