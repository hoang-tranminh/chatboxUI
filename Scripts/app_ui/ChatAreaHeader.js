var utils = require('./../app_common/Utils.js');
var ChatAreaHeader = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("ChatAreaHeader updated");
    },
    handleClick: function(event){
        this.props.leaveCurrentTopic();
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.activeTopic == nextProps.activeTopic;
        notUpdate = notUpdate & this.props.userName == nextProps.userName;
        return !notUpdate;
    },
    render:function(){
        var topicName = this.props.activeTopic ? (this.props.activeTopic.IsAdminTopic ? "Site support service": this.props.activeTopic.Subject): '';
        var shortTopicName = topicName.length > 30? topicName.substr(0,30) + '..': topicName;

        var topicNameArea = this.props.activeTopic ? (<div className="topicName"><span title={topicName}>{shortTopicName}</span><a className="leaveTopicLink" href="javascript:void(0)" onClick={this.handleClick}>Leave.</a></div>) :
                    (<div className="topicName">There is no topic to talk.</div>)
        if(this.props.userIsAdmin && this.props.activeTopic && this.props.activeTopic.IsAdminTopic)
            topicNameArea = <div className="topicName"><span title="User supporting talk">You are talking to user: {this.props.userInviting}</span><a className="leaveTopicLink" href="javascript:void(0)" onClick={this.handleClick}>Leave.</a></div>;

        return (    <div className="header">
                        <div className="avatar" ><img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/pixel.png"} /> </div>
                        <div className="headerText">
                            <div className="userName"><span className="greeting">Hi</span><span className="name">{this.props.userName}</span> </div>
                            {topicNameArea}
                        </div>
                    </div> 
            );
    }
});

module.exports= ChatAreaHeader;