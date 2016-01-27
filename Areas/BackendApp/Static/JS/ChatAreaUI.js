function ValidateMessage(msg) {
    if (!msg || /^\s*$/.test(msg) || msg.length > 255) {
        return false;
    }

    return true;
}

function showChatMessage(msgs/*array of MessageViewModel*/) {
    for (var i = 0; i < msgs.length; i++) {
        // Add the message to the page.
        $('#chatAreaContent').append('<li><strong>' + htmlEncode(msgs[i].UserName)
            + '</strong>: ' + htmlEncode(msgs[i].Text) +
            '&nbsp&nbsp<i>' + new Date(msgs[i].CreatedDate).toLocaleTimeString() + '</i>' +
            '</li>');
    }
}

function showTopicNotification(msgs/*array of MessageViewModel*/) {
    for (var i = 0; i < msgs.length; i++) {
        // Add the message to the page.
        $('#chatAreaContent').append('<li><strong>' + htmlEncode(msgs[i].UserName)
            + '</strong> ' + (msgs[i].Type == 7 ? 'joined.' : 'left.') +
            '&nbsp&nbsp<i>' + new Date(msgs[i].CreatedDate).toLocaleTimeString() + '</i>' +
            '</li>');
    }
}

function buttonLeaveChatClick() {
    var topic = $("#chatBox").data("activeTopic");
    leaveTopic(GetCurrentUri(), topic, function (activeTopic, response) {
        //leave topic successfully
        $("#chatAreaContent").empty();
        $("#chatBox").data("activeTopic", null);
        $("#topicTitle").empty();

    }, function (error) {
        //jion topic not ok
        //send not ok
        consoleLog("failed to leave topic " + topic.TopicId + " : " + error);
    });
}

function sendButtonClick() {
    var $button = $(this);
    var msg = $("#chatInput").val();
    if (!ValidateMessage(msg)) {
        showError("chatBoxErrors", "Please enter a message that is not empty or white space only and has length smaller than 256 characters.");
        return;
    }
    sendMessage(GetCurrentUri(), $("#chatBox").data("activeTopic"), msg, function (topic, response) {
        //send ok!
        $("#chatInput").val('');
        showChatMessage([{ UserName: "me", CreatedDate: new Date(), Text: msg }]);
    }, function (error) {
        //send not ok
        consoleLog("failed to send message: " + error);
    });
}

function chatBoxInit() {
    $("#leaveChat").click(buttonLeaveChatClick);
    $("#send").click(sendButtonClick);
    $("#chatInput").keyup(enterKeyUp);
}

function renderRecentChatMessages(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].Type == 2 /*message*/) {
            showChatMessage([data[i]]);
        }
    }
    //showChatMessage(data);
}

function openChatArea(activeTopic) {
    $("#chatBox").data("activeTopic", activeTopic);
    $("#topicTitle").text("you are talking user :" + activeTopic.Subject);
    $("#chatAreaContent").empty();
    getRecentChatMessages(activeTopic, renderRecentChatMessages, true);
}