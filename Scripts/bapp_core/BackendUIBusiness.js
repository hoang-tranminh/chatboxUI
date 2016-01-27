var utils = require('./../app_common/Utils.js');

var tempUniqueId = 100;
var selectedChatBox = null;
var BackendUIBusiness = function (model,coreBusiness) {
    var self = this;
    var bemodel = model;
    $.extend(self, {
        sendUserMessage: function (msg, boxName) {
            var md = boxName == "chatBox1" ? bemodel.chatBox1 : bemodel.chatBox2;
            coreBusiness.sendMessage(utils.getCurrentUri(), md.activeTopic, msg, function (topic, response) {
                //send ok!
                tempUniqueId++;

                var newArr = utils.cloneArray(md.currentTopicMessages);
                newArr.push({ UserName: "me", CreatedDate: new Date(), Text: msg, Id: tempUniqueId });
                md.currentTopicMessages = newArr;

                bemodel.raiseChanged();
            }, function (error) {
                //send not ok
                utils.consoleLog("failed to send message: " + error);
            });
        },
        logOut: function () {
            coreBusiness.ajaxCall("/Backendapp/Account/LogOff", null, function(){
                window.location = "/Backendapp/Home";
            }, true);
        },
        leaveCurrentTopic: function (boxName) {
            var topic = boxName == "chatBox1" ? bemodel.chatBox1.activeTopic : bemodel.chatBox2.activeTopic;
            var md = boxName == "chatBox1" ? bemodel.chatBox1 : bemodel.chatBox2;
            if (topic) {
                md.userInviting = null;
                coreBusiness.leaveTopic(utils.getCurrentUri(), topic, function (activeTopic, response) {
                    utils.consoleLog('leave topic successfully');

                    md.activeTopic = null;
                    md.currentTopicMessages = [];
                    bemodel.raiseChanged();

                }, function (error) {
                    //leave topic not ok
                    utils.consoleLog("failed to leave topic " + topic.TopicId + " : " + error);
                });
            }
        },
        selectChatBox: function () {
            var md = null;
            if (bemodel.chatBox1.activeTopic == null) {
                md = bemodel.chatBox1;
                selectedChatBox = bemodel.chatBox1;
            }
            else if (bemodel.chatBox2.activeTopic == null) {
                md = bemodel.chatBox2;
                selectedChatBox = bemodel.chatBox2;
            }
            else {
                alert("Only can open mamximum 2 topics per browser tab");
                return null;
            }
            return md;
        },
        joinTopic: function (topicId) {
            var md = self.selectChatBox();

            if (md != null) {
                if (!md.activeTopic || md.activeTopic.TopicId != topicId) {
                    //get the topic detail and join it afterward
                    coreBusiness.getTopicDetail(topicId, function (newTopic/*topicviewmodel*/) {
                        utils.consoleLog("going to join topic " + newTopic.TopicId);
                        coreBusiness.gotoTopic(newTopic, self.joinTopicOK);
                    }, true/*isBackend*/);

                }
            }
        },
        joinInvitation: function (topicId, fromUser) {
            var md = self.selectChatBox();

            if (md != null) {
                if (!md.activeTopic || md.activeTopic.TopicId != topicId) {
                    md.userInviting = fromUser;
                    coreBusiness.joinInvitation(topicId, md.activeTopic, function () {
                        md.activeTopic = null;
                    }, self.joinTopicOK, true/*isBackend*/);
                }
            }
        },
        joinTopicOK: function (topic) {
            utils.consoleLog("joined topic OK!");
            self.openChatArea(topic);
        },
        openChatArea: function (activeTopic) {
            selectedChatBox.activeTopic = activeTopic;

            if (!activeTopic.isNewTopic) {
                var hasData = false;
                coreBusiness.getRecentChatMessages(activeTopic, function (data, currentTopicId) {
                    utils.consoleLog("get recent chat messages OK!");
                    if (data && data.length) {
                        var msgs = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].Type == 2)
                                msgs.push(data[i]);
                        }
                        selectedChatBox.currentTopicMessages = msgs;
                        hasData = true;
                        bemodel.raiseChanged();
                    }
                }, true /*isBackend*/);
                if (!hasData)
                    bemodel.raiseChanged();
            }
            else {
                //new topic!
                //self.modelUpdated();
                activeTopic.isNewTopic = false;
            }
        },
        showTopicNotification: function (msgs/*array of MessageViewModel*/) {
            var md = null;
            if (bemodel.chatBox1.activeTopic != null && bemodel.chatBox1.activeTopic.TopicId == msgs[0].TopicId)
                md = bemodel.chatBox1;
            else if (bemodel.chatBox2.activeTopic != null && bemodel.chatBox2.activeTopic.TopicId == msgs[0].TopicId)
                md = bemodel.chatBox2;

            if (md != null) {
                var newArr = utils.cloneArray(md.currentTopicMessages);
                for (var i = 0; i < msgs.length; i++) {
                    msgs[i].Text = msgs[i].Type == 7 ? " joined." : " left.";
                    newArr.push(msgs[i]);
                }
                md.currentTopicMessages = newArr;
                bemodel.raiseChanged();
            }
        },
        showChatMessage: function (msgs/*array of MessageViewModel*/) {
            var md = null;
            if (bemodel.chatBox1.activeTopic != null && bemodel.chatBox1.activeTopic.TopicId == msgs[0].TopicId)
                md = bemodel.chatBox1;
            else if (bemodel.chatBox2.activeTopic != null && bemodel.chatBox2.activeTopic.TopicId == msgs[0].TopicId)
                md = bemodel.chatBox2;

            if (md != null) {
                var newArr = utils.cloneArray(md.currentTopicMessages);
                for (var i = 0; i < msgs.length; i++) {
                    newArr.push(msgs[i]);
                }
                md.currentTopicMessages = newArr;
                bemodel.raiseChanged();
            }
        }
    });
    coreBusiness.bindRenderCallbacks(function () { }, self.showChatMessage, function () { }, self.showTopicNotification);
    return self;
};

module.exports = BackendUIBusiness;


