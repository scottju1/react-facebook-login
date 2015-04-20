var FacebookLogin = React.createClass({displayName: "FacebookLogin",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("button", {className: "facebook-login", onClick: this.handleClick}, "Login com Facebook"), 
        React.createElement("div", {id: "fb-root"})
      )
    )
  },

  componentDidMount: function() {

    window.fbAsyncInit = function() {
      FB.init({
        appId      : this.props.appId,
        xfbml      : JSON.parse(this.props.xfbml),
        version    : 'v2.3'
      });

      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/pt_BR/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  },

  testAPI: function( authResponse ) {
    FB.api('/me', function(response) {

      response.status = true;
      response.accessToken = authResponse.accessToken;
      response.expiresIn = authResponse.expiresIn;
      response.signedRequest = authResponse.signedRequest;

      this.props.loginHandler( response );

    }.bind(this));
  },

  statusChangeCallback: function(response) {

    if (response.status === 'connected') {
      this.testAPI( response.authResponse );
    } else if (response.status === 'not_authorized') {
      this.props.loginHandler( { status: false, message: 'User not authorized' } );
    } else {
      this.props.loginHandler( { status: false, message: 'User not logged' } );
    }
  },

  checkLoginState: function() {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  },

  handleClick: function() {
    var scope = {scope: this.props.scope };
    FB.login(this.checkLoginState(), scope);
  },

});
