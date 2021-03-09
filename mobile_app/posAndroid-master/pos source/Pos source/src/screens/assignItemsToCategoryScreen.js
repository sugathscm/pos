import React, { Component } from 'react';
import {
    Image, ImageBackground, Platform, StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';
import { SearchBar } from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { decrement, getCases, increment, multiply } from "../redux/actions";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from "./homeScreen";
import { Body, Header, Left, Right, Title, List, Icon, CheckBox, Fab, Container, Toast, Spinner, ListItem, Thumbnail, Content , Button, Item } from "native-base";
import axios from "axios";
import * as AppURLS from "../redux/urls";
import { Circle, Triangle, Square, Octagon, Hexagon } from 'react-native-shape';
import signUpStrings from '../localization/signUpStrings';


class AssignItemsToCategoryScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            allItems: [],
            selectedItems:[],
            search: '',
            ischecked: false,
            assignedItems: [],
            checkboxValues : {}
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false

        });
        this.props.getCases(this.props.userData);
    }

    getCases() {
        this.props.getCases(this.props.userData);
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
        this.state.selectedItems = [];
        if (this.state.allItems) {
            this.state.selectedItems = this.state.allItems.filter((res, index) => {
                return (res.name.toLowerCase().includes(search.toLowerCase()));
            });
        }
        this.forceUpdate();
    };

    submitFormNavigateItems() {
        console.log("submitting form..");

        this.setState({
            ...this.state,
            pageLoading: true
        });

        let category = {
            name:this.state.name,
            colour: this.state.color,
            items:this.state.assignedItems,
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
                    this.showToast(`${signUpStrings.categoryAddedSuccessfully}`,`${signUpStrings.ok}`, `${signUpStrings.success}`);
                    this.props.navigation.navigate('AllCategories')

                } else if(response.data.message == "Category already exists"){
                    this.showToast(`${signUpStrings.categoryAlreadyExist}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                }
                
                
                else {
                    this.showToast(response.message, "Ok", "warning");
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
        const { search } = this.state;

        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity :
            TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;

        const { navigation } = this.props;
        const name = navigation.getParam('Name');
        const color = navigation.getParam('Color');
        this.state.name = name;
        this.state.color = color;

        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => this.props.navigation.navigate('ItemsMain')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Title>{signUpStrings.assignedItems}</Title>
                    </Body>
                    <Right>
                    <Button transparent color="white" onPress={() => this.submitFormNavigateItems()}>
                            <Text style={{color:'white'}}>{signUpStrings.save}</Text>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View>
                    <SearchBar
                        searchIcon={{ size: hp('3%') }}
                        placeholder="Search"
                        onChangeText={this.updateSearch}
                        value={search}
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0)',borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                        inputContainerStyle={{ backgroundColor: '#e1e1e1' , width:wp('95%')}}
                        inputStyle={{fontSize : hp('2.4%')}}
                    />
                    </View>

                    <ScrollView>
                        {
                            this.state.selectedItems ? (
                                this.state.selectedItems.length !== 0 ? (
                                    this.state.selectedItems.map((res, index) => {
                                        const uniqueKey = res.itemDetails.name + index; 
                                        return(
                                        <List key={index}>
                                            <ListItem thumbnail>
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
                                                        <CheckBox 
                                                            color="green"
                                                            style={{ marginRight: 20, }}
                                                            checked={this.state.checkboxValues[uniqueKey]}
                                    
                                                            onPress={() => {
                                                                // assign a new checked state based on the unique id. You'll also need to do some error/undefined checking here.
                                                                const newCheckboxValues = this.state.checkboxValues;
                                                                newCheckboxValues[uniqueKey] = !newCheckboxValues[uniqueKey]
                                                                
                                                                this.setState({
                                                                    ...this.state,
                                                                    checkboxValues: newCheckboxValues
                                                                }, () => {

                                                                    if(this.state.assignedItems.find(disc => disc.itemName == res.itemDetails.name)){
                                                                        console.log("aaaaaaaaaaaaaaaaaaaa")
                                                                        let itemObj = this.state.assignedItems.find(disc => disc.itemName == res.itemDetails.name)
                                                                        console.log("ssssssss" , itemObj)
                                                                        let updatedArr = this.state.assignedItems.filter(function(item) {
                                                                            return item.itemName != itemObj.itemName
                                                                        });

                                                                        console.log("Updated Array" , updatedArr);
                                                                        this.state.assignedItems = updatedArr;

                                                                        console.log("New Array" , this.state.assignedItems)

                                                                    }else{
                                                                        console.log("bbbbbbbbbbbbbbbbbbbbbbbb")
                                                                        let obj = {
                                                                            itemId: res.itemDetails._id,
                                                                            itemName: res.itemDetails.name,
                                                                            price: res.itemDetails.price,
                                                                            color: res.itemDetails.color,
                                                                            shape: res.itemDetails.shape
                                                                        }
                                                                        this.state.assignedItems.push(obj)

                                                                    }
                                                                });
                                                                
                                                                console.log("Array" , this.state.assignedItems)
                                                            }}
                                                            key={res.itemDetails._id}
                                                             />
                                                </Right>
                                            </ListItem>

                                        </List>
                                        )
                                                        })
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
export default connect(mapStateToProps, matchDispatchToProps)(AssignItemsToCategoryScreen);

