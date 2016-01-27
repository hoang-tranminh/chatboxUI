var utils = require('./../app_common/Utils.js');

var PageWrapper = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("PageWrapper updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return ( <div id="page-wrapper">
                    {this.props.comp && React.cloneElement(this.props.comp, {
                        userName:this.props.userName,
                        joinInvitation: this.props.joinInvitation,
                        joinTopic: this.props.joinTopic
                    })}
                 </div>
            );
    }
});

module.exports = PageWrapper;