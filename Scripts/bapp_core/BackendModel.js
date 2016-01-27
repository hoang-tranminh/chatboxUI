/*
ALL PROPERTY OF THIS MODEL THAT ARE OBJECT MUST BE CLONED, THEN MODIFIED, THEN ASSIGNED BACK, TO MAKE shouldComponentUpdate WORKS
*/

var chatBoxModel = function () {
    return {
        activeTopic: null,
        userInviting: null,
        currentTopicMessages: /*array of MessageViewModel*/[]
    };
};

var _updateFunc = null;
var _updateContext = null;
var bemodel = {
    layout: {
        currentRoute: null, 
        liveChatLayout: null,
        chatBox1Minified: false,
        chatBox2Minified: false,
    },
    data: {
        userData: { userName: null, avatar: null },
        topicData: /*array of TopicViewModel*/[],
        searchTopicKey: null
    },
    chatBox1: new chatBoxModel(),
    chatBox2: new chatBoxModel(),
    bindUpdateFunc: function (func, context) {
        _updateFunc = func;
        _updateContext = context;
    },
    raiseChanged: function () {
        if (_updateFunc && _updateContext)
            _updateFunc.call(_updateContext, this);
    }
};
module.exports = bemodel;
