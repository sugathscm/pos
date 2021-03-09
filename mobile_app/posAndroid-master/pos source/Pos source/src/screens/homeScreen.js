import React, { Component } from 'react';
import {ImageBackground, View,TouchableNativeFeedback,StyleSheet, ScrollView,
    TouchableOpacity} from "react-native";
import {Body, Button, Container, Header, Icon, Left, Right, Spinner, Text, Title} from "native-base";
import SignInScreen from "./signInScreen";
import CalendarStrip from "react-native-calendar-strip";
import Counter from "./counter";
import {decrement, getCases, increment, multiply} from "../redux/actions";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from "moment";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import signUpStrings from '../localization/signUpStrings';


class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageLoading : true,
            allCases : [],
            selectedCasesToDisplay : [],
            juniorUser : false
        };
    }

    componentDidMount(){
       // this.state.pageLoading = false;
        //this.props.navigation.navigate('SignIn');
        this.forceUpdate();
        console.log("Home state..", this.state);
        this.props.getCases(this.props.userData);
    }

    componentWillReceiveProps(nextProps) {

        if(!nextProps.userData.allCases || !nextProps.userData.allCases.document || !nextProps.userData.allCases.document.cases){
            this.setState({ ...this.state,
                isVisible  :false
            });
            return;
        }

        this.state.allCases = [];
        this.state.selectedCasesToDisplay = [];
        Object.keys(nextProps.userData.allCases.document.cases).forEach(function(key,index){
            let obj = nextProps.userData.allCases.document.cases[key];
            obj._id = key;

            //setting client details
            let clientId = obj.clientId;
            obj.clientDetails = nextProps.userData.allCases.document.clients[clientId];

            //setting court details
            let courtLocationId = obj.courtLocationId;
            obj.courtLocationDetails = nextProps.userData.allCourtLocations[courtLocationId];

            //obj.courtDetails = nextProps.appData.courts[courtId];
            this.state.allCases[this.state.allCases.length] = obj;
            this.state.selectedCasesToDisplay[this.state.selectedCasesToDisplay.length] = obj;
        }.bind(this));

        this.dateSelected(moment());

    }

    dateSelected(date) {
        this.setState({ ...this.state,
            pageLoading  :true
        });
        //console.log("filtering dates..", this.state.allCases);
        this.state.selectedCasesToDisplay = [];
        if (this.state.allCases) {

            this.state.selectedCasesToDisplay = this.state.allCases.filter((res, index) => {
                return ((moment(res.courtDate).isAfter(moment(date.startOf('day')))) &&
                    (moment(res.courtDate).isBefore(moment(date.endOf('day')))))
            });
        }
        this.forceUpdate();
        this.setState({ ...this.state,
            pageLoading  :false
        });
    }

    render() {

        let TouchablePlatformSpecific =
            Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;
        let touchableStyle =
            Platform.OS === "ios" ? styles.iosTouchable : styles.androidTouchable;


        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row'}}>
                        <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{flex:1}}>
                        <Title>{signUpStrings.home}</Title>
                    </Body>
                    {/*<Right>
                        <Icon name="md-cart" style={{ color: 'white' }} onPress={() => this.props.navigation.navigate('SignIn')} />
                    </Right>*/}
                </Header>

                {/* Spinner */}
                { this.state.pageLoading ? <Spinner color='blue' style={{position: 'absolute',
                    backgroundColor : 'rgba(0,0,0,0.4)', height : hp('100%'),
                    width : wp('100%'), zIndex:2000}} /> : null}
                <View style={{ flex: 1}}>

                    <ImageBackground
                        source={require('../assets/img/lawpic.jpg')}
                        style={{width: '100%', marginBottom : hp('18%')}}>
                        <View style={{backgroundColor : 'rgba(0,0,0,0.4)', height : hp('33%')}}>
                            {/* Calender */}
                            {/* https://github.com/BugiDev/react-native-calendar-strip */}
                            <CalendarStrip
                                calendarAnimation={{ type: "sequence", duration: 30 }}
                                daySelectionAnimation={{
                                    type: "border",
                                    duration: 200,
                                    borderWidth: 1,
                                    borderHighlightColor: "white"
                                }}
                                style={{ height: hp('30%'), paddingTop: 20, paddingBottom: 10 }}
                                calendarHeaderStyle={{ color: "white" }}
                                // calendarColor={"#7743CE"}
                                dateNumberStyle={{ color: "white" }}
                                dateNameStyle={{ color: "white" }}
                                highlightDateNumberStyle={{ color: "yellow" }}
                                highlightDateNameStyle={{ color: "yellow" }}
                                disabledDateNameStyle={{ color: "grey" }}
                                disabledDateNumberStyle={{ color: "grey" }}
                                //datesWhitelist={datesWhitelist}
                                // datesBlacklist={datesBlacklist}
                                iconLeft={require("../assets/img/left-arrow.png")}
                                iconRight={require("../assets/img/right-arrow.png")}
                                iconContainer={{ flex: 0.1 }}
                                onDateSelected={(date)=>this.dateSelected(date)}
                            />
                        </View>

                        {!this.props.userData.juniorUser ?
                        <View
                            style={{
                                height : hp('10%'),
                                flexDirection: "row",
                                justifyContent: "flex-end"
                            }}
                        >
                            <TouchablePlatformSpecific
                                style={{  }}
                                onPress={() => this.props.navigation.navigate("Cases")}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: "rgba(20,23,66,1)",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: hp("2.4%"),
                                            color: "white",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {this.state
                                            ? this.state.selectedCasesToDisplay
                                                ? "YOU HAVE " + this.state.selectedCasesToDisplay.length
                                                : "YOU HAVE 0"
                                            : "YOU HAVE 0"}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: hp("2.4%"),
                                            color: "white",
                                            fontWeight: "600",
                                        }}
                                    >
                                        CASE{(this.state.selectedCasesToDisplay && (this.state.selectedCasesToDisplay.length == 1) )? "" : "S" } TODAY
                                    </Text>
                                </View>
                            </TouchablePlatformSpecific>
                            <TouchablePlatformSpecific
                                onPress={() => this.props.navigation.navigate("NewCase")}>
                                <View
                                    style={{
                                        flex : 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "blue"
                                    }}
                                >
                                    <Icon name="ios-add-circle-outline" style={{color : "white", fontSize: hp('3.5%') }}/>
                                    <Text
                                        style={{
                                            fontSize: hp("2.4%"),
                                            margin: hp("0.5%"),
                                            color: "white",
                                            fontWeight: "600"
                                        }}
                                    >
                                        ADD NEW CASE {/*{this.props.DB ? JSON.stringify(this.props.DB) : "sa"}*/}
                                    </Text>
                                </View>
                            </TouchablePlatformSpecific>
                        </View>
                            :
                            <View
                                style={{
                                    height : hp('10%'),
                                    flexDirection: "row",
                                    justifyContent: "flex-start"
                                }}
                            >
                                <TouchablePlatformSpecific
                                    style={{  }}
                                    onPress={() => this.props.navigation.navigate("Cases")}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: "rgba(20,23,66,1)",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: hp("2.4%"),
                                                color: "white",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {this.state
                                                ? this.state.selectedCasesToDisplay
                                                    ? "YOU HAVE " + this.state.selectedCasesToDisplay.length
                                                    : "YOU HAVE 0"
                                                : "YOU HAVE 0"}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: hp("2.4%"),
                                                color: "white",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {signUpStrings.case}{(this.state.selectedCasesToDisplay && (this.state.selectedCasesToDisplay.length == 1) )? "" : "S" } {signUpStrings.today}
                                        </Text>
                                    </View>
                                </TouchablePlatformSpecific>
                            </View>
                        }
                    </ImageBackground>
                </View>
                <View style={{ flex: 1.05, paddingTop : 0 }}>
                    <ScrollView>
                        {this.state.selectedCasesToDisplay ? (
                            this.state.selectedCasesToDisplay ? (
                                this.state.selectedCasesToDisplay.length !== 0 ? (
                                    this.state.selectedCasesToDisplay.map((res, index) => (

                                        <TouchablePlatformSpecific
                                            style={{flex : 1}}
                                            onPress={() => this.props.navigation.navigate('CaseView', {data : res})}>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    backgroundColor: "white",
                                                    flexDirection: "row",
                                                    padding: 5
                                                }}
                                            >
                                                {/* Time Box */}
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: "rgba(225,225,225,1)",
                                                        height: hp("17%"),
                                                        borderBottomLeftRadius: 5,
                                                        borderTopLeftRadius: 5,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderLeftWidth: 0.5,
                                                        borderTopWidth: 0.5,
                                                        borderBottomWidth: 0.5,
                                                        borderColor: "#e1e1e1"
                                                    }}
                                                >
                                                    <Icon
                                                        name="ios-timer"
                                                        color="black"
                                                    />
                                                    <Text
                                                        style={{
                                                            lineHeight: hp("5%"),
                                                            fontSize: hp("2.6%"),
                                                            margin: 5,
                                                            color: "black",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {/* Time */}
                                                        {moment(res.courtDate) ? moment(res.courtDate).utc(false).hours() + " : " + (moment(res.courtDate).utc(false).minutes() == 0 ? '00' : moment(res.courtDate).utc(false).minutes()) : "No Data"}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 2,
                                                        height: hp("17%"),
                                                        borderWidth: 1,
                                                        borderColor: "#e1e1e1",
                                                        borderTopRightRadius: 5,
                                                        borderBottomRightRadius: 5
                                                    }}
                                                >
                                                    <View style={{ flex: 1, flexDirection: "column" }}>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                height: hp("17%"),
                                                                justifyContent: "center",
                                                                borderBottomWidth: 1,
                                                                borderColor: "#e1e1e1",
                                                                alignItems: "center"
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    lineHeight: hp("3%"),
                                                                    fontSize: hp("2.6%"),
                                                                    margin: hp("1%"),
                                                                    color: "black",
                                                                    fontWeight: "600"
                                                                }}
                                                            >
                                                                {/* Name */}
                                                                {res.clientDetails.clientName}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flex: 1, height: hp("17%") }}>
                                                            <View style={{ flex: 1, flexDirection: "row" }}>
                                                                <View
                                                                    style={{
                                                                        flex: 1,
                                                                        justifyContent: "center",
                                                                        borderRightWidth: 1,
                                                                        borderColor: "#e1e1e1",
                                                                        alignItems: "center"
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            fontSize: hp("2%"),
                                                                            margin: hp("1%"),
                                                                            color: "black",
                                                                            fontWeight: "600"
                                                                        }}
                                                                    >
                                                                        {/* CaseId */}
                                                                        {res.caseNumber}
                                                                    </Text>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        flex: 1,
                                                                        flexDirection: "row",
                                                                        justifyContent: "center",
                                                                        alignItems: "center"
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        name="md-call"
                                                                        color="black"
                                                                        size={hp("2.5%")}
                                                                    />
                                                                    <Text
                                                                        style={{
                                                                            fontSize: hp("2%"),
                                                                            margin: hp("1%"),
                                                                            color: "black",
                                                                            fontWeight: "600"
                                                                        }}
                                                                    >
                                                                        {/* Mobile No 1 */}
                                                                        {res.clientDetails.clientMobile}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                height: hp("17%"),
                                                                flexDirection: "row",
                                                                borderTopWidth: 1,
                                                                borderColor: "#e1e1e1",
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }}
                                                        >
                                                            <Icon
                                                                name="home"
                                                                color="black"
                                                                size={hp("3%")}
                                                            />
                                                            <Text
                                                                style={{
                                                                    fontSize: hp("1.9%"),
                                                                    margin: hp("1%"),
                                                                    color: "black",
                                                                    fontWeight: "600"
                                                                }}
                                                            >
                                                                {res.courtLocationDetails ? res.courtLocationDetails.location : ""}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchablePlatformSpecific>
                                    ))
                                ) : (
                                    <View style={{width : wp('100%'), justifyContent: "center", paddingTop : hp('15%'),
                                        alignItems: "center"}}>
                                        <Text>{signUpStrings.noCseDay}</Text>
                                    </View>
                                )
                            ) : (
                                <View style={{width : wp('100%'), justifyContent: "center", paddingTop : hp('15%'),
                                    alignItems: "center"}}>
                                    <Text>{signUpStrings.noCseDay}</Text>
                                </View>
                            )
                        ) : (
                            <View style={{width : wp('100%'), justifyContent: "center", paddingTop : hp('15%'),
                                alignItems: "center"}}>
                                <Text>{signUpStrings.noCseDay}</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
});

function mapStateToProps(state){
    console.log("State ::: ",state);
    return{
        count : state.multy,
        userData : state.data,
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getCases: (data) => getCases(data), decrement: decrement, multiply: multiply}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(HomeScreen);

