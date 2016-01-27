var utils = require('./../app_common/Utils.js');

var tempUniqueId = 100;
var loadingInterval = null;
var TopicsUIBusiness = function (model,coreBusiness) {
    var self = this;
    var topicData = model;
    $.extend(self, {
        loadTopicGrid: function () {
            var f = function () {
                self.loadTopics(topicData.data.topicCount, topicData.data.showOfflineTopic);
            };
            f();
            loadingInterval = setInterval(f, 10000);
        },
        showMoreTopics: function () {
            topicData.data.topicCount += 30;
            self.loadTopics(topicData.data.topicCount, topicData.data.showOfflineTopic);
        },
        toogleOfflineTopic:function() {
            topicData.data.showOfflineTopic = !topicData.data.showOfflineTopic;
            self.loadTopics(topicData.data.topicCount, topicData.data.showOfflineTopic);
        },
        loadTopics:function(count, includeOffline) {
            coreBusiness.loadTopicsBackendOnce(function (data) {
                //data is an array of topic view model
                topicData.data.adminTopicData = data.admin;
                topicData.data.userTopicData = data.user;

                topicData.raiseChanged();
            }, count, includeOffline);
        },
        stopLoadTopicGrid:function() {
            if (loadingInterval)
                clearInterval(loadingInterval);
            loadingInterval = null;
            coreBusiness.stopReadingMessages();
        },
        watchTopic: function (topicId, lastActivityDate) {
            coreBusiness.stopReadingMessages();
            topicData.data.watchingTopic = topicId;
            topicData.data.watchingData = [];
            var topic = null;
            for (var i = 0; i < topicData.data.adminTopicData.length; i++) {
                if (topicData.data.adminTopicData[i].TopicId == topicId) {
                    topic = topicData.data.adminTopicData[i];
                    break;
                }
            }
            if (!topic) {
                for (var i = 0; i < topicData.data.userTopicData.length; i++) {
                    if (topicData.data.userTopicData[i].TopicId == topicId) {
                        topic = topicData.data.userTopicData[i];
                        break;
                    }
                }
            }
            if (topic) {
                coreBusiness.getRecentMessagesToRead(topic, function (data) {
                    //data is an array of message view model
                    var newArr = utils.cloneArray(topicData.data.watchingData);
                    for (var i = 0; i < data.length; i++) {
                            newArr.push(data[i]);
                    }
                    topicData.data.watchingData = newArr;
                    topicData.raiseChanged();
                });
            }
        }
    });
    return self;
};

module.exports = TopicsUIBusiness;


