var utils = require('./../app_common/Utils.js');

var ActionSlideInMenu = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("ActionSlideInMenu updated");
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.currentScreen == nextProps.currentScreen;
        notUpdate = notUpdate & this.props.slideInMenuActive == nextProps.slideInMenuActive;
        notUpdate = notUpdate & this.props.statistics.DomainUserCount == nextProps.statistics.DomainUserCount;
        notUpdate = notUpdate & this.props.statistics.LinkUserCount == nextProps.statistics.LinkUserCount;
        notUpdate = notUpdate & this.props.statistics.AdminCount == nextProps.statistics.AdminCount;
        return !notUpdate;
    },
    handleClick: function(event){
        this.props.toogleSlideInMenu();
    },
    buttonClick:function(event) {
        this.props.invitePeopleToTopic(event.target.id);
    },
    render:function(){
        var handleVisible = this.props.currentScreen == "chatArea" ? ' show': ' hide';
        var active = this.props.currentScreen == "chatArea" &&
            this.props.slideInMenuActive ? ' active': '';
        
        var domainTitle = 'There are ' + this.props.statistics.DomainUserCount + ' number of users online on current domain. Click to invite them to this topic.';
        var linkTitle = 'There are ' + this.props.statistics.LinkUserCount + ' number of users online on current link. Click to invite them to this topic.';
        var  adminTitle = 'There are ' + this.props.statistics.AdminCount + ' number of support persons online. Click to invite them to this topic privately.';

        return ( <div className={"actionSlideIn" + active}>
                    <div className={"handle"+ handleVisible + active} onClick={this.handleClick}></div> 
                    <div className="actionIcons">
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/domainUsers.png"} className="domainUsersSmall" 
                        title={domainTitle} onClick={this.buttonClick} id="inviteDomain" />
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/linkUsers.png"} className="linkUsersSmall" 
                        title={linkTitle} onClick={this.buttonClick} id="inviteLink" />
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/adminUsers.png"} className="adminUsersSmall" 
                        title={adminTitle} onClick={this.buttonClick} id="inviteAdmin" />
                        <span title={domainTitle} className="positioned userCountBg domainUserCountSmall">{this.props.statistics.DomainUserCount}</span>
                        <span title={linkTitle} className="positioned userCountBg linkUserCountSmall">{this.props.statistics.LinkUserCount}</span>
                        <span title={adminTitle} className="positioned userCountBg adminUserCountSmall">{this.props.statistics.AdminCount}</span>
                        </div>
                        </div>
            );
        }
});

module.exports = ActionSlideInMenu;