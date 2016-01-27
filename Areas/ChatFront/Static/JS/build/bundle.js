(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('./Utils.js');

var lastReadTime = null;
var readingTopic = null;
var readingThread = null;
var readingCallback = null;

var showInvitationFunc = [];
var showChatMessageFunc = [];
var showAdminInvitationFunc = [];
var showTopicNotificationFunc = [];

var CoreBusiness = function () {
    var self = this;
    $.extend(self, {
        bindRenderCallbacks: function (showInvitation, showChatMessage, showAdminInvitation, showTopicNotification) {
            showInvitationFunc.push(showInvitation);
            showChatMessageFunc.push(showChatMessage);
            showAdminInvitationFunc.push(showAdminInvitation);
            showTopicNotificationFunc.push(showTopicNotification);
        },
        joinTopic: function (uri, topic, okcallback, failcallback) {
            var activeTopic = topic;
            // Reference the auto-generated proxy for the hub.
            var chat = $.connection.yetAnotherChatHub;
            chat.server.joinTopic(uri, topic.TopicId).done(function (response) {
                if (okcallback) {
                    okcallback.call(this, activeTopic, response);
                }
            }).fail(function (error) {
                if (failcallback) {
                    failcallback.call(this, error);
                }
            });
        },
        leaveTopic: function (uri, topic, okcallback, failcallback) {
            var activeTopic = topic;
            // Reference the auto-generated proxy for the hub.
            var chat = $.connection.yetAnotherChatHub;
            chat.server.leaveTopic(uri, topic.TopicId).done(function (response) {
                if (okcallback) {
                    okcallback.call(this, activeTopic, response);
                }
            }).fail(function (error) {
                if (failcallback) {
                    failcallback.call(this, error);
                }
            });
        },
        sendAdminInvitation: function (uri, topic, okcallback, failcallback) {
            // Reference the auto-generated proxy for the hub.
            var chat = $.connection.yetAnotherChatHub;
            chat.server.serverReceiveAdminInvitation(uri, topic.TopicId, new Date().toISOString()).done(function (response) {
                if (okcallback) {
                    okcallback.call(this, response);
                }
            }).fail(function (error) {
                if (failcallback) {
                    failcallback.call(this, error);
                }
            });
        },
        sendInvitation: function (uri, inviteAll, topic, okcallback, failcallback) {
            // Reference the auto-generated proxy for the hub.
            var chat = $.connection.yetAnotherChatHub;
            chat.server.serverReceiveInvitation(uri, inviteAll, topic.TopicId, new Date().toISOString()).done(function (response) {
                if (okcallback) {
                    okcallback.call(this, response);
                }
            }).fail(function (error) {
                if (failcallback) {
                    failcallback.call(this, error);
                }
            });
        },
        sendMessage: function (uri, topic, text, okcallback, failcallback) {
            // Reference the auto-generated proxy for the hub.
            var chat = $.connection.yetAnotherChatHub;
            chat.server.serverReceiveMsg(uri, topic.TopicId, text, new Date().toISOString()).done(function (response) {
                if (okcallback) {
                    okcallback.call(this, topic, response);
                }
            }).fail(function (error) {
                if (failcallback) {
                    failcallback.call(this, error);
                }
            });
        },
        startSignalRConnection: function () {
            // Start the connection.
            $.connection.hub.qs = { 'uri': utils.getCurrentUri() };
            $.connection.hub.start().done(function () {
                utils.consoleLog("connection started");
            }).fail(function (error) {
                //log why fail
            });;
        },
        processReceivedMsg: function (msgs /*array of MessageViewModel*/) {
            if (!msgs || !msgs.length) {
                if (console) console.error("There is no message to receive");
                return;
            }

            if (msgs[0].Type == 6 /*invitation*/) {
                    for (var i = 0; i < showInvitationFunc.length; i++) {
                        showInvitationFunc[i](msgs);
                    }
                } else if (msgs[0].Type == 2 /*message*/) {
                    //show chat messages from other users in topic
                    for (var i = 0; i < showInvitationFunc.length; i++) {
                        showChatMessageFunc[i](msgs);
                    }
                } else if (msgs[0].Type == 9 /*admin invitation*/) {
                    //show admin invitations
                    for (var i = 0; i < showAdminInvitationFunc.length; i++) {
                        showAdminInvitationFunc[i](msgs);
                    }
                } else if (msgs[0].Type == 7 || msgs[0].Type == 8 /*join, leave topic notification*/) {
                    for (var i = 0; i < showTopicNotificationFunc.length; i++) {
                        showTopicNotificationFunc[i](msgs);
                    }
                }
        },
        initSignalR: function () {
            // Reference the auto-generated proxy for the hub.
            var chat = $.connection.yetAnotherChatHub;
            // Create a function that the hub can call back to display messages.
            //must register at least 1 event handler before starting the connection!
            chat.client.clientReceiveMsg = self.processReceivedMsg;
            self.startSignalRConnection();
        },
        getTopicDetail: function (topicId, okfunc, isBackend) {
            var url = null;
            if (isBackend) url = 'http://' + utils.getBackendDomain() + '/backendapp/api/TopicBackend/GetTopic';else url = 'http://' + utils.getBaseDomain() + '/chatfront/api/Topic/GetTopic';
            var topic = null;
            self.ajaxCall(url, 'uri=' + utils.getCurrentUri() + '&topicId=' + topicId, function (data) {
                topic = data;
                if (okfunc) {
                    okfunc.call(this, topic);
                }
            }, false);
            return topic;
        },
        ajaxCall: function (url, postdata, okFunction, post, failFunc) {
            $.ajax({
                url: url,
                type: post ? 'POST' : 'GET',
                data: postdata ? postdata : null
            }).done(function (data, textStatus, jqXHR) {

                if (okFunction) okFunction.call(this, data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                utils.consoleLog(errorThrown);
                if (failFunc) failFunc.call(this);
            });
        },
        createAutoUser: function (name, okFunction) {
            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/User/RegisterAnonymous?name=' + name, null, okFunction, true);
        },
        getRecentMessagesToRead: function (topic, okFunc) {
            if (topic) {
                readingTopic = topic;
                lastReadTime = null;
                readingCallback = okFunc;
            }

            var t = topic ? topic : readingTopic;
            var date = lastReadTime ? '&fromTimeStr=' + lastReadTime : '&fromTimeStr=&fromTime=' + utils.dateAdd(new Date(t.LastActivityDate), 'minute', -60).toISOString();
            date += '&toTime=' + utils.dateAdd(new Date(t.LastActivityDate), 'minute', 30).toISOString();
            var data = 'uri=' + utils.getCurrentUri() + '&topicId=' + t.TopicId + date;
            //utils.consoleLog("loading messages for topic" + t.Subject);
            self.getRecentChatMessages(t, function (data, currentTopicId) {
                if (data && data.length > 0) {
                    lastReadTime = data[data.length - 1].DateTickStr;
                }
                var f = function () {
                    self.getRecentMessagesToRead(null, readingCallback);
                };
                readingThread = setTimeout(f, 5000);
                if (okFunc) okFunc.call(this, data);
            }, true, data);
        },
        stopReadingMessages: function () {
            if (readingThread) clearTimeout(readingThread);
        },
        getRecentChatMessages: function (topic, okFunction, isBackend, backendData) {
            var date = utils.dateAdd(new Date(topic.LastActivityDate), 'minute', -30);
            var toDate = utils.dateAdd(new Date(topic.LastActivityDate), 'minute', 30);
            var currentTopicId = topic.TopicId;

            var postData = 'uri=' + utils.getCurrentUri() + '&topicId=' + topic.TopicId + '&fromTimeStr=&fromTime=' + date.toUTCString() + '&toTime=' + toDate.toUTCString();
            if (backendData) postData = backendData;
            if (isBackend) {
                var url = 'http://' + utils.getBackendDomain() + '/backendapp/api/MessageBackend/GetMessages';
            } else {
                url = 'http://' + utils.getBaseDomain() + '/chatfront/api/Message/GetMessages';
            }
            self.ajaxCall(url, postData, function (data) {
                if (okFunction) okFunction.call(this, data, currentTopicId);
            }, false);
        },
        getPreviewChatMessages: function (previewTopicId, okFunction, isBackend, backendData) {
            self.getTopicDetail(previewTopicId, function (topic) {
                var date = utils.dateAdd(new Date(topic.LastActivityDate), 'minute', -10);
                var toDate = utils.dateAdd(new Date(topic.LastActivityDate), 'minute', 30);
                var currentTopicId = topic.TopicId;

                var postData = 'uri=' + utils.getCurrentUri() + '&topicId=' + topic.TopicId + '&fromTimeStr=&fromTime=' + date.toUTCString() + '&maxCount=4' + '&toTime=' + toDate.toUTCString();
                if (backendData) postData = backendData;
                if (isBackend) {
                    var url = 'http://' + utils.getBackendDomain() + '/backendapp/api/MessageBackend/GetMessages';
                } else {
                    url = 'http://' + utils.getBaseDomain() + '/chatfront/api/Message/GetMessages';
                }
                self.ajaxCall(url, postData, function (data) {
                    if (okFunction) okFunction.call(this, data, currentTopicId);
                }, false);
            }, isBackend);
        },
        getRecentInvitations: function (okFunction, fromDate, isBackend, includeOffline, toTime) {
            var date = fromDate ? fromDate : utils.dateAdd(new Date(), 'minute', -60);
            var postData = 'uri=' + utils.getCurrentUri() + '&fromTime=' + date.toUTCString();
            if (toTime) postData += '&toTime=' + toTime.toUTCString();
            if (includeOffline) postData += '&includeOffline=true';else postData += '&includeOffline=false';
            if (isBackend) {
                var url = 'http://' + utils.getBackendDomain() + '/backendapp/api/MessageBackend/GetRecentInvitations';
            } else {
                url = 'http://' + utils.getBaseDomain() + '/chatfront/api/Message/GetRecentInvitations';
            }
            self.ajaxCall(url, postData, function (data) {
                if (okFunction) okFunction.call(this, data);
            }, false);
        },
        joinInvitation: function (topicId, activeTopic, clearFunc, joinOkFunc, isBackend) {
            if (activeTopic) {
                //leave current topic first
                self.leaveTopic(utils.getCurrentUri(), activeTopic, function (activeTopic, response) {
                    //leave topic successfully
                    utils.consoleLog("leave topic successfully");
                    if (clearFunc) clearFunc.call(this);
                }, function () {
                    //jion topic not ok
                    //send not ok
                    utils.consoleLog("failed to leave topic");
                });
            }

            //get the new topic detail and join it afterward
            self.getTopicDetail(topicId, function (newTopic /*topicviewmodel*/) {
                utils.consoleLog("going to join topic " + newTopic.TopicId);
                self.gotoTopic(newTopic, joinOkFunc);
            }, isBackend);
        },
        gotoTopic: function (topic, okfunc) {
            self.joinTopic(utils.getCurrentUri(), topic, function (activeTopic, response) {
                if (okfunc) {
                    okfunc.call(this, activeTopic);
                }
            }, function (error) {
                //jion topic not ok
                //send not ok
                utils.consoleLog("failed to join topic " + topic.TopicId + " : " + error);
            });
        },
        inviteAdminToChat: function (createTopicOkFunc, joinTopicOKFunc, sendInviteOkFunc) {

            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Topic/CreateAdmin?&uri=' + utils.getCurrentUri(), null, function (topic) {

                if (createTopicOkFunc) createTopicOkFunc.call(this, topic);

                var t = topic;
                var uri = utils.getCurrentUri();
                self.gotoTopic(t, function (data) {
                    if (joinTopicOKFunc) joinTopicOKFunc.call(this, data);

                    self.sendAdminInvitation(utils.getCurrentUri(), t, sendInviteOkFunc, function (error) {
                        //send not ok
                        utils.consoleLog("failed to send invitation: " + error);
                    });
                });
            }, true);
        },
        createTopic: function (topicName, inviteAll, createOkFunc, joinOkFunc, sendInviteOkFunc) {
            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Topic/Create?name=' + topicName + '&uri=' + utils.getCurrentUri(), null, function (topic) {

                if (createOkFunc) createOkFunc.call(this, topic);
                var t = topic;
                var uri = utils.getCurrentUri();
                self.gotoTopic(t, function (data) {
                    if (joinOkFunc) joinOkFunc.call(this, data);
                    self.sendInvitation(uri, inviteAll, t, sendInviteOkFunc, function (error) {
                        //send not ok
                        utils.consoleLog("failed to send invitation: " + error);
                    });
                });
            }, true);
        },
        searchTopic: function (topicName, okFunc, isBackEnd) {
            if (!isBackEnd) {
                self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Topic/GetTopics', 'currentUri=' + utils.getCurrentUri() + '&filter=3&searchPharse=' + topicName + '&page=0&pageSize=10', okFunc, false);
            }
        },
        loadTopics: function (okFunc) {
            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Topic/GetTopics', 'currentUri=' + utils.getCurrentUri() + '&filter=3&searchPharse=&page=0&pageSize=10', okFunc, false);
        },
        loadTopicsBackend: function (okFunc, admin, active) {
            var act = typeof active === "undefined" ? "" : active ? "&active=true" : "&active=false";
            self.ajaxCall('http://' + utils.getBackendDomain() + '/backendapp/api/TopicBackend/GetTopicsBackend', 'currentUri=' + utils.getCurrentUri() + '&filter=3&searchPharse=&page=0&pageSize=30&adminTopic=' + admin + act, okFunc, false);
        },
        loadTopicsBackendOnce: function (okFunc, count, includeOffline) {
            self.ajaxCall('http://' + utils.getBackendDomain() + '/backendapp/api/TopicBackend/GetTopicsBackendOnce', 'currentUri=' + utils.getCurrentUri() + '&p1_filter=2&p1_searchPharse=&p1_page=0&p1_pageSize=' + count + '&p1_adminTopic=true&p1_includeOffline=' + (includeOffline ? 'true' : 'false') + '&p2_filter=2&p2_searchPharse=&p2_page=0&p2_pageSize=' + count + '&p2_adminTopic=false&p2_includeOffline=' + (includeOffline ? 'true' : 'false'), okFunc, false);
        },
        fetchStats: function (topicId, okFunc) {
            var getData = 'uri=' + utils.getCurrentUri() + (topicId ? '&topicId=' + topicId : '');
            //get the topic list
            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Statistics/get', getData, okFunc, false);
        }

    });
    return self;
};
module.exports = CoreBusiness;

},{"./Utils.js":2}],2:[function(require,module,exports){
var Utils = function () {
    var self = this;
    $.extend(self, {
        getCurrentUri: function () {
            if (!window.uri) {
                if ($("#currentDomain").length) window.uri = $("#currentDomain").val();else if ($.cookie("currentDomain")) window.uri = $.cookie("currentDomain");else window.uri = window.location.getParameter("uri");
            }
            return window.uri;
        },
        getBaseDomain: function () {
            return $("#baseDomain").val();
        },
        getBackendDomain: function () {
            return $("#backendDomain").val();
        },
        cloneArray(arr) {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                newArr.push(jQuery.extend(true, {}, arr[i]));
            }
            return newArr;
        },
        compareSortedArray(arr1, arr2) {
            if (arr1.length != arr2.length) return false;
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i].Id != arr2[i].Id) return false;
            }
            return true;
        },
        dateAdd: function (date, interval, units) {
            var ret = new Date(date); //don't change original date
            switch (interval.toLowerCase()) {
                case 'year':
                    ret.setFullYear(ret.getFullYear() + units);break;
                case 'quarter':
                    ret.setMonth(ret.getMonth() + 3 * units);break;
                case 'month':
                    ret.setMonth(ret.getMonth() + units);break;
                case 'week':
                    ret.setDate(ret.getDate() + 7 * units);break;
                case 'day':
                    ret.setDate(ret.getDate() + units);break;
                case 'hour':
                    ret.setTime(ret.getTime() + units * 3600000);break;
                case 'minute':
                    ret.setTime(ret.getTime() + units * 60000);break;
                case 'second':
                    ret.setTime(ret.getTime() + units * 1000);break;
                default:
                    ret = undefined;break;
            }
            return ret;
        },
        consoleLog: function (msg) {
            if (typeof console != "undefined") console.log(msg);
        },
        closeError: function (event) {
            event = event || window.event;
            var $errorDiv = $(event.target).parent().parent();
            $errorDiv.children().remove();
            $errorDiv.hide();
            return false;
        },
        showError: function (areaId, error) {
            var $errSpans = $("<div><span class='error'>" + error + "</span><a href='javascript:void(0);'>Close</a></div>");
            var a = $errSpans.children("a");
            a.click(self.closeError);
            $("#" + areaId).append($errSpans);
            $("#" + areaId).show();
        },
        // This optional function html-encodes messages for display in the page.
        htmlEncode: function (value) {
            var encodedValue = $('<div />').text(value).html();
            return encodedValue;
        },
        checkInvitationExist: function (arr, newInvi, timeDiff) {
            var time = timeDiff ? timeDiff * 1000 * 60 : 3 * 1000 * 60 /*3p*/;
            for (var i = 0; i < arr.length; i++) {
                if (newInvi.UserName == arr[i].UserName && newInvi.TopicSubject == arr[i].TopicSubject) {
                    var date = new Date(newInvi.CreatedDate);
                    var date2 = new Date(arr[i].CreatedDate);
                    if (Math.abs(date - date2) < time) return true;
                }
            }
            return false;
        }
    });
    return self;
};

