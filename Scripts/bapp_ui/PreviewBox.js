var utils = require('./../app_common/Utils.js');

var scrollToLast= false;
var PreviewBox = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("PreviewBox updated");

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
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){

        var previewingMessages = this.props.previewingData.map(function(msg){
            return (<li className={"previewItem"}  key={msg.Id}>
                        <span className="nick-name">{msg.UserName} :</span>
                        <span className="item-text">{msg.Text}</span>
                        <span className="item-time"> {jQuery.timeago(msg.Date)}</span>
                </li>);
        });
        if(this.props.previewingData.length ==0)
        {
            previewingMessages = (<li> <span className="item-text">There is no message to preview.</span>  </li>);
        }

        return ( <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4>{this.props.header}</h4>
                    </div>
                    <div className="panel-body">
                        <ul className="previewMessageList" ref={(ref) => this.msgContainer = ref}>
                            {previewingMessages}
                        </ul>
                    </div>
                </div>
            );
    }
});

module.exports = PreviewBox;