(function () {
    "use strict";

    var nav = WinJS.Navigation;
    var session = WinJS.Application.sessionState;
    var util = WinJS.Utilities;

    WinJS.UI.Pages.define("/pages/hub/hub.html", {

        processed: function (element) {
            return WinJS.Resources.processAll(element);
        },

        // Эта функция вызывается всякий раз, когда пользователь переходит на данную страницу. Она
        // заполняет элементы страницы данными приложения.
        ready: function (element, options) {
            var hub = element.querySelector(".hub").winControl;
            hub.onheaderinvoked = function (args) {
                args.detail.section.onheaderinvoked(args);
            };
            hub.onloadingstatechanged = function (args) {
                if (args.srcElement === hub.element && args.detail.loadingState === "complete") {
                    hub.onloadingstatechanged = null;
                }
            }
            // TODO: Инициализируйте здесь страницу.
            document.getElementById("cmdRefresh").addEventListener("click", doClickRefresh, false);
            var appBar = document.getElementById('appbar').winControl;
            appBar.show();
        },

        //section3HeaderNavigate: util.markSupportedForProcessing(function (args) {
           // nav.navigate("/pages/section/section.html", { title: args.detail.section.header, groupKey: section3Group.key });
        //}),

        //section3ItemNavigate: util.markSupportedForProcessing(function (args) {
            //var item = Data.getItemReference(section3Items.getAt(args.detail.itemIndex));
            //nav.navigate("/pages/item/item.html", { item: item });
        //}),

        unload: function () {
            // TODO: Отвечайте на переходы с этой страницы.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            // TODO: Отвечайте на изменения в макете.
        },
    });

    function doClickRefresh() {
        WinJS.Utilities.query("#mainProgressBar").removeClass("hidden");
        setTimeout(function () {
            WinJS.Utilities.query("#mainProgressBar").addClass("hidden");
        }, 2000);
    };

})();