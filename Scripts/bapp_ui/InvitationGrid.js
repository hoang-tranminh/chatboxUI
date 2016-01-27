var utils = require('./../app_common/Utils.js');

var InvitationGrid = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("InvitationGrid updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    handleClick: function(event){
        this.props.joinInvitation.call(this,$(event.target).attr('data-topicid'), $(event.target).attr('data-userid'));
    },
    previewInvi: function(event){
        this.props.previewInvitation.call(this,$(event.target).attr('data-topicid'), $(event.target).attr('data-userid'));
    },
    render:function(){
        var clickFunc = this.handleClick;
        var previewFunc = this.previewInvi;
        var currentTopic =this.props.activeInvitation;
        var th = !this.props.isAdmin ? <th>Topic name</th>:null ;
        var props = this.props;
        var invitationNodes = this.props.invitationData.map(function(invi){
            var date = typeof(invi.CreatedDate) === "string" ? new Date(invi.CreatedDate) : invi.CreatedDate;
            var cssClass = currentTopic == invi.TopicId ? " active" : "";
            if(!props.isAdmin)
            {
                return (
                        <tr className={"invitationRow" + cssClass} key={invi.Id}>
                            <td className="userName">{invi.UserName}</td>
                            <td className="topicName">{invi.TopicSubject}</td>
                            <td className="userLeft">{invi.UserLeft? "True" :"False"}</td>
                            <td className="inviTime">{jQuery.timeago(date)}</td>
                            <td><a className="inviLink" href="javascript:void(0)" data-topicid={invi.TopicId} data-userid={invi.UserName} onClick={clickFunc} >Join</a></td> 
                            <td><a className="prevLink" href="javascript:void(0)" data-topicid={invi.TopicId} data-userid={invi.UserName} onClick={previewFunc} >Preview</a></td> 
                        </tr> 
                );
            }
            else
            {
                    return (
                            <tr className={"invitationRow" + cssClass} key={invi.Id}>
                                <td className="userName">{invi.UserName}</td>
                                <td className="userLeft">{invi.UserLeft? "True" :"False"}</td>
                                <td className="inviTime">{jQuery.timeago(date)} </td>
                                <td><a className="inviLink" href="javascript:void(0)" data-topicid={invi.TopicId} data-userid={invi.UserName} onClick={clickFunc} >Join</a></td> 
                                <td><a className="prevLink" href="javascript:void(0)" data-topicid={invi.TopicId} data-userid={invi.UserName} onClick={previewFunc} >Preview</a></td> 
                            </tr> 
                    );
            }

        });
return ( 
        <table className="table table-bordered table-hover table-condensed">
            <thead>
                <tr>
                    <th>From user</th>
                    {th} 
                    <th>User left the topic</th>
                    <th>Invitation date</th>
                    <th>Join</th>
                    <th>Preview</th>
                </tr>
            </thead>
            <tbody>
                    {invitationNodes} 
            </tbody>
        </table>
       );
}
});

module.exports = InvitationGrid;