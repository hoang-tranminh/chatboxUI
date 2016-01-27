//var BeUIBusiness = require('./BackendUIBusiness.js');
//var beUIBusiness = new BeUIBusiness();
var Utils = require('./../../../../scripts/app_core/Utils.js');
var utils = Utils();
//var models = require('./BackendReactModels.js');
//var mainModel = models.mainModel;
//var coreBusiness = beUIBusiness.coreBusiness;

var InvitationList = require('./../../../../scripts/app_ui/InvitationList.js').InvitationList;
var MessageList= require('./../../../../scripts/app_ui/MessageList.js').MessageList;
var MessageForm = require('./../../../../scripts/app_ui/MessageForm.js').MessageForm;

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;
var IndexLink = ReactRouter.IndexLink;
var browserHistory = ReactRouter.browserHistory;

var NavBarHeader = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("NavBarHeader updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return ( <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="index.html">YetAnotherChat</a>
                </div>
            );
    }
});

//var MessagePreview = React.createClass({
//    componentDidUpdate :function(prevProps, prevState) {
//        utils.consoleLog("MessagePreview updated");
//    },
//    shouldComponentUpdate :function(nextProps, nextState) {
//        return true;
//    },
//    render:function(){
//        return ( 	<li className="dropdown">
//                        <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-envelope"></i> <b className="caret"></b></a>
//                        <ul className="dropdown-menu message-dropdown">
//                            <li className="message-preview">
//                                <a href="#">
//                                    <div className="media">
//                                        <span className="pull-left">
//                                            <img className="media-object" src="http://placehold.it/50x50" alt=""/>
//                                        </span>
//                                        <div className="media-body">
//                                            <h5 className="media-heading">
//                                                <strong>John Smith</strong>
//                                            </h5>
//                                            <p className="small text-muted"><i className="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>
//                                            <p>Lorem ipsum dolor sit amet, consectetur...</p>
//                                        </div>
//                                    </div>
//                                </a>
//                            </li>
                           
                            
//                            <li className="message-footer">
//                                <a href="#">Read All New Messages</a>
//                            </li>
//                        </ul>
//                    </li>
//				);
//    }
//});

//var AlertPreview = React.createClass({
//    componentDidUpdate :function(prevProps, prevState) {
//        utils.consoleLog("MessagePreview updated");
//    },
//    shouldComponentUpdate :function(nextProps, nextState) {
//        return true;
//    },
//    render:function(){
//        return ( 	<li className="dropdown">
//                        <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-bell"></i> <b className="caret"></b></a>
//                        <ul className="dropdown-menu alert-dropdown">
//                            <li>
//                                <a href="#">Alert Name <span className="label label-default">Alert Badge</span></a>
//                            </li>
                          
//                            <li className="divider"></li>
//                            <li>
//                                <a href="#">View All</a>
//                            </li>
//                        </ul>
//                    </li>
//				);
//    }
//});

var SettingsDropdown = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("SettingsDropdown updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        var userName = $("#loginUser").val();
        return ( 	<li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-user"></i>{userName}<b className="caret"></b></a>

                        <ul className="dropdown-menu">
                            <li>
                                <a href="#"><i className="fa fa-fw fa-user"></i> Profile</a>
                            </li>
                            <li>
                                <a href="#"><i className="fa fa-fw fa-envelope"></i> Inbox</a>
                            </li>
                            <li>
                                <a href="#"><i className="fa fa-fw fa-gear"></i> Settings</a>
                            </li>
                            <li className="divider"></li>
                            <li>
                                 <a href="javascript:void(0)" id="logoutLink"><i className="fa fa-fw fa-power-off"></i> Log Out</a>
                            </li>
                        </ul>

                    </li>
				);
    }
});

var TopMenu = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("TopMenu updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return (<ul className="nav navbar-right top-nav">
                    {/*<MessagePreview />
					<AlertPreview/>*/}
                    <SettingsDropdown/>
				</ul>
            );
    }
});

var Navigation = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("Navigation updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return ( <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation" > 
                    <NavBarHeader/>
                    <TopMenu/>
                    <SideMenu compName={this.props.compName}/>
                 </nav>
            );
    }
});

