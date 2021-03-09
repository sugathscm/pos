import React, { Component } from 'react';
import {
    Container,
    Content,
    Header,
    Icon,
    Text,
    Left, 
    Body,
    Title,
    Spinner,
} from "native-base";
import {
    Platform, StyleSheet, View, TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RNCamera } from 'react-native-camera';
import signUpStrings from '../localization/signUpStrings';



class BarcodeScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.handleTourch = this.handleTourch.bind(this);
        this.state = {
            torchOn: false,
            pageLoading: true,
            barcode: "",
        };
    }


    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false
        });
    }

    handleTourch(value) {
        if (value === true) {
            this.setState({ torchOn: false });
        } else {
            this.setState({ torchOn: true });
        }
    }

    onBarCodeRead = (e) => {
        //Alert.alert("Barcode value is" + e.data, "Barcode type is" + e.type);
        this.setState({
            barcode: e.data
        }, () => { this.props.navigation.navigate('NewItem', { 
            barcodeVal: this.state.barcode , 
            Name : this.state.Name,
            Category : this.state.Category,
            CategoryId : this.state.CategoryId,
            SoldBy : this.state.SoldBy,
            Price : this.state.Price,
            Cost : this.state.Cost,
            Sku : this.state.Sku,
            InStock : this.state.InStock,
            Color : this.state.Color,
            Shape : this.state.Shape,
            Image : this.state.Image
        }) })

    }

    render() {
        const { navigation } = this.props;
        const Name = navigation.getParam('Name');
        const Category = navigation.getParam('Category');
        const CategoryId = navigation.getParam('CategoryId');
        const SoldBy = navigation.getParam('SoldBy');
        const Price = navigation.getParam('Price');
        const Cost = navigation.getParam('Cost');
        const Sku = navigation.getParam('Sku');
        const InStock = navigation.getParam('InStock');
        const Color = navigation.getParam('Color');
        const Shape = navigation.getParam('Shape');
        const Image = navigation.getParam('Image');
        this.state.Name = Name;
        this.state.Category = Category;
        this.state.CategoryId = CategoryId;
        this.state.SoldBy = SoldBy;
        this.state.Price = Price;
        this.state.Cost = Cost;
        this.state.Sku = Sku;
        this.state.InStock = InStock;
        this.state.Color = Color;
        this.state.Shape = Shape;
        this.state.Image = Image;

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
                        <Icon onPress={() => this.props.navigation.navigate('NewItem')} name="arrow-back" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Title>{signUpStrings.scanBarCode}</Title>
                    </Body>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>
                    <View style={styles.container}>
                        <RNCamera
                            style={styles.preview}
                            flashMode={this.state.torchOn
                                ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                            onBarCodeRead={this.onBarCodeRead}
                            ref={cam => this.camera = cam}
                            androidCameraPermissionOptions={{
                                title: "Permission to use camera",
                                message: "We need your permission to use your camera",
                                buttonPositive: "ok",
                                buttonNegative: "cancel",
                            }}
                        >
                            <Text style={{

                            }}></Text>
                        </RNCamera>
                    </View>
                </Content>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        height:hp('80%'),
        alignItems: 'center'
    },
    cameraIcon: {
        margin: 5,
        height: 40,
        width: 40
    },
    bottomOverlay: {
        position: "absolute",
        width: "100%",
        flex: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
});

export default BarcodeScreen;

