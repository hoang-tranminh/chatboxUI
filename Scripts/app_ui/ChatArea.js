var utils = require('./../app_common/Utils.js');

var MessageList = require('./MessageList.js');
var MessageForm = require('./MessageForm.js');
var ChatAreaHeader = require('./ChatAreaHeader.js');

var ChatArea = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        if(this.props.componentUpdated)
            this.props.componentUpdated.call(this);
        utils.consoleLog("ChatArea updated");
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        return true;
    },
    render:function(){
        var active = this.props.active ? '': ' hidden';
        return ( <div className={"chatArea" + active}>
                    <ChatAreaHeader leaveCurrentTopic={this.props.leaveCurrentTopic} activeTopic={this.props.activeTopic} 
                            userName={this.props.userName} 
                            userInviting={this.props.userInviting} 
                            userIsAdmin={this.props.userIsAdmin} />
                    <div className="messageArea">
                       <MessageList currentTopicMessages={this.props.currentTopicMessages} userName={this.props.userName} />
                    </div>
                    <MessageForm sendMessage={this.props.sendMessage}/>
                </div>
            );
}
});

module.exports = ChatArea;