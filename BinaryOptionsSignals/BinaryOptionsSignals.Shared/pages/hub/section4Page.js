(function () {
    "use strict";

    var ControlConstructor = WinJS.UI.Pages.define("/pages/hub/section4Page.html", {
        // Эта функция вызывается после загрузки содержимого элементов 
        // управления страницы, активации элементов управления и 
        // для результирующих элементов установлены дочерние отношения с моделью DOM. 
        ready: function (element, options) {
            options = options || {};
        },
    });

    // Следующие строки предоставляют этот конструктор элемента управления как глобальный. 
    // Это позволяет использовать элемент управления как декларативный элемент управления внутри 
    // атрибута data-win-control. 

    WinJS.Namespace.define("HubApps_SectionControls", {
        Section4Control: ControlConstructor
    });
})();