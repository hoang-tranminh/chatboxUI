
var TopicsSelection = React.createClass({
    render:function(){
        return (
                <h1>TopicsSelection</h1>
            );
    }
});

//function createTopicOK() {
//    var topicName = $("#newTopicName").val();
//    if (!ValidateTopicName(topicName)) {
//        showError("topicSelectionErrors", "Please select a topic name from 2 to 150 characters.");
//        return;
//    }
//    createTopic(topicName, function (topic) {
//        $("#newTopicArea").hide();
//        $("#newTopicName").val('');
//        //$("#topicSelectionButtons").show();
//        //$("#topicsSelection").trigger("reloadTopics");
//        //$("#topicsSelection").show();
//    },joinTopicOK , function (response) {
//        //send ok!
//        var all = $("#topicsSelection div.traficInfo").data("inviteAll");
//        if (!all) {
//            showChatMessage([{ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current URL to chat." }]);
//        }
//        else {
//            showChatMessage([{ UserName: "me", CreatedDate: new Date(), Text: "Invited everyone in current domain to chat." }]);
//        }
//    });
//}

//function createTopicCancel(event, fromChat) {
//    if (fromChat) {
//        $("#topicsSelection div.invitations li").remove();
//    }

//    loadTopicList();
//    $("#topicsSelection div.traficInfo").data("inviteAll", false);
//    $("#newTopicArea").hide();
//    $("#topicsSelection div.traficInfo").show();
//    $("#topicsSelection div.invitations").show();
//    $("#noTopicMsg").hide();
//}




//function ValidateTopicName(name) {
//    if (!name || name.length < 2 || name.length > 150) {
//        return false;
//    }

//    return true;
//}

//function inviteToChat(all) {

//    $("#topicsSelection div.traficInfo").data("inviteAll", all ? false: true);
//    $("#newTopicArea").show();
//    $("#topicsSelection div.traficInfo").hide();
//    $("#topicsSelection div.invitations").hide();
//    $("#noTopicMsg").hide();
//}

//function inviteAdminToChatUI()
//{
//    inviteAdminToChat(function () {
//        $("#topicsSelection").hide();
//    }, joinTopicOK, function (response) {
//        //send ok!
//        showChatMessage([{ UserName: "me", CreatedDate: new Date(), Text: "Invited admin of current domain to chat." }]);
//    });
//}


//function inviteAllToChat()
//{
//    inviteToChat(true);
//}

//function topicsInit() {
//    $("#topicsSelection").show();

//    //bind events for buttons topics screen
//    $("#topicsSelection button.inviteToChat").click(inviteToChat);
//    $("#topicsSelection button.inviteAllToChat").click(inviteAllToChat);
//    $("#topicsSelection button.inviteAdminToChat").click(inviteAdminToChatUI);
    
//    $("button.createTopicOK").click(createTopicOK);
//    $("button.createTopicCancel").click(createTopicCancel);

//    $("#topicsSelection").on("reloadTopics", loadTopicList);
//    $("#topicsSelection").trigger("reloadTopics");
//}

//function joinTopicOK(topic)
//{
//    //join topic successfully
//    $("#topicsSelection").hide();
//    $("#registerForm").hide();
//    openChatArea(topic);
//}

//function gotoTopicUI(topic)
//{
//    gotoTopic(topic, joinTopicOK);
//}

//function topicLinkClick(e) {
//    var udata = getOrSetUserData();
//    if (udata == null) {
//        //if user not logined, show the registration form and hide the topic list
//        $("#topicsSelection").hide();
//        $("#registerForm").show();
//        return;
//    }

//    var topic = $(this).closest("tr").data("topic");
//    gotoTopicUI(topic);
    
//}


