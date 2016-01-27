var utils = require('./../app_common/Utils.js');
var UserAvatarBig =  require('./UserAvatarBig.js');

var MainScreen = React.createClass({
	 componentDidUpdate :function(prevProps, prevState) {
		utils.consoleLog("MainScreen updated");
	 },
	 shouldComponentUpdate :function(nextProps, nextState)
	{
		 var notUpdate = true;
	      notUpdate = notUpdate & this.props.userData.userName == nextProps.userData.userName;
	     notUpdate = notUpdate & this.props.userData.avatar == nextProps.userData.avatar;
	     notUpdate = notUpdate & this.props.statistics.DomainUserCount == nextProps.statistics.DomainUserCount;
	     notUpdate = notUpdate & this.props.statistics.LinkUserCount == nextProps.statistics.LinkUserCount;
	     notUpdate = notUpdate & this.props.statistics.AdminCount == nextProps.statistics.AdminCount;
		return !notUpdate;
	},
	 handleClick: function(event){
	     this.props.invitePeople(event.target.id);
    },
    render:function(){
        var domainTitle = 'There are ' + this.props.statistics.DomainUserCount + ' number of users online on current domain. Click to invite them to talk.';
        var linkTitle = 'There are ' + this.props.statistics.LinkUserCount + ' number of users online on current link. Click to invite them to talk.';
        var  adminTitle = 'There are ' + this.props.statistics.AdminUserCount + ' number of support persons online. Click to invite them to talk privately.';
        return ( <div className="mainScreen">
                    <div className="avatarContainer">
                        <UserAvatarBig userName={this.props.userData.userName} avatar={this.props.userData.avatar}
                        changeName={this.props.changeName}/>
                    </div>
                    <div className="mainScreenIcons">
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/homeiconbg.png"} className="homeBackground"/>
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/domainUsers.png"} className="positioned domainUsers" id="inviteDomain"
                        title={domainTitle} onClick={this.handleClick} />
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/linkUsers.png"} className="positioned linkUsers"  id="inviteLink"
                        title={linkTitle} onClick={this.handleClick} />
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/adminUsers.png"} className="positioned adminUsers" id="inviteAdmin" 
                        title={adminTitle} onClick={this.handleClick} />
                        <span title={domainTitle} className="positioned userCountBg domainUserCount">{this.props.statistics.DomainUserCount}</span>
                        <span title={linkTitle} className="positioned userCountBg linkUserCount">{this.props.statistics.LinkUserCount}</span>
                        <span title={adminTitle} className="positioned userCountBg adminUserCount">{this.props.statistics.AdminCount}</span>
                    </div>    
                </div>
            );
    }
});

module.exports = MainScreen;





   