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
    Picker,
    Card,
    CardItem,
    Spinner, Radio, Separator, Thumbnail
} from "native-base";
import {
    Image, ImageBackground, Platform, StyleSheet, View, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert, Switch
} from 'react-native';
import { SearchBar } from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { decrement, getCases, increment, multiply } from "../redux/actions";
import { bindActionCreators } from 'redux';
import ModalSelector from 'react-native-modal-selector';
import { connect } from 'react-redux';
import moment from "./homeScreen";
import { Circle, Triangle, Square, Octagon, Hexagon } from 'react-native-shape';
import axios from "axios";
import * as AppURLS from "../redux/urls";
import ImagePicker from 'react-native-image-picker';
import signUpStrings from '../localization/signUpStrings';
import validator from "../util/validatorRegularExpressions";

const soldBy = [
    { label: 'Each', value: 'Each' },
    { label: 'Weight', value: 'Weight' },
    { label: 'Volumn', value :'Volume (In liters)'}
];

const colorOrShape = [
    { label: 'Color and Shape', value: 'Color and Shape' },
    { label: 'Image', value: 'Image' },
];


class EditItem extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            selectedCategoriesToDisplay: [],
            selectedCategory: "",
            selectedCategoryId: "",
            checkGray: false,
            checkRed: false,
            checkPink: false,
            checkOrange: false,
            checkYellow: false,
            checkGreen: false,
            checkBlue: false,
            checkpurple: false,
            checkOctagon: false,
            checkCircle: false,
            checkSquare: false,
            checkHexagon: false,
            strGray: "",
            strRed: "",
            strPink: "",
            strOrange: "",
            strYellow: "",
            strGreen: "",
            strBlue: "",
            strPurple: "",
            strHexagon: "",
            strOctagon: "",
            strSquare: "",
            strCircle: "",
            representation: "Color and Shape",
            name: "",
            category: "",
            soldBy: "",
            price: "",
            cost: "",
            sku: "",
            barcode: "",
            inStock: "",
            checkStock: false,
            categoryId: "",

            photo: null
        };
    }

    options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false,
            name: this.state.data.name,
            soldBy: this.state.data.soldBy,
            price: this.state.data.price,
            cost: this.state.data.cost,
            sku: this.state.data.sku,
            barcode: this.state.data.barcode,
            inStock: JSON.stringify(this.state.data.inStock),
            selectedCategory: this.state.data.category ? this.state.data.category : "",
            selectedCategoryId: this.state.data.categoryId ? this.state.data.categoryId : "",
            checkStock: this.state.data.inStock ? true : false,
            photo: this.state.Photo ? this.state.Photo : this.state.photo

        }, () => {
            //this.state.photo.uri = this.state.data.image ? this.state.data.image : ""
        });
        //this.state.data.inStock ? this.state.checkStock == true : this.state.checkStock == false
        console.log("dataaaaa", this.state.Photo)
        //Shape 
        if(this.state.data.shape && this.state.data.shape == "Square"){
            this.setState({
                checkSquare:true,
                strSquare:"strSquare"
            })
        }else if(this.state.data.shape && this.state.data.shape == "Circle"){
            this.setState({
                checkCircle:true,
                strCircle:"Circle"
            })

        }else if(this.state.data.shape && this.state.data.shape == "Octagon"){
            this.setState({
                checkOctagon:true,
                strOctagon:"Octagon"
            })

        }else if(this.state.data.shape && this.state.data.shape == "Hexagon"){
            this.setState({
                checkHexagon:true,
                strSquare:"Hexagon"
            })
        }

        //color
        if(this.state.data.color && this.state.data.color == "Gray"){
            this.setState({
                checkGray:true,
                strGray:"Gray"      
            })
        }else if(this.state.data.color && this.state.data.color == "Pink"){
            this.setState({
                checkPink:true,
                strPink:"Pink"      
            })
        }else if(this.state.data.color && this.state.data.color == "Red"){
            this.setState({
                checkRed:true,
                strRed:"Red"      
            })
        }else if(this.state.data.color && this.state.data.color == "Orange"){
            this.setState({
                checkOrange:true,
                strOrange:"Orange"      
            })
        }else if(this.state.data.color && this.state.data.color == "Yellow"){
            this.setState({
                checkYellow:true,
                strYellow:"Yellow"      
            })
        }else if(this.state.data.color && this.state.data.color == "Green"){
            this.setState({
                checkGreen:true,
                strGreen:"Green"      
            })
        }else if(this.state.data.color && this.state.data.color == "Blue"){
            this.setState({
                checkBlue:true,
                strBlue:"Blue"      
            })
        }else if(this.state.data.color && this.state.data.color == "Purple"){
            this.setState({
                checkpurple:true,
                strPurple:"Purple"      
            })
        }
        this.props.getCases(this.props.userData);
    }

    componentWillReceiveProps(nextProps) {

        this.state.selectedCategoriesToDisplay = [];

        Object.keys(nextProps.userData.allCategories).forEach(function (key, index) {

            let categoryPopUpObj = {};
            categoryPopUpObj.label = nextProps.userData.allCategories[key].name;
            categoryPopUpObj.key = nextProps.userData.allCategories[key]._id;

            let objAvailable = false;
            for (let i = 0; i < this.state.selectedCategoriesToDisplay.length; i++) {
                if (this.state.selectedCategoriesToDisplay[i].key === categoryPopUpObj.key) {
                    objAvailable = true;
                    break;
                }
            }
            if (!objAvailable) {
                this.state.selectedCategoriesToDisplay.push(categoryPopUpObj);
            }
        }.bind(this));
        if (this.state.selectedCategoriesToDisplay.length == 0) {
            this.showToast(`${signUpStrings.noItemsPlzAdd}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
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

    validate() {
        console.log("validating form..");
        // Name

        this.forceUpdate();
    }

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.setState({ photo: response })
            }
        })
        console.log("Photo Obj", this.state.photo)
    };

    handleUploadPhoto = () => {
        this.setState({
            ...this.state,
            pageLoading: true
        });
        fetch(AppURLS.ApiBaseUrl + 'image/upload', {
            method: "POST",
            body: this.createFormData(this.state.photo, { userId: "123" })
        })
            .then(response => response.json())
            .then(response => {
                this.state.pageLoading = false;
                console.log("upload succes", response);
                this.showToast(`${signUpStrings.itemUpdatedSuccessfully}`, `${singUpStrings.ok}`, `${signUpStrings.success}`);
                this.setState({ photo: null });
            })
            .catch(error => {
                console.log("upload error", error);
                this.showToast(`${signUpStrings.error}`, `${singUpStrings.ok}`, `${singUpStrings.warning}`);
                this.setState({
                    ...this.state,
                    pageLoading: false
                });
            });
    };

    createFormData = (photo, body) => {
        const data = new FormData();

        data.append("photo", {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });

        return data;
    };


    submitForm() {
        console.log("submitting form..");

        this.setState({
            ...this.state,
            pageLoading: true
        });

        let isPriceNum = validator.currencyValidator.test(this.state.price);
        if(!isPriceNum){
            this.showToast(`${signUpStrings.pleaseEnterValidDetails}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
            this.setState({
                ...this.state,
                pageLoading: false
            });
            return;
        }

        let isCostNum = validator.currencyValidator.test(this.state.cost);
        if(!isCostNum){
            this.showToast(`${signUpStrings.pleaseEnterValidDetails}`, `${signUpStrings.ok}`, `${signUpStrings.warning}`);
            this.setState({
                ...this.state,
                pageLoading: false
            });
            return;
        }

        let itemType = "";
        if(this.state.price !== "" && this.state.soldBy === "Each"){
            itemType= "Type1"

        }else if(this.state.price === "" && this.state.soldBy === "Each"){
            itemType= "Type2"
            
        }else if(this.state.price !== "" && this.state.soldBy !== "Each"){
            itemType= "Type3"
            
        }else if(this.state.price === "" && this.state.soldBy !== "Each"){
            itemType= "Type4"
            
        }else {
            itemType= "Type5"
        }

        let item = {
            itemId: this.state.data._id,
            name: this.state.name,
            category: this.state.selectedCategory,
            categoryId: this.state.selectedCategoryId,
            soldBy: this.state.soldBy,
            price: this.state.price,
            cost: this.state.cost,
            sku: this.state.sku,
            type: itemType,
            barcode: this.state.barcodeEdit ? this.state.barcodeEdit : this.state.barcode,
            inStock: parseInt(this.state.inStock),
            color: this.state.strGray +
                this.state.strRed +
                this.state.strPink +
                this.state.strOrange +
                this.state.strYellow +
                this.state.strGreen +
                this.state.strBlue +
                this.state.strPurple != "" ? this.state.strGray +
                this.state.strRed +
                this.state.strPink +
                this.state.strOrange +
                this.state.strYellow +
                this.state.strGreen +
                this.state.strBlue +
                this.state.strPurple : this.state.data.color,
            shape: this.state.strHexagon +
                this.state.strOctagon +
                this.state.strSquare +
                this.state.strCircle != "" ? this.state.strHexagon +
                this.state.strOctagon +
                this.state.strSquare +
                this.state.strCircle : this.state.data.shape,
            companyId: this.props.userData.userData.companyId
        }
        if (this.state.photo != null) {

            fetch(AppURLS.ApiBaseUrl + 'image/upload', {
                method: "POST",
                body: this.createFormData(this.state.photo, { userId: "123" })
            })
                .then(response => response.json())
                .then(response => {
                    this.state.pageLoading = false;
                    console.log("upload succes", response);
                    item.image = "https://posandroid.herokuapp.com/" + response.document[0].path;
                    axios
                        .post(AppURLS.ApiBaseUrl + 'item/editItem', item)
                        .then(response => {
                            console.log("backend data", response);

                            if (response.data.success) {
                                this.state.pageLoading = false;
                                this.forceUpdate();
                                this.showToast(`${signUpStrings.itemUpdatedSuccessfully}`,`${signUpStrings.ok}`, `${signUpStrings.success}`);
                                this.props.navigation.navigate('AllItems')

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
                            this.showToast(`${signUpStrings.pleaseFillAll}` `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                            this.setState({
                                ...this.state,
                                pageLoading: false
                            });


                        });
                    this.setState({ photo: null });
                })
                .catch(error => {
                    console.log("upload error", error);
                    this.showToast(`${signUpStrings.error}`,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                });

        } else if (this.state.photo == null && this.state.data.image != "") {

            item.image = this.state.data.image;
            axios
                .post(AppURLS.ApiBaseUrl + 'item/editItem', item)
                .then(response => {
                    console.log("backend data", response);

                    if (response.data.success) {
                        this.state.pageLoading = false;
                        this.forceUpdate();
                        this.showToast(`${signUpStrings.itemUpdatedSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                        this.props.navigation.navigate('AllItems')

                    } else {
                        this.showToast(`${signUpStrings.invalidDetails}`,  `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                        this.setState({
                            ...this.state,
                            pageLoading: false
                        });
                    }
                })
                .catch(error => {
                    console.log("error", error);
                    this.showToast(`${signUpStrings.pleaseFillAll}` ,`${signUpStrings.ok}`, `${signUpStrings.warning}`);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });


                });
        } else {
            axios
                .post(AppURLS.ApiBaseUrl + 'item/editItem', item)
                .then(response => {
                    console.log("backend data", response);

                    if (response.data.success) {
                        this.state.pageLoading = false;
                        this.forceUpdate();
                        this.showToast(`${signUpStrings.itemUpdatedSuccessfully}`, `${signUpStrings.ok}`, `${signUpStrings.success}`);
                        this.props.navigation.navigate('AllItems')

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
                    this.showToast(`${signUpStrings.pleaseFillAll}` `${signUpStrings.ok}`, `${signUpStrings.warning}`);
                    this.setState({
                        ...this.state,
                        pageLoading: false
                    });
                });

        }

    }

    render() {
        const { navigation } = this.props;
        const data = navigation.getParam('data');
        const photo = navigation.getParam('photo');
        const barcodeEdit = navigation.getParam('barcodeEdit');
        this.state.data = data;
        this.state.barcodeEdit = barcodeEdit;
        this.state.Photo = photo;

        let TouchablePlatformSpecific = Platform.OS === 'ios' ?
            TouchableOpacity : TouchableNativeFeedback;

        let touchableStyle = Platform.OS === 'ios' ?
            styles.iosTouchable :
            styles.androidTouchable;

        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => this.props.navigation.navigate('AllItems')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Title>{signUpStrings.EditItem}</Title>
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

                        <Card style={{ marginLeft: wp('0%'), marginRight: wp('0%'), marginTop: hp('0%') }}>
                            <Content padder>

                                {/* Name */}
                                <Item floatingLabel style={{ marginBottom: wp('5%') }}>
                                    <Label>{signUpStrings.name}</Label>
                                    <Input onChangeText={text => {
                                        this.state.name = text;
                                        this.forceUpdate()
                                    }}
                                        value={this.state.data.name ? this.state.name : ""}
                                    />
                                    {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                                </Item>

                                {/* Category */}
                                <Item style={{ borderBottomWidth: 0, marginBottom: hp('0%') }}>
                                    <Text>{signUpStrings.category}</Text>
                                </Item>

                                <Item style={{ marginBottom: wp('5%') }}>
                                    <ModalSelector
                                        style={{ width: wp('85%') }}
                                        data={this.state.selectedCategoriesToDisplay}
                                        supportedOrientations={['landscape']}
                                        accessible={true}
                                        scrollViewAccessibilityLabel={'Scrollable options'}
                                        cancelButtonAccessibilityLabel={'Cancel Button'}
                                        onChange={(option) => {
                                            console.log("aaaaaaaaaaaaaaa", option.key)

                                            this.setState({
                                                ...this.state,
                                                selectedCategory: option.label,
                                                selectedCategoryId: option.key
                                            })
                                        }}>

                                        <Input
                                            style={{ padding: 0, height: hp('8%') }}
                                            editable={false}
                                            placeholder="Category"
                                            value={this.state.selectedCategory} />

                                    </ModalSelector>
                                </Item>

                                <Item style={{ borderBottomWidth: 0, marginBottom: hp('1%') }}>
                                    <Label padder>{signUpStrings.soldBy}</Label>
                                </Item>

                                {
                                    soldBy.map((data, key) => {
                                        return (
                                            <ListItem key={key} noBorder>

                                                <Left>
                                                    <Radio
                                                        color={'blue'}
                                                        selectedColor={"blue"}
                                                        onPress={() => this.setState({ soldBy: data.value })}
                                                        selected={data.value === this.state.soldBy}
                                                    />

                                                    <Text style={{ marginLeft: wp('4%') }}>{data.label}</Text>
                                                </Left>
                                            </ListItem>
                                        )
                                    })
                                }

                                {/* Price */}
                                <Item floatingLabel
                                >
                                    <Label>{signUpStrings.price}</Label>
                                    <Input onChangeText={text => {
                                        let priceText = parseFloat(text).toFixed(2);
                                        this.setState({
                                            price: text == "" ? "" : priceText
                                        })
                                        this.validate();
                                    }}
                                        value={this.state.data.price ? this.state.price : ""}
                                        keyboardType="phone-pad"
                                    />
                                    {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                                </Item>

                                <Item style={{ borderBottomWidth: 0, fontSize: 8, color: '#DCDCDC' }}>
                                    <Text>{signUpStrings.leaveTheFieldBlank}</Text>
                                </Item>

                                {/* Cost */}
                                <Item floatingLabel
                                >
                                    <Label>{signUpStrings.cost}</Label>
                                    <Input onChangeText={text => {
                                        this.state.cost = text;
                                        this.validate();
                                    }}
                                        value={this.state.data.cost ? this.state.cost : ""}
                                        keyboardType="phone-pad"
                                    />
                                    {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                                </Item>

                                {/* SKU */}
                                <Item floatingLabel
                                >
                                    <Label>{signUpStrings.sku}</Label>
                                    <Input onChangeText={text => {
                                        this.state.sku = text;
                                        this.validate();
                                    }}
                                        value={this.state.data.sku ? this.state.sku : ""}

                                    />
                                    {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}
                                </Item>
                                <Button style={{ marginBottom: wp('5%'), marginTop: wp('10%') }} onPress={() => {
                                    this.props.navigation.navigate('BarcodeEditScreen', { data: this.state.data , photo:this.state.photo })
                                }}>
                                    <Text>{signUpStrings.scanBarCode}</Text>
                                </Button>

                                {/* Barcode */}
                                <Item floatingLabel style={{ marginBottom: wp('3%') }}>
                                    <Label>{signUpStrings.barcode}</Label>
                                    <Input onChangeText={text => {
                                        this.state.barcode = text;
                                        this.validate();
                                    }}
                                        value={this.state.barcodeEdit ? this.state.barcodeEdit : this.state.barcode}
                                    />
                                    {/* <Icon name={this.showValidityIcon(this.state.clientNameValid)} /> */}

                                </Item>
                            </Content>
                        </Card>


                        <Separator style={{ width: wp('100%'), height: wp('2%'), backgroundColor: 'white', margin: 0, padding: 0 }}></Separator>

                        <Card style={{ height: hp('25%') }}>
                            <Content padder>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ marginTop: hp('2%'), color: 'blue' }}>{signUpStrings.Inventory}</Text>
                                </Item>

                                {/*  Inventory */}
                                <Item style={{ marginTop: hp('2%'), marginBottom: hp('3%'), borderBottomWidth: 0, }}>
                                    <Left>
                                        <Label>{signUpStrings.trackStock}</Label>
                                    </Left>
                                    <Right>
                                        <Switch
                                            onValueChange={() =>
                                                this.setState({
                                                    ...this.state,
                                                    checkStock: !this.state.checkStock
                                                })}
                                            value={this.state.checkStock}
                                        />
                                    </Right>
                                </Item>
                                {this.state.checkStock ?
                                    <Item floatingLabel style={{ marginBottom: wp('3%') }}>
                                        <Label>{signUpStrings.inStock}</Label>
                                        <Input onChangeText={text => {
                                            this.state.inStock = text;
                                            this.validate();
                                        }}
                                            value={this.state.data.inStock ? this.state.inStock : ""}
                                            keyboardType="phone-pad"
                                        />
                                    </Item>
                                    : null}
                            </Content>
                        </Card>

                        <Separator style={{ width: wp('100%'), height: wp('2%'), backgroundColor: 'white', margin: 0, padding: 0 }}></Separator>

                        <Card style={{ marginBottom: wp('10%'), height: hp('70%') }}>
                            <Content padder>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <ListItem style={{ marginLeft: wp('0%'), borderBottomWidth: 0 }}>
                                        <Text style={{ color: 'blue' }}>{signUpStrings.representationOnPos}</Text>
                                    </ListItem>
                                </Item>

                                {
                                    colorOrShape.map((data, key) => {
                                        return (
                                            <ListItem key={key} noBorder>

                                                <Left>
                                                    <Radio
                                                        color={'blue'}
                                                        selectedColor={"blue"}
                                                        onPress={() => this.setState({ representation: data.value })}
                                                        selected={data.value === this.state.representation}
                                                    />

                                                    <Text style={{ marginLeft: wp('4%') }}>{data.label}</Text>
                                                </Left>
                                            </ListItem>
                                        )
                                    })
                                }

                                {this.state.representation == "Color and Shape" ?
                                    <View>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                <TouchablePlatformSpecific
                                                    onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkGray: !this.state.checkGray,
                                                            checkRed: false,
                                                            checkPink: false,
                                                            checkOrange: false,
                                                            checkYellow: false,
                                                            checkGreen: false,
                                                            checkBlue: false,
                                                            checkpurple: false
                                                        });
                                                        if (!this.state.checkGray) {
                                                            this.setState({
                                                                strGray: "Gray",
                                                                strRed: "",
                                                                strPink: "",
                                                                strOrange: "",
                                                                strYellow: "",
                                                                strGreen: "",
                                                                strBlue: "",
                                                                strPurple: ""
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strGray: ""
                                                            })
                                                        }
                                                    }}>
                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "gray", justifyContent: 'center', alignItems: 'center' }}>
                                                        {this.state.checkGray ?
                                                            <Icon name='md-checkmark' style={{ fontSize: hp('6%'), color: 'white' }} />
                                                            : null}
                                                    </View>
                                                </TouchablePlatformSpecific>
                                            </View>
                                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                <TouchablePlatformSpecific
                                                    onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkPink: !this.state.checkPink,
                                                            checkGray: false,
                                                            checkRed: false,
                                                            checkOrange: false,
                                                            checkYellow: false,
                                                            checkGreen: false,
                                                            checkBlue: false,
                                                            checkpurple: false
                                                        });
                                                        if (!this.state.checkPink) {
                                                            this.setState({
                                                                strPink: "Pink",
                                                                strGray: "",
                                                                strRed: "",
                                                                strOrange: "",
                                                                strYellow: "",
                                                                strGreen: "",
                                                                strBlue: "",
                                                                strPurple: ""
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strPink: ""
                                                            })
                                                        }
                                                    }}>
                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "pink", justifyContent: 'center', alignItems: 'center' }}>
                                                        {this.state.checkPink ?
                                                            <Icon name='md-checkmark' style={{ fontSize: hp('6%'), color: 'white' }} />
                                                            : null}
                                                    </View>
                                                </TouchablePlatformSpecific>
                                            </View>
                                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                <TouchablePlatformSpecific
                                                    onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkRed: !this.state.checkRed,
                                                            checkGray: false,
                                                            checkPink: false,
                                                            checkOrange: false,
                                                            checkYellow: false,
                                                            checkGreen: false,
                                                            checkBlue: false,
                                                            checkpurple: false
                                                        });
                                                        if (!this.state.checkRed) {
                                                            this.setState({
                                                                strRed: "Red",
                                                                strGray: "",
                                                                strPink: "",
                                                                strOrange: "",
                                                                strYellow: "",
                                                                strGreen: "",
                                                                strBlue: "",
                                                                strPurple: ""
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strRed: ""
                                                            })
                                                        }
                                                    }}>
                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "red", justifyContent: 'center', alignItems: 'center' }}>
                                                        {this.state.checkRed ?
                                                            <Icon name='md-checkmark' style={{ fontSize: hp('6%'), color: 'white' }} />
                                                            : null}
                                                    </View>
                                                </TouchablePlatformSpecific>
                                            </View>
                                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                <TouchablePlatformSpecific
                                                    onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkOrange: !this.state.checkOrange,
                                                            checkGray: false,
                                                            checkRed: false,
                                                            checkPink: false,
                                                            checkYellow: false,
                                                            checkGreen: false,
                                                            checkBlue: false,
                                                            checkpurple: false
                                                        });
                                                        if (!this.state.checkOrange) {
                                                            this.setState({
                                                                strOrange: "Orange",
                                                                strGray: "",
                                                                strRed: "",
                                                                strPink: "",
                                                                strYellow: "",
                                                                strGreen: "",
                                                                strBlue: "",
                                                                strPurple: ""
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strOrange: ""
                                                            })
                                                        }
                                                    }}>
                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "orange", justifyContent: 'center', alignItems: 'center' }}>
                                                        {this.state.checkOrange ?
                                                            <Icon name='md-checkmark' style={{ fontSize: hp('6%'), color: 'white' }} />
                                                            : null}
                                                    </View>
                                                </TouchablePlatformSpecific>
                                            </View>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                <TouchablePlatformSpecific
                                                    onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkYellow: !this.state.checkYellow,
                                                            checkGray: false,
                                                            checkRed: false,
                                                            checkPink: false,
                                                            checkOrange: false,
                                                            checkGreen: false,
                                                            checkBlue: false,
                                                            checkpurple: false
                                                        });
                                                        if (!this.state.checkYellow) {
                                                            this.setState({
                                                                strYellow: "Yellow",
                                                                strGray: "",
                                                                strRed: "",
                                                                strPink: "",
                                                                strOrange: "",
                                                                strGreen: "",
                                                                strBlue: "",
                                                                strPurple: ""
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strYellow: ""
                                                            })
                                                        }
                                                    }}>
                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "yellow", justifyContent: 'center', alignItems: 'center' }}>
                                                        {this.state.checkYellow ?
                                                            <Icon name='md-checkmark' style={{ fontSize: hp('6%'), color: 'white' }} />
                                                            : null}
                                                    </View>
                                                </TouchablePlatformSpecific>
                                            </View>
                                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                <TouchablePlatformSpecific
                                                    onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkGreen: !this.state.checkGreen,
                                                            checkGray: false,
                                                            checkRed: false,
                                                            checkPink: false,
                                                            checkOrange: false,
                                                            checkYellow: false,
                                                            checkBlue: false,
                                                            checkpurple: false
                                                        });
                                                        if (!this.state.checkGreen) {
                                                            this.setState({
                                                                strGreen: "Green",
                                                                strGray: "",
                                                                strRed: "",
                                                                strPink: "",
                                                                strOrange: "",
                                                                strYellow: "",
                                                                strBlue: "",
                                                                strPurple: ""
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strGreen: ""
                                                            })
                                                        }
                                                    }}>
                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "green", justifyContent: 'center', alignItems: 'center' }}>
                                                        {this.state.checkGreen ?
                                                            <Icon name='md-checkmark' style={{ fontSize: hp('6%'), color: 'white' }} />
                                                            : null}
                                                    </View>
                                                </TouchablePlatformSpecific>
                                            </View>
                                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                <TouchablePlatformSpecific
                                                    onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkBlue: !this.state.checkBlue,
                                                            checkGray: false,
                                                            checkRed: false,
                                                            checkPink: false,
                                                            checkOrange: false,
                                                            checkYellow: false,
                                                            checkGreen: false,
                                                            checkpurple: false
                                                        });
                                                        if (!this.state.checkBlue) {
                                                            this.setState({
                                                                strBlue: "Blue",
                                                                strGray: "",
                                                                strRed: "",
                                                                strPink: "",
                                                                strOrange: "",
                                                                strYellow: "",
                                                                strGreen: "",
                                                                strPurple: ""
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strBlue: ""
                                                            })
                                                        }
                                                    }}>
                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "blue", justifyContent: 'center', alignItems: 'center' }}>
                                                        {this.state.checkBlue ?
                                                            <Icon name='md-checkmark' style={{ fontSize: hp('6%'), color: 'white' }} />
                                                            : null}
                                                    </View>
                                                </TouchablePlatformSpecific>
                                            </View>
                                            <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                <TouchablePlatformSpecific
                                                    onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkpurple: !this.state.checkpurple,
                                                            checkGray: false,
                                                            checkRed: false,
                                                            checkPink: false,
                                                            checkOrange: false,
                                                            checkYellow: false,
                                                            checkGreen: false,
                                                            checkBlue: false,
                                                        });
                                                        if (!this.state.checkpurple) {
                                                            this.setState({
                                                                strPurple: "Purple",
                                                                strGray: "",
                                                                strRed: "",
                                                                strPink: "",
                                                                strOrange: "",
                                                                strYellow: "",
                                                                strGreen: "",
                                                                strBlue: "",
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strPurple: ""
                                                            })
                                                        }
                                                    }}>
                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: "purple", justifyContent: 'center', alignItems: 'center' }}>
                                                        {this.state.checkpurple ?
                                                            <Icon name='md-checkmark' style={{ fontSize: hp('6%'), color: 'white' }} />
                                                            : null}
                                                    </View>
                                                </TouchablePlatformSpecific>
                                            </View>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            {this.state.checkHexagon ? <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                                <TouchablePlatformSpecific onPress={() => {
                                                    this.setState({
                                                        ...this.state,
                                                        checkHexagon: !this.state.checkHexagon,
                                                        checkOctagon: false,
                                                        checkCircle: false,
                                                        checkSquare: false,

                                                    });
                                                    if (!this.state.checkHexagon) {
                                                        this.setState({
                                                            strHexagon: "Hexagon",
                                                            strOctagon: "",
                                                            strCircle: "",
                                                            strSquare: "",
                                                        })
                                                    } else {
                                                        this.setState({
                                                            strHexagon: ""
                                                        })
                                                    }
                                                    console.log(this.state.strHexagon)
                                                }}>

                                                    <View style={{
                                                        width: wp('17%'), height: wp('17%'), margin: wp('4%'),
                                                        backgroundColor: 'gray', justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>

                                                        <Hexagon color="black" rotate={45}>
                                                        </Hexagon>
                                                    </View>

                                                </TouchablePlatformSpecific>

                                            </View> : <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                                    <TouchablePlatformSpecific onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkHexagon: !this.state.checkHexagon,
                                                            checkOctagon: false,
                                                            checkCircle: false,
                                                            checkSquare: false,

                                                        });
                                                        if (!this.state.checkHexagon) {
                                                            this.setState({
                                                                strHexagon: "Hexagon",
                                                                strOctagon: "",
                                                                strCircle: "",
                                                                strSquare: "",
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strHexagon: ""
                                                            })
                                                        }
                                                        console.log(this.state.strHexagon)
                                                    }}>

                                                        <View style={{
                                                            width: wp('17%'), height: wp('17%'), margin: wp('4%'),
                                                            backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>

                                                            <Hexagon color="black" rotate={45}>
                                                            </Hexagon>
                                                        </View>

                                                    </TouchablePlatformSpecific>

                                                </View>
                                            }

                                            {this.state.checkOctagon ? <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                                <TouchablePlatformSpecific onPress={() => {
                                                    this.setState({
                                                        ...this.state,
                                                        checkOctagon: !this.state.Octagon,
                                                        checkHexagon: false,
                                                        checkCircle: false,
                                                        checkSquare: false,

                                                    });
                                                    if (!this.state.checkOctagon) {
                                                        this.setState({
                                                            strHexagon: "",
                                                            strOctagon: "Octagon",
                                                            strCircle: "",
                                                            strSquare: "",
                                                        })
                                                    } else {
                                                        this.setState({
                                                            strOctagon: ""
                                                        })
                                                    }
                                                    console.log(this.state.strOctagon)
                                                }}>

                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>

                                                        <Octagon color="black" rotate={45}>
                                                        </Octagon>
                                                    </View>

                                                </TouchablePlatformSpecific>
                                            </View> : <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                                    <TouchablePlatformSpecific onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkOctagon: !this.state.Octagon,
                                                            checkHexagon: false,
                                                            checkCircle: false,
                                                            checkSquare: false,

                                                        });
                                                        if (!this.state.checkOctagon) {
                                                            this.setState({
                                                                strHexagon: "",
                                                                strOctagon: "Octagon",
                                                                strCircle: "",
                                                                strSquare: "",
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strOctagon: ""
                                                            })
                                                        }
                                                        console.log(this.state.strOctagon)
                                                    }}>

                                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <Thumbnail square source={require('../assets/img/hollowsquare.png')} /> */}

                                                            <Octagon color="black" rotate={45}>
                                                            </Octagon>
                                                        </View>

                                                    </TouchablePlatformSpecific>
                                                </View>}


                                            {this.state.checkCircle ? <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                                <TouchablePlatformSpecific onPress={() => {
                                                    this.setState({
                                                        ...this.state,
                                                        checkHexagon: false,
                                                        checkOctagon: false,
                                                        checkCircle: !this.state.checkCircle,
                                                        checkSquare: false,

                                                    });
                                                    if (!this.state.checkCircle) {
                                                        this.setState({
                                                            strHexagon: "",
                                                            strOctagon: "",
                                                            strCircle: "Circle",
                                                            strSquare: "",
                                                        })
                                                    } else {
                                                        this.setState({
                                                            strCircle: ""
                                                        })
                                                    }
                                                    console.log(this.state.strCircle)
                                                }}>

                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                                                        {/* <Thumbnail square source={require('../assets/img/hollowsquare.png')} /> */}

                                                        <Circle color="black" rotate={45}>
                                                        </Circle>
                                                    </View>

                                                </TouchablePlatformSpecific>
                                            </View> : <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                                    <TouchablePlatformSpecific onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkHexagon: false,
                                                            checkOctagon: false,
                                                            checkCircle: !this.state.checkCircle,
                                                            checkSquare: false,

                                                        });
                                                        if (!this.state.checkCircle) {
                                                            this.setState({
                                                                strHexagon: "",
                                                                strOctagon: "",
                                                                strCircle: "Circle",
                                                                strSquare: "",
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strCircle: ""
                                                            })
                                                        }
                                                        console.log(this.state.strCircle)
                                                    }}>

                                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <Thumbnail square source={require('../assets/img/hollowsquare.png')} /> */}

                                                            <Circle color="black" rotate={45}>
                                                            </Circle>
                                                        </View>

                                                    </TouchablePlatformSpecific>
                                                </View>}

                                            {this.state.checkSquare ? <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                                <TouchablePlatformSpecific onPress={() => {
                                                    this.setState({
                                                        ...this.state,
                                                        checkOctagon: false,
                                                        checkHexagon: false,
                                                        checkCircle: false,
                                                        checkSquare: !this.state.checkSquare,

                                                    });
                                                    if (!this.state.checkSquare) {
                                                        this.setState({
                                                            strHexagon: "",
                                                            strOctagon: "",
                                                            strCircle: "",
                                                            strSquare: "Square",
                                                        })
                                                    } else {
                                                        this.setState({
                                                            strSquare: ""
                                                        })
                                                    }
                                                    console.log(this.state.strSquare)
                                                }}>

                                                    <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                                                        {/* <Thumbnail square source={require('../assets/img/hollowsquare.png')} /> */}

                                                        <Square color="black" rotate={45}>
                                                        </Square>
                                                    </View>

                                                </TouchablePlatformSpecific>
                                            </View> : <View style={{ width: wp('25%'), height: wp('25%'), backgroundColor: 'rgba(0,0,0,0)' }}>

                                                    <TouchablePlatformSpecific onPress={() => {
                                                        this.setState({
                                                            ...this.state,
                                                            checkOctagon: false,
                                                            checkHexagon: false,
                                                            checkCircle: false,
                                                            checkSquare: !this.state.checkSquare,

                                                        });
                                                        if (!this.state.checkSquare) {
                                                            this.setState({
                                                                strHexagon: "",
                                                                strOctagon: "",
                                                                strCircle: "",
                                                                strSquare: "Square",
                                                            })
                                                        } else {
                                                            this.setState({
                                                                strSquare: ""
                                                            })
                                                        }
                                                        console.log(this.state.strSquare)
                                                    }}>

                                                        <View style={{ width: wp('17%'), height: wp('17%'), margin: wp('4%'), backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <Thumbnail square source={require('../assets/img/hollowsquare.png')} /> */}

                                                            <Square color="black" rotate={45}>
                                                            </Square>
                                                        </View>

                                                    </TouchablePlatformSpecific>
                                                </View>}

                                        </View>

                                    </View> :
                                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: wp('10%') }}>
                                        <View style={{ width: wp('40%'), marginLeft: wp('5%') }}>
                                            {this.state.photo
                                                ?
                                                this.state.photo && (
                                                    <Image
                                                        source={{ uri: this.state.photo.uri }}
                                                        style={{ width: wp('30%'), height: wp('30%') }}
                                                    />
                                                )
                                                : [
                                                    (
                                                      this.state.data.image != "" && this.state.data.image != undefined
                                                            ?
                                                            <Image
                                                                source={{ uri: this.state.data.image }}
                                                                style={{ width: wp('30%'), height: wp('30%') }}
                                                            />
                                                            :
                                                            <Image
                                                                source={require("../assets/img/addImage.png")}
                                                                style={{ width: wp('30%'), height: wp('30%') }}
                                                            />
                                                    )
                                                ]
                                            }


                                        </View>
                                        <View style={{ width: wp('50%') }}>
                                            <Button title="Choose Photo" onPress={this.handleChoosePhoto} iconLeft transparent color="white">
                                                <Icon name='md-camera' />
                                                <Text style={{ color: 'black' }}>{signUpStrings.selectImg}</Text>
                                            </Button>
                                        </View>


                                    </View>
                                }

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
    return bindActionCreators({ getCases: (data) => getCases(data) }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(EditItem);

