import React from 'react';
import LocalizedStrings from 'react-native-localization';
import {Text, Title} from "native-base";
const signUpStrings = new LocalizedStrings({
  "si": {
    username:"පරිශීලක නාමය",
    password:"රහස් පදය",
    firstname:"මුල් නම",
    lastname:"අවසන් නම",
    email:"විද්‍යුත් තැපෑල",
    settings:"සැකසුම්",
    select_language:"භාෂාව තෝරන්න",
    printers:"මුද්‍රණ යන්ත්‍ර",
    general:"සාමාන්‍යයි",
    change_password:"මුරපදය වෙනස් කරන්න",
    logout:"ලොග්අවුට්",
    currentPwd:"වත්මන් මුරපදය",
    newPwd:"නව මුරපදය",
    signinAgain: "කරුණාකර නැවත පුරනය වන්න",
    //settings screen
    changeLanguageAPISuccessMsg: "භාෂාව සාර්ථකව වෙනස් විය!",


    // sales screen
    ticket: "ටිකට්",
    charge: "ගාස්තු",
    search: "සොයන්න",
    noItemsForCategory:"කාණ්ඩය සඳහා අයිතම නොමැත",
    noDiscount:"වට්ටම් නැත",
    noItems:"අයිතම නැත",
    sales:"විකුණුම්",
    help:"උදව්",



    // Receipts screen
    receipts: "කුවිතාන්සිය",
    searchInReceipts: "සොයන්න",
    refund: "ආපසු ගෙවීම",
    refunded: "ආපසු ගෙවා ඇත",
    am: "පෙරවරු",
    pm: "පස්වරු",
    noReceipts :"කුවිතාන්සි නැත",

    //receipDetails
    total:"සම්පූර්ණ",
    generatePdf:"PDF ජනනය කරන්න",
    totalDiscount:"මුළු වට්ටම",
    refundInReceipt:"නැවත මුදල් ගෙවන්න",
    cashier:"මුදල් අයකැමි",
    pdf : "PDF",

    //All Items
    items : "ආයිත්තම",
    categories : "වර්ග",
    discounts : "වට්ටම්",

    // New Item Page
    createItem : "අයිතමය සාදන්න",
    save : "සුරකින්න",
    name : "නාමය",
    category : "වර්ගය",
    soldBy : "විකිණුවේ",
    each: "සෑම",
    weight : "බර",
    volume : "පරිමාව",
    price : "මිල",
    cost : "පිරිවැය",
    sku : "sku",
    priceAdvice : "විකිණීමෙන් පසු මිල දැක්වීමට ක්ෂේත්‍රය හිස්ව තබන්න",
    scanBarCode : "ස්කෑන් බාර්කෝඩ්",
    barcode : "තීරු කේතය",
    inventory : "ඉන්වෙන්ටරි",
    inStock : "ගබඩාවේ ඇති ප්‍රමාණය",
    trackStock : "ඉන්වෙන්ටරි තබන්න",
    representationOnPos : "POS හි නියෝජනය",
    colorAndShape : "වර්ණය සහ හැඩය",
    image : "රූපය",

    //All Items
    allItems : "සියලු අයිතම",
    askMeLater : "පසුව මගෙන් අසන්න",
    areYouSure : "ඔබට විශ්වාසද?",
    yourAreAboutToDeleteThisItem : "ඔබ මෙම අයිතමය මකා දැමීමට සූදානම්",
    cancel : "අවලංගු කරන්න",
    delete : "මකන්න",
    successfullyDeleted : "අයිතමය සාර්ථකව මකා දැමීය",
    canNotDeleteItem:"මේ මොහොතේ අයිතමය මකා දැමිය නොහැක",
    loadingItems:"අයිතම පූරණය වෙමින් පවතියි",

    //All categories
    allCategories : "සියලුම කාණ්ඩ",
    itemsInAllCategories : "අයිතම",
    youAreAboutToDeletethisCategory:"ඔබ මෙම කාණ්ඩය මකා දැමීමට සූදානම්.!",
    successfullyDeletedDiscount:"වට්ටම් සාර්ථකව මකා දැමීය",
    cantDeleteDiscountThisMoment:"මේ මොහොතේ වට්ටම් මකා දැමිය නොහැක",
    youAreAboutToDeleteDiscount:"ඔබ මෙම වට්ටම් මකා දැමීමට සූදානම්.",




     //Add customer to ticket
    searchInAddCustomer:"සොයන්න",
    AddNewCustomer:"නව පාරිභෝගිකයා එක් කරන්න",
    YourMostRecentCustomerShowUpHere:"ඔබගේ නවතම පාරිභෝගිකයා මෙහි පෙන්වනු ඇත",
    NoCustomer:"ගනුදෙනුකරුවන් නැත",
    AddCustomerToTicket:"ප්‍රවේශ පත්‍රයට පාරිභෝගිකයා එක් කරන්න",

     //create customer
     createCustomer:"පාරිභෝගිකයා සාදන්න",
     saveInCreateCustomer:"සුරකින්න",
     Name:"නම",
     Email:"විද්යුත් තැපෑල",
     MobileNumber:"ජංගම දූරකථන අංකය",
     Note:"සටහන",
     cstmrCreatedSuccessfully:"පාරිභෝගිකයා සාර්ථකව නිර්මාණය කරන ලදි!",


    //Sales screen-alert
    clearTicket:"ප්‍රවේශ පත්‍ර හිස් කරන්න",
    youAreAboutToClearTheTicket:"ඔබ ටිකට් පත ඉවත් කිරීමට සූදානම්",
    dropDownAllItems:"සියලු අයිතම",
    dropDownDiscount:"වට්ටම්",
    dropDownCancel:"අවලංගු කරන්න",

     //ticket view screen
     chargeInViewScreen:"ගාස්තු",

     //charge screen
    split:"බෙදුණු",
    discountReference:"වට්ටම් යොමු කිරීම",
    discount:"වට්ටම්",
    totatlAmount:"මුලු වටිනාකම",
    discountedAmount:"වට්ටම් මුදල",
    totalAmountDue:"ගෙවිය යුතු මුළු මුදල",
    cashReceived:"මුදල් ලැබුණි",
    cash:"මුදල්",
    card:"කාඩ්",
    receivedAmountNtEnough:"ලැබුණු මුදල ප්‍රමාණවත් නොවේ. කරුණාකර සම්පූර්ණ මුදල ලබා දෙන්න!",


     //split screen
     done:"කළා",
     payments:"ගෙවීම",
     chargeSplitScreen:"ගාස්තු",

     //split cards screen
    totalAmount:"මුලු වටිනාකම",
    splitAmount : "බෙදුණු මුදල",
    change:"ඉතුරු",
    enterEmail:"විද්‍යුත් තැපෑල ඇතුළත් කරන්න",
    newSale:"නව විකිණීම",

    //Customer profile screen
    customerProfile:"පාරිභෝගික පැතිකඩ",
    addToTicket:"ටිකට් එකට එකතු කරන්න",
    points:"කරුණු",
    visits:"පැමිණීම්",
    lastVisit:"අවසන් වරට පැමිණීම",
    editProfile:"පැතිකඩ සංස්කරණය කරන්න",
    redeemPoints:"මුදවා ගත් කරුණු",

    //refund screen
    noItemsToRefund:"මුදල් ආපසු ගෙවීමට අයිතම නොමැත",
    totalInRefundScreen:"සම්පූර්ණ",
    refundedInRefundScreen:"ආපසු ගෙවා ඇත",

    //email receipt screen
    enterEmailInReceipt:"විද්‍යුත් තැපෑල ඇතුළත් කරන්න",
    send:"යවන්න",
    pleaseValidEmail:"කරුණාකර වලංගු විද්‍යුත් තැපෑලක් ඇතුළත් කරන්න",
    ok:"හරි",
    warning:"අනතුරු ඇඟවීම",

    //view pdf screen
    scanBarcode:"තීරු කේතය පරිලෝකනය කරන්න",
    emailInPdfViewScreen:"විද්යුත් තැපෑල",
    print:"මුද්‍රණය කරන්න",

    //view single item screen
    quantity:"ප්‍රමාණය",
    enterComment:"අදහස් දක්වන්න",
    comment:"අදහස්",

     //edit item screen
     noItemsPlzAdd:"කාණ්ඩ නැත. කරුණාකර පළමුව කාණ්ඩයක් එක් කරන්න",
     imageUploadedSuccessfully:"රූපය සාර්ථකව යාවත්කාලීන කරන ලදි!",
     success:"සාර්ථකය",
     invalidDetails:"අවලංගු විස්තර",
     pleaseFillAll:"කරුණාකර අවශ්‍ය සියලු තොරතුරු පුරවන්න.",
     itemUpdatedSuccessfully:"අයිතමය සාර්ථකව යාවත්කාලීන කරන ලදි!",
     error:"දෝෂයකි",
     leaveTheFieldBlank:"විකිණීමෙන් පසු මිල දැක්වීමට ක්ෂේත්‍රය හිස්ව තබන්න",
     Inventory:"ඉන්වෙන්ටරි",
     selectImg:"රූපය තෝරන්න",



     //barcode screen
     permissionToCam:"කැමරාව භාවිතා කිරීමට අවසර",
     weNeedPermissonToCam:"ඔබගේ කැමරාව භාවිතා කිරීමට අපට ඔබගේ අවසරය අවශ්‍යයි",

     //assign Items eit screen
    categoryAddedSuccessfully:"වර්ගය සාර්ථකව එකතු කරන ලදි!",
    categoryAlreadyExist:"වර්ගය දැනටමත් පවතී",
    pleaseFillTheNecessaryDetails:"කරුණාකර අවශ්‍ය සියලු තොරතුරු පුරවන්න.",
    pleaseEnterValidDetails : "කරුණාකර වලංගු තොරතුරු පුරවන්න",

       //card screen
    chargeAddedSuccessfully:"ගාස්තුව සාර්ථකව එකතු කරන ලදි!",
    emailSentSuccessfully:"විද්‍යුත් තැපෑල සාර්ථකව යවන ලදි!",
    errorOccured:"දෝෂයක් ඇතිවිය",

    //change password scrren
    plzEnterPwd:"ඔබගේ මුරපදය ඇතුල් කරන්න",
    inValidPwd:"අවලංගු මුරපදය",
    inValidNewPwd:"අවලංගු නව මුරපදය",
    inValidReEnteredPwd:"අවලංගු නැවත ඇතුළත් කළ මුරපදය",
    pwdDoesntMatch:"මුරපදය නොගැලපේ",
    pwdChangedSucessfully:"මුරපදය සාර්ථකව වෙනස් කරන ලදි",
    loginFailed:"පුරනය වීම අසාර්ථක විය, කරුණාකර පද්ධති පරිපාලනය අමතන්න",
    reEnterNewPwd:"නව මුරපදය නැවත ඇතුළත් කරන්න",

    //counter screen
    reduxCounter:"Redux කවුන්ටරය",
    incremnt:"වැඩි කිරීම",
    decremnt:"Decreඅඩුවීමment",
    multyPly:"ගුණ කිරීම",

    //create printer screen
    createPrinter:"මුද්‍රණය සාදන්න",
    nameInPrinterscrn:"නම",
    prnterModel:"මුද්‍රණ ආකෘතිය",
    prnterReceipt:"රිසිට්පත් මුද්‍රණය කරන්න",
    prntTst:"මුද්‍රණ පරීක්ෂණය",

    //edit category screen
    categoryClr:"කාණ්ඩයේ වර්ණය",
    categoryName:"කාණ්ඩයේ නම",
    editCategory:"කාණ්ඩය සංස්කරණය කරන්න",
    assignItems:"අයිතමයන් ලබා දෙන්න",
    createItemInCategoryScreen:"අයිතමය සාදන්න",

    //edit discount screen
    discountUpdatedSuccessfully:"වට්ටම් සාර්ථකව යාවත්කාලීන කරන ලදි!",

     //help screen
    helpCenter:"උපකාරක මධ්යස්ථානය",

    //home screen
    home:"ගෙදර",
    addNewCase:"නව අවස්ථාව එක් කරන්න",
    noCseDay:"දවස සඳහා අවස්ථා නොමැත",
    today:"අද",
    case:"අවස්ථාව",

   //itemQuantity Screen
    pen:"පෑන",
    saveInItemQuentity:"සුරකින්න",

    //log out screen
    logOut:"ඉවත් වන්න",
    logginOut:"ඔබව ඉවත් කිරීම ..",

     //new category screen
     createCategory:"වර්ගය සාදන්න",
     fieldsCntEmpty:"ක්ෂේත්‍ර හිස් කළ නොහැක",

     //new discount screen
    createDiscount:"වට්ටම් සාදන්න",
    discountRef:"වට්ටම් යොමුව",
    value:"අගය",
    discountAddedSuccessfully:"වට්ටම් සාර්ථකව එකතු කරන ලදි!",

    //Auth Loading screen
    welcomeToPOS:"සාදරයෙන් පිළිගනිමු",
    ticketSummary : "ටිකට් සාරාංශය",
    customerAlreadyAdded : "පාරිභෝගිකයා දැනටමත් බිල්පතට එකතු කර ඇත, ඔබට ඉවත් කිරීමට අවශ්‍යද?"


  },
  "ta":{
    username:"பயனர்பெயர்",
    password:"கடவுச்சொல்",
    firstname:"முதல் பெயர்",
    lastname:"கடைசி பெயர்",
    email:"மின்னஞ்சல்",
    address:"முகவரி",
    city:"நகரம்",
    district:"மாவட்டம்",
    settings:"அமைப்புகள்",
    logout:"வெளியேறு",

    // sales screen
    ticket: "සාමාන්‍යයි",
    charge: "",
    search: "",
    noItemsForCategory:"No Items For Category",

    // Receipts screen
    receipts: "ටිකට්",
    searchInReceipts: "සෙවීම",
    refund: "සෙවීම",
    am: "",
    pm: "",
    yes : "ඔව්",
    pay : "ගෙවන්න"

  },
  "en":{
    username:"Username",
    password:"Password",
    firstname:"First Name",
    lastname:"Last Name",
    email:"Email",
    address:"Address",
    settings:"Settings",
    select_language:"Select Language",
    printers:"Printers",
    general:"General",
    change_password:"Change Password",
    logout:"SIGN OUT",
    currentPwd:"Current password",
    newPwd:"New Password",
    changeLanguageAPISuccessMsg:"Language changed successfully!",

    // sales screen
    ticket: "Ticket",
    charge: "CHARGE",
    search: "Search",
    noItemsForCategory:"No Items For Category",
    noDiscount:"No Discounts",
    noItems:"No Items",
    sales:"Sales",
    help:"Help",

    // Receipts screen
    receipts: "Receipts",
    searchInReceipts: "Search",
    refund: "Refund",
    refunded: "Refunded",
    am: "am",
    pm: "pm",
    noReceipts : "No Receipts",
    totalBillDiscount:"Total Bill Discount",

    //receipDetails
    total:"Total",
    generatePdf:"GENERATE PDF",
    totalDiscount:"Total Discount",
    refundInReceipt:"REFUND",
    cashier:"Cashier",

    //Items
    items : "Items",
    categories : "Categories",
    discounts : "Discounts",

    // New Item Page
    createItem : "Create Item",
    save : "Save",
    name : "Name",
    category : "Category",
    soldBy : "Sold By",
    each: "Each",
    weight : "Weight",
    volume : "Volume",
    price : "Price",
    cost : "Cost",
    sku : "SKU",
    priceAdvice : "Leave the field blank to indicate the price upon sale",
    scanBarCode : "SCAN BARCODE",
    barcode : "Barcode",
    inventory: "Inventory",
    trackStock : "Track Stock",
    inStock : "In Stock",
    representationOnPos : "Representation on POS",
    colorAndShape : "Color and Shape",
    image : "Image",

    //All Items
    allItems : "All Items",
    askMeLater : "Ask me later",
    areYouSure : "Are you sure?",
    yourAreAboutToDeleteThisItem : "You are about to delete this item",
    cancel : "Cancel",
    delete : "Delete",
    successfullyDeleted : "Successfully deleted the item",
    canNotDeleteItem:"Can not delete the item at the moment",
    loadingItems:"Loading Items",


    //All categories
    allCategories : "All Categories",
    itemsInAllCategories : "items",
    youAreAboutToDeletethisCategory:"You are about to delete this category.",
    successfullyDeletedDiscount:"Successfully deleted the discount",
    cantDeleteDiscountThisMoment:"Can not delete the discount at the moment",
    youAreAboutToDeleteDiscount:"You are about to delete this discount.",


    //Add customer to ticket
    searchInAddCustomer:"Search",
    AddNewCustomer:"ADD NEW CUSTOMER",
    YourMostRecentCustomerShowUpHere:"Your most recent customer will show up here",
    NoCustomer:"No customers",
    AddCustomerToTicket:"Add customer to ticket",

    //create customer
    createCustomer:"Create Customer",
    saveInCreateCustomer:"SAVE",
    Name:"Name",
    Email:"Email",
    MobileNumber:"Mobile Number",
    Note:"Note",
    cstmrCreatedSuccessfully:"Customer created successfully!",


    //Sales screen-alert
    clearTicket:"Clear Ticket",
    youAreAboutToClearTheTicket:"You are about to clear the ticket",
    dropDownAllItems:"AllItems",
    dropDownDiscount:"Discount",
    dropDownCancel:"Cancel",

    //ticket view screen
    chargeInViewScreen:"CHARGE",

    //charge screen
    split:"SPLIT",
    discountReference:"Discount Reference",
    discount:"Discount",
    totatlAmount:"Total amount",
    discountedAmount:"Discounted Amount",
    totalAmountDue:"Total amount due",
    cashReceived:"Cash received",
    card:"Card",
    receivedAmountNtEnough:"Received amount not enough. Please provide total amount!",

    //split screen
    done:"DONE",
    payments:"Payments",
    cash:"Cash",
    chargeSplitScreen:"CHARGE",

    //split cards screen
    totalAmount:"Total Amount",
    splitAmount : "splitAmount",
    change:"Change",
    enterEmail:"Enter Email",
    newSale:"NEW SALE",

    //Customer profile screen
    customerProfile:"Customer profile",
    addToTicket:"ADD TO TICKET",
    points:"Points",
    visits:"Visits",
    lastVisit:"Last Visit",
    editProfile:"EDIT PROFILE",
    redeemPoints:"REDEEM POINTS",

    //refund screen
    noItemsToRefund:"No Items To Refund",
    totalInRefundScreen:"Total",
    refundedInRefundScreen:"refunded",

    //email receipt screen
    enterEmailInReceipt:"Enter email",
    send:"SEND",
    pleaseValidEmail:"Please enter valid email",
    ok:"ok",
    warning:"warning",

    //view pdf screen
    scanBarcode:"Scan Barcode",
    emailInPdfViewScreen:"Email",
    print:"Print",

    //view single item screen
    quantity:"Quantity",
    enterComment:"Enter Comment",
    comment:"Comments",

    //edit item screen
    noItemsPlzAdd:"No Categories. Please add category first",
    imageUploadedSuccessfully:"Image Updated successfully!",
    success:"success",
    invalidDetails:"invalid details",
    pleaseFillAll:"Please fill all the necessary details.",
    itemUpdatedSuccessfully:"Item Updated successfully!",
    error:"Error",
    leaveTheFieldBlank:"Leave the field blank to indicate the price upon sale",
    Inventory:"Inventory",
    selectImg:"Select Image",


    //barcode screen
    permissionToCam:"Permission to use camera",
    weNeedPermissonToCam:"We need your permission to use your camera",

    //assign Items eit screen
    categoryAddedSuccessfully:"Category Added successfully!",
    categoryAlreadyExist:"Category already exists",
    pleaseFillTheNecessaryDetails:"Please fill all the necessary details.",
    pleaseEnterValidDetails : "Please Enter Valid Details.",

    //asign items category screen

    //card screen
    chargeAddedSuccessfully:"Charge added successfully!",
    emailSentSuccessfully:"Email sent successfully!",
    errorOccured:"Error Occured",

    //change password scrren
    plzEnterPwd:"Please enter your password",
    inValidPwd:"invalid password",
    inValidNewPwd:"invalid new password",
    inValidReEnteredPwd:"invalid re-enterd password",
    pwdDoesntMatch:"Password doesn't match",
    pwdChangedSucessfully:"Password changed successfully",
    loginFailed:"Login failed, Please contact system administration",
    reEnterNewPwd:"Re-enter New Password",

    //counter screen
    reduxCounter:"Redux Counter",
    incremnt:"Increment",
    decremnt:"Decrement",
    multyPly:"Multiply",

    //create printer screen
    createPrinter:"Create Printer",
    nameInPrinterscrn:"Name",
    prnterModel:"Printer Model",
    prnterReceipt:"Print receipts",
    prntTst:"PRINT TEST",

    //edit category screen
    categoryClr:"category colour",
    categoryName:"Category Name",
    editCategory:"Edit Category",
    assignItems:"ASSIGN ITEMS",
    createItemInCategoryScreen:"CREATE ITEM",

    //edit discount screen
    discountUpdatedSuccessfully:"Discount Updated successfully!",

    //help screen
    helpCenter:"Help Center",

    //home screen
    home:"Home",
    addNewCase:"ADD NEW CASE",
    noCseDay:"No cases available for the day",
    today:"TODAY",
    case:"CASE",

    //itemQuantity Screen
    pen:"Pen",
    saveInItemQuentity:"SAVE",

     //log out screen
    logOut:"Log Out",
    logginOut:"Logging You out....",

    //new category screen
    createCategory:"Create Category",
    fieldsCntEmpty:"Fields cannot empty",

    //new discount screen
    createDiscount:"Create Discount",
    discountRef:"Discount Reference",
    value:"Value",
    discountAddedSuccessfully:"Discount Added successfully!",

    //new item screen
    noCategoriesPlzAdd:"No Categories. Please add category first",
    itemAddedSuccessfully:"Item Added Successfully!",

    //receipt details screen
    pdfGeneretedSuccessfully:"PDF generated successfully!",

    //Auth Loading Screen
    welcomeToPOS: "Welcome to POS",
    signinAgain : "Please Signin Again",
    ticketSummary : "Ticket Summary",
    customerAlreadyAdded : "Customer is added to bill",
    yes : "Yes",
    pay : "Pay",
    pdf : "pdf",



  }
});
export default signUpStrings;


//{signUpStrings.sku}
