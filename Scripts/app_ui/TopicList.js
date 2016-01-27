var utils = require('./../app_common/Utils.js');
var TopicList = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("TopicList updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        var equal = utils.compareSortedArray(this.props.topicData, nextProps.topicData) && this.state == nextState;
        if(!equal)
            return true;
        for(var i =0; i< this.props.topicData.length; i++)
        {
            if(this.props.topicData[i].UserCount != nextProps.topicData[i].UserCount ||
                this.props.topicData[i].MessageCount != nextProps.topicData[i].MessageCount ||
                this.props.topicData[i].Subject != nextProps.topicData[i].Subject ||
                this.props.topicData[i].LastActivityDate != nextProps.topicData[i].LastActivityDate)
                return true;
        }
        return false;
    },
    handleTextChange: function(e) {
        this.setState({topicSearchTxt: e.target.value});
        this.props.setTopicSearchKey.call(this, e.target.value);
    },
    onKeyDown:function(event){
        if(event.keyCode == 13)
        {
            this.props.searchTopic(event.target.value);
        }
    },
    handleClick: function(event){
        this.props.joinSelectedTopic($(event.target).attr('data-topicid'));
    },
    render:function(){
        var clickFunc = this.handleClick;
        var topicRows = this.props.topicData.map(function(topic){
            var shortTopicName = topic.Subject.length > 45? topic.Subject.substr(0,45) +"..": topic.Subject;
            return (
                     <tr key={topic.TopicId}>
                            <td><span className="shortTopicName" title={topic.Subject}>{shortTopicName}</span>
                            <a className="inviLink" href="javascript:void(0)" data-topicid={topic.TopicId} onClick={clickFunc}>Join</a> </td>
                            <td><span className="userCount">{topic.UserCount}</span></td>
                            <td><span className="messageCount">{topic.MessageCount}</span></td>
                            <td><span className="createdDate" title={topic.LastActivityDate}>{jQuery.timeago(topic.LastActivityDate)}</span></td>
                        </tr>
                );
        });

        return ( <div className="topicList">
                     <div className="topicSearch">
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/searchIcon.png"} className="searchIcon"/>
                        <input type="text" id="txtTopicSearch" onKeyDown={this.onKeyDown} onChange={this.handleTextChange} placeholder="Type topic name and press enter to search"/>
                    </div>
                    <table className="topicTable">
                        <tbody>
                            <tr>
                                <th className="topicName"><span>Topic name</span></th>
                                <th className="userCount"><img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/TopicUserCount.png"} title="User count"></img></th>
                                <th className="messageCount"><img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/TopicMessageCount.png"} title="Message count"></img></th>
                                <th className="createdDate"><img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/TopicCreateTime.png"} title="Last activity, sometime ago"></img></th>
                            </tr>
                            {topicRows}
                        </tbody>
                    </table>
                    <span className="noTopicFound"></span>
                   
                </div>
                );
    }
});

module.exports = TopicList;               