module.exports = new Utils();

if (!window.location.getParameter) {
    window.location.getParameter = function (key) {
        function parseParams() {
            var params = {},
                e,
                a = /\+/g,
                // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
                d = function (s) {
                return decodeURIComponent(s.replace(a, " "));
            },
                q = window.location.search.substring(1);

            while (e = r.exec(q)) params[d(e[1])] = d(e[2]);

            return params;
        }

        if (!this.queryStringParams) this.queryStringParams = parseParams();

        return this.queryStringParams[key];
    };
}

},{}],3:[function(require,module,exports){
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
    displayName: 'ChatBox',

    sendMessage: function (text) {
        uiBusiness.sendUserMessage(text);
    },
    joinInvitation: function (topicId) {
        uiBusiness.joinInvitation(topicId);
    },
    showPanel: function (panelId) {
        uiBusiness.showPanel(panelId);
    },
    toogleSlideInMenu: function () {
        uiBusiness.toogleSlideInMenu();
    },
    invitePeopleToTopic: function (buttonInviteId) {
        uiBusiness.invitePeopleToTopic(buttonInviteId);
    },
    leaveCurrentTopic: function () {
        uiBusiness.leaveCurrentTopic();
    },
    invitePeople: function (buttonInviteId) {
        uiBusiness.invitePeople(buttonInviteId);
    },
    createNewTopic: function (topicName) {
        uiBusiness.createNewTopic(topicName);
    },
    cancelNewTopic: function () {
        uiBusiness.cancelNewTopic();
    },
    registerAnonymousName: function (name) {
        uiBusiness.registerAnonymousName(name);
    },
    cancelRegistration: function () {
        uiBusiness.cancelRegistration();
    },
    searchTopic: function (name) {
        uiBusiness.searchTopic(name);
    },
    joinSelectedTopic: function (topicId) {
        uiBusiness.joinSelectedTopic(topicId);
    },
    changeName: function () {
        uiBusiness.changeName();
    },
    getInitialState: function () {
        cbmodel.bindUpdateFunc(this.setState, this);
        return cbmodel;
    },

    componentDidMount: function () {
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
    render: function () {
        return React.createElement(
            'div',
            { className: 'reactContainer' },
            React.createElement(Accordion, { model: this.state, sendMessage: this.sendMessage,
                joinInvitation: this.joinInvitation,
                showPanel: this.showPanel,
                toogleSlideInMenu: this.toogleSlideInMenu,
                invitePeopleToTopic: this.invitePeopleToTopic,
                leaveCurrentTopic: this.leaveCurrentTopic,
                invitePeople: this.invitePeople,
                searchTopic: this.searchTopic,
                joinSelectedTopic: this.joinSelectedTopic,
                changeName: this.changeName }),
            React.createElement(Registration, { currentScreen: this.state.layout.currentScreen, userData: this.state.data.userData,
                registerAnonymousName: this.registerAnonymousName,
                cancelRegistration: this.cancelRegistration,
                changeName: this.changeName }),
            React.createElement(NewTopic, { currentScreen: this.state.layout.currentScreen, userData: this.state.data.userData,
                createNewTopic: this.createNewTopic,
                cancelNewTopic: this.cancelNewTopic,
                changeName: this.changeName })
        );
    }
});

ReactDOM.render(React.createElement(ChatBox, null), document.getElementById('container'));

},{"./../app_common/BusinessCore.js":1,"./../app_common/Utils.js":2,"./../app_ui/Accordion.js":6,"./../app_ui/NewTopic.js":14,"./../app_ui/Registration.js":15,"./ChatBoxModel.js":4,"./UIBusiness.js":5}],4:[function(require,module,exports){
/*
ALL PROPERTY OF THIS MODEL THAT ARE OBJECT MUST BE CLONED, THEN MODIFIED, THEN ASSIGNED BACK, TO MAKE shouldComponentUpdate WORKS
*/
var _updateFunc = null;
var _updateContext = null;
var cbmodel = {
    layout: {
        currentScreen: "mainScreen", /*"mainScreen", "invitations", "topics", "registration", "newtopic","chatArea"  */
        previousScreen: null,
        slideInMenuActive: false,
        mainScreenOrChatArea: true
    },
    data: {
        connectionStatus: 0, /* 0:not started, 1: succeeded, 2:  */
        invitingPeople: -1, /* -1: null, 0: domain, 1: link, 2: admin*/
        activeTopic: null,
        /*latestInviCount: -4,
        latestTopicCount: -5,*/
        userData: { userName: null, avatar: null },
        statistics: /*StatisticViewModel*/{ DomainUserCount: 0, LinkUserCount: 0, AdminCount: 0 },
        invitationData: /*array of InvitationViewModel*/[],
        topicData: /*array of TopicViewModel*/[],
        currentTopicMessages: /*array of MessageViewModel*/[],
        searchTopicKey: null
    },
    bindUpdateFunc: function (func, context) {
        _updateFunc = func;
        _updateContext = context;
    },
    raiseChanged: function () {
        if (_updateFunc && _updateContext) _updateFunc.call(_updateContext, this);
    }
};
module.exports = cbmodel;

},{}],5:[function(require,module,exports){
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
            if (!topic) return;
            coreBusiness.gotoTopic(topic, self.joinTopicOK);
        },
        joinInvitation: function (topicId) {
            if (!cbmodel.data.activeTopic || cbmodel.data.activeTopic.TopicId != topicId) {
                coreBusiness.joinInvitation(topicId, cbmodel.data.activeTopic, function () {
                    cbmodel.data.activeTopic = null;
                }, self.joinTopicOK);
            } else if (cbmodel.data.activeTopic && cbmodel.data.activeTopic.TopicId == topicId) {
                var pre = cbmodel.layout.previousScreen;
                cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                cbmodel.layout.currentScreen = pre;
                self.modelUpdated();
            }
        },
        showPanel: function (panelId) {
            if (panelId == "panelHeaderInvi" || panelId == "panelHeaderTopic") {
                if (cbmodel.layout.currentScreen == "invitations" && panelId == "panelHeaderInvi" || cbmodel.layout.currentScreen == "topics" && panelId == "panelHeaderTopic") {
                    var pre = cbmodel.layout.previousScreen;
                    if (pre == "invitations" || pre == "topics") pre = cbmodel.layout.mainScreenOrChatArea ? "mainScreen" : "chatArea";
                    cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                    cbmodel.layout.currentScreen = pre;
                } else {
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
            if (btnId == "inviteDomain") cbmodel.data.invitingPeople = 0;else if (btnId == "inviteLink") cbmodel.data.invitingPeople = 1;else cbmodel.data.invitingPeople = 2;
            tempUniqueId++;

            //send ok!
            var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);
            if (cbmodel.data.invitingPeople == 1) {
                newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current URL to chat.", Id: tempUniqueId });
            } else if (cbmodel.data.invitingPeople == 0) {
                newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current domain to chat.", Id: tempUniqueId });
            } else {
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
            } else {
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
            if (btnId == "inviteDomain") cbmodel.data.invitingPeople = 0;else if (btnId == "inviteLink") cbmodel.data.invitingPeople = 1;else cbmodel.data.invitingPeople = 2;

            if (cbmodel.data.invitingPeople != 2) {
                cbmodel.layout.previousScreen = cbmodel.layout.currentScreen;
                cbmodel.layout.currentScreen = "newtopic";
                self.modelUpdated();
            } else {
                coreBusiness.inviteAdminToChat(function () {
                    //create admin topic ok!
                }, self.joinTopicOK, function (response) {
                    //send ok!
                    tempUniqueId++;
                    var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);
                    newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited admin of current domain to chat.", Id: tempUniqueId });

                    if (cbmodel.data.statistics.AdminCount == 0) {
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
                if (okfunc) okfunc.call(this);
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

            if (!activeTopic.isNewTopic) {
                var hasData = false;
                coreBusiness.getRecentChatMessages(activeTopic, function (data, currentTopicId) {
                    utils.consoleLog("get recent chat messages OK!");
                    if (data && data.length) {
                        var msgs = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].Type == 2) msgs.push(data[i]);
                        }
                        cbmodel.data.currentTopicMessages = msgs;
                        hasData = true;
                        self.modelUpdated();
                    }
                });
                if (!hasData) self.modelUpdated();
            } else {
                //new topic!
                //self.modelUpdated();
                activeTopic.isNewTopic = false;
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
                } else {
                    coreBusiness.loadTopics(function (data) {
                        //data is an array of topic view model, not topic objects
                        utils.consoleLog("load topics OK!");
                        cbmodel.data.topicData = data.domain;
                        self.modelUpdated();
                    });
                }
            }
            if (!topicLoadThread) topicLoadThread = setInterval(self.loadTopicList, 5000);
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
            if (cbmodel.layout.currentScreen == "mainScreen" || cbmodel.layout.currentScreen == "chatArea" && cbmodel.layout.slideInMenuActive) {
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
                topic.isNewTopic = true;
            }, self.joinTopicOK, function (response) {
                utils.consoleLog("sent invitation for topic OK!");
                tempUniqueId++;

                var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);

                if (cbmodel.data.invitingPeople == 0) newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current domain to chat.", Id: tempUniqueId });else if (cbmodel.data.invitingPeople == 1) newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current link to chat.", Id: tempUniqueId });else if (cbmodel.data.invitingPeople == 2) newArr.push({ UserName: "me", CreatedDate: new Date(), Text: "Invited admin of current domain to chat.", Id: tempUniqueId });

                cbmodel.data.currentTopicMessages = newArr;

                self.modelUpdated();
            });
        },
        autoRegister: function (name, okFunc) {
            if (cbmodel.data.userData == null || cbmodel.data.userData.userName == null) {
                coreBusiness.createAutoUser(name, function (data) {
                    cbmodel.data.userData = { userName: data.name, avatar: null };
                    if (okFunc) okFunc.call(this);
                });
            }
        },
        showTopicNotification: function (msgs /*array of MessageViewModel*/) {
            var newArr = utils.cloneArray(cbmodel.data.currentTopicMessages);
            for (var i = 0; i < msgs.length; i++) {
                msgs[i].Text = msgs[i].Type == 7 ? " joined." : " left.";
                newArr.push(msgs[i]);
            }
            cbmodel.data.currentTopicMessages = newArr;
            self.modelUpdated();
        },
        showChatMessage: function (msgs /*array of MessageViewModel*/) {
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
        showInvitation: function (msgs /*array of InvitationViewModel*/) {
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

},{"./../app_common/Utils.js":2}],6:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');

