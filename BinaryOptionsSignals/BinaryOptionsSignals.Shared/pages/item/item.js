(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/item/item.html", {
        // Эта функция вызывается всякий раз, когда пользователь переходит на данную страницу. Она
        // заполняет элементы страницы данными приложения.
        ready: function (element, options) {
            var item = Data.resolveItemReference(options.item);
            element.querySelector(".titlearea .pagetitle").textContent = item.title;
			if (WinJS.Utilities.isPhone)
			{
				document.getElementById("backButton").style.display = "none";
            }
			// TODO: Инициализируйте здесь страницу.
        }
    });
})();
