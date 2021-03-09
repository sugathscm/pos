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
    Right,
    Button
} from "native-base";
import {
    Platform, StyleSheet, View, TouchableOpacity,
    TouchableNativeFeedback, Dimensions , AppRegistry, NativeModules
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Pdf from 'react-native-pdf';
import RNPrint from 'react-native-print';
import Mailer from 'react-native-mail';
import signUpStrings from '../localization/signUpStrings';



class ViewPdfScreen extends React.Component {

    static navigationOptions = {
        title: 'All Items',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            selectedPrinter: null
        };
    }


    componentDidMount() {
        this.setState({
            ...this.state,
            pageLoading: false
        });
    }

    handleEmail() {
        Mailer.mail({
            subject: 'POS App Receipt',
            recipients: [],
            body: '<b>Please find the attached file.</b>',
            isHTML: true,
            attachment: {
                path: this.state.filePath,  // The absolute path of the file from which to read data.
                type: 'pdf',
                name: 'Receipt',   // Optional: Custom filename for attachment
            }
        }, (error, event) => {
            Alert.alert(
                error,
                event,
                [
                    { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                    { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
                ],
                { cancelable: true }
            )
        });
    }


    render() {
        const { navigation } = this.props;
        const path = navigation.getParam('filePath');
        const data = navigation.getParam('data');
        this.state.filePath = path;
        this.state.data = data;

        const source = {uri: this.state.filePath,cache:true};
        //const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};

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
                        <Icon onPress={() => this.props.navigation.navigate('ReceiptDetailsScreen' , { data:this.state.data})} name="md-close" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Title>{signUpStrings.pdf}</Title>
                    </Body>
                    <Right>
                    <Button transparent color="white"
                            onPress={() => {
                                this.handleEmail();
                            }}>
                            <Text>{signUpStrings.email}</Text>
                        </Button>
                        <Button transparent color="white" style={{ marginRight: wp('3%') }}
                            onPress={()=> {
                                RNPrint.print({ filePath: this.state.filePath })
                            }}>
                            <Text>{signUpStrings.print}</Text>
                        </Button>
                    </Right>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>
                <View style={styles.container}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    onPressLink={(uri)=>{
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf}/>
            </View>
                </Content>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});

export default ViewPdfScreen;

