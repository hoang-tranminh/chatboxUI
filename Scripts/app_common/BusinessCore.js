var utils = require('./Utils.js');

var lastReadTime = null;
var readingTopic = null;
var readingThread = null;
var readingCallback = null;

var showInvitationFunc = [];
var showChatMessageFunc = [];
var showAdminInvitationFunc = [];
var showTopicNotificationFunc = [];

var CoreBusiness = function ()
{
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
        processReceivedMsg: function (msgs/*array of MessageViewModel*/) {
            if (!msgs || !msgs.length) {
                if (console)
                    console.error("There is no message to receive");
                return;
            }

            if (msgs[0].Type == 6 /*invitation*/) {
                for (var i = 0; i < showInvitationFunc.length; i++)
                {
                    showInvitationFunc[i](msgs);
                }
            }
            else if (msgs[0].Type == 2 /*message*/) {
                //show chat messages from other users in topic
                for (var i = 0; i < showInvitationFunc.length; i++) {
                    showChatMessageFunc[i](msgs);
                }
            }
            else if (msgs[0].Type == 9 /*admin invitation*/) {
                //show admin invitations
                for (var i = 0; i < showAdminInvitationFunc.length; i++) {
                    showAdminInvitationFunc[i](msgs);
                }
            }
            else if (msgs[0].Type == 7 || msgs[0].Type == 8  /*join, leave topic notification*/) {
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
            if (isBackend)
                url = 'http://' + utils.getBackendDomain() + '/backendapp/api/TopicBackend/GetTopic';
            else
                url = 'http://' + utils.getBaseDomain() + '/chatfront/api/Topic/GetTopic';
            var topic = null;
            self.ajaxCall(url,
                'uri=' + utils.getCurrentUri() + '&topicId=' + topicId, function (data) {
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

                if (okFunction)
                    okFunction.call(this, data);


            }).fail(function (jqXHR, textStatus, errorThrown) {
                utils.consoleLog(errorThrown);
                if (failFunc)
                    failFunc.call(this);
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
            var date = lastReadTime ? '&fromTimeStr=' + lastReadTime : '&fromTimeStr=&fromTime='
                + utils.dateAdd(new Date(t.LastActivityDate), 'minute', -60).toISOString();
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
                if (okFunc)
                    okFunc.call(this, data);
            }, true, data);
        },
        stopReadingMessages:function(){
           if (readingThread)
            clearTimeout(readingThread);
        },
        getRecentChatMessages: function (topic, okFunction, isBackend, backendData) {
            var date = utils.dateAdd(new Date(topic.LastActivityDate), 'minute', -30);
            var toDate = utils.dateAdd(new Date(topic.LastActivityDate), 'minute', 30);
            var currentTopicId = topic.TopicId;

            var postData = 'uri=' + utils.getCurrentUri() + '&topicId=' + topic.TopicId +
                '&fromTimeStr=&fromTime=' + date.toUTCString() + '&toTime=' + toDate.toUTCString();
            if (backendData)
                postData = backendData;
            if (isBackend) {
                var url = 'http://' + utils.getBackendDomain() + '/backendapp/api/MessageBackend/GetMessages'
            }
            else {
                url = 'http://' + utils.getBaseDomain() + '/chatfront/api/Message/GetMessages';
            }
            self.ajaxCall(url,
                postData,
                function (data) {
                    if (okFunction)
                        okFunction.call(this, data, currentTopicId);
                }, false);
        },
        getPreviewChatMessages: function (previewTopicId, okFunction, isBackend, backendData) {
            self.getTopicDetail(previewTopicId, function (topic) {
                var date = utils.dateAdd(new Date(topic.LastActivityDate), 'minute', -10);
                var toDate = utils.dateAdd(new Date(topic.LastActivityDate), 'minute', 30);
                var currentTopicId = topic.TopicId;

                var postData = 'uri=' + utils.getCurrentUri() + '&topicId=' + topic.TopicId
                    + '&fromTimeStr=&fromTime=' + date.toUTCString() + '&maxCount=4' + '&toTime=' + toDate.toUTCString();
                if (backendData)
                    postData = backendData;
                if (isBackend) {
                    var url = 'http://' + utils.getBackendDomain() + '/backendapp/api/MessageBackend/GetMessages'
                }
                else {
                    url = 'http://' + utils.getBaseDomain() + '/chatfront/api/Message/GetMessages';
                }
                self.ajaxCall(url,
                    postData,
                    function (data) {
                        if (okFunction)
                            okFunction.call(this, data, currentTopicId);
                    }, false);
            }, isBackend);
        },
        getRecentInvitations: function (okFunction, fromDate, isBackend, includeOffline, toTime) {
            var date = fromDate ? fromDate : utils.dateAdd(new Date(), 'minute', -60);
            var postData = 'uri=' + utils.getCurrentUri() + '&fromTime=' + date.toUTCString();
            if (toTime)
                postData += '&toTime=' + toTime.toUTCString();
            if (includeOffline)
                postData += '&includeOffline=true';
            else
                postData += '&includeOffline=false';
            if (isBackend) {
                var url = 'http://' + utils.getBackendDomain() + '/backendapp/api/MessageBackend/GetRecentInvitations';
            }
            else {
                url = 'http://' + utils.getBaseDomain() + '/chatfront/api/Message/GetRecentInvitations';
            }
            self.ajaxCall(url,
                postData,
                function (data) {
                    if (okFunction)
                        okFunction.call(this, data);
                }, false);
        },
        joinInvitation: function (topicId, activeTopic, clearFunc, joinOkFunc, isBackend) {
            if (activeTopic) {
                //leave current topic first
                self.leaveTopic(utils.getCurrentUri(), activeTopic, function (activeTopic, response) {
                    //leave topic successfully
                    utils.consoleLog("leave topic successfully");
                    if (clearFunc)
                        clearFunc.call(this);
                }, function () {
                    //jion topic not ok
                    //send not ok
                    utils.consoleLog("failed to leave topic");
                });
            }

            //get the new topic detail and join it afterward
            self.getTopicDetail(topicId, function (newTopic/*topicviewmodel*/) {
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

            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Topic/CreateAdmin?&uri=' + utils.getCurrentUri(),
                    null, function (topic) {

                        if (createTopicOkFunc)
                            createTopicOkFunc.call(this, topic);

                        var t = topic;
                        var uri = utils.getCurrentUri();
                        self.gotoTopic(t, function (data) {
                            if (joinTopicOKFunc)
                                joinTopicOKFunc.call(this, data);

                            self.sendAdminInvitation(utils.getCurrentUri(), t, sendInviteOkFunc, function (error) {
                                //send not ok
                                utils.consoleLog("failed to send invitation: " + error);
                            });

                        });

                    }, true);

        },
        createTopic: function (topicName, inviteAll, createOkFunc, joinOkFunc, sendInviteOkFunc) {
            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Topic/Create?name=' + topicName + '&uri=' + utils.getCurrentUri(), null, function (topic) {

                if (createOkFunc)
                    createOkFunc.call(this, topic);
                var t = topic;
                var uri = utils.getCurrentUri();
                self.gotoTopic(t, function (data) {
                    if (joinOkFunc)
                        joinOkFunc.call(this, data);
                    self.sendInvitation(uri, inviteAll, t, sendInviteOkFunc, function (error) {
                        //send not ok
                        utils.consoleLog("failed to send invitation: " + error);
                    });

                });

            }, true);
        },
        searchTopic: function (topicName, okFunc, isBackEnd) {
            if (!isBackEnd) {
                self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Topic/GetTopics',
                    'currentUri=' + utils.getCurrentUri() + '&filter=3&searchPharse='+ topicName+'&page=0&pageSize=10',
                    okFunc, false);
            }
        },
        loadTopics: function (okFunc) {
            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Topic/GetTopics',
                'currentUri=' + utils.getCurrentUri() + '&filter=3&searchPharse=&page=0&pageSize=10',
                okFunc, false);
        },
        loadTopicsBackend: function (okFunc, admin, active) {
            var act = typeof(active ) ==="undefined" ? "" : (active ? "&active=true": "&active=false");
            self.ajaxCall('http://' + utils.getBackendDomain() + '/backendapp/api/TopicBackend/GetTopicsBackend',
                  'currentUri=' + utils.getCurrentUri() + '&filter=3&searchPharse=&page=0&pageSize=30&adminTopic=' + admin + act,
                  okFunc, false);
        },
        loadTopicsBackendOnce: function (okFunc, count, includeOffline) {
            self.ajaxCall('http://' + utils.getBackendDomain() + '/backendapp/api/TopicBackend/GetTopicsBackendOnce',
                  'currentUri=' + utils.getCurrentUri() 
                  + '&p1_filter=2&p1_searchPharse=&p1_page=0&p1_pageSize='+count+'&p1_adminTopic=true&p1_includeOffline='+ (includeOffline ? 'true':'false')
                  + '&p2_filter=2&p2_searchPharse=&p2_page=0&p2_pageSize='+count+'&p2_adminTopic=false&p2_includeOffline=' + (includeOffline ? 'true':'false'),
                  okFunc, false);
        },
        fetchStats: function (topicId, okFunc) {
            var getData = 'uri=' + utils.getCurrentUri() + (topicId ? ('&topicId=' + topicId) : '');
            //get the topic list
            self.ajaxCall('http://' + utils.getBaseDomain() + '/chatfront/api/Statistics/get', getData, okFunc, false);

        }
        
    });
    return self;
}
module.exports = CoreBusiness;

