var MainScreen = require('./MainScreen.js');
var ChatArea = require('./ChatArea.js');
var ActionSlideInMenu = require('./ActionSlideInMenu.js');
var InvitationList = require('./InvitationList.js');
var TopicList = require('./TopicList.js');

var Accordion = React.createClass({
    displayName: 'Accordion',

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("Accordion updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },
    handleClick: function () {},
    panelHeaderClick: function (event) {
        this.props.showPanel(event.currentTarget.id);
    },
    setTopicSearchKey: function (topicName) {
        this.props.model.data.searchTopicKey = topicName;
    },
    render: function () {
        var top = '404px';
        var inviArrow = 'arrowDown';
        var topicArrow = 'arrowDown';
        var inviActive = this.props.model.layout.currentScreen == 'invitations' ? 'active' : 'collapsed';
        if (inviActive == 'active') {
            top = '0px';
            inviArrow = 'arrowUp';
        }
        var topicActive = this.props.model.layout.currentScreen == 'topics' ? 'active' : 'collapsed';
        if (topicActive == 'active') {
            top = '0px';
            topicArrow = 'arrowUp';
        }
        if (inviActive != 'active' && topicActive != 'active') {
            top = '404px';
            inviActive = 'collapsed';
            topicActive = 'collapsed';
        }

        var accordionActive = '';

        if (this.props.model.layout.currentScreen == "newtopic" || this.props.model.layout.currentScreen == "registration") {
            accordionActive = ' hidden';
        }

        var defaultComp = this.props.model.layout.mainScreenOrChatArea ? React.createElement(MainScreen, { statistics: this.props.model.data.statistics,
            userData: this.props.model.data.userData,
            invitePeople: this.props.invitePeople,
            changeName: this.props.changeName }) : React.createElement(ChatArea, { leaveCurrentTopic: this.props.leaveCurrentTopic, activeTopic: this.props.model.data.activeTopic,
            userName: this.props.model.data.userData.userName,
            active: this.props.model.layout.currentScreen == "chatArea",
            currentTopicMessages: this.props.model.data.currentTopicMessages, sendMessage: this.props.sendMessage });

        return React.createElement(
            'div',
            { className: "accordion" + accordionActive },
            React.createElement(
                'div',
                { className: 'defaultPanel' },
                defaultComp,
                React.createElement(ActionSlideInMenu, { currentScreen: this.props.model.layout.currentScreen,
                    slideInMenuActive: this.props.model.layout.slideInMenuActive,
                    statistics: this.props.model.data.statistics,
                    toogleSlideInMenu: this.props.toogleSlideInMenu,
                    invitePeopleToTopic: this.props.invitePeopleToTopic })
            ),
            React.createElement(
                'ul',
                { className: 'panelHeaders', style: { top: top } },
                React.createElement(
                    'li',
                    { className: "panel panelHeader " + inviActive, id: 'panelHeaderInvi', onClick: this.panelHeaderClick },
                    React.createElement(
                        'span',
                        { className: 'panelTitle' },
                        'Invitations '
                    ),
                    React.createElement(
                        'span',
                        { className: 'panelUpdate' },
                        '(',
                        this.props.model.data.invitationData.length,
                        ')'
                    ),
                    React.createElement('i', { className: "arrowIcon " + inviArrow })
                ),
                React.createElement(
                    'li',
                    { className: "panel panelHeader topicPanel " + topicActive, id: 'panelHeaderTopic', onClick: this.panelHeaderClick },
                    React.createElement(
                        'span',
                        { className: 'panelTitle' },
                        'Hot topics '
                    ),
                    React.createElement('i', { className: "arrowIcon " + topicArrow })
                )
            ),
            React.createElement(
                'div',
                { className: "panelContent " + inviActive, id: 'panel1' },
                React.createElement(InvitationList, { invitationData: this.props.model.data.invitationData, joinInvitation: this.props.joinInvitation })
            ),
            React.createElement(
                'div',
                { className: "panelContent " + topicActive, id: 'panel2' },
                React.createElement(TopicList, { topicData: this.props.model.data.topicData, setTopicSearchKey: this.setTopicSearchKey,
                    searchTopic: this.props.searchTopic,
                    joinSelectedTopic: this.props.joinSelectedTopic })
            )
        );
    }
});

module.exports = Accordion;

},{"./../app_common/Utils.js":2,"./ActionSlideInMenu.js":7,"./ChatArea.js":8,"./InvitationList.js":10,"./MainScreen.js":11,"./TopicList.js":16}],7:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');

