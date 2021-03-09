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
import { Circle, Triangle, Square, Octagon, Hexagon } from 'react-native-shape';
import signUpStrings from "../localization/signUpStrings";


class ItemsMain extends React.Component {

    static navigationOptions = {
        title: `${signUpStrings.allItems}`,
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            allItems: [],
            selectedItems:[],
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

    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }


    componentWillReceiveProps(nextProps) {

        console.log("aaaaaaaaaaaaaa", this.state.allItems, "ggggggggggggggggggggggggggg")
        if (!nextProps.userData.allItems) {
            this.setState({
                ...this.state,
                isVisible: false
            });
            return;
        }
        this.state.allItems = [];
        this.state.selectedItems =[];
        Object.keys(nextProps.userData.allItems).forEach(function (key, index) {
            let obj = nextProps.userData.allItems[key];
            obj._id = key;

            //setting client details
            let itemId = obj._id;
            obj.itemDetails = nextProps.userData.allItems[itemId];
            this.state.allItems[this.state.allItems.length] = obj;
            this.state.selectedItems[this.state.selectedItems.length] = obj;
        }.bind(this));


        this.forceUpdate();
        this.state.pageLoading = false;
    }

    updateSearch = search => {
        this.setState({ search });
        //console.log("filtering dates..", this.state.allCases);
        this.state.selectedItems = [];
        if (this.state.allItems) {
            this.state.selectedItems = this.state.allItems.filter((res, index) => {
                return (res.name.toLowerCase().includes(search.toLowerCase()));
            });
        }
        this.forceUpdate();
    };

