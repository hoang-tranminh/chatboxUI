var utils = require('./../app_common/Utils.js');
var UserAvatarBig =  require('./UserAvatarBig.js');

var NewTopic = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("NewTopic updated");
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.currentScreen == nextProps.currentScreen;
        notUpdate = notUpdate & this.props.userData.userName == nextProps.userData.userName;
        notUpdate = notUpdate & this.props.userData.avatar == nextProps.userData.avatar;
        return !notUpdate;
    },
    validateTopicName:function(name){
        if (!name || name.length < 2 || name.length > 150) {
            return false;
        }

        return true;
    },
    inputKeyDown:function(event)
    {
        if(event.keyCode == 13)
        {
            this.handleClick("inputEnter");
        }
    },
    handleClick: function(event){
        if(event == "inputEnter" || event.target.id == "createTopic")
        {
            $(this.errorDiv).empty();
            if(!this.validateTopicName(this.txtTopicName.value))
            {
                utils.showError(this.errorDiv.id, "Please enter a topic name with length 2-150 characters.");
                return;
            }
            this.props.createNewTopic(this.txtTopicName.value);
            this.txtTopicName.value="";
        }
        else {
            this.props.cancelNewTopic();
            this.txtTopicName.value="";
        }
    },
    render:function(){
        var active = this.props.currentScreen == "newtopic" ? '': ' hidden';
        return ( <div className={"newTopicForm" + active}>
                    <div className="avatarContainer">
                    <UserAvatarBig userName={this.props.userData.userName} avatar={this.props.userData.avatar}
                    changeName={this.props.changeName}/>
                    </div>
                    <div className="newTopicTitle">Please create a topic to talk to people:</div>
                    <div className="topicName">
                    <input type="text" id="txtTopicName" placeholder="Enter topic name" ref={(ref) => this.txtTopicName = ref} onKeyDown={this.inputKeyDown}></input></div>
                    <div className="buttonContainer">
                        <input type="button" className="btn registerButton" id="createTopic" value="Create" onClick={this.handleClick} />
                        <input type="button" className="btn cancelButton" id="cancelNewTopic" value="Cancel" onClick={this.handleClick}/>
                        </div>
                    <div id="newTopicFormErrors" style={{display:'none'}} ref={(ref) => this.errorDiv = ref}></div>
                    
                </div>
            );
}
});

module.exports = NewTopic;