var ActionSlideInMenu = React.createClass({
    displayName: "ActionSlideInMenu",

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("ActionSlideInMenu updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.currentScreen == nextProps.currentScreen;
        notUpdate = notUpdate & this.props.slideInMenuActive == nextProps.slideInMenuActive;
        notUpdate = notUpdate & this.props.statistics.DomainUserCount == nextProps.statistics.DomainUserCount;
        notUpdate = notUpdate & this.props.statistics.LinkUserCount == nextProps.statistics.LinkUserCount;
        notUpdate = notUpdate & this.props.statistics.AdminCount == nextProps.statistics.AdminCount;
        return !notUpdate;
    },
    handleClick: function (event) {
        this.props.toogleSlideInMenu();
    },
    buttonClick: function (event) {
        this.props.invitePeopleToTopic(event.target.id);
    },
    render: function () {
        var handleVisible = this.props.currentScreen == "chatArea" ? ' show' : ' hide';
        var active = this.props.currentScreen == "chatArea" && this.props.slideInMenuActive ? ' active' : '';

        var domainTitle = 'There are ' + this.props.statistics.DomainUserCount + ' number of users online on current domain. Click to invite them to this topic.';
        var linkTitle = 'There are ' + this.props.statistics.LinkUserCount + ' number of users online on current link. Click to invite them to this topic.';
        var adminTitle = 'There are ' + this.props.statistics.AdminCount + ' number of support persons online. Click to invite them to this topic privately.';

        return React.createElement(
            "div",
            { className: "actionSlideIn" + active },
            React.createElement("div", { className: "handle" + handleVisible + active, onClick: this.handleClick }),
            React.createElement(
                "div",
                { className: "actionIcons" },
                React.createElement("img", { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/domainUsers.png", className: "domainUsersSmall",
                    title: domainTitle, onClick: this.buttonClick, id: "inviteDomain" }),
                React.createElement("img", { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/linkUsers.png", className: "linkUsersSmall",
                    title: linkTitle, onClick: this.buttonClick, id: "inviteLink" }),
                React.createElement("img", { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/adminUsers.png", className: "adminUsersSmall",
                    title: adminTitle, onClick: this.buttonClick, id: "inviteAdmin" }),
                React.createElement(
                    "span",
                    { title: domainTitle, className: "positioned userCountBg domainUserCountSmall" },
                    this.props.statistics.DomainUserCount
                ),
                React.createElement(
                    "span",
                    { title: linkTitle, className: "positioned userCountBg linkUserCountSmall" },
                    this.props.statistics.LinkUserCount
                ),
                React.createElement(
                    "span",
                    { title: adminTitle, className: "positioned userCountBg adminUserCountSmall" },
                    this.props.statistics.AdminCount
                )
            )
        );
    }
});

