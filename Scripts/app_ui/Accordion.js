var utils = require('./../app_common/Utils.js');

var MainScreen = require('./MainScreen.js');
var ChatArea = require('./ChatArea.js');
var ActionSlideInMenu = require('./ActionSlideInMenu.js');
var InvitationList = require('./InvitationList.js');
var TopicList = require('./TopicList.js');

var Accordion = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("Accordion updated");
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        return true;
    },
    handleClick: function(){
    },
    panelHeaderClick: function(event){
        this.props.showPanel(event.currentTarget.id);
    },
    setTopicSearchKey: function(topicName){
        this.props.model.data.searchTopicKey = topicName;
    },
    render:function(){
        var top = '404px';
        var inviArrow = 'arrowDown';
        var topicArrow = 'arrowDown';
        var inviActive = this.props.model.layout.currentScreen == 'invitations' ? 'active' : 'collapsed';
        if(inviActive == 'active'){
            top = '0px';
            inviArrow = 'arrowUp';
        }
        var topicActive = this.props.model.layout.currentScreen == 'topics' ? 'active' : 'collapsed';
        if(topicActive == 'active'){
            top = '0px';
            topicArrow = 'arrowUp';
        }
        if(inviActive != 'active' && topicActive != 'active')
        {
            top = '404px';
            inviActive = 'collapsed';
            topicActive = 'collapsed';
        }

        var accordionActive='';

        if( this.props.model.layout.currentScreen == "newtopic" 
                        || this.props.model.layout.currentScreen == "registration")
        {
            accordionActive= ' hidden';
        }
        
        var defaultComp = this.props.model.layout.mainScreenOrChatArea ? (<MainScreen statistics={this.props.model.data.statistics} 
                                                                            userData={this.props.model.data.userData} 
                                                                            invitePeople={this.props.invitePeople}
                                                                            changeName={this.props.changeName}/>) : 
                (<ChatArea leaveCurrentTopic={this.props.leaveCurrentTopic} activeTopic={this.props.model.data.activeTopic} 
                userName={this.props.model.data.userData.userName} 
                active={this.props.model.layout.currentScreen == "chatArea"} 
                currentTopicMessages={this.props.model.data.currentTopicMessages} sendMessage={this.props.sendMessage}/>)
        

        return ( <div className={"accordion" + accordionActive}>
                            <div className="defaultPanel">
                                {defaultComp}
                                <ActionSlideInMenu currentScreen={this.props.model.layout.currentScreen} 
                                slideInMenuActive={this.props.model.layout.slideInMenuActive} 
                                statistics={this.props.model.data.statistics}
                                toogleSlideInMenu={this.props.toogleSlideInMenu} 
                                invitePeopleToTopic={this.props.invitePeopleToTopic}/>
                            </div>
                            <ul className="panelHeaders" style={{top:top}}>
                                <li className={"panel panelHeader " + inviActive}  id="panelHeaderInvi" onClick={this.panelHeaderClick}>
                                    <span className="panelTitle">Invitations </span><span className="panelUpdate">({this.props.model.data.invitationData.length})</span>
                                    <i className={"arrowIcon " + inviArrow}></i>
                                </li>
                                <li className={"panel panelHeader topicPanel "+ topicActive} id="panelHeaderTopic" onClick={this.panelHeaderClick}>
                                    <span className="panelTitle">Hot topics </span>
                                    <i className={"arrowIcon " + topicArrow}></i>
                                </li>
                            </ul>
                            <div className={"panelContent " + inviActive} id="panel1">
                                <InvitationList invitationData={this.props.model.data.invitationData} joinInvitation={this.props.joinInvitation}/>
                            </div>
                            <div className={"panelContent " + topicActive} id="panel2">
                                    <TopicList topicData={this.props.model.data.topicData} setTopicSearchKey={this.setTopicSearchKey}
                                    searchTopic={this.props.searchTopic}
                                    joinSelectedTopic={this.props.joinSelectedTopic}/>
                            </div>
                        </div>
                    );
        }
});

module.exports = Accordion;