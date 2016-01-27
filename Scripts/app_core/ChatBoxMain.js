var utils = require('./../app_common/Utils.js');
var cbmodel = require('./ChatBoxModel.js');
var CoreBusiness = require('./../app_common/BusinessCore.js');
var coreBusiness = new CoreBusiness();
var UIBusiness = require('./UIBusiness.js');
var uiBusiness = new UIBusiness(cbmodel, coreBusiness);


var Accordion = require('./../app_ui/Accordion.js');
var Registration = require('./../app_ui/Registration.js');
var NewTopic = require('./../app_ui/NewTopic.js');

var ChatBox = React.createClass({
    sendMessage: function(text){
        uiBusiness.sendUserMessage(text);
    },
    joinInvitation:function(topicId){
        uiBusiness.joinInvitation(topicId);
    },
    showPanel:function(panelId){
        uiBusiness.showPanel(panelId);
    },
    toogleSlideInMenu:function() {
        uiBusiness.toogleSlideInMenu();
    },
    invitePeopleToTopic:function(buttonInviteId) {
        uiBusiness.invitePeopleToTopic(buttonInviteId);
    },
    leaveCurrentTopic:function() {
        uiBusiness.leaveCurrentTopic();
    },
    invitePeople:function(buttonInviteId){
        uiBusiness.invitePeople(buttonInviteId);
    },
    createNewTopic:function(topicName){
        uiBusiness.createNewTopic(topicName);
    },
    cancelNewTopic:function() {
        uiBusiness.cancelNewTopic();
    },
    registerAnonymousName:function(name) {
        uiBusiness.registerAnonymousName(name);
    },
    cancelRegistration:function(){
        uiBusiness.cancelRegistration();
    },
    searchTopic:function(name) {
        uiBusiness.searchTopic(name);
    },
    joinSelectedTopic:function(topicId){
        uiBusiness.joinSelectedTopic(topicId);
    },
    changeName:function(){
        uiBusiness.changeName();
    },
    getInitialState: function() {
        cbmodel.bindUpdateFunc(this.setState, this);
        return cbmodel;
    },
   
    componentDidMount: function() {
        $.support.cors = true;
        uiBusiness.autoRegister("auto");
        uiBusiness.fetchStatistics();
        coreBusiness.initSignalR();
        uiBusiness.loadTopicList();
        uiBusiness.loadInvitationList();
        
        $.extend($.timeago, {
            settings: {
                refreshMillis: 60000,
                allowPast: true,
                allowFuture: false,
                localeTitle: false,
                cutoff: 0,
                autoDispose: true,
                strings: {
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: "ago",
                    suffixFromNow: "from now",
                    inPast: 'any moment now',
                    seconds: "some secs",
                    minute: "~ a min",
                    minutes: "%d mins",
                    hour: "~ 1 hr",
                    hours: "~ %d hrs",
                    day: "a day",
                    days: "%d days",
                    month: "~ a month",
                    months: "%d months",
                    year: "~ a year",
                    years: "%d years",
                    wordSeparator: " ",
                    numbers: []
                }
            }
        });

    },
    render:function(){
        return (
            <div className="reactContainer" >
                <Accordion model={this.state} sendMessage={this.sendMessage} 
                joinInvitation={this.joinInvitation}
                showPanel={this.showPanel}
                toogleSlideInMenu={this.toogleSlideInMenu}
                invitePeopleToTopic={this.invitePeopleToTopic}
                leaveCurrentTopic={this.leaveCurrentTopic}
                invitePeople={this.invitePeople}
                searchTopic={this.searchTopic}
                joinSelectedTopic={this.joinSelectedTopic}
                changeName={this.changeName}/>
                <Registration currentScreen={this.state.layout.currentScreen} userData={this.state.data.userData}
                registerAnonymousName={this.registerAnonymousName}
                cancelRegistration={this.cancelRegistration}
                changeName={this.changeName}/>
                <NewTopic currentScreen={this.state.layout.currentScreen} userData={this.state.data.userData}
                createNewTopic={this.createNewTopic}
                cancelNewTopic={this.cancelNewTopic}
                changeName={this.changeName}/>
            </div>
            );
    }
});

ReactDOM.render(
  <ChatBox/>,
document.getElementById('container')
);




   