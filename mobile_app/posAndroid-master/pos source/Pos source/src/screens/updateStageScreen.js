import React, {Component} from 'react';
import {
    Modal,
    Picker,
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableHighlight,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import DatePicker from "react-native-datepicker";
import {getCases} from "../redux/actions";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from "moment";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {Body, Header, Left, Right, Title, Icon, Form, Item, Label, Content, Spinner, Button, Input, Toast} from "native-base";
import ModalSelector from "react-native-modal-selector";
import axios from "axios";
import * as AppURLS from "../redux/urls";


class updateStageScreen extends React.Component {

    static navigationOptions = {
        title: 'Update Case Stage',
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state={
            data : {},
            pageLoading : true,
            selectedStageLabel : "",
            selectedStageId : "",
            nextCourtDate : "",
            notesOfThisStage : "",
            notesOfThisStageValid : null,
            notesForNextStage : "",
            notesForNextStageValid : null,
            nextCaseDate: moment(new Date()).format("YYYY-MM-DD"),
            nextCaseDateLabel: "Next Case Date",
            allStages : []

        }
    }

    componentDidMount(){
        this.setState({...this.state,
            pageLoading : false
        });
        this.props.getCases(this.props.userData);
    }

    componentWillReceiveProps(nextProps) {

        console.log("case check 1", JSON.stringify(nextProps.userData));

        if(!nextProps.userData.allCaseStageNames){
            this.setState({ ...this.state,
                pageLoading  :false
            });
            return;
        }

        Object.keys(nextProps.userData.allCaseStageNames).forEach(function(key,index){

            let clientPopUpObj = {};
            clientPopUpObj.label = nextProps.userData.allCaseStageNames[key].caseStageName;
            clientPopUpObj.key = nextProps.userData.allCaseStageNames[key]._id;

            let objAvailable = false;
            for(let i=0; i < this.state.allStages.length; i++){
                if(this.state.allStages[i].key === clientPopUpObj.key){
                    objAvailable = true;
                    break;
                }
            }
            if(!objAvailable){
                this.state.allStages.push(clientPopUpObj);
            }
        }.bind(this));

        console.log(" Stages :: ", this.state.allStages);
    }

    showToast(message,text, type){
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }

    validate(){
        console.log("validating form..");
        // notes Of This Stage
        if(this.state.notesOfThisStageValid !== null || this.state.notesOfThisStage !== ""){
            if(this.state.notesOfThisStage && this.state.notesOfThisStage.length >= 3){
                this.state.notesOfThisStageValid = true;
            }else{
                this.state.notesOfThisStageValid = false;
            }
        }
        // notes For Next Stage
        if(this.state.notesForNextStageValid !== null || this.state.notesForNextStage !== ""){
            if(this.state.notesForNextStage && this.state.notesForNextStage.length >= 3){
                this.state.notesForNextStageValid = true;
            }else{
                this.state.notesForNextStageValid = false;
            }
        }

        // Next Case Date


        this.forceUpdate();
    }

    submitForm(){
        console.log("submitting form..", this.state);
        this.validate();

        // invalidating untouched field
        if(this.state.notesOfThisStageValid === null){
            this.state.notesOfThisStageValid = false;
        }
        if(this.state.notesForNextStageValid === null){
            this.state.notesForNextStageValid = false;
        }

        if(!this.state.notesForNextStageValid || !this.state.notesOfThisStageValid){
            this.showToast("Please provide valid details","Ok","warning")
            return;
        }

        this.forceUpdate();

        let caseStageUpdate = {
            caseId : this.state.data._id,
            caseStageNameId : this.state.selectedStageId,
            nextCourtDate : this.state.nextCaseDate,
            notesOfThisStage : this.state.notesOfThisStage,
            notesForNextStage : this.state.notesForNextStage
        };

        console.log("Ready to update stage..", caseStageUpdate);

        axios
            .post(AppURLS.ApiBaseUrl + 'cases/caseStageUpdate', caseStageUpdate)
            .then(response => {
                console.log("backend data", JSON.stringify(response));
                if(response.data.success){
                    console.log("data =========>", response);
                    this.state.pageLoading = false;
                    this.props.getCases(this.props.userData);
                    this.forceUpdate();
                    this.showToast("Updated Successfully!" ,"Ok" ,"success");
                    this.props.navigation.navigate('CaseView', {data : this.state.data} );

            }else{
                    this.showToast("Please provide valid details","Ok","warning");
                }
            })
            .catch(error => {
                console.log("error",error);
                this.state.pageLoading = false;
                this.forceUpdate();

                if(error.response.data.dialogMessage){
                    //alert(error.response.data.dialogMessage + " Please try again");
                    this.state.dialogMessage = "Please enter valid details, and try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                }else{
                    this.state.dialogMessage = "Failed adding new client. Please try again";
                    this.setState({
                        defaultAnimationDialog: true,
                    });
                }

            });

    }


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


    render() {

        const { navigation } = this.props;
        const data = navigation.getParam('data');
        this.state.data = data;
        console.log("update stage screen ", data);

        return (
            <View style={{flex :1, backgroundColor : '#e1e1e1'}}>

                <Header>
                    <Left style={{ flexDirection: 'row'}}>
                        <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 15 }} />
                    </Left>
                    <Body style={{flex:1}}>
                        <Title>Update Case Stage</Title>
                    </Body>
                    <Right>
                        <Icon name="arrow-back" style={{ color: 'white' }}
                        onPress={ () => this.props.navigation.navigate('CaseView', {data : this.state.data})}/>
                    </Right>
                </Header>
                {/* Spinner */}
                { this.state.pageLoading ? <Spinner color='blue' style={{position: 'absolute',
                    backgroundColor : 'rgba(0,0,0,0.4)', height : hp('100%'),
                    width : wp('100%'), zIndex:2000}} /> : null}
                <Content padder>
                    <KeyboardAvoidingView behavior="position" enabled>
                    <Form>

                        {/* Court Location*/}
                        <Item style={{marginTop : hp('3%')}}>
                            <ModalSelector
                                style={{width : wp('90%')}}
                                data={this.state.allStages}
                                initValue="Select a case stage"
                                supportedOrientations={['landscape']}
                                accessible={true}
                                scrollViewAccessibilityLabel={'Scrollable options'}
                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                onChange={(option)=>{ this.setState({
                                    ...this.state ,
                                    selectedStageLabel : option.label,
                                    selectedStageId : option.key
                                })}}>

                                <Input
                                    style={{padding:0, height: hp('8%')}}
                                    editable={false}
                                    placeholder="Select a case stage"
                                    value={this.state.selectedStageLabel} />
                            </ModalSelector>
                            {/* <Icon name="ios-add-circle-outline"
                                  onPress={() => this.props.navigation.navigate('NewClient')}/> */}
                        </Item>

                        {/* Join Date */}
                        <Item style={{marginTop : hp('3%')}}>
                            <Label>{this.state.nextCaseDateLabel}</Label>
                            <DatePicker
                                style={{
                                    width: wp("60%"),
                                    marginLeft: wp("5%")
                                }}
                                date={this.state.nextCaseDate}
                                mode="datetime"
                                placeholder="select date"
                                format="YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                                minDate="1900-01-01"
                                maxDate="2200-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                hideText="true"
                                customStyles={{
                                    dateIcon: {
                                        position: "absolute",
                                        right: 0,
                                        top: 4,
                                        marginRight: wp('4%')
                                    },
                                    dateInput: {
                                        marginRight: 0,
                                        borderWidth: 0,
                                        paddingRight: 45,
                                    }
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={res => {
                                    console.log("date change.. ", res);
                                    this.setState({...this.state,
                                         nextCaseDate: res,
                                         nextCaseDateLabel : res.toString().substring(0,16).replace("T", " ", )
                                    });
                                }}
                            />
                        </Item>

                        {/* Notes for this stage */}
                        <Item floatingLabel
                              success={this.state.notesOfThisStageValid === true ? true : null}
                              error={this.state.notesOfThisStageValid === false ? true : null}>
                            <Label>Notes for this stage</Label>
                            <Input onChangeText={text => {
                                this.state.notesOfThisStage = text;
                                this.validate();
                            }}
                            />
                            <Icon name={this.showValidityIcon(this.state.notesOfThisStageValid)} />
                        </Item>

                        {/* Notes for next stage */}
                        {/*<Item floatingLabel
                              success={this.state.notesForNextStageValid === true ? true : null}
                              error={this.state.notesForNextStageValid === false ? true : null}>
                            <Label>Notes for next stage</Label>
                            <Input onChangeText={text => {
                                this.state.notesForNextStage = text;
                                this.validate();
                            }}
                                value={this.state.notesForNextStage}
                            />
                            <Icon name={this.showValidityIcon(this.state.notesForNextStageValid)} />
                        </Item>*/}

                        <Item floatingLabel
                              success={this.state.notesForNextStageValid === true ? true : null}
                              error={this.state.notesForNextStageValid === false ? true : null}>
                            <Label>Notes for next stage</Label>
                            <Input onChangeText={text => {
                                this.state.notesForNextStage = text;
                                this.validate();
                            }}
                            />
                            <Icon name={this.showValidityIcon(this.state.notesForNextStageValid)} />
                        </Item>

                        <Button block primary onPress={ () => this.submitForm()}
                                style={{marginTop : hp('3%')}}>
                            <Text>Update</Text>
                        </Button>


                    </Form>
                    </KeyboardAvoidingView>
                </Content>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    textStylePicker: {
        height: 50,
        width: 150,
        fontSize: 50,
        color: "blue"
    },
    itemStylePicker: {
        height: 50,
        width: 150,
        fontSize: 50,
        color: "red"
    }
});

function mapStateToProps(state){
    return{
        userData : state.data,
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getCases: (data) => getCases(data)}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(updateStageScreen);

