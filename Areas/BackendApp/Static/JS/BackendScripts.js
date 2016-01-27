
function Logout()
{
    event = event || window.event;
    var $form = $(event.target).parent();
    $form[0].submit();
}

function GetCurrentUri()
{
    if (!window.uri) {
        if ($("#currentDomain").length)
            window.uri = $("#currentDomain").val();
        else
            window.uri = $.cookie("currentDomain");
    }
    return window.uri;
}

$(function () {
    topicsInit();

    chatBoxInit();

    initSignalR();

    //fetchStatistics();
});