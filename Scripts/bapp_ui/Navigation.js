var utils = require('./../app_common/Utils.js');

var NavBarHeader = require('./NavBarHeader.js');
var TopMenu = require('./TopMenu.js');
var SideMenu = require('./SideMenu.js');

var Navigation = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("Navigation updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return ( <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation" > 
                    <NavBarHeader/>
                    <TopMenu logOut={this.props.logOut}/>
                    <SideMenu compName={this.props.compName}/>
                 </nav>
            );
    }
});

module.exports = Navigation;