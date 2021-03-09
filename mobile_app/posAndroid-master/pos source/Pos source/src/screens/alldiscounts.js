import React, { Component } from 'react';
import {
    Image, ImageBackground, Platform, StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';
import { Button, SearchBar } from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { decrement, getCases, increment, multiply } from "../redux/actions";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from "./homeScreen";
import { Body, Header, Left, Right, Title, List, Icon, Fab, Container, Toast, Spinner, ListItem, Thumbnail, Content } from "native-base";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import signUpStrings from '../localization/signUpStrings';

class AllDiscounts extends React.Component {

    static navigationOptions = {
        title: 'All Discounts',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: false,
            allDiscounts: [],
            selectedDiscounts: [],
            searchSelected: false
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: true
        });
        this.props.getCases(this.props.userData);
    }

    getCases() {
        this.props.getCases(this.props.userData);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            ...this.state,
            isVisible: true
        });

        if (!nextProps.userData.allDiscounts) {
            this.setState({
                ...this.state,
                isVisible: false
            });
            return;
        }
        this.state.allDiscounts = [];
        this.state.selectedDiscounts = [];
        Object.keys(nextProps.userData.allDiscounts).forEach(function (key, index) {
            let obj = nextProps.userData.allDiscounts[key];
            obj._id = key;
            let discountId = obj._id;
            obj.discountDetails = nextProps.userData.allDiscounts[discountId];
            this.state.allDiscounts[this.state.allDiscounts.length] = obj;
            this.state.selectedDiscounts[this.state.selectedDiscounts.length] = obj;
        }.bind(this));

        this.setState({
            ...this.state,
            isVisible: false,
            pageLoading:false
        });
        this.forceUpdate();
    }

    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }
    updateSearch = search => {
        this.setState({ search });
        //console.log("filtering dates..", this.state.allCases);
        this.state.selectedDiscounts = [];
        if (this.state.allDiscounts) {
            this.state.selectedDiscounts = this.state.allDiscounts.filter((res, index) => {
                return (res.name.toLowerCase().includes(search.toLowerCase()));
            });
        }
        this.forceUpdate();
    };

    deleteDiscount(data) {
        console.log("Data", data);
        Alert.alert(
            `${signUpStrings.areYouSure}`,
            `${signUpStrings.youAreAboutToDeleteDiscount}`,
            [
                { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Delete', onPress: () => {
                        // Deleting case
                        this.setState({
                            ...this.state,
                            pageLoading: true
                        });

                        let Obj = {
                            discountId : data._id,
                            deleted : true
                        }

                        axios
                            .post(AppURLS.ApiBaseUrl + 'discounts/discountDelete',Obj)
                            .then(response => {
                                console.log("backend auth data", response.data);
                                if (response.data.success) {
                                    console.log("auth success..");
                                    this.setState({
                                        ...this.state,
                                        pageLoading: false,
                                        selectedDiscounts:[]
                                    });
                                    this.showToast(`${signUpStrings.successfullyDeletedDiscount}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                                    this.getCases();
                                    return;
                                } else {
                                    console.log("failed to delete the discount...");
                                    this.setState({
                                        ...this.state,
                                        pageLoading: false
                                    });
                                    this.showToast(`${signUpStrings.cantDeleteDiscountThisMoment}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                                    return;
                                }
                            })
                            .catch(error => {
                                console.log("failed to delete the case... Catch..", error);
                                this.setState({
                                    ...this.state,
                                    pageLoading: false
                                });
                                this.showToast(`${signUpStrings.cantDeleteDiscountThisMoment}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                                return;
                            });
                    }
                },
            ],
            { cancelable: false },
        );
    }


    render() {
        const { search } = this.state;

        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;

        return (
            <Container>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.7)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                {this.state.searchSelected ?
                    <Header>
                        <Left style={{ flexDirection: 'row' }}>
                            <Icon onPress={() => this.setState({ searchSelected: false })} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                        </Left>
                        <Body style={{ flex: 1 }}>
                            <SearchBar
                                searchIcon={{ size: hp('3%') }}
                                placeholder="Search"
                                onChangeText={this.updateSearch}
                                value={search}
                                containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
                                inputContainerStyle={{ backgroundColor: '#e1e1e1', width: wp('60%') }}
                                inputStyle={{ fontSize: hp('2.4%') }}
                            />

                        </Body>
                    </Header>

                    :

                    <Header>
                        <Left style={{ flexDirection: 'row' }}>
                            <Icon onPress={() => this.props.navigation.navigate('ItemsMain')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                        </Left>
                        <Body style={{ flex: 1 }}>
                            <Title>All Discounts</Title>
                        </Body>
                        <Right>
                            <Icon active name="search" onPress={() => this.setState({ searchSelected: true })}
                                style={{ color: 'white', marginRight: 15 }} />
                        </Right>
                    </Header>

                }
                <Content>
                    <ScrollView>


                        {
                            this.state.selectedDiscounts ? (
                                this.state.selectedDiscounts.length !== 0 ? (
                                    this.state.selectedDiscounts.map((res, index) => (
                                        <List>
                                            <ListItem thumbnail onLongPress={()=> this.deleteDiscount(res)} onPress={() => this.props.navigation.navigate('EditDiscount' , {data : res})}>
                                                <Left>
                                                    <Icon active name="pricetag" />
                                                </Left>
                                                <Body>
                                                    <Text>{res.discountDetails ? res.discountDetails.name : ""}</Text>
                                                </Body>
                                                <Right>
                                                    <Text>{res.discountDetails ? res.discountDetails.discount : ""}</Text>
                                                </Right>
                                            </ListItem>

                                        </List>
                                    ))
                                ) : (
                                        <View style={{
                                            width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                            alignItems: "center"
                                        }}>
                                            <Text>No Discounts</Text>
                                        </View>
                                    )
                            ) : (
                                    <View style={{
                                        width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                        alignItems: "center"
                                    }}>
                                        <Text>No Discounts</Text>
                                    </View>
                                )}
                        <View style={{ height: hp('20%'), zIndex: 100 }}>
                            <ScrollView>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </Content>
                <Fab
                    active={this.state.active}
                    direction="bottomRight"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewDiscount')}>
                    <Icon name="add" />
                </Fab>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
});

function mapStateToProps(state) {
    return {
        userData: state.data,
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({ getCases: (data) => getCases(data) }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(AllDiscounts);

