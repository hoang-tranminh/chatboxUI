var utils = require('./../app_common/Utils.js');

var tempUniqueId = 100;
var topicLoadThread = null;
var UIBusiness = function (model, coreBusiness) {
    var self = this;
    var cbmodel = model;
    $.extend(self, {
        modelUpdated: function () {
            cbmodel.raiseChanged();
        },
        joinSelectedTopic: function (topicId) {
            var topic = null;
            for (var i = 0; i < cbmodel.data.topicData.length; i++) {
                if (cbmodel.data.topicData[i].TopicId == topicId) {
                    topic = cbmodel.data.topicData[i];
                    break;
                }
            }
            if (!topic)
                return;
            coreBusiness.gotoTopic(topic, self.joinTopicOK);
        },
        joinInvitation: function (topicId) {
            if (!cbmodel.data.activeTopic || cbmodel.data.activeTopic.TopicId != topicId) {
                coreBusiness.joinInvitation(topicId, cbmodel.data.activeTopic, function () {
                    cbmodel.data.activeTopic = null;
                }, self.joinTopicOK);
            }
            else if(cbmodel.data.activeTopic && cbmodel.data.activeTopic.TopicId == topicId) {
                var pre = cbmodel.layout.previousScreen;
                cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                cbmodel.layout.currentScreen = pre;
                self.modelUpdated();
            }
        },
        showPanel: function (panelId) {
            if (panelId == "panelHeaderInvi"
                   || panelId == "panelHeaderTopic") {
                if (cbmodel.layout.currentScreen == "invitations" && panelId == "panelHeaderInvi"
                    || cbmodel.layout.currentScreen == "topics" && panelId == "panelHeaderTopic") {
                    var pre = cbmodel.layout.previousScreen;
                    if (pre == "invitations" || pre == "topics")
                        pre = cbmodel.layout.mainScreenOrChatArea ? "mainScreen" : "chatArea";
                    cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                    cbmodel.layout.currentScreen = pre;
                }
                else {
                    cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                    cbmodel.layout.currentScreen = panelId == "panelHeaderInvi" ? "invitations" : "topics";
                }
                if (panelId == "panelHeaderTopic") {
                    self.loadTopicList();
                }
                self.modelUpdated();
            }
        },
        invitePeopleToTopic: function (btnId) {
            if (btnId == "inviteDomain")
                cbmodel.data.invitingPeople = 0;
            else if (btnId == "inviteLink")
                cbmodel.data.invitingPeople = 1;
            else
                cbmodel.data.invitingPeople = 2;
            tempUniqueId++;

            //send ok!
            var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);
            if (cbmodel.data.invitingPeople == 1) {
                newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current URL to chat.", Id: tempUniqueId });
            }
            else if (cbmodel.data.invitingPeople == 0) {
                newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current domain to chat.", Id: tempUniqueId });
            }
            else {
                newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited admin of current site to chat.", Id: tempUniqueId });
            }
            cbmodel.data.currentTopicMessages = newArr;

            if (cbmodel.data.invitingPeople != 2) {
                coreBusiness.sendInvitation(utils.getCurrentUri(), cbmodel.data.invitingPeople == 0, cbmodel.data.activeTopic, function (response) {
                    utils.consoleLog("send invitation ok");
                }, function (error) {
                    //send not ok
                    utils.consoleLog("failed to send invitation: " + error);
                });
            }
            else {
                coreBusiness.sendAdminInvitation(utils.getCurrentUri(), cbmodel.data.activeTopic, function (response) {
                    utils.consoleLog("send invitation ok");
                }, function (error) {
                    //send not ok
                    utils.consoleLog("failed to send invitation: " + error);
                });
            }
            self.modelUpdated();
        },
        invitePeople: function (btnId) {
            if (btnId == "inviteDomain")
                cbmodel.data.invitingPeople = 0;
            else if (btnId == "inviteLink")
                cbmodel.data.invitingPeople = 1;
            else
                cbmodel.data.invitingPeople = 2;

            if (cbmodel.data.invitingPeople != 2) {
                cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                cbmodel.layout.currentScreen = "newtopic";
                self.modelUpdated();
            }
            else {
                coreBusiness.inviteAdminToChat(function () {
                    //create admin topic ok!
                }, self.joinTopicOK, function (response) {
                    //send ok!
                    tempUniqueId++;
                    var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);
                    newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited admin of current domain to chat.", Id: tempUniqueId });

                    if (cbmodel.data.statistics.AdminCount == 0)
                    {
                        tempUniqueId++;
                        newArr.push({ UserName: "admin", CreatedDate: new Date(), Text: "Hey, we are not online, please leave your name, email and questions so that we can help you later. ", Id: tempUniqueId });
                    }

                    cbmodel.data.currentTopicMessages = newArr;
                    self.modelUpdated();
                });
            }
        },
        cancelNewTopic: function () {
            cbmodel.data.invitingPeople = -1;
            cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
            cbmodel.layout.currentScreen = "mainScreen";
            self.modelUpdated();
        },
        sendUserMessage: function (msg, okfunc) {
            coreBusiness.sendMessage(utils.getCurrentUri(), cbmodel.data.activeTopic, msg, function (topic, response) {
                //send ok!
                tempUniqueId++;

                var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);
                newArr.push({ UserName: "me", CreatedDate: new Date(), Text: msg, Id: tempUniqueId });
                cbmodel.data.currentTopicMessages = newArr;

                self.modelUpdated();
                if (okfunc)
                    okfunc.call(this);
            }, function (error) {
                //send not ok
                utils.consoleLog("failed to send message: " + error);
            });
        },
        openChatArea: function (activeTopic) {
            cbmodel.data.activeTopic = activeTopic;

            cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
            cbmodel.layout.currentScreen = "chatArea";
            cbmodel.layout.mainScreenOrChatArea = false;

            if(!activeTopic.isNewTopic)
            {
                var hasData = false;
                coreBusiness.getRecentChatMessages(activeTopic, function (data, currentTopicId) {
                    utils.consoleLog("get recent chat messages OK!");
                    if (data && data.length) {
                        var msgs = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].Type == 2)
                                msgs.push(data[i]);
                        }
                        cbmodel.data.currentTopicMessages = msgs;
                        hasData= true;
                        self.modelUpdated();
                    }
                });
                if(!hasData)
                    self.modelUpdated();
            }
            else
            {
                //new topic!
                //self.modelUpdated();
                activeTopic.isNewTopic= false;
            }
        },
        loadTopicList: function () {
            //get the topic list
            if (cbmodel.layout.currentScreen == "topics") {
                if (cbmodel.data.searchTopicKey) {
                    coreBusiness.searchTopic(cbmodel.data.searchTopicKey, function (data) {
                        //data is an array of topic view model, not topic objects
                        utils.consoleLog("search topics OK!");
                        cbmodel.data.topicData = data.domain;
                        self.modelUpdated();
                    });
                }
                else
                {
                    coreBusiness.loadTopics(function (data) {
                        //data is an array of topic view model, not topic objects
                        utils.consoleLog("load topics OK!");
                        cbmodel.data.topicData = data.domain;
                        self.modelUpdated();
                    });
                }
            }
            if (!topicLoadThread)
                topicLoadThread = setInterval(self.loadTopicList, 5000);
        },
        searchTopic: function (topicName) {
            if (cbmodel.layout.currentScreen == "topics") {
                coreBusiness.searchTopic(topicName, function (data) {
                    //data is an array of topic view model, not topic objects
                    utils.consoleLog("search topics OK!");
                    cbmodel.data.topicData = data.domain;
                    self.modelUpdated();
                });
            }
        },
        loadInvitationList: function () {
            coreBusiness.getRecentInvitations(function (data) {
                //data is an array of invitation view model
                utils.consoleLog("load initial invitations OK!");
                var newArr = utils.cloneArray(cbmodel.data.invitationData);
                for (var i = 0; i < data.length; i++) {
                    if (!data[i].IsAdminInvitation || data[i].FromBackend) {
                        if (!utils.checkInvitationExist(newArr, data[i])) {
                            newArr.unshift(data[i]);
                        }
                    }
                }
                cbmodel.data.invitationData = newArr;
                self.modelUpdated();
            });
        },
        changeName: function () {
            if (cbmodel.layout.currentScreen != "registration") {
                cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                cbmodel.layout.currentScreen = "registration";
                cbmodel.layout.mainScreenOrChatArea = true;
                self.modelUpdated();
            }
        },
        registerAnonymousName: function (name) {
            coreBusiness.createAutoUser(name, function (data) {
                cbmodel.data.userData = { userName: data.name, avatar: null };
                cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                cbmodel.layout.currentScreen = "mainScreen";
                cbmodel.layout.mainScreenOrChatArea = true;
                self.modelUpdated();
            });
        },
        cancelRegistration: function () {
            if (cbmodel.layout.currentScreen == "registration") {
                cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                cbmodel.layout.currentScreen = "mainScreen";
                cbmodel.layout.mainScreenOrChatArea = true;
                self.modelUpdated();
            }
        },
        toogleSlideInMenu: function () {
            if (cbmodel.layout.currentScreen == "chatArea") {
                cbmodel.layout.slideInMenuActive = !cbmodel.layout.slideInMenuActive;
                self.modelUpdated();
            }
        },
        leaveCurrentTopic: function () {
            var topic = cbmodel.data.activeTopic;
            if (topic) {
                coreBusiness.leaveTopic(utils.getCurrentUri(), topic, function (activeTopic, response) {
                    utils.consoleLog('leave topic successfully');

                    cbmodel.data.activeTopic = null;
                    cbmodel.data.currentTopicMessages = [];
                    cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                    cbmodel.layout.currentScreen = "mainScreen";
                    cbmodel.layout.mainScreenOrChatArea = true;
                    self.modelUpdated();

                }, function (error) {
                    //leave topic not ok
                    utils.consoleLog("failed to leave topic " + topic.TopicId + " : " + error);
                });
            }
        },
        joinTopicOK: function (topic) {
            utils.consoleLog("joined topic OK!");
            self.openChatArea(topic);
        },
        fetchStatistics: function () {
            var topicId = cbmodel.data.activeTopic ? cbmodel.data.activeTopic.TopicId : null;
            if (cbmodel.layout.currentScreen == "mainScreen"
                    || cbmodel.layout.currentScreen == "chatArea" && cbmodel.layout.slideInMenuActive) {
                coreBusiness.fetchStats(topicId, function (data) {
                    utils.consoleLog("fetch statistics OK!");
                    cbmodel.data.statistics = data;
                    self.modelUpdated();
                });
            }
            setTimeout(self.fetchStatistics, 3000);
        },
        createNewTopic: function (name) {
            coreBusiness.createTopic(name, cbmodel.data.invitingPeople == 0, function (topic) {
                utils.consoleLog("created topic OK!");
                topic.isNewTopic= true;
            }, self.joinTopicOK, function (response) {
                utils.consoleLog("sent invitation for topic OK!");
                tempUniqueId++;

                var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);

                if (cbmodel.data.invitingPeople == 0)
                    newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current domain to chat.", Id: tempUniqueId });
                else if (cbmodel.data.invitingPeople == 1)
                    newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current link to chat.", Id: tempUniqueId });
                else if (cbmodel.data.invitingPeople == 2)
                    newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited admin of current domain to chat.", Id: tempUniqueId });

                cbmodel.data.currentTopicMessages = newArr;

                self.modelUpdated();
            });
        },
        autoRegister: function (name, okFunc) {
            if (cbmodel.data.userData == null || cbmodel.data.userData.userName == null) {
                coreBusiness.createAutoUser(name, function (data) {
                    cbmodel.data.userData = { userName: data.name, avatar: null };
                    if (okFunc)
                        okFunc.call(this);
                });
            }
        },
        showTopicNotification: function (msgs/*array of MessageViewModel*/) {
            var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);
            for (var i = 0; i < msgs.length; i++) {
                msgs[i].Text = msgs[i].Type == 7 ? " joined." : " left.";
                newArr.push(msgs[i]);
            }
            cbmodel.data.currentTopicMessages = newArr;
            self.modelUpdated();
        },
        showChatMessage: function (msgs/*array of MessageViewModel*/) {
            var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);
            for (var i = 0; i < msgs.length; i++) {
                newArr.push(msgs[i]);
            }
            cbmodel.data.currentTopicMessages = newArr;
            self.modelUpdated();
        },
        showAdminInvitation: function (msgs) {
            var newArr = utils.cloneArray(cbmodel.data.invitationData);
            for (var i = 0; i < msgs.length; i++) {
                if (!utils.checkInvitationExist(newArr, msgs[i])) {
                    newArr.unshift(msgs[i]);
                }
            }
            cbmodel.data.invitationData = newArr;
            self.modelUpdated();
        },
        showInvitation: function (msgs/*array of InvitationViewModel*/) {
            var newArr = utils.cloneArray(cbmodel.data.invitationData);
            for (var i = 0; i < msgs.length; i++) {
                if (!utils.checkInvitationExist(newArr, msgs[i])) {
                    newArr.unshift(msgs[i]);
                }
            }
            cbmodel.data.invitationData = newArr;
            self.modelUpdated();
        }
    });
    coreBusiness.bindRenderCallbacks(self.showInvitation, self.showChatMessage, self.showAdminInvitation, self.showTopicNotification);
    return self;
};

module.exports = UIBusiness;