module.exports = ActionSlideInMenu;

},{"./../app_common/Utils.js":2}],8:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');

var MessageList = require('./MessageList.js');
var MessageForm = require('./MessageForm.js');
var ChatAreaHeader = require('./ChatAreaHeader.js');

var ChatArea = React.createClass({
    displayName: 'ChatArea',

    componentDidUpdate: function (prevProps, prevState) {
        if (this.props.componentUpdated) this.props.componentUpdated.call(this);
        utils.consoleLog("ChatArea updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },
    render: function () {
        var active = this.props.active ? '' : ' hidden';
        return React.createElement(
            'div',
            { className: "chatArea" + active },
            React.createElement(ChatAreaHeader, { leaveCurrentTopic: this.props.leaveCurrentTopic, activeTopic: this.props.activeTopic,
                userName: this.props.userName,
                userInviting: this.props.userInviting,
                userIsAdmin: this.props.userIsAdmin }),
            React.createElement(
                'div',
                { className: 'messageArea' },
                React.createElement(MessageList, { currentTopicMessages: this.props.currentTopicMessages, userName: this.props.userName })
            ),
            React.createElement(MessageForm, { sendMessage: this.props.sendMessage })
        );
    }
});

module.exports = ChatArea;

},{"./../app_common/Utils.js":2,"./ChatAreaHeader.js":9,"./MessageForm.js":12,"./MessageList.js":13}],9:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');
var ChatAreaHeader = React.createClass({
    displayName: "ChatAreaHeader",

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("ChatAreaHeader updated");
    },
    handleClick: function (event) {
        this.props.leaveCurrentTopic();
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.activeTopic == nextProps.activeTopic;
        notUpdate = notUpdate & this.props.userName == nextProps.userName;
        return !notUpdate;
    },
    render: function () {
        var topicName = this.props.activeTopic ? this.props.activeTopic.IsAdminTopic ? "Site support service" : this.props.activeTopic.Subject : '';
        var shortTopicName = topicName.length > 30 ? topicName.substr(0, 30) + '..' : topicName;

        var topicNameArea = this.props.activeTopic ? React.createElement(
            "div",
            { className: "topicName" },
            React.createElement(
                "span",
                { title: topicName },
                shortTopicName
            ),
            React.createElement(
                "a",
                { className: "leaveTopicLink", href: "javascript:void(0)", onClick: this.handleClick },
                "Leave."
            )
        ) : React.createElement(
            "div",
            { className: "topicName" },
            "There is no topic to talk."
        );
        if (this.props.userIsAdmin && this.props.activeTopic && this.props.activeTopic.IsAdminTopic) topicNameArea = React.createElement(
            "div",
            { className: "topicName" },
            React.createElement(
                "span",
                { title: "User supporting talk" },
                "You are talking to user: ",
                this.props.userInviting
            ),
            React.createElement(
                "a",
                { className: "leaveTopicLink", href: "javascript:void(0)", onClick: this.handleClick },
                "Leave."
            )
        );

        return React.createElement(
            "div",
            { className: "header" },
            React.createElement(
                "div",
                { className: "avatar" },
                React.createElement("img", { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/pixel.png" }),
                " "
            ),
            React.createElement(
                "div",
                { className: "headerText" },
                React.createElement(
                    "div",
                    { className: "userName" },
                    React.createElement(
                        "span",
                        { className: "greeting" },
                        "Hi"
                    ),
                    React.createElement(
                        "span",
                        { className: "name" },
                        this.props.userName
                    ),
                    " "
                ),
                topicNameArea
            )
        );
    }
});

module.exports = ChatAreaHeader;

},{"./../app_common/Utils.js":2}],10:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');

