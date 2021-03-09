import React, { Component } from 'react';
import {
    Container,
    Content,
    Header,
    Icon,
    Text,
    Left,
    Body,
    Right,
    Title,
    Toast,
    Spinner,
} from "native-base";
import {
    Platform, StyleSheet, View, TouchableOpacity,
    TouchableNativeFeedback, Dimensions,
} from 'react-native';
import { Button } from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
} from "react-native-responsive-screen";
import { getCases } from "../redux/actions";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import signUpStrings from "../localization/signUpStrings";
import ModalSelector from 'react-native-modal-selector';
import axios from "axios";
import * as AppURLS from "../redux/urls";


class Settings extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        const lang = [
            { key: 'si', longform: 'සිංහල' },
            { key: 'ta', longform: 'தமிழ்' },
            { key: 'en', longform: 'English' },
        ];
        global.lang = lang;
        const data = [
            { key: 'en', label: 'English' },
            { key: 'si', label: 'සිංහල' },
            { key: 'ta', label: 'தமிழ்' }
        ];
        global.data = data;
        this.state = {
            pageLoading: true
        };
    }

    settext(value) {
        console.log("Value" , value);
        signUpStrings.setLanguage(value);
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false
        });
        this.props.getCases(this.props.userData);
        lor(this);
        console.log("User Data" , this.props.userData)
    }

    componentWillUnmount() {
        rol();
    }

    getSWD() {
        const windowWidth = Dimensions.get('window').width;
        return windowWidth;
    }

    componentWillReceiveProps(nextProps) {
    };


    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }
    changeUserLanguage(value) {
        this.setState({
            ...this.state,
            pageLoading: true
        });

        let userLanguage = {
            userId: this.props.userData.userData._id,
            language: value
        }
        axios
            .post(AppURLS.ApiBaseUrl + 'users/userLanguage', userLanguage)
            .then(response => {
                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    //this.showToast(`${signUpStrings.discountAddedSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                    this.showToast(`${signUpStrings.changeLanguageAPISuccessMsg} ${signUpStrings.signinAgain}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                    // this.showToast(`${signUpStrings.signinAgain}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);

                    setTimeout(() => {
                        // write your functions
                        this.props.navigation.navigate('SignIn');
                    },3000);

                } else {
                    this.showToast(`${signUpStrings.invalidDetails}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                }
            })
            .catch(error => {
                console.log("error", error);
                this.showToast(`${signUpStrings.pleaseFillTheNecessaryDetails}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                this.setState({
                    ...this.state,
                    pageLoading: false
                });
            });
    }


    render() {
        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;

        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title>{signUpStrings.settings}</Title>
                    </Body>
                    <Right>


                    </Right>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content padder>

                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{
                                width: (this.getSWD() < 500) ? wp('25%') : (this.getSWD() > 1000) ? wp('10%') : wp('15%'),
                                backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{
                                    width: wp('17%'),
                                    margin: wp('4%'),
                                    marginRight: wp('0%'),
                                    backgroundColor: 'rgba(0,0,0,0)'
                                }}>
                                    <Icon name='md-book' style={{ color: 'gray' }} />
                                </View>
                            </View>

                            <View style={{
                                width: (this.getSWD() < 500) ? wp('75%') : (this.getSWD() > 1000) ? wp('90%') : wp('85%'),
                                backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{
                                    width: (this.getSWD() < 500) ? wp('67%') : (this.getSWD() > 1000) ? wp('87%') : wp('80%'),
                                    paddingBottom: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('2%') : wp('3%'),
                                    margin: wp('4%'),
                                    marginLeft: wp('0%'),
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderBottomWidth: wp('0.25%'),
                                    borderBottomColor: 'gray',
                                    color : 'black'
                                }}>
                                    <TouchableOpacity>
                                        <View style={{ flex: 1, textAlign: 'left', color: 'red',width: wp('100%') }}>

                                            <ModalSelector
                                                data={data}
                                                initValue=""
                                                style={{ width: wp('100%') , textAlign: 'flex-end', alignSelf: 'stretch'}}
                                                accessible={true}
                                                selectStyle={{ borderWidth: 0}}
                                                scrollViewAccessibilityLabel={'Scrollable options'}
                                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                                onChange={(option) => {
                                                    this.setState({ textInputValue: option.label })
                                                    this.settext(option.key)
                                                    this.changeUserLanguage(option.key);
                                                }}>
                                                <Text>{signUpStrings.select_language}</Text>
                                            </ModalSelector>

                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{
                                width: (this.getSWD() < 500) ? wp('25%') : (this.getSWD() > 1000) ? wp('10%') : wp('15%'),
                                backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{
                                    width: wp('17%'),
                                    margin: wp('4%'),
                                    marginRight: wp('0%'),
                                    backgroundColor: 'rgba(0,0,0,0)'
                                }}>
                                    <Icon onPress={() => this.props.navigation.navigate('PrintersScreen')} name='md-print' style={{ color: 'gray' }} />
                                </View>
                            </View>
                            <View style={{ width: wp('75%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{
                                    width: (this.getSWD() < 500) ? wp('67%') : (this.getSWD() > 1000) ? wp('87%') : wp('80%'),
                                    paddingBottom: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('2%') : wp('3%'),
                                    margin: wp('4%'),
                                    marginLeft: wp('0%'),
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderBottomWidth: wp('0.25%'),
                                    borderBottomColor: 'gray'
                                }}>
                                    <Text onPress={() => this.props.navigation.navigate('PrintersScreen')}>{signUpStrings.printers}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{
                                width: (this.getSWD() < 500) ? wp('25%') : (this.getSWD() > 1000) ? wp('10%') : wp('15%'),
                                backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{
                                    width: wp('17%'), margin: wp('4%'),
                                    marginRight: wp('0%'), backgroundColor: 'rgba(0,0,0,0)'
                                }}>
                                    <Icon name='md-settings' style={{ color: 'gray' }} />
                                </View>
                            </View>
                            <View style={{ width: wp('75%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View style={{
                                    width: (this.getSWD() < 500) ? wp('67%') : (this.getSWD() > 1000) ? wp('87%') : wp('80%'),
                                    paddingBottom: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('2%') : wp('3%'),
                                    margin: wp('4%'),
                                    marginLeft: wp('0%'),
                                    backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: wp('0.25%'), borderBottomColor: 'gray'
                                }}>
                                    <Text>{signUpStrings.general}</Text>
                                </View>
                            </View>

                        </View>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePasswordScreen')}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{
                                    width: (this.getSWD() < 500) ? wp('25%') : (this.getSWD() > 1000) ? wp('10%') : wp('15%'),
                                    backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <View style={{
                                        width: wp('17%'), margin: wp('4%'),
                                        marginRight: wp('0%'), backgroundColor: 'rgba(0,0,0,0)'
                                    }}>
                                        <Icon name='md-lock' style={{ color: 'gray' }} />
                                    </View>
                                </View>
                                <View style={{ width: wp('75%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <View style={{
                                        width: (this.getSWD() < 500) ? wp('67%') : (this.getSWD() > 1000) ? wp('87%') : wp('80%'),
                                        paddingBottom: (this.getSWD() < 500) ? wp('4%') : (this.getSWD() > 1000) ? wp('2%') : wp('3%'),
                                        margin: wp('4%'),
                                        marginLeft: wp('0%'),
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        borderBottomWidth: wp('0.25%'),
                                        borderBottomColor: 'gray'
                                    }}>
                                        <Text>{signUpStrings.change_password}</Text>
                                    </View>
                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>



                    <View style={{
                        justifyContent: "center", marginTop: wp('6%'),
                        alignItems: "center"
                    }}>
                        <Text style={{ color: 'gray' }}>{this.props.userData.userData.email}</Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{
                                width: wp('95%'), height: wp('25%'), marginTop: wp('3%'),
                                backgroundColor: 'rgba(0,0,0,0)'
                            }}>
                                <Button
                                    buttonStyle={{ width: wp('95%'), height: wp('12%'), backgroundColor: "gray" }}
                                    onPress={() => this.props.navigation.navigate('SignIn')}
                                    title={signUpStrings.logout}
                                    titleStyle={{ fontSize: hp('2.5%') }}

                                />
                            </View>
                        </View>
                    </View>



                </Content>



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
export default connect(mapStateToProps, matchDispatchToProps)(Settings);

