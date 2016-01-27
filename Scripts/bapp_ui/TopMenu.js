var utils = require('./../app_common/Utils.js');
var SettingsDropdown = require('./SettingsDropdown.js');
var TopMenu = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("TopMenu updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return (<ul className="nav navbar-right top-nav">
                    {/*<MessagePreview />
					<AlertPreview/>*/}
                    <SettingsDropdown logOut={this.props.logOut}/>
				</ul>
            );
    }
});
module.exports = TopMenu;