var utils = require('./../app_common/Utils.js');

var UserAvatarBig = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("UserAvatarBig updated");
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.avatar == nextProps.avatar;
        notUpdate = notUpdate & this.props.userName == nextProps.userName;
	     
        return !notUpdate;
    },
    handleClick: function(event) {
        this.props.changeName();
    },
    render:function(){
        var imgLink = this.props.avatar ? this.props.avatar: "http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/defaultuseravatar.png";
        return ( <div className="userAvatarBig"> 
                    <a href="javascript:void(0)" onClick={this.handleClick} className="imgLink">
                        <img src={imgLink} title="Please click here to change your display name" className="avatarImg"/>
                        </a> 
                    <a href="javascript:void(0)" onClick={this.handleClick} className="greetingLink">
                        <span className="greeting">Hi</span><span className="userName">{this.props.userName}</span>
                        </a> 
                </div>
            );
    }
});

module.exports = UserAvatarBig;