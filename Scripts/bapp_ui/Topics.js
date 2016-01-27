var utils = require('./../app_common/Utils.js');

var TopicGrid = require('./../bapp_ui/TopicGrid.js');
var PreviewBox = require('./../bapp_ui/PreviewBox.js');
/*
ALL PROPERTY OF THIS MODEL THAT ARE OBJECT MUST BE CLONED, THEN MODIFIED, THEN ASSIGNED BACK, TO MAKE shouldComponentUpdate WORKS
*/
var _updateFunc = null;
var _updateContext = null;
var topicData= {
    layout: {
        currentTab:null
    },
    data: {
        adminTopicData: /*array of TopicViewModel*/[],
        userTopicData: /*array of TopicViewModel*/[],
        watchingTopic:null /*previewing topic Id*/,
        watchingData: [] /*array of MessageViewModel*/,
        topicCount:30,
        showOfflineTopic:true
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

var UIBusiness= require('./../bapp_core/TopicsUIBusiness.js');
var uiBusiness = new UIBusiness(topicData, window.coreBusiness);

var Topics = React.createClass({
    getInitialState: function() {
        topicData.bindUpdateFunc(this.setState, this);
        return topicData;
    },
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("Topics updated");
    },
    componentDidMount: function() {
        utils.consoleLog("Topics mounted");
        setTimeout(function(){
            uiBusiness.loadTopicGrid();
        },500);
    },
    componentWillUnmount:function(){
        uiBusiness.stopLoadTopicGrid();
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    watchTopic: function(topicId) {
        uiBusiness.watchTopic(topicId);
    },
    checkBoxChanged: function(event){
        uiBusiness.toogleOfflineTopic();
    },
    showMoreClick:function(event) {
        uiBusiness.showMoreTopics();
    },
    render:function() {

        var adminTopicCount = topicData.data.adminTopicData.length;
        var userTopicCount = topicData.data.userTopicData.length;
        //var offlineTopicCount = topicData.data.offlineTopicData.length;
        
        return ( <div className="container-fluid">
                    <div classNamw="row">
                        <div className="col-md-12">
                            <h1 className="page-header">
                                Topics <small> Preview topics or join one to chat</small>
                            </h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                                <ul className="nav nav-tabs">
                                        <li role="presentation" className="active"><a data-toggle="tab" href="#adminTopic">Site support talks <span className="badge">{adminTopicCount}</span></a></li>
                                        <li role="presentation"><a data-toggle="tab" href="#userTopic">User topics <span className="badge">{userTopicCount}</span></a></li>
                                        {/*<li role="presentation"><a data-toggle="tab" href="#offlineTopic">Inactive topics <span className="badge">{offlineTopicCount}</span></a></li>*/}
                                </ul>
                                <div className="tab-content"> 
                                    <div id="adminTopic" className="tab-pane fade in active">
                                        <div className="infoDiv"><span className="label label-info"> <span className="glyphicon glyphicon-info-sign"/> Latest site support talks</span></div>
                                         <div className="checkbox">
                                            <label>
                                                <input type="checkbox" checked={!topicData.data.showOfflineTopic} onChange={this.checkBoxChanged}/> Remove topics that has no user.
                                            </label>
                                        </div>
                                        <TopicGrid topicData={topicData.data.adminTopicData} joinTopic={this.props.joinTopic} 
                                        watchTopic={this.watchTopic} activeTopic={topicData.data.watchingTopic} />
                                        <div className="form-group">
                                            <div><span className="label label-info showTimeLabel">Showing top {topicData.data.topicCount} topics that recently changed</span></div>
                                            <button type="button" className="btn btn-primary btn-sm" onClick={this.showMoreClick}>Show more</button>
                                        </div>
                                    </div>
                                    <div id="userTopic" className="tab-pane fade">
                                        <div className="infoDiv"><span className="label label-info"> <span className="glyphicon glyphicon-info-sign"/> Topics from users </span></div>
                                         <div className="checkbox">
                                            <label>
                                                <input type="checkbox" checked={!topicData.data.showOfflineTopic} onChange={this.checkBoxChanged}/> Remove topics that has no user.
                                            </label>
                                        </div>
                                        <TopicGrid topicData={topicData.data.userTopicData} joinTopic={this.props.joinTopic} 
                                        watchTopic={this.watchTopic} activeTopic={topicData.data.watchingTopic} />
                                        <div className="form-group">
                                            <div><span className="label label-info showTimeLabel">Showing top {topicData.data.topicCount} topics that recently changed</span></div>
                                            <button type="button" className="btn btn-primary btn-sm" onClick={this.showMoreClick}>Show more</button>
                                        </div>
                                    </div>
                                    {/*<div id="offlineTopic" className="tab-pane fade">
                                        <div className="infoDiv"><span className="label label-info"> <span className="glyphicon glyphicon-info-sign"/> User topics that have no user currently online </span></div>
                                         <TopicGrid topicData={topicData.data.offlineTopicData} joinTopic={this.props.joinTopic} 
                                            watchTopic={this.watchTopic} activeTopic={topicData.data.watchingTopic} isOffline={true} />
                                    </div>*/}
                                </div>
                        </div>

                        <div className="col-md-4">
                            <PreviewBox header="Viewing latest messages in topic" previewingData={topicData.data.watchingData} />
                        </div>
                    </div>
                </div>
            );
    }
});

module.exports = Topics;