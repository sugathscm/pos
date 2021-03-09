import React, { Component } from 'react';
import {
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item,
    ListItem,
    Label,
    InputGroup,
    Button,
    Text,
    Left, Right,
    Body,
    Title,
    Toast,
    Card,
    CardItem,
    Picker,
    Spinner, Radio
} from "native-base";
import {
    Image, ImageBackground, Platform, StyleSheet, View, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { decrement, getCases, increment, multiply, setUpdatedCategoryData } from "../redux/actions";
import { bindActionCreators } from 'redux';
import { Switch } from 'react-native-base-switch';
import { connect } from 'react-redux';
import moment from "./homeScreen";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import signUpStrings from "../localization/signUpStrings";


class NewCategory extends React.Component {

    static navigationOptions = {
        title: 'New Category',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            name:"",
            formNameValid:null,
            checkGray:false,
            checkRed:false,
            checkPink:false,
            checkOrange:false,
            checkYellow:false,
            checkGreen:false,
            checkBlue:false,
            checkpurple:false,
            strGray:"",
            strRed:"",
            strPink:"",
            strOrange:"",
            strYellow:"",
            strGreen:"",
            strBlue:"",
            strPurple:"",
            colour:"",
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false
        });
    }

    componentWillReceiveProps(nextProps) {

    };
    validate() {
        console.log("validating form..");
        // Name
        if (this.state.formNameValid !== null || this.state.name !== "") {
            if (this.state.name && this.state.name.length >= 3) {
                this.state.formNameValid = true;
            } else {
                this.state.formNameValid = false;
            }
        }
        this.forceUpdate();
    }

    showValidityIcon(value) {
        if (value !== null) {
            if (value === true) {
                return 'checkmark-circle';
            } else {
                return 'close-circle';
            }
        } else {
            return 'create';
        }
    }


    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }


    submitForm() {
        console.log("submitting form..");

        this.setState({
            ...this.state,
            pageLoading: true
        });

        let category = {
            name:this.state.name,
            colour: this.state.strGray + 
                    this.state.strRed +
                    this.state.strPink +
                    this.state.strOrange +
                    this.state.strYellow +
                    this.state.strGreen +
                    this.state.strBlue +
                    this.state.strPurple,
            companyId : this.props.userData.userData.companyId
        }

        console.log("aaaaaaaa",category)
        axios
            .post(AppURLS.ApiBaseUrl + 'categories/addCategory', category)
            .then(response => {
                console.log("backend data", response);

                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    this.showToast(`${signUpStrings.categoryAddedSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                    this.props.navigation.navigate('AllCategories')

                }
                else if(response.data.message == "Category already exists"){
                    this.showToast(`${signUpStrings.categoryAlreadyExist}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                }
                
                else {
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

    submitFormNavigateItems() {
        console.log("submitting form..");

        this.setState({
            ...this.state,
            pageLoading: true
        });

        let category = {
            name:this.state.name,
            colour: this.state.strGray + 
                    this.state.strRed +
                    this.state.strPink +
                    this.state.strOrange +
                    this.state.strYellow +
                    this.state.strGreen +
                    this.state.strBlue +
                    this.state.strPurple,
            companyId : this.props.userData.userData.companyId
        }

        console.log("aaaaaaaa",category)
        axios
            .post(AppURLS.ApiBaseUrl + 'categories/addCategory', category)
            .then(response => {
                console.log("backend data", response);

                if (response.data.success) {
                    this.state.pageLoading = false;
                    this.forceUpdate();
                    this.showToast(`${signUpStrings.categoryAddedSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                    console.log("Data Response" ,  response.data.document)
                    this.props.navigation.navigate('NewItem' , {res:response.data.document})

                } else if(response.data.message == "Category already exists"){
                    this.showToast(`${signUpStrings.categoryAlreadyExist}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                }
                
                
                else {
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
                        <Icon onPress={() => this.props.navigation.navigate('AllCategories')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title>{signUpStrings.createCategory}</Title>
                    </Body>
                    <Right>
                        <Button transparent color="white" onPress={() => this.submitForm()}>
                            <Text>{signUpStrings.save}</Text>
                        </Button>
                        {/* <Icon active name="search" onPress={() => this.props.navigation.navigate('NewItem')}
                              style={{ color: 'white', marginRight: 15 }} /> */}
                    </Right>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>



                    <Form>

                        <Card style={{ marginLeft: wp('0%'), marginRight: wp('0%'), width: wp('100%'), marginTop: hp('0%') }}>
                            <Content padder>
                                {/* Name */}
                                <Item floatingLabel
                                    style={{marginBottom:wp('5%')}}
                                    success={this.state.formNameValid === true ? true : null}
                                    error={this.state.formNameValid === false ? true : null}>
                                    <Label style={{ color: 'blue' }}>{signUpStrings.categoryName}</Label>
                                    <Input onChangeText={text => {
                                        this.state.name = text;
                                        this.validate();
                                    }}
                                        value={this.state.name}
                                    />
                                    <Icon name={this.showValidityIcon(this.state.formNameValid)}/>
                                </Item>

                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Label style={{ color: 'blue' }}>
                                        {signUpStrings.categoryClr}
                                </Label>
                                </Item>
                            </Content>

                            {/* Category color */}
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <TouchablePlatformSpecific 
                                         onPress={()=> {
                                            this.setState({ ...this.state,
                                                checkGray : !this.state.checkGray,
                                                checkRed : false,
                                                checkPink:false,
                                                checkOrange:false,
                                                checkYellow:false,
                                                checkGreen:false,
                                                checkBlue:false,
                                                checkpurple:false
                                            });
                                            if(!this.state.checkGray){
                                                this.setState({
                                                    strGray:"Gray",
                                                    strRed:"",
                                                    strPink:"",
                                                    strOrange:"",
                                                    strYellow:"",
                                                    strGreen:"",
                                                    strBlue:"",
                                                    strPurple:""
                                                })
                                            }else{
                                                this.setState({
                                                    strGray:""
                                                })
                                            }
                                        }}>
                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "gray",justifyContent:'center',alignItems:'center' }}>
                                        {this.state.checkGray ?
                                        <Icon name='md-checkmark' style={{fontSize: hp('6%'),   color : 'white'}}/>
                                        :null}
                                        </View>
                                        </TouchablePlatformSpecific>
                                    </View>
                                    <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <TouchablePlatformSpecific
                                        onPress={()=> {
                                            this.setState({ ...this.state,
                                                checkRed : !this.state.checkRed,
                                                checkGray : false,
                                                checkPink:false,
                                                checkOrange:false,
                                                checkYellow:false,
                                                checkGreen:false,
                                                checkBlue:false,
                                                checkpurple:false
                                            });
                                            if(!this.state.checkRed){
                                                this.setState({
                                                    strRed:"Red",
                                                    strGray:"",
                                                    strPink:"",
                                                    strOrange:"",
                                                    strYellow:"",
                                                    strGreen:"",
                                                    strBlue:"",
                                                    strPurple:""
                                                })
                                            }else{
                                                this.setState({
                                                    strRed:""
                                                })
                                            }
                                        }}>
                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "red" ,justifyContent:'center',alignItems:'center'}}>
                                        {this.state.checkRed ?
                                        <Icon name='md-checkmark' style={{fontSize: hp('6%'),   color : 'white'}}/>
                                        :null}
                                        </View>
                                        </TouchablePlatformSpecific>
                                    </View>
                                    <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <TouchablePlatformSpecific
                                        onPress={()=> {
                                            this.setState({ ...this.state,
                                                checkPink : !this.state.checkPink,
                                                checkGray : false,
                                                checkRed : false,
                                                checkOrange:false,
                                                checkYellow:false,
                                                checkGreen:false,
                                                checkBlue:false,
                                                checkpurple:false
                                            });
                                            if(!this.state.checkPink){
                                                this.setState({
                                                    strPink:"Pink",
                                                    strGray:"",
                                                    strRed:"",
                                                    strOrange:"",
                                                    strYellow:"",
                                                    strGreen:"",
                                                    strBlue:"",
                                                    strPurple:""
                                                })
                                            }else{
                                                this.setState({
                                                    strPink:""
                                                })
                                            }
                                        }}>
                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "pink" ,justifyContent:'center',alignItems:'center'}}>
                                        {this.state.checkPink ?
                                        <Icon name='md-checkmark' style={{fontSize: hp('6%'),   color : 'white'}}/>
                                        :null}
                                        </View>
                                        </TouchablePlatformSpecific>
                                    </View>
                                    <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <TouchablePlatformSpecific
                                    onPress={()=> {
                                        this.setState({ ...this.state,
                                            checkOrange : !this.state.checkOrange,
                                            checkGray : false,
                                                checkRed : false,
                                                checkPink:false,
                                                checkYellow:false,
                                                checkGreen:false,
                                                checkBlue:false,
                                                checkpurple:false
                                        });
                                        if(!this.state.checkOrange){
                                            this.setState({
                                                strOrange:"Orange",
                                                strGray:"",
                                                    strRed:"",
                                                    strPink:"",
                                                    strYellow:"",
                                                    strGreen:"",
                                                    strBlue:"",
                                                    strPurple:""
                                            })
                                        }else{
                                            this.setState({
                                                strOrange:""
                                            })
                                        }
                                    }}>
                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "orange",justifyContent:'center',alignItems:'center' }}>
                                        {this.state.checkOrange ?
                                        <Icon name='md-checkmark' style={{fontSize: hp('6%'),   color : 'white'}}/>
                                        :null}
                                        </View>
                                        </TouchablePlatformSpecific>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <TouchablePlatformSpecific
                                    onPress={()=> {
                                        this.setState({ ...this.state,
                                            checkYellow : !this.state.checkYellow,
                                            checkGray : false,
                                                checkRed : false,
                                                checkPink:false,
                                                checkOrange:false,
                                                checkGreen:false,
                                                checkBlue:false,
                                                checkpurple:false
                                        });
                                        if(!this.state.checkYellow){
                                            this.setState({
                                                strYellow:"Yellow",
                                                strGray:"",
                                                    strRed:"",
                                                    strPink:"",
                                                    strOrange:"",
                                                    strGreen:"",
                                                    strBlue:"",
                                                    strPurple:""
                                            })
                                        }else{
                                            this.setState({
                                                strYellow:""
                                            })
                                        }
                                    }}>
                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "yellow" ,justifyContent:'center',alignItems:'center'}}>
                                        {this.state.checkYellow ?
                                        <Icon name='md-checkmark' style={{fontSize: hp('6%'),   color : 'white'}}/>
                                        :null}
                                        </View>
                                        </TouchablePlatformSpecific>
                                    </View>
                                    <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <TouchablePlatformSpecific
                                    onPress={()=> {
                                        this.setState({ ...this.state,
                                            checkGreen : !this.state.checkGreen,
                                            checkGray : false,
                                                checkRed : false,
                                                checkPink:false,
                                                checkOrange:false,
                                                checkYellow:false,
                                                checkBlue:false,
                                                checkpurple:false
                                        });
                                        if(!this.state.checkGreen){
                                            this.setState({
                                                strGreen:"Green",
                                                strGray:"",
                                                    strRed:"",
                                                    strPink:"",
                                                    strOrange:"",
                                                    strYellow:"",
                                                    strBlue:"",
                                                    strPurple:""
                                            })
                                        }else{
                                            this.setState({
                                                strGreen:""
                                            })
                                        }
                                    }}>
                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "green" ,justifyContent:'center',alignItems:'center'}}>
                                        {this.state.checkGreen ?
                                        <Icon name='md-checkmark' style={{fontSize: hp('6%'),   color : 'white'}}/>
                                        :null}
                                        </View>
                                        </TouchablePlatformSpecific>
                                    </View>
                                    <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <TouchablePlatformSpecific
                                    onPress={()=> {
                                        this.setState({ ...this.state,
                                            checkBlue : !this.state.checkBlue,
                                            checkGray : false,
                                                checkRed : false,
                                                checkPink:false,
                                                checkOrange:false,
                                                checkYellow:false,
                                                checkGreen:false,
                                                checkpurple:false
                                        });
                                        if(!this.state.checkBlue){
                                            this.setState({
                                                strBlue:"Blue",
                                                strGray:"",
                                                    strRed:"",
                                                    strPink:"",
                                                    strOrange:"",
                                                    strYellow:"",
                                                    strGreen:"",
                                                    strPurple:""
                                            })
                                        }else{
                                            this.setState({
                                                strBlue:""
                                            })
                                        }
                                    }}>
                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "blue" ,justifyContent:'center',alignItems:'center'}}>
                                        {this.state.checkBlue ?
                                        <Icon name='md-checkmark' style={{fontSize: hp('6%'),   color : 'white'}}/>
                                        :null}
                                        </View>
                                        </TouchablePlatformSpecific>
                                    </View>
                                    <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <TouchablePlatformSpecific
                                    onPress={()=> {
                                        this.setState({ ...this.state,
                                            checkpurple : !this.state.checkpurple,
                                            checkGray : false,
                                                checkRed : false,
                                                checkPink:false,
                                                checkOrange:false,
                                                checkYellow:false,
                                                checkGreen:false,
                                                checkBlue:false,
                                        });
                                        if(!this.state.checkpurple){
                                            this.setState({
                                                strPurple:"Purple",
                                                strGray:"",
                                                    strRed:"",
                                                    strPink:"",
                                                    strOrange:"",
                                                    strYellow:"",
                                                    strGreen:"",
                                                    strBlue:"",
                                            })
                                        }else{
                                            this.setState({
                                                strPurple:""
                                            })
                                        }
                                    }}>
                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "purple" ,justifyContent:'center',alignItems:'center'}}>
                                        {this.state.checkpurple ?
                                        <Icon name='md-checkmark' style={{fontSize: hp('6%'),   color : 'white'}}/>
                                        :null}
                                        </View>
                                        </TouchablePlatformSpecific>
                                    </View>
                                </View>
                            </View>

                            <Content padder>

                                <View style={{ marginBottom: hp('2%'), alignContent: 'center' }}>
                                    {/* Assign Items */}
                                    <Button bordered success style={{ width: wp('95%'), justifyContent: 'center', borderColor: 'blue', color: 'blue' }}
                                    onPress={() => {
                                        if(!this.state.formNameValid || this.state.strGray + 
                                            this.state.strRed +
                                            this.state.strPink +
                                            this.state.strOrange +
                                            this.state.strYellow +
                                            this.state.strGreen +
                                            this.state.strBlue +
                                            this.state.strPurple==''){
                                            this.showToast(`${signUpStrings.fieldsCntEmpty}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                                        }else{
                                            this.props.navigation.navigate('AssignItemsToCategoryScreen' , {Name : this.state.name , Color:this.state.strGray + 
                                                this.state.strRed +
                                                this.state.strPink +
                                                this.state.strOrange +
                                                this.state.strYellow +
                                                this.state.strGreen +
                                                this.state.strBlue +
                                                this.state.strPurple})
                                        }
                                       

                                    }}>
                                        <Text style={{ textAlign: 'center', color: 'blue' }}>{signUpStrings.assignItems}</Text>
                                    </Button>
                                </View>

                                <View style={{ marginBottom: hp('2%') }}>
                                    {/* create item */}
                                    <Button bordered success style={{ width: wp('95%'), justifyContent: 'center', borderColor: 'blue', color: 'blue' }}
                                        onPress={() => 
                                            this.submitFormNavigateItems()}>
                                        <Text style={{ textAlign: 'center', color: 'blue' }}>{signUpStrings.createItemInCategoryScreen}</Text>
                                    </Button>
                                </View>

                            </Content>

                        </Card>

                    </Form>

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
    return bindActionCreators({ getCases: (data) => getCases(data) },{setUpdatedCategoryData:(data)=> setUpdatedCategoryData(data)} ,dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(NewCategory);

