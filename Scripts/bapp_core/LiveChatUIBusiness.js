var utils = require('./../app_common/Utils.js');

var tempUniqueId = 100;
var LiveChatUIBusiness = function (model,coreBusiness) {
    var self = this;
    var liveChat = model;
    $.extend(self, {
        loadInvitationList: function () {
            coreBusiness.getRecentInvitations(function (data) {
                //data is an array of invitation view model
                utils.consoleLog("load initial invitations OK!");
                var user = utils.cloneArray(liveChat.data.userInviData);
                var admin = utils.cloneArray(liveChat.data.adminInviData);
                for (var i = 0; i < data.length; i++) {
                    if (!data[i].IsAdminInvitation) {
                        if (!self.checkInvitationExist(user, data[i])) {
                            user.push(data[i]);
                        }
                    }
                    else {
                        if (!data[i].FromBackend) {
                            if (!self.checkInvitationExist(admin, data[i])) {
                                admin.push(data[i]);
                            }
                        }
                    }
                }
                liveChat.data.adminInviData = admin;
                liveChat.data.userInviData = user;
                liveChat.raiseChanged();
            },true/*isBackend*/);
        },
        checkInvitationExist: function (arr, newInvi) {
            for (var i = 0; i < arr.length; i++) {
                if (newInvi.UserName == arr[i].UserName &&
                    newInvi.TopicSubject == arr[i].TopicSubject) {
                    var date = new Date(newInvi.CreatedDate);
                    var date2 = new Date(arr[i].CreatedDate)
                    if (Math.abs(date - date2) < 3 * 1000 * 60 /*3p*/)
                        return true;
                }
            }
            return false;
        },
        showAdminInvitation: function (msgs) {
            var newArr = utils.cloneArray(liveChat.data.adminInviData);
            for (var i = 0; i < msgs.length; i++) {
                if (!self.checkInvitationExist(newArr, msgs[i])) {
                    newArr.unshift(msgs[i]);
                }
            }
            liveChat.data.adminInviData = newArr;
            liveChat.raiseChanged();
        },
        showInvitation: function (msgs/*array of InvitationViewModel*/) {
            var newArr = utils.cloneArray(liveChat.data.userInviData);
            for (var i = 0; i < msgs.length; i++) {
                if (!self.checkInvitationExist(newArr, msgs[i])) {
                    newArr.unshift(msgs[i]);
                }
            }
            liveChat.data.userInviData = newArr;
            liveChat.raiseChanged();
        }
    });
    coreBusiness.bindRenderCallbacks(self.showInvitation, function () { }, self.showAdminInvitation, function () { });
    return self;
};

module.exports = LiveChatUIBusiness;


