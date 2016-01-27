var utils = require('./../app_common/Utils.js');

var InvitationGrid = require('./../bapp_ui/InvitationGrid.js');
var PreviewBox = require('./../bapp_ui/PreviewBox.js');
/*
ALL PROPERTY OF THIS MODEL THAT ARE OBJECT MUST BE CLONED, THEN MODIFIED, THEN ASSIGNED BACK, TO MAKE shouldComponentUpdate WORKS
*/
var _updateFunc = null;
var _updateContext = null;
var inviData= {
        layout: {
            currentTab:null
        },
        data: {
            //activeTopic: null,
            //userInviting:null,
            adminInviData: /*array of InvitationViewModel*/[],
            userInviData: /*array of InvitationViewModel*/[],
            //offlineInviData: /*array of InvitationViewModel*/[],
            previewingTopic:null /*previewing topic Id*/,
            previewingData: [] /*array of MessageViewModel*/,
            //offlineInviDate:null
            inviDate:null, /* Date object*/
            oldInviDate:null, /* Date object*/
            showingOfflineInvi:true
        },
        bindUpdateFunc: function (func, context) {
            _updateFunc = func;
            _updateContext = context;
        },
        raiseChanged: function () {
            if (_updateFunc && _updateContext)
                _updateFunc.call(_updateContext, this);
        }
};
var UIBusiness= require('./../bapp_core/InvitationsUIBusiness.js');
var uiBusiness = new UIBusiness(inviData, window.coreBusiness);

var Invitations = React.createClass({
    getInitialState: function() {
        inviData.data.inviDate = new Date();
        inviData.bindUpdateFunc(this.setState, this);
        return inviData;
    },
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("Invitations updated");
    },
    componentDidMount: function() {
        uiBusiness.loadInvitationGrid();
    },
    componentWillUnmount:function(){
        uiBusiness.stopLoadingGrid();
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    previewInvitation: function(topicId, userId) {
        uiBusiness.previewInvitation(topicId, userId);
    },
    checkBoxChanged: function(event){
        uiBusiness.toogleOfflineInvi();
    },
    showMoreClick:function(event) {
        uiBusiness.showMoreInvitations();
    },
    render:function(){
        var adminInviCount = inviData.data.adminInviData.length;
        var userInviCount = inviData.data.userInviData.length;
        //var offlineInviCount = inviData.data.offlineInviData.length;

        return ( <div className="container-fluid">
                    <div classNamw="row">
                        <div className="col-md-12">
                            <h1 className="page-header">
                                Invitations <small> Join invitations to chat</small>
                            </h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                                <ul className="nav nav-tabs">
                                        <li role="presentation" className="active"><a data-toggle="tab" href="#adminInvi">Admin invitations <span className="badge">{adminInviCount}</span></a></li>
                                        <li role="presentation"><a data-toggle="tab" href="#userInvi">User invitations <span className="badge">{userInviCount}</span></a></li>
                                        {/*<li role="presentation"><a data-toggle="tab" href="#offlineInvi">Offline invitations <span className="badge">{offlineInviCount}</span></a></li>*/}
                                    </ul>
                                <div className="tab-content"> 
                                    <div id="adminInvi" className="tab-pane fade in active">
                                        <div className="infoDiv"><span className="label label-info"> <span className="glyphicon glyphicon-info-sign"/> Invitations from a user that openning a site support talk topic to admins</span></div>
                                         <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" checked={!inviData.data.showingOfflineInvi} onChange={this.checkBoxChanged}/> Remove invitations from users that left their topic.
                                                </label>
                                        </div>
                                        <InvitationGrid invitationData={inviData.data.adminInviData} joinInvitation={this.props.joinInvitation} 
                                            previewInvitation={this.previewInvitation} activeInvitation={inviData.data.previewingTopic} isAdmin={true} />
                                        <div className="form-group">
                                            <div><span className="label label-info showTimeLabel">Showing data from {inviData.data.inviDate.toLocaleString()}</span></div>
                                            <button id="userInviShowMore"  type="button" className="btn btn-primary btn-sm" onClick={this.showMoreClick}>Show more</button>
                                        </div>
                                    </div>
                                    <div id="userInvi" className="tab-pane fade">
                                        <div className="infoDiv"><span className="label label-info"> <span className="glyphicon glyphicon-info-sign"/> Invitations from an user that is in a topic to all users</span></div>
                                         <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" checked={!inviData.data.showingOfflineInvi} onChange={this.checkBoxChanged}/> Remove invitations from users that left their topic.
                                                </label>
                                        </div>
                                        <InvitationGrid invitationData={inviData.data.userInviData} joinInvitation={this.props.joinInvitation} 
                                            previewInvitation={this.previewInvitation} activeInvitation={inviData.data.previewingTopic} />
                                        <div className="form-group">
                                            <div><span className="label label-info showTimeLabel">Showing data from {inviData.data.inviDate.toLocaleString()}</span></div>
                                            <button id="userInviShowMore"  type="button" className="btn btn-primary btn-sm" onClick={this.showMoreClick}>Show more</button>
                                        </div>
                                    </div>
                                    {/*<div id="offlineInvi" className="tab-pane fade">
                                        <div className="infoDiv"><span className="label label-info"> <span className="glyphicon glyphicon-info-sign"/> Invitations from offline users </span></div>
                                            <InvitationGrid invitationData={inviData.data.offlineInviData} joinInvitation={this.props.joinInvitation} 
                                            previewInvitation={this.previewInvitation} activeInvitation={inviData.data.previewingTopic}  />
                                    </div>*/}
                                </div>
                        </div>

                         <div className="col-md-4">
                            <PreviewBox header="Preview invitation messages" previewingData={inviData.data.previewingData} />
                         </div>

                    </div>
                </div>
            );
        }
});

module.exports = Invitations;