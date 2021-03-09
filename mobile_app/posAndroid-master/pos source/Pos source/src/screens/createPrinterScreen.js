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
    Button,
    Text,
    Left, Right,
    Body,
    Title,
    Toast,
    Picker,
    Card,
    CardItem,
    Spinner,Radio,Separator,Thumbnail
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


class CretePrnterScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading : true
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
                        <Icon  onPress={() => this.props.navigation.navigate('PrintersScreen')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{flex:1}}>
                        <Title>{signUpStrings.createPrinter}</Title>
                    </Body>
                    <Right>
                    <Button transparent color="white">
                    <Text>{signUpStrings.save}</Text>
                    </Button>
                        {/* <Icon active name="search" onPress={() => this.props.navigation.navigate('NewItem')}
                              style={{ color: 'white', marginRight: 15 }} /> */}
                    </Right>
                </Header>
            {/* Spinner */}
            { this.state.pageLoading ? <Spinner color='blue' style={{position: 'absolute',
                backgroundColor : 'rgba(0,0,0,0.4)', height : hp('100%'),
                width : wp('100%'), zIndex:2000}} /> : null}
            <Content>
                <Form>

                    <Card style={{marginLeft:wp('0%'), marginRight: wp('0%'),marginTop:wp('0%')}}>
                        <Content padder>

                            {/* Name */}
                            <Item floatingLabel style={{marginBottom: wp('5%')}}>
                                <Label>{signUpStrings.nameInPrinterscrn}</Label>
                                <Input onChangeText={text => {
                                    this.state.clientName = text;
                                   // this.validate();
                                }}
                                value={this.state.clientName}
                                />
                                {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                            </Item>

                            {/* Category */}
                            <Item style={{borderBottomWidth: 0, marginBottom: hp('0%')}}>
                                <Text>{signUpStrings.prnterModel}</Text>
                            </Item>

                            <Item  style={{marginBottom: wp('5%')}}>
                                <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined , marginLeft: wp('0%')}}
                                placeholder="Category"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selected2}>
                                        <Picker.Item label="No printer" value="key0" />
                                        <Picker.Item label="printer 1" value="key1" />
                                </Picker>
                            </Item>
                            <Item style={{marginTop : hp('2%'), marginBottom : hp('3%'), borderBottomWidth: 0, }}>
                            <Left>
                                <Label>{signUpStrings.prnterReceipt}</Label>
                            </Left>

                            <Right>

                                        <Switch
                                            customStyles={{
                                                activeBackgroundColor: "black",
                                                inactiveBackgroundColor: "red",
                                                activeButtonColor: "black",
                                                inactiveButtonColor: "red"
                                            }}
                                            onChangeState={this.onChangeState}/>
                            </Right>
                        </Item>
                        
                        </Content>
                        <Button full iconLeft style={{backgroundColor: 'white' ,}}>
                        <Icon name='md-print' style={{color: 'black'}} />
                        <Text style={{color: 'black'}}>{signUpStrings.prntTst}</Text>
                    </Button>
                            
                        
                    </Card>

                </Form>
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
export default connect(mapStateToProps, matchDispatchToProps)(CretePrnterScreen);

