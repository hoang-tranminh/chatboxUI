var ChatContainer = React.createClass({
    render:function(){
        return (
                <h1>ChatContainer</h1>
            );
    }
});

//function ValidateMessage(msg) {
//    if (!msg || /^\s*$/.test(msg) || msg.length > 255) {
//        return false;
//    }

//    return true;
//}

//function showTopicNotification(msgs/*array of MessageViewModel*/) {
//    for (var i = 0; i < msgs.length; i++) {
//        // Add the message to the page.
//        $('#chatareaContent').append('<li><strong>' + htmlEncode(msgs[i].UserName)
//            + '</strong> '+ (msgs[i].Type == 7 ? 'joined.' :'left.') +
//            '&nbsp&nbsp<i>' + new Date(msgs[i].CreatedDate).toLocaleTimeString() + '</i>' +
//            '</li>');
//    }
//}

//function showChatMessage(msgs/*array of MessageViewModel*/) {
//    for (var i = 0; i < msgs.length; i++) {
//        // Add the message to the page.
//        $('#chatareaContent').append('<li><strong>' + htmlEncode(msgs[i].UserName)
//            + '</strong>: ' + htmlEncode(msgs[i].Text) +
//            '&nbsp&nbsp<i>' + new Date(msgs[i].CreatedDate).toLocaleTimeString() + '</i>' +
//            '</li>');
//    }
//}

//function joinInvitationUI(topicId)
//{
//    var activeTopic = null;
//    if ($("#chatBox").css("display") == "block") {
//        activeTopic = $("#chatBox").data("activeTopic");
//    }
//    joinInvitation(topicId, activeTopic, function () {
//        $("#chatBox").data("activeTopic", null);
//    }, joinTopicOK);
//}

//function showInvitation(msgs/*array of MessageViewModel*/)
//{
//    var topic = $("#chatBox").data("activeTopic");
//    for (var i = 0; i < msgs.length; i++) {
//        if (!topic || topic.TopicId != msgs[i].TopicId) {
//            // Add the message to the page.
//            $('div.invitations').append('<li><strong>' + htmlEncode(msgs[i].UserName)
//                + '</strong> invited you to chat on: ' + htmlEncode(msgs[i].TopicSubject) +
//                '<i>' + new Date(msgs[i].CreatedDate).toLocaleTimeString() + '. </i>' +
//                '<a href="javascript:return false;" onclick="javascript:joinInvitationUI(\'' + msgs[i].TopicId + '\')">Join</a>' +
//                '</li>');
//        }
//    }
//}

//function buttonInviteAdminClick()
//{
//    sendAdminInvitation(GetCurrentUri(), function (response) {
//        //send ok!
//        //go to support topic directly
//    }, function (error) {
//        //send not ok
//        consoleLog("failed to send invitation: " + error);
//    });
//}

//function buttonInviteClick()
//{
//    sendInvitation(GetCurrentUri(), $("#chatBox").data("activeTopic"), function (response) {
//        //send ok!
//        showChatMessage([{ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current URL to chat." }]);
//    }, function (error) {
//        //send not ok
//        consoleLog("failed to send invitation: " + error);
//    });
//}

//function buttonInviteAllClick() {
//    sendInvitation(GetCurrentUri(), $("#chatBox").data("activeTopic"), function (response) {
//        //send ok!
//        showChatMessage([{ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current domain to chat." }]);
//    }, function (error) {
//        //send not ok
//        consoleLog("failed to send invitation: " + error);
//    });
//}

//function buttonLeaveChatClick()
//{
//    var topic = $("#chatBox").data("activeTopic");
//    leaveTopic(GetCurrentUri(), topic, function (activeTopic, response) {
//        //leave topic successfully
//        $("#chatBox").hide();
//        $("#chatBox").data("activeTopic", null);
//        $("#topicsSelection").show();
//        $("#registerForm").hide();
//        createTopicCancel(null, true);

//    }, function (error) {
//        //jion topic not ok
//        //send not ok
//        consoleLog("failed to leave topic " + topic.TopicId + " : " + error);
//    });
//}


//function sendButtonClick()
//{
//    var $button = $(this);
//    var msg = $("#chatInput").val();
//    if (!ValidateMessage(msg))
//    {
//        showError("chatBoxErrors", "Please enter a message that is not empty or white space only and has length smaller than 256 characters.");
//        return;
//    }
//    sendMessage(GetCurrentUri(), $("#chatBox").data("activeTopic"), msg, function (topic, response) {
//        //send ok!
//        $("#chatInput").val('');
//        var udata = getOrSetUserData();
//        showChatMessage([{ UserName: "me", CreatedDate: new Date(), Text: msg }]);
//    }, function (error) {
//        //send not ok
//        consoleLog("failed to send message: " + error);
//    });
//}

//function chatBoxInit() {
//    $("#chatBox button.inviteToChat").click(buttonInviteClick);
//    $("#chatBox button.inviteAllToChat").click(buttonInviteAllClick)
//    $("#leaveChat").click(buttonLeaveChatClick);
//    $("#send").click(sendButtonClick);
//    $("#chatInput").keyup(enterKeyUp);
//}

//function renderRecentChatMessages(data, currentTopicId)
//{
//    for (var i = 0; i < data.length; i++) {
//        if (data[i].Type == 6 /*invitation*/) {
//            var msgDate = dateAdd(new Date(data[i].Date), 'minute', 10);
//            var now = new Date();
//            if (data[i].TopicId != currentTopicId && msgDate >= now) {
//                showInvitation([data[i]]);
//            }
//        }
//        else if (data[i].Type == 2 /*message*/) {
//            showChatMessage([data[i]]);
//        }
//        //bypass admin invitation for now
//    }
//}

//function openChatArea(activeTopic) {
//    $("#chatBox").data("activeTopic", activeTopic);
//    if (!activeTopic.IsAdminTopic) {
//        $("#topicTitle").text(activeTopic.Subject);
//    }
//    else
//        $("#topicTitle").text("You are talking to admin of current domain.");
//    //var $invitations = $("a.invitations").text(activeTopic.InvitationCount);
//    $("#chatareaContent").empty();
//    $("#chatBox").show();
//    $('#chatBox div.invitations li').remove();
//    getRecentChatMessages(activeTopic, renderRecentChatMessages);
    
//}