(function ($$) {
    var needjQuery = false;
    if (!$$ || !$$.fn || !$$.fn.jquery) {
        //no jquery ?
        needjQuery = true;
    }
    else {
        //has jquery
        var versionParts = $$.fn.jquery.split('.');
        if (versionParts[0] < 1 || versionParts[0]==1 && versionParts[1] < 11)
            needjQuery = true;
    }
    var win = window;
    function startExe() {
        var $ = win.$ || win.jQuery;

        //include our styles
        $(win.document.head).append('<link href="http://chatwebserver/areas/chatfront/static/css/yacchatboxstyles.css" rel="stylesheet">');

        if (!win.YAC)
            win.YAC = {};
        win.YAC.ChatBox = function (parentDoc) {
            var template = '<div class="yacChatBox">' +
                                '<div class="border"></div> ' +
                                '<div class="inner"> ' +
                                    '<div class="inner-background">' +
                                        '<div class="title">' +
                                        '<a href="javascript:void(0)"><i class="ico ico-resize right"></i></a><i class="ico ico-person"></i><span class="logotext">Connecting people</span>' +
                                        '</div>' + //close title
                                        '<div class="content">' +
                                        '</div>' + //close content
                                    '</div>' + //close inner-background
                                 '</div>' + //close inner  
                            '</div>';

            $(parentDoc.body).append(template);
            var cb = $(".yacChatBox");

            var reSizeButton = $(".yacChatBox .title .ico-resize");
            var minimized = false;
            this.reSize = function () {
                if (minimized) {
                    cb.height("470px");
                    cb.css('position', 'fixed');
                    cb.css('bottom', '5px');
                    cb.css('right', '5px');
                    minimized = false;
                }
                else {
                    cb.height("28px");
                    cb.css('position', 'fixed');
                    cb.css('bottom', '5px');
                    cb.css('right', '5px');
                    minimized = true;
                }
            };
            reSizeButton.click(this.reSize);

            var contentFrame = $(".yacChatBox .content");
            if (contentFrame.length) {
                var cbIframeLink = "http://chatwebserver/chatfront/chatbox?uri=" + window.location.href;
                var cbIframe = $('<iframe class="contentFrame" src="' + cbIframeLink + '"></iframe>');
                cbIframe.appendTo(contentFrame);
            }
        };

        win.YAC.ChatBox(win.document);
    }
    win.startExe = startExe;
    if (needjQuery) {
        var oScriptElem = document.createElement("script");
        oScriptElem.type = "text/javascript";
        //oScriptElem.async = false;
        //oScriptElem.src = "http://code.jquery.com/jquery-1.11.3.js";
        oScriptElem.src = "http://chatwebserver/scripts/jquery-1.11.3.js";
        oScriptElem.onload = startExe;
        var head = document.head ? document.head: document.getElementsByTagName('head')[0];
        head.appendChild(oScriptElem);
        //document.write('<script type = "text/javascript" src="http://chatwebserver/scripts/jquery-1.11.3.js" onload="startExe()" />');
    }
    else
        startExe();
   
})(typeof(jQuery) === "undefined" ? null: jQuery);