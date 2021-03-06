﻿(function () {
    "use strict";

    var indicatorsLists = {
        900: new WinJS.Binding.List(),
        1800: new WinJS.Binding.List(),
        3600: new WinJS.Binding.List(),
        14400: new WinJS.Binding.List(),
    };

    function startLoadingFromCloud(timeout) {
        return new WinJS.Promise(function (completeDispatch, errorDispatch, progressDispatch) {
            function loadIndicators() {
                if (timeout) {
                    WinJS.Promise.timeout(timeout).then(function () {
                        completeDispatch(0);
                    });
                }

                bossClient.getTable("Indicator").take(500).read().done(function (indicators) {

                    // Clear already loaded indicators
                    for (var timeFrame in indicatorsLists) {
                        var list = indicatorsLists[timeFrame];
                        list.splice(0, list.length);
                    }

                    indicators.forEach(function (indicator) {
                        if (indicator.time_frame in indicatorsLists) {
                            indicator.level = Math.max(indicator.level, 1);
                            indicator.timeFormatted = WinJS.Application.toUserTimeString(indicator.time);
                            indicator.directionTechText = (indicator.direction > 0) ? 'up' : 'down';
                            indicator.directionText = (indicator.direction > 0) ? 'Call' : 'Put';
                            indicator.directionHTML = '<div class="direction-' + indicator.directionTechText + '">' + indicator.directionText + '</div>';
                            indicator.levelHTML = '<div class="level-' + indicator.level + '"></div>';
                            indicatorsLists[indicator.time_frame].push(indicator);
                        }
                    });
                    completeDispatch(indicators.length);
                }, function (error) {
                    // Create the message dialog and set its content
                    var msg = new Windows.UI.Popups.MessageDialog("No internet connection has been found.");
                    // Add commands and set their command handlers
                    msg.commands.append(new Windows.UI.Popups.UICommand("Try again", Data.startLoadingFromCloud));
                    msg.commands.append(new Windows.UI.Popups.UICommand("Ignore", function () {}));
                    // Set the command that will be invoked by default
                    msg.defaultCommandIndex = 0;
                    // Set the command to be invoked when escape is pressed
                    msg.cancelCommandIndex = 1;
                    // Show the message dialog
                    msg.showAsync();
                    // Temporary ugly error handling
                    completeDispatch(0);
                    // errorDispatch(error);
                });
            };
            setImmediate(loadIndicators, {});
        });
    }


    WinJS.Namespace.define("Data", {
        indicators900: indicatorsLists[900],
        indicators1800: indicatorsLists[1800],
        indicators3600: indicatorsLists[3600],
        indicators14400: indicatorsLists[14400],
        startLoadingFromCloud: startLoadingFromCloud
    });
    
})();
