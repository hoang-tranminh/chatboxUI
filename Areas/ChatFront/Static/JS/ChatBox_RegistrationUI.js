var Registration = React.createClass({
    render:function(){
        return (
                <h1>Registration</h1>
            );
    }
});

//function ValidateName(name) {
//    if (!name || name.length < 2 || name.length > 25) {
//        return false;
//    }

//    return true;
//}

//function autoRegister(name, okFunc) {
   
//    createAutoUser(name, function (data) {
//        //set user data in HTML element and in cookie
//        getOrSetUserData(data);

//        $("span.autoName").text(data.name);

//        //always hide registration form
//        $("#registerForm").hide();
//        //show the topic list
//        $("#chatBox").hide();
//        $("#chatBox").data("activeTopic", null);
//        $("#topicsSelection").show();
//        $("#registerForm").hide();
//        createTopicCancel();
//    });

//    return getOrSetUserData();
//}

//function registerButtonClick() {
//    if ($("#registerForm input[name='registerMethod']:checked").hasClass("anonymousRadioButton")) {
//        var anonymousName = $("#anonymousUserName").val();

//        if (!ValidateName(anonymousName)) {
//            showError("registerFormErrors", "Please select a user name from 2 to 25 characters.");
//            return;
//        }
//        autoRegister(anonymousName);
//    } else {
//        //TODO: implement login = FB, TW, G+
//    }
//}

////toggle login method, still anonymous but with new name
////or login by FB, TW, G+
//function registerRadioButtonClick() {
//    //if ($(this).hasClass("loginRadioButton")) {
//    //    $("div.loginRadioButton").show();
//    //    $("div.anonymousRadioButton").hide();
//    //} else {
//    //    $("div.loginRadioButton").hide();
//    //    $("div.anonymousRadioButton").show();
//    //}
//}

//function changeNameClick() {
//    $("#topicsSelection").hide();
//    $("#chatBox").hide();
//    $("#registerForm").show();
//    $("input.anonymousRadioButton").attr('checked', true);
//}


//function registrationInit() {

//    //bind event for registration button
//    $("#buttonRegister").click(registerButtonClick);

//    $("#topicsSelection button.changeName").click(changeNameClick);

//    //bind event to toggle registration modes
//    $(".registerForm input[name='regiserMethod']").click(registerRadioButtonClick);

//    var udata = getOrSetUserData();
//    if (udata == null)
//        udata = autoRegister("auto");
//    else
//        $("span.autoName").text(udata.name);
//}





