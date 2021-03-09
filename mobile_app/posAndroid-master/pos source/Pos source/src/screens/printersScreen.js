import React, {Component} from 'react';
import {
    Image, ImageBackground, Platform, StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TouchableNativeFeedback, Alert
} from 'react-native';
import {Button, SearchBar} from "react-native-elements";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {decrement, getCases, increment, multiply} from "../redux/actions";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from "./homeScreen";
import {Body, Header, Left, Right, Title,List, Icon, Fab, Container, Toast, Spinner, ListItem, Thumbnail} from "native-base";
import axios from "axios";
import * as AppURLS from "../redux/urls";


class PrintersScreen extends React.Component {

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
                    <Left style={{ flex:1 ,flexDirection: 'row'}}>
                        <Title>Printers</Title>
                    </Left>
                    <Right>
                        <Icon active name="md-close" onPress={() => this.props.navigation.navigate('SalesScreen')}
                              style={{ color: 'white', marginRight: 15 }} />
                    </Right>
                </Header>

                <Fab
                    active={this.state.active}
                    direction="bottomRight"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('CretePrnterScreen')}>
                    <Icon name="add" />
                </Fab>
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
export default connect(mapStateToProps, matchDispatchToProps)(PrintersScreen);