var InvitationList = React.createClass({
    displayName: 'InvitationList',

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("InvitationList updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return !utils.compareSortedArray(this.props.invitationData, nextProps.invitationData);
    },
    handleClick: function (event) {
        this.props.joinInvitation.call(this, $(event.target).attr('data-topicid'), $(event.target).attr('data-userid'));
    },
    render: function () {
        var clickFunc = this.handleClick;
        var invitationNodes = this.props.invitationData.map(function (invi) {
            var date = typeof invi.CreatedDate === "string" ? new Date(invi.CreatedDate) : invi.CreatedDate;
            if (!invi.IsAdminInvitation) {
                return React.createElement(
                    'li',
                    { className: 'invitation', key: invi.Id },
                    React.createElement(
                        'span',
                        { className: 'userName' },
                        invi.UserName
                    ),
                    ' invited you to talk on "',
                    React.createElement(
                        'span',
                        { className: 'topicName' },
                        invi.TopicSubject + '"'
                    ),
                    React.createElement(
                        'span',
                        { className: 'inviTime' },
                        jQuery.timeago(date)
                    ),
                    React.createElement(
                        'a',
                        { className: 'inviLink', href: 'javascript:void(0)', 'data-topicid': invi.TopicId, 'data-userid': invi.UserName, onClick: clickFunc },
                        'Join'
                    )
                );
            } else {
                return React.createElement(
                    'li',
                    { className: 'invitation', key: invi.Id },
                    React.createElement(
                        'span',
                        { className: 'userName' },
                        invi.UserName
                    ),
                    ' invited you to talk privately',
                    React.createElement(
                        'span',
                        { className: 'inviTime' },
                        jQuery.timeago(date)
                    ),
                    React.createElement(
                        'a',
                        { className: 'inviLink', href: 'javascript:void(0)', 'data-topicid': invi.TopicId, 'data-userid': invi.UserName, onClick: clickFunc },
                        'Join'
                    )
                );
            }
        });
        return React.createElement(
            'ul',
            { className: 'invitations' },
            invitationNodes
        );
    }
});

module.exports = InvitationList;

},{"./../app_common/Utils.js":2}],11:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');
var UserAvatarBig = require('./UserAvatarBig.js');

var MainScreen = React.createClass({
    displayName: 'MainScreen',

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("MainScreen updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.userData.userName == nextProps.userData.userName;
        notUpdate = notUpdate & this.props.userData.avatar == nextProps.userData.avatar;
        notUpdate = notUpdate & this.props.statistics.DomainUserCount == nextProps.statistics.DomainUserCount;
        notUpdate = notUpdate & this.props.statistics.LinkUserCount == nextProps.statistics.LinkUserCount;
        notUpdate = notUpdate & this.props.statistics.AdminCount == nextProps.statistics.AdminCount;
        return !notUpdate;
    },
    handleClick: function (event) {
        this.props.invitePeople(event.target.id);
    },
    render: function () {
        var domainTitle = 'There are ' + this.props.statistics.DomainUserCount + ' number of users online on current domain. Click to invite them to talk.';
        var linkTitle = 'There are ' + this.props.statistics.LinkUserCount + ' number of users online on current link. Click to invite them to talk.';
        var adminTitle = 'There are ' + this.props.statistics.AdminUserCount + ' number of support persons online. Click to invite them to talk privately.';
        return React.createElement(
            'div',
            { className: 'mainScreen' },
            React.createElement(
                'div',
                { className: 'avatarContainer' },
                React.createElement(UserAvatarBig, { userName: this.props.userData.userName, avatar: this.props.userData.avatar,
                    changeName: this.props.changeName })
            ),
            React.createElement(
                'div',
                { className: 'mainScreenIcons' },
                React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/homeiconbg.png", className: 'homeBackground' }),
                React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/domainUsers.png", className: 'positioned domainUsers', id: 'inviteDomain',
                    title: domainTitle, onClick: this.handleClick }),
                React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/linkUsers.png", className: 'positioned linkUsers', id: 'inviteLink',
                    title: linkTitle, onClick: this.handleClick }),
                React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/adminUsers.png", className: 'positioned adminUsers', id: 'inviteAdmin',
                    title: adminTitle, onClick: this.handleClick }),
                React.createElement(
                    'span',
                    { title: domainTitle, className: 'positioned userCountBg domainUserCount' },
                    this.props.statistics.DomainUserCount
                ),
                React.createElement(
                    'span',
                    { title: linkTitle, className: 'positioned userCountBg linkUserCount' },
                    this.props.statistics.LinkUserCount
                ),
                React.createElement(
                    'span',
                    { title: adminTitle, className: 'positioned userCountBg adminUserCount' },
                    this.props.statistics.AdminCount
                )
            )
        );
    }
});

module.exports = MainScreen;

},{"./../app_common/Utils.js":2,"./UserAvatarBig.js":17}],12:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');

var MessageForm = React.createClass({
    displayName: 'MessageForm',

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("MessageForm updated");
    },
    getInitialState: function () {
        return { msgText: '' };
    },
    validateMessage: function (msg) {
        if (!msg || /^\s*$/.test(msg) || msg.length > 255) {
            $(this.errorDiv).empty();
            utils.showError(this.errorDiv.id, "Please enter a message with length 1-255 characters.");
            return false;
        }
        return true;
    },
    sendBtnClick: function (event) {
        if (this.validateMessage(this.txtInput.value)) {
            $(this.errorDiv).empty();
            var msg = this.txtInput.value;
            this.txtInput.value = '';
            this.setState({ msgText: '' });
            this.props.sendMessage.call(this, msg);
        }
    },
    handleTextChange: function (e) {
        this.setState({ msgText: e.target.value });
    },
    inputKeyDown: function (event) {
        if (event.keyCode == 13) {
            this.sendBtnClick();
            event.preventDefault();
            event.stopPropagation();
        }
    },
    render: function () {
        return React.createElement(
            'div',
            { className: 'form' },
            React.createElement(
                'div',
                { className: 'inputDiv' },
                React.createElement('textarea', { id: 'messageinput', className: 'messageinput', onKeyDown: this.inputKeyDown, onChange: this.handleTextChange, ref: ref => this.txtInput = ref })
            ),
            React.createElement(
                'div',
                { className: 'sendMessage' },
                React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/SendBtnBg.png", title: 'Send message', className: 'sendBtn', onClick: this.sendBtnClick })
            ),
            React.createElement('div', { id: 'messageFormErrors', style: { display: 'none' }, ref: ref => this.errorDiv = ref })
        );
    }
});

