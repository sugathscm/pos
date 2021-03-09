import React, {Component} from 'react';
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
    Button ,
    Text,
    Left, Right,
    Body,
    Title,
    Toast,
    Picker,
    Spinner,Radio
} from "native-base";
import {
    Image, ImageBackground, Platform, StyleSheet, View, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';
import { SearchBar} from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {decrement, getCases, increment, multiply} from "../redux/actions";
import {bindActionCreators} from 'redux';
import { Switch } from 'react-native-base-switch';
import {connect} from 'react-redux';
import moment from "./homeScreen";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import signUpStrings from '../localization/signUpStrings';


class ItemQuantityScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading : true,
            formEmail : "",
            formEmailValid : null,
        };
    }

    componentDidMount(){
        this.setState({
            ...this.state,
            pageLoading : false
        });
    }

    componentWillReceiveProps(nextProps) {

    };

    showValidityIcon(value){
        if(value !== null){
            if(value === true){
                return 'checkmark-circle';
            }else{
                return 'close-circle';
            }
        }else{
            return 'create';
        }
    }

    showToast(message,text, type){
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
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
                    <Left style={{ flexDirection: 'row'}}>
                        <Icon  onPress={() => this.props.navigation.navigate('ReceiptDetailsScreen')} name="md-close" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{flex:1}} >
                        <Title>{signUpStrings.pen}</Title>
                    </Body>
                    <Right>
                    <Button transparent color="white" style={{}}>
                        <Text>{signUpStrings.saveInItemQuentity}</Text>
                    </Button>
                    </Right>
                </Header>
            {/* Spinner */}
            { this.state.pageLoading ? <Spinner color='blue' style={{position: 'absolute',
                backgroundColor : 'rgba(0,0,0,0.4)', height : hp('100%'),
                width : wp('100%'), zIndex:2000}} /> : null}
            <Content padder>
                <View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{width: wp('70%'), height: wp('16%'), backgroundColor: 'rgba(0,0,0,0)'}}>
                        <View style={{width : wp('62%'), height: wp('8%'),marginLeft:wp('0%') , margin : wp('4%'), backgroundColor  :'rgba(0,0,0,0)'}}>
                            <Text>{signUpStrings.quantity}</Text>
                        </View>
                    </View>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row',marginLeft:wp('-1%')}}>
                    <View style={{width: wp('20%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)'}}>
                        <View style={{width : wp('16%'), height: wp('17%'),marginLeft:wp('0%') ,marginRight:wp('0%'),marginBottom:wp('4%'),marginTop:wp('4%'),
                         backgroundColor  :'rgba(238, 236, 235, 1)' ,justifyContent:'center' ,alignItems:'center'}}>
                            <Text style={{fontSize:hp('7.5%')}}>-</Text>
                        </View>
                    </View>
                    <View style={{width: wp('60%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)'}}>
                        <View style={{width : wp('56%'), height: wp('17%'),marginLeft:wp('0%') ,marginRight:wp('0%'), margin : wp('4%'), backgroundColor  :'rgba(0,0,0,0)'
                         ,justifyContent:'center' ,alignItems:'center' , borderBottomWidth:wp('0.5%')}}>
                            <Text>7</Text>
                        </View>
                    </View>
                    <View style={{width: wp('20%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)'}}>
                        <View style={{width : wp('16%'), height: wp('17%'),marginLeft:wp('0%') , marginTop : wp('4%'),marginBottom:wp('4%'),marginRight:wp('4%'), backgroundColor  :'rgba(238, 236, 235, 1)' ,justifyContent:'center' ,alignItems:'center'}}>
                            <Text style={{fontSize:hp('5.5%')}}>+</Text>
                        </View>
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

function mapStateToProps(state){
    return{
        userData : state.data,
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getCases: (data) => getCases(data)}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ItemQuantityScreen);