var SideMenu = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("SideMenu updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return (<div className="collapse navbar-collapse navbar-ex1-collapse">
					<ul className="nav navbar-nav side-nav">
						<li key="liveChat">
							<IndexLink to="/" activeClassName="active"><i className="fa fa-fw fa-dashboard"></i> Live chat</IndexLink>
						</li>
						<li key="chatHistory">
							<Link to="chathistory" activeClassName="active"><i className="fa fa-fw fa-bar-chart-o"></i> Chat history</Link>
						</li>
					</ul>
				</div>
            );
    }
});



var PageWrapper = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("PageWrapper updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return ( <div class="container-fluid">
                    {this.props.comp && React.cloneElement(this.props.comp, {
                        sendMessage: this.props.sendMessage,
                        joinInvitation: this.props.joinInvitation
                    })}
                 </div>
            );
    }
});

var LiveChat = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("LiveChat updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        var inviData = [{ UserName: 'Bien.Tran', TopicSubject: 'Find a girl friend1', TopicId: 1, CreatedDate: new Date(), Id: 1 },
                        { UserName: 'Bien.Tran', TopicSubject: 'Find a girl friend2', TopicId: 2, CreatedDate: new Date(), Id: 2 },
                        { UserName: 'Bien.Tran', TopicSubject: 'Find a girl friend3', TopicId: 3, CreatedDate: new Date(), Id: 3 }];

        var messageData =[{ UserName: 'Bien.Tran', Text: 'example text message 1', CreatedDate: new Date(), Id: 1 },
                            { UserName: 'Bien.Tran', Text: 'example text message 2', CreatedDate: new Date(), Id: 2 },
                            { UserName: 'Bien.Tran', Text: 'example text message 3', CreatedDate: new Date(), Id: 3 }];

        return ( <div className="container-fluid">
					<div className="row">
                        <div className="col-md-8">
                                <ul className="nav nav-tabs">
                                      <li role="presentation" className="active"><a data-toggle="tab" href="#adminInvi">Admin invitations</a></li>
                                      <li role="presentation"><a data-toggle="tab" href="#userInvi">User invitations</a></li>
                                      <li role="presentation"><a data-toggle="tab" href="#userOnline">Online users</a></li>
                                    </ul>
                                <div className="tab-content"> 
                                    <div id="adminInvi" className="tab-pane fade in active">
                                         <InvitationList invitationData={inviData} joinInvitation={this.props.joinInvitation}/>
                                    </div>
                                    <div id="userInvi" className="tab-pane fade">
                                         <InvitationList invitationData={inviData} joinInvitation={this.props.joinInvitation}/>
                                    </div>
                                    <div id="userOnline" className="tab-pane fade">
                                         Online users list 
                                    </div>
                                </div>
                        </div>
                        <div className="col-md-4">
                            <div className="chatArea">
                                 <div className="messageArea">
                                    <MessageList currentTopicMessages={messageData} userName="Bien.Tran" />
                                </div>
                                <MessageForm sendMessage={this.props.sendMessage}/>
                            </div>
                        </div>
                    </div>
                 </div>
            );
    }
});

var ChatHistory = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("ChatHistory updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return ( <div>
					ChatHistory is here! Will list all conversations in current week.
                 </div>
            );
    }
});

var NoMatch = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("NoMatch updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return ( <div>
					No react route found here, go away.
                 </div>
            );
    }
});

var BackendMain = React.createClass({
    //getInitialState: function() {
        //mainModel.bindUpdateFunc(this.setState, this);
        //return mainModel;
    //},
    sendMessage:function(msg){},
    joinInvitation:function(){},
    componentDidMount: function() {
        $.support.cors = true;
        //coreBusiness.initSignalR();
    },
    render:function(){
        return (
            <div id="wrapper" >
                <Navigation/>
                <PageWrapper comp={this.props.children} sendMessage={this.sendMessage} joinInvitation={this.joinInvitation} />
            </div>
            );
    }
});

ReactDOM.render(
   <Router history={browserHistory}>
    <Route path="/" component={BackendMain}>
      <IndexRoute component={LiveChat }/>
      <Route path="chathistory" component={ChatHistory}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>,
document.getElementById('reactContainer')
);




   