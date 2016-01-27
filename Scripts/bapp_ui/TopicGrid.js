var utils = require('./../app_common/Utils.js');

var TopicGrid = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("TopicGrid updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    handleClick: function(event){
        this.props.joinTopic.call(this,$(event.target).attr('data-topicid'));
    },
    watchTopic: function(event){
        this.props.watchTopic.call(this,$(event.target).attr('data-topicid'));
    },
    render:function(){
        var clickFunc = this.handleClick;
        var watchFunc = this.watchTopic;
        var currentTopic =this.props.activeTopic;
        var topicNodes = this.props.topicData.map(function(topic){
            var date = typeof(topic.CreatedDate) === "string" ? new Date(topic.CreatedDate) : topic.CreatedDate;
            var cssClass = currentTopic == topic.TopicId ? " active" : "";
            if(!topic.IsAdminTopic)
            {
                return (
                        <tr className={"topicRow" + cssClass} key={topic.TopicId}>
                            <td className="topicName">{topic.Subject}</td>
                            <td className="userCount">{topic.UserCount}</td>
                            <td className="messageCount">{topic.MessageCount}</td>
                            <td className="lastActiveDate" title={new Date(topic.LastActivityDate).toLocaleString()}>{jQuery.timeago(topic.LastActivityDate)}</td>
                            <td><a className="topicLink" href="javascript:void(0)" data-topicid={topic.TopicId} onClick={clickFunc} >Join</a></td> 
                            <td><a className="prevLink" href="javascript:void(0)" data-topicid={topic.TopicId} onClick={watchFunc} >Preview</a></td> 
                        </tr> 
                );
            }
            else
            {
                    return (
                              <tr className={"topicRow" + cssClass} key={topic.TopicId}>
                                <td className="supportUser">{topic.CreatedBy}</td>
                                <td className="userCount">{topic.UserCount}</td>
                                <td className="messageCount">{topic.MessageCount}</td>
                                <td className="lastActiveDate" title={new Date(topic.LastActivityDate).toLocaleString()}>{jQuery.timeago(topic.LastActivityDate)}</td>
                                <td><a className="topicLink" href="javascript:void(0)" data-topicid={topic.TopicId} onClick={clickFunc} >Join</a></td> 
                                <td><a className="prevLink" href="javascript:void(0)" data-topicid={topic.TopicId} onClick={watchFunc} >Preview</a></td> 
                        </tr> 
                    );
            }

        });
        return ( 
                <table className="table table-bordered table-hover table-condensed">
                    <thead>
                        <tr>
                            <th>Topic name /Support user name</th>
                            <th>Online users</th>
                            <th>Message count</th>
                            <th>Last active date</th>
                            <th>Join</th>
                            <th>Preview</th>
                        </tr>
                    </thead>
                    <tbody>
                            {topicNodes} 
                    </tbody>
                </table>
               );
}
});

module.exports = TopicGrid;