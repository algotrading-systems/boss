(function () {
    "use strict";

    var util = WinJS.Utilities;

    WinJS.UI.Pages.define("/pages/hub/hub.html", {

        processed: function (element) {
            WinJS.Application.setLanguageFromSettings();
            return WinJS.Resources.processAll(element);
        },

        // Эта функция вызывается всякий раз, когда пользователь переходит на данную страницу. Она
        // заполняет элементы страницы данными приложения.
        ready: function (element, options) {

            // Clear navigation history
            WinJS.Navigation.history.backStack.length = 0;

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
            WinJS.Application.setLanguageFromSettings();
            WinJS.Resources.processAll();
            document.getElementById("cmdRefresh").addEventListener("click", doClickRefresh, false);
            document.getElementById("cmdSettings").addEventListener("click", doClickSettings, false);
            // 
            document.getElementById('appbar').winControl.show();

            document.getElementById("updated-at-value").innerText = WinJS.Application.toUserTimeString();
            document.getElementById("time-zone-value").innerText = WinJS.Application.getUsedTimeZoneName();

            if (options && options.refresh) {
                doClickRefresh();
            }
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
        Data.startLoadingFromCloud().done(function () {
            WinJS.Utilities.query("#mainProgressBar").addClass("hidden");
            // Update "Updated at" time
            document.getElementById("updated-at-value").innerText = WinJS.Application.toUserTimeString();
        });
    };

    function doClickSettings() {
        WinJS.Navigation.navigate("/pages/settings.html", {});
    }

})();