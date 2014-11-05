(function () {
    "use strict";

    var indicatorsLists = {
        900: new WinJS.Binding.List(),
        1800: new WinJS.Binding.List(),
        3600: new WinJS.Binding.List(),
        14400: new WinJS.Binding.List(),
    };

    WinJS.Namespace.define("Data", {
        indicators900: indicatorsLists[900],
        indicators1800: indicatorsLists[1800],
        indicators3600: indicatorsLists[3600],
        indicators14400: indicatorsLists[14400],
    });


    function loadIndicatorsFromCloud() {
        bossClient.getTable("Indicator").read().done(function (indicators) {
            indicators.forEach(function (indicator) {
                if (indicator.time_frame in indicatorsLists) {
                    indicatorsLists[indicator.time_frame].push(indicator);
                }
            });
        }, function (error) {
            /** @TODO Add error handling */
            var x = error;
        });
    };

    loadIndicatorsFromCloud();
    
})();
