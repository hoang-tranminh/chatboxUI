var utils = require('./../app_common/Utils.js');
var UserAvatarBig =  require('./UserAvatarBig.js');

var Registration = React.createClass({
    componentDidUpdate :function(prevProps, prevState) {
        utils.consoleLog("Registration updated");
    },
    shouldComponentUpdate :function(nextProps, nextState)
    {
        var notUpdate = true;
        notUpdate = notUpdate & this.props.currentScreen == nextProps.currentScreen;
        notUpdate = notUpdate & this.props.userData.userName == nextProps.userData.userName;
        notUpdate = notUpdate & this.props.userData.avatar == nextProps.userData.avatar;
        return !notUpdate;
    },
    validateUserName:function(name){
        if (!name || name.length < 2 || name.length > 25) {
            return false;
        }

        return true;
    },
    inputKeyDown:function(event)
    {
        if(event.keyCode == 13)
        {
            this.buttonClick("inputEnter");
        }
    },
    buttonClick:function(event) {
        if(event=="inputEnter" || event.target.id =="buttonRegister") {
            $(this.errorDiv).empty();
            if(!this.validateUserName(this.anonymousName.value))
            {
                utils.showError(this.errorDiv.id, "Please enter a display name with length 2-25 characters.");
                return;
            }
            this.props.registerAnonymousName(this.anonymousName.value);
            this.anonymousName.value="";
        }
        else
        {
            this.props.cancelRegistration();
            this.anonymousName.value="";
        }
    },
    render:function(){
        var active = this.props.currentScreen == "registration" ? '': ' hidden';
        return ( <div className={"registrationForm" + active } >
                    <div className="avatarContainer">
                    <UserAvatarBig userName={this.props.userData.userName} avatar={this.props.userData.avatar} 
                    changeName={this.props.changeName} />
                    </div>
                    <div className="registrationTitle">You can change your display name by:</div>
                    <div className="registerRadio"><input type="radio" className="radioButton" id="loginRadioButton"  name="registerMethod" value="Login" disabled="true"></input>
                    <label htmlFor="loginRadioButton" >Login</label></div>
                        <ul className="loginProviders">
                            <li className="facebook"><a href="javascript:void(0)" id="fbLogin" onClick={this.handleClick}><img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/fbLogin.png"}/></a></li>
                            <li className="google"><a href="javascript:void(0)" id="tLogin" onClick={this.handleClick}><img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/twitterLogin.png"}/></a></li>
                            <li className="twitter"><a href="javascript:void(0)" id="gLogin" onClick={this.handleClick}><img src={"http://" + utils.getBaseDomain()+"/areas/chatfront/static/img/gLogin.png"}/></a></li>
                        </ul>
                    <div className="registerRadio"><input type="radio" className="radioButton" id="anonymousRadioButton" name="registerMethod" value="Anonymous" defaultChecked />
                    <label htmlFor="anonymousRadioButton"> Quick Registration </label></div>
                    <div className="anonymousName">
                        <input type="text" id="anonymousUserName" placeholder="Enter your name" ref={(ref) => this.anonymousName = ref} onKeyDown={this.inputKeyDown}></input>
                    </div>
                    <div className="buttonContainer"><input type="button" className="btn registerButton" id="buttonRegister" value="Register" onClick={this.buttonClick}/>
                    <input type="button" className="btn cancelButton" id="cancelRegister" value="Cancel" onClick={this.buttonClick} /></div>
                    <div id="registerFormErrors" style={{display:'none'}} ref={(ref) => this.errorDiv = ref}></div>
                </div>
            );
    }
});

module.exports = Registration;
