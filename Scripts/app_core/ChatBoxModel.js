/*
ALL PROPERTY OF THIS MODEL THAT ARE OBJECT MUST BE CLONED, THEN MODIFIED, THEN ASSIGNED BACK, TO MAKE shouldComponentUpdate WORKS
*/
var _updateFunc = null;
var _updateContext = null;
var cbmodel = {
    layout: {
        currentScreen: "mainScreen",/*"mainScreen", "invitations", "topics", "registration", "newtopic","chatArea"  */
        previousScreen: null,
        slideInMenuActive: false,
        mainScreenOrChatArea: true
    },
    data: {
        connectionStatus: 0,/* 0:not started, 1: succeeded, 2:  */
        invitingPeople: -1, /* -1: null, 0: domain, 1: link, 2: admin*/
        activeTopic: null,
        /*latestInviCount: -4,
        latestTopicCount: -5,*/
        userData: { userName: null, avatar: null },
        statistics:/*StatisticViewModel*/ { DomainUserCount: 0, LinkUserCount: 0, AdminCount: 0 },
        invitationData: /*array of InvitationViewModel*/[],
        topicData: /*array of TopicViewModel*/[],
        currentTopicMessages: /*array of MessageViewModel*/[],
        searchTopicKey:null
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
module.exports = cbmodel;
