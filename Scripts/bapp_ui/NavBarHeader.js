var utils = require('./../app_common/Utils.js');

var NavBarHeader = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("NavBarHeader updated");
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

module.exports = NavBarHeader;