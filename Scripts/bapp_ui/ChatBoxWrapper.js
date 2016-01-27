var utils = require('./../app_common/Utils.js');

var ChatArea = require('./../app_ui/ChatArea.js');

var ChatBoxWrapper = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        $(this.div).draggable({handle:'div.handle'});
        utils.consoleLog("ChatBoxWrapper updated");
    },
    componentDidMount: function() {
        $(this.div).draggable({handle:'div.handle'});
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        if(!this.props.minified && nextProps.minified)
            this.closingDown= true;
        else if(this.props.minified && !nextProps.minified)
            this.closingDown= false;
        else
            this.closingDown= null;
        return true;
    },
    handleClick:function(event){
        this.props.toggleBoxSize(this.props.name);
    },
    leaveCurrentTopic:function(){
        this.props.leaveCurrentTopic(this.props.name);
    },
    sendMessage:function(msg){
        this.props.sendMessage(msg, this.props.name);
    },
    render:function(){
        var hidden = this.props.model.activeTopic ==null ? ' hidden':'';
        var height = !this.props.minified ? '461px' : '31px';
        var style ={};
        if(this.closingDown == true && this.props.minified)
        {
            style={height:height,top:$(window).height()-40};
        }
        else if (this.closingDown == false && !this.props.minified)
        {
            style={height:height,top:80};
        }
        else
        {
            style={height:height};
        }

        return ( <div id={this.props.name} className={"chatBoxWrapper" + hidden } ref={(ref) => this.div = ref} style={style} > 
                    <div className="handleContainer"><div className="handle" >{this.props.minified ? "Active conversation minified" : ""}</div> <img className="minmaxButton" onClick={this.handleClick} src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/ico-resize.png"}  /> </div>
                    <ChatArea leaveCurrentTopic={this.leaveCurrentTopic} activeTopic={this.props.model.activeTopic} 
                    userName={this.props.userName} 
                    userInviting={this.props.model.userInviting} userIsAdmin="true" active={this.props.model.activeTopic!=null} 
                    currentTopicMessages={this.props.model.currentTopicMessages} sendMessage={this.sendMessage} />
                 </div>
            );
    }
});

module.exports = ChatBoxWrapper;