module.exports = MessageForm;

},{"./../app_common/Utils.js":2}],13:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');

var scrollToLast = false;
var MessageList = React.createClass({
    displayName: "MessageList",

    getInitialState: function () {
        return { flag: 0 };
    },
    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("MessageList updated");
        var $allMessages = $(this.msgContainer);
        var $parentBox = $allMessages.parent();
        var heightDiff = $allMessages.height() - $parentBox.height();
        var $lastMsg = $allMessages.children("li:last-child");
        if (heightDiff > 0) {
            if (heightDiff - $parentBox.scrollTop() - $lastMsg.height() < 15) {
                $parentBox.scrollTop(heightDiff);
            }
            if (scrollToLast) {
                $parentBox.scrollTop(heightDiff);
                scrollToLast = false;
            }
        }
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        if (this.props.currentTopicMessages.length == 0 && nextProps.currentTopicMessages.length > 0) scrollToLast = true;

        return !utils.compareSortedArray(this.props.currentTopicMessages, nextProps.currentTopicMessages) || this.state != nextState;
    },
    messageClick: function (event) {
        var li = event.target;
        while (li.tagName != "LI") {
            li = li.parentNode;
        }
        var msgId = $(li).attr('data-msgid');
        var msg = null;
        for (var i = 0; i < this.props.currentTopicMessages.length; i++) {
            if (this.props.currentTopicMessages[i].Id == msgId) {
                msg = this.props.currentTopicMessages[i];
                break;
            }
        }
        if (msg) {
            msg.showTime = !msg.showTime;
            this.setState({ flag: ++this.state.flag });
        }
    },
    componentDidMount: function () {},
    render: function () {
        var props = this.props;
        var clickFunc = this.messageClick;
        var messages = this.props.currentTopicMessages.map(function (msg) {
            var css = msg.UserName == props.userName || msg.UserName == "me" ? "me" : "other";
            var timeCss = msg.showTime ? "" : " hidden";
            var date = msg.Date ? new Date(msg.Date) : new Date();
            return React.createElement(
                "li",
                { "data-msgid": msg.Id, onClick: clickFunc, className: "chatlistitem " + css, key: msg.Id },
                React.createElement(
                    "div",
                    { className: "text-container" },
                    React.createElement("i", { className: "ico ico-arrow" }),
                    React.createElement(
                        "span",
                        { className: "nick-name" },
                        msg.UserName
                    ),
                    React.createElement(
                        "span",
                        { className: "item-text" },
                        msg.Text
                    )
                ),
                React.createElement(
                    "div",
                    { className: timeCss },
                    React.createElement(
                        "span",
                        { className: "item-time", title: date.toLocaleString() },
                        " ",
                        jQuery.timeago(date)
                    )
                ),
                React.createElement("div", { style: { clear: 'both' } })
            );
        });
        return React.createElement(
            "ul",
            { className: "messageList", ref: ref => this.msgContainer = ref },
            messages
        );
    }
});

module.exports = MessageList;

},{"./../app_common/Utils.js":2}],14:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');
var UserAvatarBig = require('./UserAvatarBig.js');

var NewTopic = React.createClass({
    displayName: 'NewTopic',

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("NewTopic updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.currentScreen == nextProps.currentScreen;
        notUpdate = notUpdate & this.props.userData.userName == nextProps.userData.userName;
        notUpdate = notUpdate & this.props.userData.avatar == nextProps.userData.avatar;
        return !notUpdate;
    },
    validateTopicName: function (name) {
        if (!name || name.length < 2 || name.length > 150) {
            return false;
        }

        return true;
    },
    inputKeyDown: function (event) {
        if (event.keyCode == 13) {
            this.handleClick("inputEnter");
        }
    },
    handleClick: function (event) {
        if (event == "inputEnter" || event.target.id == "createTopic") {
            $(this.errorDiv).empty();
            if (!this.validateTopicName(this.txtTopicName.value)) {
                utils.showError(this.errorDiv.id, "Please enter a topic name with length 2-150 characters.");
                return;
            }
            this.props.createNewTopic(this.txtTopicName.value);
            this.txtTopicName.value = "";
        } else {
            this.props.cancelNewTopic();
            this.txtTopicName.value = "";
        }
    },
    render: function () {
        var active = this.props.currentScreen == "newtopic" ? '' : ' hidden';
        return React.createElement(
            'div',
            { className: "newTopicForm" + active },
            React.createElement(
                'div',
                { className: 'avatarContainer' },
                React.createElement(UserAvatarBig, { userName: this.props.userData.userName, avatar: this.props.userData.avatar,
                    changeName: this.props.changeName })
            ),
            React.createElement(
                'div',
                { className: 'newTopicTitle' },
                'Please create a topic to talk to people:'
            ),
            React.createElement(
                'div',
                { className: 'topicName' },
                React.createElement('input', { type: 'text', id: 'txtTopicName', placeholder: 'Enter topic name', ref: ref => this.txtTopicName = ref, onKeyDown: this.inputKeyDown })
            ),
            React.createElement(
                'div',
                { className: 'buttonContainer' },
                React.createElement('input', { type: 'button', className: 'btn registerButton', id: 'createTopic', value: 'Create', onClick: this.handleClick }),
                React.createElement('input', { type: 'button', className: 'btn cancelButton', id: 'cancelNewTopic', value: 'Cancel', onClick: this.handleClick })
            ),
            React.createElement('div', { id: 'newTopicFormErrors', style: { display: 'none' }, ref: ref => this.errorDiv = ref })
        );
    }
});

module.exports = NewTopic;

},{"./../app_common/Utils.js":2,"./UserAvatarBig.js":17}],15:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');
var UserAvatarBig = require('./UserAvatarBig.js');

