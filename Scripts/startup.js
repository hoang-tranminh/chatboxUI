/*
Copyright 2011 Olivine Labs, LLC. <http://olivinelabs.com>
Licensed under the MIT license: <http://www.opensource.org/licenses/mit-license.php>
*/

(function(window, $) {

  Modernizr.load({
    test: Modernizr.websockets,
    nope: 'js/web-socket-js/web_socket.js'
  });

  // Set URL of your WebSocketMain.swf here, for web-socket-js
  WEB_SOCKET_SWF_LOCATION = 'js/web-socket-js/WebSocketMain.swf';
  WEB_SOCKET_DEBUG = true;

  var AlchemyChatServer = {};
  var me = {};

  function Connect(server, port, onConnected) {
    // If we're using the Flash fallback, we need Flash.
    if (!window.WebSocket && !swfobject.hasFlashPlayerVersion('10.0.0')) {
      alert('Flash Player >= 10.0.0 is required.');
      return;
    }

    // Set up the Alchemy client object
    AlchemyChatServer = new Alchemy({
      Server:server,
      Port: port,
      Action: 'chat',
      DebugMode: true
    });

    LogMessage('Connecting...');
    $('#status').removeClass('offline').addClass('pending').text('Connecting...');

    AlchemyChatServer.Connected = function () {
        LogMessage('Connection established!');
        $('#status').removeClass('pending').addClass('online').text('Online');
        //$('#connectToServer').hide('fast', function () { $('#registerName').show('fast'); });
        onConnected();
    };

    AlchemyChatServer.Disconnected = function() {
      LogMessage('Connection closed.');
      $('#status').removeClass('pending').removeClass('online').addClass('offline').text('Offline');
      $('#onlineUsers').text('???');
      $('#registerName, #sendMessage').hide('fast', function() { $('#connectToServer').show('fast'); });
    };

    AlchemyChatServer.MessageReceived = function(event) {
      ParseResponse(event.data);
    };

    AlchemyChatServer.Start();
  };

  function LogMessage(message) {
    var p = $('<p></p>').text(message);
    $('#results').prepend(p);
  }

  var usersTyping = new Array();
  

  function ParseResponse(response) {
      var data = JSON.parse(response);

      // The Chat server demo sends back a responsetype to let us know how to parse the message.
      if (data.Type == 0) {
          var message = data.Name + ' connected!';
          LogMessage(message);
      } else if (data.Type == 1) {
          var message = data.Name + ' disconnected!';
          LogMessage(message);
      } else if (data.Type == 2 && data.Name != me.Name) { //normal chat
          // We don't display it if it's from ourselves, because we display our own messages immediately
          // see the jQuery bindings later on for more info)
          var message = data.Name + ': ' + data.Text;
          var i = usersTyping.indexOf(data.Name);
          if (i >= 0) {
              //replace the typing message with the real message
              var p = $('<p></p>').text(message);
              var value = $('#results').html();
              value = value.replace("<p>" + data.Name + ": typing</p>", "<p>"+message+"</p>");
              $('#results').html(value);
              usersTyping.splice(i, 1);
          }
          else
              LogMessage(message);

      } else if (data.Type == 3 && data.Name != me.Name) { // user typing 
          usersTyping.push(data.Name);
          LogMessage(data.Name + ": typing");
      } else if (data.Type == 5 && data.Name != me.Name) { // user stopped typing 
          var i = usersTyping.indexOf(data.Name);
          if (i >= 0) {
              //replace the typing message with the empty message
              var p = $('<p></p>').text(message);
              var value = $('#results').html();
              value = value.replace("<p>" + data.Name + ": typing</p>", "");
              $('#results').html(value);
              usersTyping.splice(i, 1);
          }
          var message = data.Message;
          usersTyping.push(data.Name);
          LogMessage(message);
      }
      else if (data.Type == 5 && data.Name != me.Name) { // user stopped typing 
          var i = usersTyping.indexOf(data.Name);
          if (i >= 0) {
              //replace the typing message with the empty message
              var p = $('<p></p>').text(message);
              var value = $('#results').html();
              value = value.replace("<p>" + data.Name + ": typing</p>", "");
              $('#results').html(value);
              usersTyping.splice(i, 1);
          }
          var message = data.Message;
          usersTyping.push(data.Name);
          LogMessage(message);
      }
      else if (data.Type == 6 && data.Name != me.Name) { // got a invitation
          invitations.push(data);
          var p = $('<p></p>').text("Invite from " + data.Name + " to topic: " + data.Topic.Subject);
          $('#showInvites').prepend(p);
      }
      else if (data.Type == 4) {
          // Set the online users, and show the list of users if you hover over the number.
          $('#onlineUsers').text(data.Data.Users.length).attr('title', data.Data.Users.join('\n'));
      }
  }

  function ValidateName(name) {
    if (name.length < 3 || name.length > 25) {
      return false;
    }

    return true;
  }

  var invitations = new Array();
  var cachedTopics = new Array();
  var currentTopic;
  // Just some event bindings.
  $(function() {
    $('#sendMessage').bind('submit', function(e) {
      e.preventDefault();
      typingSent = false;
      var message = $('#message').val();
      var data = {};

      if (message.indexOf('/nick ') == 0) { //change name
        var name = message.replace(/\/nick /, '');
        data = { Type: 2, Name: name };

        if (!ValidateName(name)) {
          alert('Please pick a name of length 3 - 25.');
          return;
        }

        if (name == me.Name) {
          return;
        }

        me.Name = name;
      }
      else { //chat normally
        // We display our own messages immediately to increase perceived performance.
          data = { Type: 1, Message: message, Name: me.Name, UserId: $.cookie("userId")};
        LogMessage(me.Name + ': ' + data.Message);
      }
      if (currentTopic) {
          data.TopicId = currentTopic.GuidId;
          AlchemyChatServer.Send(data);
      }

      $('#message').val('').focus();
    });

    $('#registerName').bind('submit', function(e) {
      e.preventDefault();
      var name = $('#name').val();

      if (!ValidateName(name)) {
        alert('Please pick a name of length 3 - 25.');
        return;
      }

      me.Name = name;
        //AlchemyChatServer.Send(data);
      $.ajax({
          url: 'http://chatwebserver/chatfront/api/User/Register',
          type: 'POST',
          data: "name="+name+"&provider=facebook&supportTcp=true",
          async: false
      }).done(function (data, textStatus, jqXHR) {

          $.cookie("userId", data.Data.UserId);

          if (data.Data.Port != -1) {
              Connect(data.Data.Server, data.Data.Port, function ()
              {
                  var registerMsg = { Type: 0, Name: name, UserId: data.Data.UserId };
                  AlchemyChatServer.Send(registerMsg);
                  $('#registerName').hide('fast', function () {
                      //$('#sendMessage').show('fast');
                      $('#choseTopic').show('fast');
                      $('#invite').show('fast');
                  });
              });
          }
      }).fail(function (jqXHR, textStatus, errorThrown) {
          if (typeof console != "undefined")
              console.log(errorThrown);
      });
      
    });

    //$('#connectToServer').bind('submit', function(e) {
    //  e.preventDefault();
    //  Connect();
    //});

    //$('#disconnect').bind('click', function(e) {
    //  e.preventDefault();
    //  AlchemyChatServer.Stop();
    //});

    var typingSent = false;
    $('#message').keyup(function (e) {
        if (!currentTopic)
            return;
        if (typingSent && e.which == 13) {
            //reset typing if user typed enter
            typingSent = false;
        }
        else if (!typingSent) {
            //sending typing message
            var data = { Type: 4, Name: me.Name, UserId: $.cookie("userId"), TopicId: currentTopic.GuidId };
            AlchemyChatServer.Send(data);
            typingSent = true;
        }
        else if (typingSent) {
            //send the stop typing message
            if ($('#message').val() == null || $('#message').val() == "") {
                //send user stop typing
                var data = { Type: 5, Name: me.Name, UserId: $.cookie("userId"), TopicId: currentTopic.GuidId };
                AlchemyChatServer.Send(data);
                typingSent = false;
            }
        }
    });

    //$('#sendinvite').click(function () {
    //    //sending invitation
    //    var data = { Type: 6, Name: me.Name, UserId: $.cookie("userId"), TopicId: currentTopic };
    //    AlchemyChatServer.Send(data);
    //    data.Date = new Date();
    //    invitations.push(data);
    //});

    $("#chose").click(function () {
        $("#buttonClicked").val("chose");
    });

    $("#sendinvite").click(function () {
        $("#buttonClicked").val("sendinvite");
    });


    $('#choseTopic').bind('submit', function (e) {
        //query or creates a topic
        e.preventDefault();

        if ( $("#buttonClicked").val() == "sendinvite")
        {
            if (!currentTopic)
                alert('must join a topic before invite');
            //invite to current topic
            var data = { Type: 6, Name: me.Name, UserId: $.cookie("userId"), TopicId: currentTopic.GuidId };
            AlchemyChatServer.Send(data);
            return;
        }


        var leaveTopic;
        var topic;
        var topicSubject = $('#topic').val();
        if (!topicSubject)
            topicSubject = window.location.href;
        else
        {
            for (var i = 0; i < cachedTopics.length; i++)
            {
                if (cachedTopics[i].Subject == topicSubject) {
                    topic = cachedTopics[i];
                    break;
                }
            }
        }
        if (!topic) {
            //get topic details from server
            $.ajax({
                url: 'http://chatwebserver/chatfront/api/Topic/GetTopic',
                type: 'GET',
                data: "subject="+topicSubject,
                async: false
            }).done(function (data, textStatus, jqXHR) {

                topic = data;
                cachedTopics.push(data);
                if (currentTopic || currentTopic != topic) {
                    leaveTopic = currentTopic;
                    currentTopic = topic;
                }
                $('#sendMessage').show('fast');
                $('#sendinvite').show('fast');
                $('#currentTopic').html(currentTopic.Subject);

            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (typeof console != "undefined")
                    console.log(errorThrown);
            });
        }

        if (leaveTopic) {
            //leave topic
            var data = { Type: 8, Name: me.Name, UserId: $.cookie("userId"), TopicId: leaveTopic.GuidId };
            AlchemyChatServer.Send(data);
        }

        if (topic) {
            //join topic
            var data = { Type: 7, Name: me.Name, UserId: $.cookie("userId"), TopicId: topic.GuidId };
            AlchemyChatServer.Send(data);
        }
    });

  });
})(window, jQuery);
