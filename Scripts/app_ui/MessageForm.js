var utils = require('./../app_common/Utils.js');

var MessageForm = React.createClass({
	 componentDidUpdate :function(prevProps, prevState) {
		utils.consoleLog("MessageForm updated");
	 },
	getInitialState: function() {
        return {msgText: ''};
    },
	validateMessage: function(msg) {
        if (!msg || /^\s*$/.test(msg) || msg.length > 255) {
            $(this.errorDiv).empty();
            utils.showError(this.errorDiv.id, "Please enter a message with length 1-255 characters.");
            return false;
        }
        return true;
    },
    sendBtnClick:function(event){
        if(this.validateMessage(this.txtInput.value))
        {
            $(this.errorDiv).empty();
			var msg = this.txtInput.value;
			this.txtInput.value='';
			this.setState({msgText: ''});
			this.props.sendMessage.call(this, msg);
        }
    },
    handleTextChange: function(e) {
        this.setState({msgText: e.target.value});
    },
    inputKeyDown:function(event)
    {
        if(event.keyCode == 13)
        {
            this.sendBtnClick();
			event.preventDefault();
			event.stopPropagation();
        }
    },
    render:function(){
        return (
            <div className="form">
                        <div className="inputDiv">
                        <textarea id="messageinput" className="messageinput" onKeyDown={this.inputKeyDown} onChange={this.handleTextChange} ref={(ref) => this.txtInput = ref}/></div>
                        <div className="sendMessage">
                        <img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/SendBtnBg.png"} title="Send message" className="sendBtn" onClick={this.sendBtnClick}/></div>
                        <div id="messageFormErrors" style={{display:'none'}} ref={(ref) => this.errorDiv = ref}></div>
                    </div>
            );
    }
});


module.exports = MessageForm;



   