var Registration = React.createClass({
    displayName: 'Registration',

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("Registration updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.currentScreen == nextProps.currentScreen;
        notUpdate = notUpdate & this.props.userData.userName == nextProps.userData.userName;
        notUpdate = notUpdate & this.props.userData.avatar == nextProps.userData.avatar;
        return !notUpdate;
    },
    validateUserName: function (name) {
        if (!name || name.length < 2 || name.length > 25) {
            return false;
        }

        return true;
    },
    inputKeyDown: function (event) {
        if (event.keyCode == 13) {
            this.buttonClick("inputEnter");
        }
    },
    buttonClick: function (event) {
        if (event == "inputEnter" || event.target.id == "buttonRegister") {
            $(this.errorDiv).empty();
            if (!this.validateUserName(this.anonymousName.value)) {
                utils.showError(this.errorDiv.id, "Please enter a display name with length 2-25 characters.");
                return;
            }
            this.props.registerAnonymousName(this.anonymousName.value);
            this.anonymousName.value = "";
        } else {
            this.props.cancelRegistration();
            this.anonymousName.value = "";
        }
    },
    render: function () {
        var active = this.props.currentScreen == "registration" ? '' : ' hidden';
        return React.createElement(
            'div',
            { className: "registrationForm" + active },
            React.createElement(
                'div',
                { className: 'avatarContainer' },
                React.createElement(UserAvatarBig, { userName: this.props.userData.userName, avatar: this.props.userData.avatar,
                    changeName: this.props.changeName })
            ),
            React.createElement(
                'div',
                { className: 'registrationTitle' },
                'You can change your display name by:'
            ),
            React.createElement(
                'div',
                { className: 'registerRadio' },
                React.createElement('input', { type: 'radio', className: 'radioButton', id: 'loginRadioButton', name: 'registerMethod', value: 'Login', disabled: 'true' }),
                React.createElement(
                    'label',
                    { htmlFor: 'loginRadioButton' },
                    'Login'
                )
            ),
            React.createElement(
                'ul',
                { className: 'loginProviders' },
                React.createElement(
                    'li',
                    { className: 'facebook' },
                    React.createElement(
                        'a',
                        { href: 'javascript:void(0)', id: 'fbLogin', onClick: this.handleClick },
                        React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/fbLogin.png" })
                    )
                ),
                React.createElement(
                    'li',
                    { className: 'google' },
                    React.createElement(
                        'a',
                        { href: 'javascript:void(0)', id: 'tLogin', onClick: this.handleClick },
                        React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/twitterLogin.png" })
                    )
                ),
                React.createElement(
                    'li',
                    { className: 'twitter' },
                    React.createElement(
                        'a',
                        { href: 'javascript:void(0)', id: 'gLogin', onClick: this.handleClick },
                        React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/gLogin.png" })
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'registerRadio' },
                React.createElement('input', { type: 'radio', className: 'radioButton', id: 'anonymousRadioButton', name: 'registerMethod', value: 'Anonymous', defaultChecked: true }),
                React.createElement(
                    'label',
                    { htmlFor: 'anonymousRadioButton' },
                    ' Quick Registration '
                )
            ),
            React.createElement(
                'div',
                { className: 'anonymousName' },
                React.createElement('input', { type: 'text', id: 'anonymousUserName', placeholder: 'Enter your name', ref: ref => this.anonymousName = ref, onKeyDown: this.inputKeyDown })
            ),
            React.createElement(
                'div',
                { className: 'buttonContainer' },
                React.createElement('input', { type: 'button', className: 'btn registerButton', id: 'buttonRegister', value: 'Register', onClick: this.buttonClick }),
                React.createElement('input', { type: 'button', className: 'btn cancelButton', id: 'cancelRegister', value: 'Cancel', onClick: this.buttonClick })
            ),
            React.createElement('div', { id: 'registerFormErrors', style: { display: 'none' }, ref: ref => this.errorDiv = ref })
        );
    }
});

module.exports = Registration;

},{"./../app_common/Utils.js":2,"./UserAvatarBig.js":17}],16:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');
var TopicList = React.createClass({
    displayName: 'TopicList',

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("TopicList updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        var equal = utils.compareSortedArray(this.props.topicData, nextProps.topicData) && this.state == nextState;
        if (!equal) return true;
        for (var i = 0; i < this.props.topicData.length; i++) {
            if (this.props.topicData[i].UserCount != nextProps.topicData[i].UserCount || this.props.topicData[i].MessageCount != nextProps.topicData[i].MessageCount || this.props.topicData[i].Subject != nextProps.topicData[i].Subject || this.props.topicData[i].LastActivityDate != nextProps.topicData[i].LastActivityDate) return true;
        }
        return false;
    },
    handleTextChange: function (e) {
        this.setState({ topicSearchTxt: e.target.value });
        this.props.setTopicSearchKey.call(this, e.target.value);
    },
    onKeyDown: function (event) {
        if (event.keyCode == 13) {
            this.props.searchTopic(event.target.value);
        }
    },
    handleClick: function (event) {
        this.props.joinSelectedTopic($(event.target).attr('data-topicid'));
    },
    render: function () {
        var clickFunc = this.handleClick;
        var topicRows = this.props.topicData.map(function (topic) {
            var shortTopicName = topic.Subject.length > 45 ? topic.Subject.substr(0, 45) + ".." : topic.Subject;
            return React.createElement(
                'tr',
                { key: topic.TopicId },
                React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'span',
                        { className: 'shortTopicName', title: topic.Subject },
                        shortTopicName
                    ),
                    React.createElement(
                        'a',
                        { className: 'inviLink', href: 'javascript:void(0)', 'data-topicid': topic.TopicId, onClick: clickFunc },
                        'Join'
                    ),
                    ' '
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'span',
                        { className: 'userCount' },
                        topic.UserCount
                    )
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'span',
                        { className: 'messageCount' },
                        topic.MessageCount
                    )
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'span',
                        { className: 'createdDate', title: topic.LastActivityDate },
                        jQuery.timeago(topic.LastActivityDate)
                    )
                )
            );
        });

        return React.createElement(
            'div',
            { className: 'topicList' },
            React.createElement(
                'div',
                { className: 'topicSearch' },
                React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/searchIcon.png", className: 'searchIcon' }),
                React.createElement('input', { type: 'text', id: 'txtTopicSearch', onKeyDown: this.onKeyDown, onChange: this.handleTextChange, placeholder: 'Type topic name and press enter to search' })
            ),
            React.createElement(
                'table',
                { className: 'topicTable' },
                React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            { className: 'topicName' },
                            React.createElement(
                                'span',
                                null,
                                'Topic name'
                            )
                        ),
                        React.createElement(
                            'th',
                            { className: 'userCount' },
                            React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/TopicUserCount.png", title: 'User count' })
                        ),
                        React.createElement(
                            'th',
                            { className: 'messageCount' },
                            React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/TopicMessageCount.png", title: 'Message count' })
                        ),
                        React.createElement(
                            'th',
                            { className: 'createdDate' },
                            React.createElement('img', { src: "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/TopicCreateTime.png", title: 'Last activity, sometime ago' })
                        )
                    ),
                    topicRows
                )
            ),
            React.createElement('span', { className: 'noTopicFound' })
        );
    }
});

module.exports = TopicList;

},{"./../app_common/Utils.js":2}],17:[function(require,module,exports){
var utils = require('./../app_common/Utils.js');

var UserAvatarBig = React.createClass({
    displayName: "UserAvatarBig",

    componentDidUpdate: function (prevProps, prevState) {
        utils.consoleLog("UserAvatarBig updated");
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.avatar == nextProps.avatar;
        notUpdate = notUpdate & this.props.userName == nextProps.userName;

        return !notUpdate;
    },
    handleClick: function (event) {
        this.props.changeName();
    },
    render: function () {
        var imgLink = this.props.avatar ? this.props.avatar : "http://" + utils.getBaseDomain() + "/areas/chatfront/static/img/defaultuseravatar.png";
        return React.createElement(
            "div",
            { className: "userAvatarBig" },
            React.createElement(
                "a",
                { href: "javascript:void(0)", onClick: this.handleClick, className: "imgLink" },
                React.createElement("img", { src: imgLink, title: "Please click here to change your display name", className: "avatarImg" })
            ),
            React.createElement(
                "a",
                { href: "javascript:void(0)", onClick: this.handleClick, className: "greetingLink" },
                React.createElement(
                    "span",
                    { className: "greeting" },
                    "Hi"
                ),
                React.createElement(
                    "span",
                    { className: "userName" },
                    this.props.userName
                )
            )
        );
    }
});

module.exports = UserAvatarBig;

},{"./../app_common/Utils.js":2}]},{},[3]);