    deleteItem(data){
        console.log("Data", data);
        Alert.alert(
            signUpStrings.areYouSure,
            signUpStrings.yourAreAboutToDeleteThisItem,
            [
                {text: signUpStrings.askMeLater, onPress: () => console.log('Ask me later pressed')},
                {
                    text: signUpStrings.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: signUpStrings.delete, onPress: () => {
                    // Deleting case
                        this.setState({
                            ...this.state,
                            pageLoading : true,
                            selectedItems : []
                        });

                        let Obj = {
                            itemId : data._id,
                            deleted : true
                        }

                        axios
                            .post(AppURLS.ApiBaseUrl + 'item/itemDelete',Obj)
                            .then(response => {
                                console.log("backend auth data", response.data);
                                if(response.data.success){
                                    console.log("auth success..");
                                    this.setState({
                                        ...this.state,
                                        pageLoading : false
                                    });
                                    this.showToast(`${signUpStrings.successfullyDeleted}`,`${signUpStrings.ok}`, `${signUpStrings.success}`);
                                    this.getCases();
                                    return;
                                }else{
                                    console.log("failed to delete the item...");
                                    this.setState({
                                        ...this.state,
                                        pageLoading : false
                                    });
                                    this.showToast(signUpStrings.canNotDeleteItem,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                                    return;
                                }
                            })
                            .catch(error => {
                                console.log("failed to delete the case... Catch.." , error);
                                this.setState({
                                    ...this.state,
                                    pageLoading : false
                                });
                                this.showToast(`${signUpStrings.canNotDeleteItem}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                                return;
                            });
                }},
            ],
            {cancelable: false},
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
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
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
                        placeholder={signUpStrings.search}
                        onChangeText={this.updateSearch}
                        value={search}
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0)',borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                        inputContainerStyle={{ backgroundColor: '#e1e1e1' , width:wp('60%')}}
                        inputStyle={{fontSize : hp('2.4%')}}
                    />

                        </Body>
                    </Header>

                    :

                    <Header>
                        <Left style={{ flexDirection: 'row' }}>
                            <Icon onPress={() => this.props.navigation.navigate('ItemsMain')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                        </Left>
                        <Body style={{ flex: 1 }}>
                            <Title>{signUpStrings.allItems}</Title>
                        </Body>
                        <Right>
                            <Icon active name="search" onPress={() =>this.setState({ searchSelected:true})}
                                style={{ color: 'white', marginRight: 15 }} />
                        </Right>
                    </Header>

                }

                <Content>
                    <ScrollView>



                        {
                            this.state.selectedItems ? (
                                this.state.selectedItems.length !== 0 ? (
                                    this.state.selectedItems.map((res, index) => (
                                        <List>
                                            <ListItem thumbnail onPress={() => this.props.navigation.navigate('EditItem', {data:res})} onLongPress={()=> this.deleteItem(res)}>
                                                <Left>
                                                {res.itemDetails.image?
                                                    <Thumbnail source={{uri: res.itemDetails.image}} />
                                                    :
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: wp('17%') }}>
                                                        {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="gray" rotate={45}></Hexagon> : null}
                                                        {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="red" rotate={45}></Hexagon> : null}
                                                        {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="pink" rotate={45}></Hexagon> : null}
                                                        {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="orange" rotate={45}></Hexagon> : null}
                                                        {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="yellow" rotate={45}></Hexagon> : null}
                                                        {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="green" rotate={45}></Hexagon> : null}
                                                        {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="blue" rotate={45}></Hexagon> : null}
                                                        {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Hexagon' ? <Hexagon color="purple" rotate={45}></Hexagon> : null}

                                                        {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Octagon' ? <Octagon color="gray" ></Octagon> : null}
                                                        {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Octagon' ? <Octagon color="red" ></Octagon> : null}
                                                        {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Octagon' ? <Octagon color="pink" ></Octagon> : null}
                                                        {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Octagon' ? <Octagon color="orange" ></Octagon> : null}
                                                        {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Octagon' ? <Octagon color="yellow" ></Octagon> : null}
                                                        {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Octagon' ? <Octagon color="green" ></Octagon> : null}
                                                        {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Octagon' ? <Octagon color="blue" ></Octagon> : null}
                                                        {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Octagon' ? <Octagon color="purple" ></Octagon> : null}

                                                        {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Square' ? <Square color="gray" ></Square> : null}
                                                        {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Square' ? <Square color="red" ></Square> : null}
                                                        {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Square' ? <Square color="pink" ></Square> : null}
                                                        {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Square' ? <Square color="orange"></Square> : null}
                                                        {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Square' ? <Square color="yellow" ></Square> : null}
                                                        {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Square' ? <Square color="green" ></Square> : null}
                                                        {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Square' ? <Square color="blue" ></Square> : null}
                                                        {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Square' ? <Square color="purple"></Square> : null}

                                                        {res.itemDetails.color == 'Gray' && res.itemDetails.shape == 'Circle' ? <Circle color="gray"></Circle> : null}
                                                        {res.itemDetails.color == 'Red' && res.itemDetails.shape == 'Circle' ? <Circle color="red" ></Circle> : null}
                                                        {res.itemDetails.color == 'Pink' && res.itemDetails.shape == 'Circle' ? <Circle color="pink"></Circle> : null}
                                                        {res.itemDetails.color == 'Orange' && res.itemDetails.shape == 'Circle' ? <Circle color="orange"></Circle> : null}
                                                        {res.itemDetails.color == 'Yellow' && res.itemDetails.shape == 'Circle' ? <Circle color="yellow" ></Circle> : null}
                                                        {res.itemDetails.color == 'Green' && res.itemDetails.shape == 'Circle' ? <Circle color="green" ></Circle> : null}
                                                        {res.itemDetails.color == 'Blue' && res.itemDetails.shape == 'Circle' ? <Circle color="blue" ></Circle> : null}
                                                        {res.itemDetails.color == 'Purple' && res.itemDetails.shape == 'Circle' ? <Circle color="purple" ></Circle> : null}
                                                    </View>


                                                    }
                                                </Left>
                                                <Body>
                                                    <Text>{res.itemDetails.name ? res.itemDetails.name : ""}</Text>
                                                    <Text >{res.itemDetails ? res.itemDetails.inStock : ""} </Text>
                                                </Body>
                                                <Right>
                                                    <Text>{res.itemDetails ? res.itemDetails.price : "--"}</Text>
                                                </Right>
                                            </ListItem>

                                        </List>
                                    ))
                                ) : (

                                        <View style={{
                                            width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                            alignItems: "center"
                                        }}>
                                            <Text>{signUpStrings.noItems}</Text>
                                        </View>

                                    )
                            ) : (
                                    <View style={{
                                        width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                        alignItems: "center"
                                    }}>
                                        <Text>{signUpStrings.noItems}</Text>
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
                    onPress={() => this.props.navigation.navigate('NewItem')}>
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
export default connect(mapStateToProps, matchDispatchToProps)(ItemsMain);

