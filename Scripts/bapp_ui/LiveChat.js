var utils = require('./../app_common/Utils.js');

var InvitationList = require('./../app_ui/InvitationList.js');
//var MessageList= require('./../app_ui/MessageList.js');
//var MessageForm = require('./../app_ui/MessageForm.js');
//var ChatAreaHeader = require('./../app_ui/ChatAreaHeader.js');

/*
ALL PROPERTY OF THIS MODEL THAT ARE OBJECT MUST BE CLONED, THEN MODIFIED, THEN ASSIGNED BACK, TO MAKE shouldComponentUpdate WORKS
*/
var _updateFunc = null;
var _updateContext = null;
var liveChat= {
        layout: {
            currentTab:null
        },
        data: {
            //activeTopic: null,
            //userInviting:null,
            adminInviData: /*array of InvitationViewModel*/[],
            userInviData: /*array of InvitationViewModel*/[],
            userOnlineData: /*array of UserOnlineViewModel*/[]
        },
        bindUpdateFunc: function (func, context) {
            _updateFunc = func;
            _updateContext = context;
        },
        raiseChanged: function () {
            if (_updateFunc && _updateContext)
                _updateFunc.call(_updateContext, this);
        }
};
var UIBusiness= require('./../bapp_core/LiveChatUIBusiness.js');
var uiBusiness = new UIBusiness(liveChat, window.coreBusiness);

var LiveChat = React.createClass({
    getInitialState: function() {
        liveChat.bindUpdateFunc(this.setState, this);
        return liveChat;
    },
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("LiveChat updated");
    },
    componentDidMount: function() {
        uiBusiness.loadInvitationList();
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        var adminInviCount = liveChat.data.adminInviData.length;
        var userInviCount = liveChat.data.userInviData.length;
        var onlineUserCount = liveChat.data.userOnlineData.length;
        return ( <div className="container-fluid">
                    <div classNamw="row">
                        <div className="col-md-12">
                            <h1 className="page-header">
                                Live Chat <small> Join invitations or invite online users to chat</small>
                            </h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                                <ul className="nav nav-tabs">
                                        <li role="presentation" className="active"><a data-toggle="tab" href="#adminInvi">Admin invitations <span className="badge">{adminInviCount}</span></a></li>
                                        <li role="presentation"><a data-toggle="tab" href="#userInvi">User invitations <span className="badge">{userInviCount}</span></a></li>
                                        <li role="presentation"><a data-toggle="tab" href="#userOnline">Online users <span className="badge">{onlineUserCount}</span></a></li>
                                    </ul>
                                <div className="tab-content"> 
                                    <div id="adminInvi" className="tab-pane fade in active">
                                            <InvitationList invitationData={liveChat.data.adminInviData} joinInvitation={this.props.joinInvitation}/>
                                    </div>
                                    <div id="userInvi" className="tab-pane fade">
                                            <InvitationList invitationData={liveChat.data.userInviData} joinInvitation={this.props.joinInvitation}/>
                                    </div>
                                    <div id="userOnline" className="tab-pane fade">
                                            Online users list 
                                    </div>
                                </div>
                        </div>
                        <div className="col-md-6">
                            {/*<div className="chatArea">
                                <ChatAreaHeader leaveCurrentTopic={this.leaveCurrentTopic} activeTopic={liveChat.data.activeTopic} userName={this.props.userName} userInviting={liveChat.data.userInviting} userIsAdmin="true"/>
                                <div className="messageArea">
                                    <MessageList currentTopicMessages={liveChat.data.currentTopicMessages} userName={this.props.userName} />
                                </div>
                                <MessageForm sendMessage={this.sendMessage}/>
                            </div>*/}
                        </div>
                    </div>
                    </div>
            );
    }
});

module.exports = LiveChat;