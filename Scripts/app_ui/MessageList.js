var utils = require('./../app_common/Utils.js');

var scrollToLast= false;
var MessageList = React.createClass({
    getInitialState: function() {
        return {flag:0};
    },
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("MessageList updated");
        var $allMessages = $(this.msgContainer);
        var $parentBox = $allMessages.parent();
        var heightDiff = $allMessages.height() - $parentBox.height();
        var $lastMsg = $allMessages.children("li:last-child");
        if(heightDiff >0)
        {
            if(heightDiff - $parentBox.scrollTop() - $lastMsg.height() < 15 )  {
                $parentBox.scrollTop(heightDiff);

            }
            if(scrollToLast)
            {
                $parentBox.scrollTop(heightDiff);
                scrollToLast = false;
            }
        }
		
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        if(this.props.currentTopicMessages.length == 0 && nextProps.currentTopicMessages.length >0 )
            scrollToLast=true;
		
        return !utils.compareSortedArray(this.props.currentTopicMessages, nextProps.currentTopicMessages) || this.state != nextState;
		
    },
    messageClick: function(event) {
        var li =event.target;
        while(li.tagName != "LI")
        {
            li= li.parentNode;
        }
        var msgId = $(li).attr('data-msgid');
        var msg =null;
        for(var i=0; i<this.props.currentTopicMessages.length; i++) {
            if(this.props.currentTopicMessages[i].Id == msgId)
            {
                msg = this.props.currentTopicMessages[i];
                break;
            }
        }
        if(msg) {
            msg.showTime=!msg.showTime;
            this.setState({flag:++this.state.flag});
        }
    },
    componentDidMount :function(){ },
    render:function(){
        var props = this.props;
        var clickFunc = this.messageClick;
        var messages = this.props.currentTopicMessages.map(function(msg){
            var css =  msg.UserName == props.userName || msg.UserName=="me" ? "me":"other";
            var timeCss = msg.showTime ? "": " hidden";
            var date = msg.Date? new Date(msg.Date) : new Date();
            return (<li data-msgid={msg.Id} onClick={clickFunc} className={"chatlistitem " + css}  key={msg.Id}>
                    <div className="text-container" ><i className="ico ico-arrow"></i><span className="nick-name">{msg.UserName}</span>
                        <span className="item-text">{msg.Text}</span></div>
                    <div className={timeCss} ><span className="item-time" title={date.toLocaleString()}> {jQuery.timeago(date)}</span></div>
                    <div style={{clear:'both'}}></div>
                </li>);
        });
    return (<ul className="messageList" ref={(ref) => this.msgContainer = ref}>
                {messages}
            </ul>
        );
    }
});

module.exports = MessageList;





   