(function () {
    "use strict";

    var indicatorsList = new WinJS.Binding.List();

    WinJS.Namespace.define("Data", {
        indicators: indicatorsList,
    });

    function loadIndicatorsFromCloud() {
        bossClient.getTable("Indicator").read().done(function (indicators) {
            indicators.forEach(function (indicator) {
                indicatorsList.push(indicator);
            });
        }, function (error) {
            /** @TODO Add error handling */
            var x = error;
        });
    };

    loadIndicatorsFromCloud();
    
})();
