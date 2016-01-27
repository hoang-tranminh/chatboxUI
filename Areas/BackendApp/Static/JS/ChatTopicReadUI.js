function loadTopicList() {

    loadTopics(function (data) {
        var $topics = $("#topicList");

        var noTopic = true;

        var $table2 = $("#topicList table.domainTopicsTable");
        //print results
        $table2.empty();

        if (data.domain && data.domain.length) {
            if ($("#noTopicMsg").css("display") == "block") {
                $("#noTopicMsg").hide();
            }
            $table2.append('<tr><td>Topic subject |&nbsp</td><td>User count |&nbsp</td><td>Invitation count |&nbsp</td><td>Created date&nbsp</td></tr>');
            for (i = 0; i < data.domain.length; i++) {
                var $row = $('<tr></tr>').addClass('topicsRow');
                $row.data("topic", data.domain[i]);
                var a = $('<a href="javascript:return false;"></a>').addClass("topicSubjectLink").click(topicLinkClick).append(data.domain[i].Subject);
                $row.append($('<td></td>').addClass('topicSubject').append(a));
                $row.append($('<td></td>').addClass('userCount').append(data.domain[i].UserCount));
                $row.append($('<td></td>').addClass('invitationCount').append(data.domain[i].InvitationCount));
                $row.append($('<td></td>').addClass('createdDate').append(data.domain[i].CreatedDateStr));
                $table2.append($row);
            }
            noTopic = false;
        }

        if (noTopic) {
            if ($("#noTopicMsg").css("display") != "block") {
                $("#noTopicMsg").empty();
                $("<span class='noTopicMsg'>There is no topic.</span>").appendTo($("#noTopicMsg"));
                $("#noTopicMsg").show();
            }
        }

        setTimeout(loadTopicList, 5000);
    }, true);
}

function topicLinkClick() {
    var topicvm = $(this).closest("tr").data("topic");
    readTopic(topicvm, function () {
        $("#chatReadBox").empty();
    });
}

function showChatMessageToRead(msgs/*array of MessageViewModel*/) {
    for (var i = 0; i < msgs.length; i++) {
        // Add the message to the page.
        $('#chatReadBox').append('<li><strong>' + htmlEncode(msgs[i].UserName)
            + '</strong>: ' + htmlEncode(msgs[i].Text) +
            '&nbsp&nbsp<i>' + new Date(msgs[i].CreatedDate).toLocaleTimeString() + '</i>' +
            '</li>');
    }
}

function getRecentChatMessagesToRead(topic) {
    getRecentMessagesToRead(topic, function (data) {
        //showChatMessageToRead(data);

        for (var i = 0; i < data.length; i++) {
            if (data[i].Type == 2 /*message*/) {
                showChatMessageToRead([data[i]]);
            }
            //else if (data[i].Type == 9 /* admin invitations*/) {
            //    var msgDate = dateAdd(new Date(data[i].Date), 'minute', 10);
            //    var now = new Date();
            //    if (data[i].TopicId != currentTopicId && msgDate >= now) {
            //        showAdminInvitation([data[i]]);
            //    }
            //}
        }
    });
}

function topicsInit() {
    loadTopicList();
}
