/*
 * Fix missing indexOf in IE8
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        "use strict";

        var len = this.length >>> 0,
            from = Number(arguments[1]) || 0;

        from = (from < 0) ? Math.ceil(from) : Math.floor(from);

        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }

        return -1;
    };
}


/*
 * Name space
 */
var YETANOTHERCHAT = YETANOTHERCHAT || {};

/*
* Utilities
*/

YETANOTHERCHAT.Utilites = function () {
    "use strict";
};

YETANOTHERCHAT.Utilites.TimeToTicks = function (times) {
    "use strict";
    return ((times * 10000) + 621355968000000000);
};

/*
* Common settings for chat application.
*/
YETANOTHERCHAT.Settings = {
    CHAT_API: ''
};


/*
* Message API
*/

YETANOTHERCHAT.Messages = function() {
    "use strict";
};
/*
* Send message to Message WebAPI
*/
YETANOTHERCHAT.Messages.prototype.SendMessage = function (message, userId, topicId, createdOnTimes) {
    "use strict";

    var flag = false;
    
    if (!createdOnTimes) {
        createdOnTimes = new Date().getTime();
    }
    createdOnTimes = YETANOTHERCHAT.Utilites.TimeToTicks(createdOnTimes);
    if (!YETANOTHERCHAT.Settings.CHAT_API) {
        alert("You must set value for YETANOTHERCHAT.Settings.CHAT_API before call this function!");
        return false;
    }
    $.ajax({
        url: YETANOTHERCHAT.Settings.CHAT_API + 'MessageWebApi/Chat',
        type: 'POST',
        data: {
            Text: message,
            Ticks: createdOnTimes,
            ChatTopicGuidId: topicId,
            UserGuidId: userId
        },
        async: false,
        cache: false,
        contenType: 'application/json'
    })
    .done(function (data, textStatus, jqXHR) {
        console.log("sent message OK");
        flag = true;
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        if (console)
        {
            console.log(textStatus);
            console.log(errorThrown);
        }
        flag = false;
    });
    return flag;
};

YETANOTHERCHAT.Messages.prototype.GetMessages = function (messageContainer, userId, topicId, fromTimes) {
    "use strict";
    var flag = false;
    var that = this;
    if (!fromTimes) {
        fromTimes = new Date();
        fromTimes.setMinutes(fromTimes.getMinutes() - 5);
        fromTimes = fromTimes.getTime();
    }
    fromTimes = YETANOTHERCHAT.Utilites.TimeToTicks(fromTimes);

    $.ajax({
        url: YETANOTHERCHAT.Settings.CHAT_API + 'MessageWebApi/GetMessage',
        type: 'GET',
        data: {
            userId: userId,
            topicId: topicId,
            fromTimes: fromTimes
        },
        success: function (data) {
            var str = "";
            for (var i = 0; i < data.length; i++) {
                str += data[i].Text + '\n';
            }
            $(messageContainer).val($(messageContainer).val() + str);
            flag = true;
        },
        error: function () {
            flag = false;
        }
    });
    return flag;
};