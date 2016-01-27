var utils = require('./../app_common/Utils.js');

var InvitationList = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("InvitationList updated");
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        return !utils.compareSortedArray(this.props.invitationData, nextProps.invitationData);
    },
    handleClick: function(event){
        this.props.joinInvitation.call(this,$(event.target).attr('data-topicid'), $(event.target).attr('data-userid'));
    },
    render:function(){
        var clickFunc = this.handleClick;
        var invitationNodes = this.props.invitationData.map(function(invi){
            var date = typeof(invi.CreatedDate) === "string" ? new Date(invi.CreatedDate) : invi.CreatedDate;
            if(!invi.IsAdminInvitation)
            {
                return (
                        <li className="invitation" key={invi.Id}>
                            <span className="userName">{invi.UserName}</span> invited you to talk on "
                            <span className="topicName">{invi.TopicSubject + '"' }</span>
                            <span className="inviTime">{jQuery.timeago(date)}</span> 
                            <a className="inviLink" href="javascript:void(0)" data-topicid={invi.TopicId} data-userid={invi.UserName} onClick={clickFunc} >Join</a> 
                        </li> 
                );
            }
            else
            {
                return (
                        <li className="invitation" key={invi.Id}>
                            <span className="userName">{invi.UserName}</span> invited you to talk privately
                            <span className="inviTime">{jQuery.timeago(date)}</span> 
                            <a className="inviLink" href="javascript:void(0)" data-topicid={invi.TopicId} data-userid={invi.UserName} onClick={clickFunc} >Join</a> 
                        </li> 
                );
            }

        });
    return ( <ul className="invitations">
                 {invitationNodes} 
             </ul>
                );
        }
});

module.exports = InvitationList;