var utils = require('./../app_common/Utils.js');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var IndexLink = ReactRouter.IndexLink;
var SideMenu = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("SideMenu updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return (<div className="collapse navbar-collapse navbar-ex1-collapse">
					<ul className="nav navbar-nav side-nav">
						<li key="dashboard">
							<IndexLink to="/" activeClassName="active"><i className="fa fa-fw fa-dashboard"></i> Dashboard</IndexLink>
						</li>
                        <li key="invitations">
							<Link to="invitations" activeClassName="active"><i className="fa fa-fw fa-bar-chart-o"></i> Invitations</Link>
						</li>
						<li key="topics">
							<Link to="topics" activeClassName="active"><i className="fa fa-fw fa-bar-chart-o"></i> Topics</Link>
						</li>
					</ul>
				</div>
            );
    }
});

module.exports = SideMenu;