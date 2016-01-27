var utils = require('./../app_common/Utils.js');

var tempUniqueId = 100;
var loadingInterval = -120;
var loadingThread = null;
var LiveChatUIBusiness = function (model,coreBusiness) {
    var self = this;
    var inviData = model;
    $.extend(self, {
        loadInvitationGrid: function () {
            inviData.data.inviDate = utils.dateAdd(new Date(), 'minute', loadingInterval);
            self.loadInvitations(inviData.data.inviDate);
            loadingThread = setInterval(function () {
                self.loadInvitations(inviData.data.inviDate, null, true);
            }, 10000);
        },
        showMoreInvitations: function () {
            inviData.data.oldInviDate = inviData.data.inviDate;
            loadingInterval = 2 * loadingInterval;
            inviData.data.inviDate = utils.dateAdd(inviData.data.inviDate, 'minute', loadingInterval);
            self.loadInvitations(inviData.data.inviDate, inviData.data.oldInviDate);
        },
        toogleOfflineInvi: function () {
            inviData.data.showingOfflineInvi = !inviData.data.showingOfflineInvi;
            inviData.data.oldInviDate = new Date();
            self.loadInvitations(inviData.data.inviDate, inviData.data.oldInviDate, true);
        },
        stopLoadingGrid: function () {
            if (loadingThread)
                clearInterval(loadingThread);
        },
        loadInvitations: function (date, toDate, replace) {

            coreBusiness.getRecentInvitations(function (data) {
                //data is an array of invitation view model
                utils.consoleLog("load initial invitations OK!");
                var user = replace ? [] : utils.cloneArray(inviData.data.userInviData);
                var admin = replace ? [] : utils.cloneArray(inviData.data.adminInviData);
                for (var i = 0; i < data.length; i++) {
                    if (!data[i].IsAdminInvitation) {
                        if (!utils.checkInvitationExist(user, data[i], 10)) {
                            user.push(data[i]);
                        }
                    }
                    else {
                        if (!data[i].FromBackend) {
                            if (!utils.checkInvitationExist(admin, data[i], 10)) {
                                admin.push(data[i]);
                            }
                        }
                    }
                }
                inviData.data.adminInviData = admin;
                inviData.data.userInviData = user;
                inviData.raiseChanged();
            }, date, true/*isBackend*/, inviData.data.showingOfflineInvi, toDate);
        },
        showAdminInvitation: function (msgs) {
            var newArr = utils.cloneArray(inviData.data.adminInviData);
            for (var i = 0; i < msgs.length; i++) {
                if (!utils.checkInvitationExist(newArr, msgs[i], 10)) {
                    newArr.unshift(msgs[i]);
                }
            }
            inviData.data.adminInviData = newArr;
            inviData.raiseChanged();
        },
        showInvitation: function (msgs/*array of InvitationViewModel*/) {
            var newArr = utils.cloneArray(inviData.data.userInviData);
            for (var i = 0; i < msgs.length; i++) {
                if (!utils.checkInvitationExist(newArr, msgs[i], 10)) {
                    newArr.unshift(msgs[i]);
                }
            }
            inviData.data.userInviData = newArr;
            inviData.raiseChanged();
        },
        previewInvitation: function (topicId, userId, doneFunc) {
            inviData.data.previewingTopic = topicId;
            coreBusiness.getPreviewChatMessages(topicId, function (data) {
                //data is an array of message view model
                inviData.data.previewingData = data;
                inviData.raiseChanged();
                if (doneFunc)
                    doneFunc(data);
            }, true/*isBackend*/);
        }
    });
    coreBusiness.bindRenderCallbacks(self.showInvitation, function () { }, self.showAdminInvitation, function () { });
    return self;
};

module.exports = LiveChatUIBusiness;


