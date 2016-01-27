var utils = require('./../app_common/Utils.js');


var Dashboard = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        //utils.consoleLog("Dashboard updated");
    },
    shouldComponentUpdate :function(nextProps, nextState) {
        return true;
    },
    render:function(){
        return ( <div className="container-fluid">
                    <div classNamw="row">
                        <div className="col-md-12">
                            <h1 className="page-header">
                                DASHBOARD <small> Graphs of importance data </small>
                            </h1>
                        </div>
                    </div>
                </div>
            );
    }
});

module.exports = Dashboard;