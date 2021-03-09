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



class BarcodeEditScreen extends React.Component {

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
        }, () => { this.props.navigation.navigate('EditItem', { barcodeEdit: this.state.barcode , data:this.state.data , photo : this.state.photo}) })

    }

    render() {

        const { navigation } = this.props;
        const data = navigation.getParam('data');
        const photo = navigation.getParam('photo');
        this.state.data = data;
        this.state.photo = photo;

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
                        <Title>Scan Barcode</Title>
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
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
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

export default BarcodeEditScreen;

