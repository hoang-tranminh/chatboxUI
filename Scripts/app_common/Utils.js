var Utils = function () {
    var self = this;
    $.extend(self, {
        getCurrentUri: function () {
            if (!window.uri) {
                if ($("#currentDomain").length)
                    window.uri = $("#currentDomain").val();
                else if ($.cookie("currentDomain"))
                    window.uri = $.cookie("currentDomain");
                else
                    window.uri = window.location.getParameter("uri");
            }
            return window.uri;
        },
        getBaseDomain: function () {
            return $("#baseDomain").val();
        },
        getBackendDomain: function () {
            return $("#backendDomain").val();
        },
        cloneArray(arr)
        {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                newArr.push(jQuery.extend(true, {}, arr[i]));
            }
            return newArr;
        },
        compareSortedArray(arr1, arr2)
        {
            if (arr1.length != arr2.length)
                return false;
            for (var i = 0; i < arr1.length; i++)
            {
                if (arr1[i].Id != arr2[i].Id)
                    return false;
            }
            return true;
        },
        dateAdd: function (date, interval, units) {
            var ret = new Date(date); //don't change original date
            switch (interval.toLowerCase()) {
                case 'year': ret.setFullYear(ret.getFullYear() + units); break;
                case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); break;
                case 'month': ret.setMonth(ret.getMonth() + units); break;
                case 'week': ret.setDate(ret.getDate() + 7 * units); break;
                case 'day': ret.setDate(ret.getDate() + units); break;
                case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
                case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
                case 'second': ret.setTime(ret.getTime() + units * 1000); break;
                default: ret = undefined; break;
            }
            return ret;
        },
        consoleLog: function (msg) {
            if (typeof console != "undefined")
                console.log(msg);
        },
        closeError:  function (event) {
            event = event || window.event;
            var $errorDiv = $(event.target).parent().parent();
            $errorDiv.children().remove();
            $errorDiv.hide();
            return false;
        },
        showError: function (areaId, error) {
            var $errSpans = $("<div><span class='error'>" + error + "</span><a href='javascript:void(0);'>Close</a></div>");
            var a = $errSpans.children("a");
            a.click(self.closeError);
            $("#" + areaId).append($errSpans);
            $("#" + areaId).show();
        },
        // This optional function html-encodes messages for display in the page.
        htmlEncode: function (value) {
            var encodedValue = $('<div />').text(value).html();
            return encodedValue;
        },
        checkInvitationExist: function (arr, newInvi, timeDiff) {
            var time = timeDiff ? timeDiff * 1000 * 60 : 3 * 1000 * 60 /*3p*/;
            for (var i = 0; i < arr.length; i++) {
                if (newInvi.UserName == arr[i].UserName &&
                    newInvi.TopicSubject == arr[i].TopicSubject) {
                    var date = new Date(newInvi.CreatedDate);
                    var date2 = new Date(arr[i].CreatedDate)
                    if (Math.abs(date - date2) < time)
                        return true;
                }
            }
            return false;
        },
    });
    return self;
};

module.exports = new Utils();

if (!window.location.getParameter) {
    window.location.getParameter = function (key) {
        function parseParams() {
            var params = {},
                e,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
                q = window.location.search.substring(1);

            while (e = r.exec(q))
                params[d(e[1])] = d(e[2]);

            return params;
        }

        if (!this.queryStringParams)
            this.queryStringParams = parseParams();

        return this.queryStringParams[key];
    };
}

