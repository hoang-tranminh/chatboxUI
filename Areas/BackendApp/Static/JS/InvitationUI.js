function joinInvitationUI(topicId, isUserTopic) {
    var activeTopic = $("#chatBox").data("activeTopic");
    joinInvitation(topicId, activeTopic, function () {
        $("#chatBox").data("activeTopic", null);
    }, joinTopicOK, true, isUserTopic);
}


function joinTopicOK(topic) {
    //join topic successfully
    openChatArea(topic);
}

function showInvitation(msgs/*array of MessageViewModel*/)
{
    for (var i = 0; i < msgs.length; i++) {
        // Add the message to the page.
        $('div.invitations').append('<li><strong>' + htmlEncode(msgs[i].UserName)
            + '</strong> invited' + (msgs[i].Text ? 'everyone on link: '+msgs[i].Text: 'everyone')  + ' to chat. ' +
            '&nbsp;&nbsp;<i>' + new Date(msgs[i].CreatedDate).toLocaleTimeString() + '. </i>' +
            '<a href="javascript:return false;" onclick="javascript:joinInvitationUI(\'' + msgs[i].TopicId + '\', true)">Join</a>' +
            '</li>');
    }

}

function showAdminInvitation(msgs/*array of MessageViewModel*/) {

    for (var i = 0; i < msgs.length; i++) {
        // Add the message to the page.
        $('div.invitations').append('<li><strong>' + htmlEncode(msgs[i].UserName)
            + '</strong> invited you to chat. ' +
            '&nbsp;&nbsp;<i>' + new Date(msgs[i].CreatedDate).toLocaleTimeString() + '. </i>' +
            '<a href="javascript:return false;" onclick="javascript:joinInvitationUI(\'' + msgs[i].TopicId + '\')">Join</a>' +
            '</li>');
    }
}