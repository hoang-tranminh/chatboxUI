var utils = require('./../app_common/Utils.js');

var SettingsDropdown = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("SettingsDropdown updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    logoutClick:function(event) {
        this.props.logOut(event);
    },
    render:function(){
        var userName = $("#loginUser").val();
        return ( 	<li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-user"></i> {userName}<b className="caret"></b></a>

                        <ul className="dropdown-menu">
                            {/*<li>
                                <a href="#"><i className="fa fa-fw fa-user"></i> Profile</a>
                            </li>
                            <li>
                                <a href="#"><i className="fa fa-fw fa-envelope"></i> Inbox</a>
                            </li>
                            <li>
                                <a href="#"><i className="fa fa-fw fa-gear"></i> Settings</a>
                            </li>
                            <li className="divider"></li>*/}
                            <li>
                                 <a href="javascript:void(0)" id="logoutLink" onClick={this.logoutClick}><i className="fa fa-fw fa-power-off"></i> Log Out</a>
                            </li>
                        </ul>

                    </li>
				);
    }
});

module.exports = SettingsDropdown;