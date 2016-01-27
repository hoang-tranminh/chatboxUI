var utils = require('./../app_common/Utils.js');
var bemodel = require('./BackendModel.js');
var BeUIBusiness = require('./BackendUIBusiness.js');
var CoreBusiness = require('./../app_common/BusinessCore.js');
var coreBusiness = new CoreBusiness();
window.coreBusiness = coreBusiness;
var uiBusiness = new BeUIBusiness(bemodel, coreBusiness);

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;
var IndexLink = ReactRouter.IndexLink;
var browserHistory = ReactRouter.browserHistory;

var Navigation = require('./../bapp_ui/Navigation.js');
var PageWrapper = require('./../bapp_ui/PageWrapper.js');
var Invitations = require('./../bapp_ui/Invitations.js');
var Dashboard = require('./../bapp_ui/Dashboard.js');
var Topics = require('./../bapp_ui/Topics.js');
var ChatBoxWrapper = require('./../bapp_ui/ChatBoxWrapper.js');

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
    getInitialState: function() {
        bemodel.data.userData.userName=$("#loginUser").val();
        bemodel.bindUpdateFunc(this.setState, this);
        return bemodel;
    },
    sendMessage:function(msg, boxName){
        uiBusiness.sendUserMessage(msg, boxName);
    },
    joinInvitation:function(topicId, fromUser){
        uiBusiness.joinInvitation(topicId, fromUser);
    },
    leaveCurrentTopic:function(topicId, boxName){
        uiBusiness.leaveCurrentTopic(topicId, boxName);
    },
    joinTopic:function(topicId){
        uiBusiness.joinTopic(topicId);
    },
    componentDidMount: function() {
        $.support.cors = true;
        coreBusiness.initSignalR();
    },
    logOut: function(event){
        uiBusiness.logOut();
    },
    toggleBoxSize:function(boxName){
        if(boxName =="chatBox1") {
            bemodel.layout.chatBox1Minified = !bemodel.layout.chatBox1Minified;
        }
        else {
            bemodel.layout.chatBox2Minified = !bemodel.layout.chatBox2Minified;
        }
        bemodel.raiseChanged();
    },
    render:function(){
        return (
            <div id="wrapper" >
                <ChatBoxWrapper toggleBoxSize={this.toggleBoxSize} name="chatBox1" model={bemodel.chatBox1} leaveCurrentTopic={this.leaveCurrentTopic} 
                    userName={bemodel.data.userData.userName} 
                    minified={bemodel.layout.chatBox1Minified}
                    sendMessage={this.sendMessage} />
                <ChatBoxWrapper toggleBoxSize={this.toggleBoxSize} name="chatBox2" model={bemodel.chatBox2} leaveCurrentTopic={this.leaveCurrentTopic} 
                    userName={bemodel.data.userData.userName} 
                    minified={bemodel.layout.chatBox2Minified}
                    sendMessage={this.sendMessage} />
                <Navigation logOut={this.logOut}/>
                <PageWrapper comp={this.props.children} userName={bemodel.data.userData.userName} joinInvitation={this.joinInvitation}
                        joinTopic={this.joinTopic}/>
            </div>
            );
    }
});

ReactDOM.render(
   <Router history={browserHistory}>
    <Route path="/" component={BackendMain}>
      <IndexRoute component={Dashboard }/>
      <Route path="invitations" component={Invitations}/>
      <Route path="topics" component={Topics}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>,
document.getElementById('reactContainer')
);




   