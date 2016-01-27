var utils = require('./../app_common/Utils.js');

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

module.exports = ChatHistory;