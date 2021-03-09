import React, { Component } from 'react';
import { Container, Content, Text, Card, Header, Body, Button, Title, CardItem } from 'native-base';
import { increment, decrement, multiply } from '../redux/actions/index.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import signUpStrings from '../localization/signUpStrings.js';

class Counter extends Component{
    render(){
        console.log(this.props.count);
        return(
            <Container>
                <Header>
                    <Body>
                        <Title>{signUpStrings.reduxCounter}</Title>
                    </Body>
                </Header>
                <Content padder>
                    <Card>
                        <CardItem>
                            <Text>
                                {this.props.count}
                            </Text>
                        </CardItem>
                    </Card>
                    <Button dark bordered onPress= {() => this.props.increment()}>
                        <Text>{signUpStrings.incremnt}</Text>
                    </Button>
                    <Button dark bordered onPress= {() => this.props.decrement()}>
                        <Text>{signUpStrings.decremnt}</Text>
                    </Button>
                    <Button dark bordered onPress= {() => this.props.multiply()}>
                        <Text>{signUpStrings.multyPly}</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}
function mapStateToProps(state){
    return{
        count : state.multy
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({increment: increment, decrement: decrement, multiply: multiply}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Counter);
