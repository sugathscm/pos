import React from 'react';
import {
    Container,
    Content,
    Header,
    Icon,
    Text,
    Left,
    Body,
    Title,
    Toast,
    Spinner,
} from "native-base";
import {
    StyleSheet, View, ScrollView, TouchableOpacity,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { bindActionCreators } from 'redux';
import { getCases } from "../redux/actions";
import { connect } from 'react-redux';
import moment from "moment";
import { SearchBar } from "react-native-elements";
import signUpStrings from "../localization/signUpStrings";


class AllReceipts extends React.Component {

    static navigationOptions = {
        drawerLabel: () => null
    }

    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            search: '',
            allReceipts: [],
            selectedReceipts:[],
            reverseArray:[],
            selectedReciptsArrayGroup : []
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

    updateSearch = search => {
        this.setState({ search });
        this.state.selectedReceipts = [];
        if (this.state.allReceipts) {
            this.state.selectedReceipts = this.state.allReceipts.filter((res, index) => {
                return (res.totalPaid.toLowerCase().includes(search.toLowerCase()) ||
                        res.receiptId.toLowerCase().includes(search.toLowerCase())
                );
            });

            let selectedReciptsArrayGroup = [];
            for(let i=0; i< this.state.selectedReceipts.length; i++){
                let found = false;
                for(let j=0; j < selectedReciptsArrayGroup.length; j++){
                    if(selectedReciptsArrayGroup[j].timestamp === moment(this.state.selectedReceipts[i].timestamp).format("L")){
                        found = true;
                        selectedReciptsArrayGroup[j].receipts.push(this.state.selectedReceipts[i]);
                    }
                }
                if(!found){
                    let newArrayObj = {
                        timestamp : moment(this.state.selectedReceipts[i].timestamp).format("L"),
                        receipts : [this.state.selectedReceipts[i]]
                    }
                    selectedReciptsArrayGroup.push(newArrayObj);
                }
            }
            this.state.selectedReciptsArrayGroup = selectedReciptsArrayGroup;
            this.forceUpdate();
        }
        this.forceUpdate();
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.userData.allReceipts) {
            this.setState({
                ...this.state,
                isVisible: false
            });
            return;
        }
        this.state.allReceipts = [];
        Object.keys(nextProps.userData.allReceipts).forEach(function (key, index) {
            let obj = nextProps.userData.allReceipts[key];
            obj._id = key;
            let receiptId = obj._id;
            obj.receiptDetails = nextProps.userData.allReceipts[receiptId];
            this.state.allReceipts[this.state.allReceipts.length] = obj;
            this.state.selectedReceipts[this.state.selectedReceipts.length] = obj;
        }.bind(this));
        this.forceUpdate();
        this.state.pageLoading = false
        this.state.selectedReceipts.reverse();

        let selectedReciptsArrayGroup = []; //
        for(let i=0; i< this.state.selectedReceipts.length; i++){
            let found = false;
            for(let j=0; j < selectedReciptsArrayGroup.length; j++){
                if(selectedReciptsArrayGroup[j].timestamp === moment(this.state.selectedReceipts[i].timestamp).format("L")){
                    found = true;
                    selectedReciptsArrayGroup[j].receipts.push(this.state.selectedReceipts[i]);
                }
            }
            if(!found){
                let newArrayObj = {
                    timestamp : moment(this.state.selectedReceipts[i].timestamp).format("L"),
                    receipts : [this.state.selectedReceipts[i]]
                }
                selectedReciptsArrayGroup.push(newArrayObj);
            }
        }
        this.state.selectedReciptsArrayGroup = selectedReciptsArrayGroup;
    };


    showToast(message, text, type) {
        Toast.show({
            text: message,
            buttonText: text,
            position: "top",
            type: type
        })
    }


    render() {
        const { search } = this.state;
        return (
            <Container>
                <Header>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 0 }} />
                    </Left>
                    <Body style={{ flex: 1 }} >
                        <Title>{signUpStrings.receipts}</Title>
                    </Body>
                </Header>
                {/* Spinner */}
                {this.state.pageLoading ? <Spinner color='blue' style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)', height: hp('100%'),
                    width: wp('100%'), zIndex: 2000
                }} /> : null}
                <Content>
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: wp('95%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                <View searchBar style={{ width: wp('94%'), marginStart: wp('3%') , borderBottomWidth:wp('0.5%') }}>
                                    <SearchBar
                                        searchIcon={{ size: hp('3%') }}
                                        placeholder={signUpStrings.searchInReceipts}
                                        onChangeText={this.updateSearch}
                                        value={search}
                                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
                                        inputContainerStyle={{ backgroundColor: 'rgba(0,0,0,0)', width: wp('90%') }}
                                        inputStyle={{ fontSize: hp('2.4%') }}
                                    />
                                </View>
                            </View>
                        </View>


                        <View>
                            <ScrollView>
                                {
                                    this.state.selectedReciptsArrayGroup ? (
                                        this.state.selectedReciptsArrayGroup.length !== 0 ? (
                                            this.state.selectedReciptsArrayGroup.map((mainGroup, groupIndex) => (
                                                <View>
                                                    <Text style={{
                                                        borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#d6d7da', flexDirection: 'row',
                                                        paddingVertical: wp('2%'), paddingHorizontal : wp('2%')
                                                    }}>
                                                    {moment(mainGroup.timestamp).format('dddd, MMMM DD, YYYY')}
                                                    </Text>
                                                    <View>
                                                        {
                                                            mainGroup.receipts && mainGroup.receipts.length !== 0 ? (
                                                                mainGroup.receipts.map((res,index) => (
                                                                    <TouchableOpacity onPress={() => console.log("dataaaaaaaaaaa",
                                                                        this.state.allReceipts,
                                                                        this.props.navigation.navigate('ReceiptDetailsScreen',
                                                                            { data: res })
                                                                    )}>
                                                                        <View style={{ flex: 1, flexDirection: 'row', marginVertical: wp('4%') }}>
                                                                            <View style={{ width: wp('20%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                                <View style={{ width: wp('17%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                                    <Icon
                                                                                        style={{ marginStart: wp('3%'), color: 'gray', fontWeight: 'bold' }}
                                                                                       // name='ios-card'
                                                                                        name={res.receiptDetails.paymentType === 'Cash' ? 'ios-cash' : 'ios-card'}
                                                                                        size={hp('2.4%')} />
                                                                                </View>
                                                                            </View>
                                                                            <View style={{
                                                                                borderBottomWidth: 1, borderColor: '#d6d7da', width: wp('80%'), flexDirection: 'row',
                                                                                paddingBottom: wp('3%')
                                                                            }}>
                                                                                <View style={{ flex: 1.5, backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                                    <View style={{ width: wp('30%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                                        <Text>
                                                                                            {res.receiptDetails ? res.receiptDetails.chargeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").toString() : ""}
                                                                                        </Text>
                                                                                        <Text style={{ fontSize: hp('2.4%') }}>
                                                                                            {res.receiptDetails ? moment(res.receiptDetails.timestamp).format('h:mm A') : ""}
                                                                                        </Text>
                                                                                    </View>
                                                                                </View>
                                                                                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                                    <View style={{ width: wp('40%'), backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                                        <Text>
                                                                                            {res.receiptDetails.receiptId ? res.receiptDetails.receiptId : "#*****"}
                                                                                        </Text>
                                                                                        <Text style={{color:'red'}}>
                                                                                            {res.receiptDetails.refunded ? signUpStrings.refunded: ""}
                                                                                        </Text>
                                                                                        <Text style={{color:'red'}}>
                                                                                            {res.receiptDetails.refunded ? res.receiptDetails.refundId : ""}
                                                                                        </Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                ))
                                                            ) : (
                                                                <Text> {signUpStrings.noReceipts} </Text>
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            ))
                                        ) : (
                                            <View style={{
                                                width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                                alignItems: "center"
                                            }}>
                                                <Text>{signUpStrings.noReceipts}</Text>
                                            </View>
                                        )
                                    ) : (
                                        <View style={{
                                            width: wp('100%'), justifyContent: "center", paddingTop: hp('15%'),
                                            alignItems: "center"
                                        }}>
                                            <Text>{signUpStrings.noReceipts}</Text>
                                        </View>
                                    )
                                }
                                <View style={{ height: hp('20%'), zIndex: 100 }}>
                                    <ScrollView>
                                    </ScrollView>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        userData: state.data,
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({ getCases: (data) => getCases(data) }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(AllReceipts);

