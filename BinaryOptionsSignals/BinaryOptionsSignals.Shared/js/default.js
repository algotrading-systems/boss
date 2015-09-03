// Основные сведения о шаблоне Hub/Pivot см. в следующей документации:
// http://go.microsoft.com/fwlink/?LinkID=392285
(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: Это приложение было вновь запущено. Инициализируйте
                // приложение здесь.
            } else {
                // TODO: Это приложение вновь активировано после приостановки.
                // Восстановите состояние приложения здесь.
            }

            hookUpBackButtonGlobalEventHandlers();
            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Оптимизация загрузки приложений и выполнение запланированных задач с высоким приоритетом во время отображения экрана-заставки.
            ui.disableAnimations();

            var promise = Data.startLoadingFromCloud(2000).then(function () {
                ui.processAll();
            }).then(function () {
                return nav.navigate(nav.location || Application.navigator.home, nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            args.setPromise(promise);
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: Это приложение будет приостановлено. Сохраните здесь все состояния,
        // которые необходимо сохранять во время приостановки. Если необходимо 
        // завершить асинхронную операцию, прежде чем приложение 
        // будет приостановлено, вызовите args.setPromise().
        app.sessionState.history = nav.history;
    };

    function hookUpBackButtonGlobalEventHandlers() {
        // Подписывается на глобальные события в объекте окна
        window.addEventListener('keyup', backButtonGlobalKeyUpHandler, false)
    }

    // КОНСТАНТЫ
    var KEY_LEFT = "Left";
    var KEY_BROWSER_BACK = "BrowserBack";
    var MOUSE_BACK_BUTTON = 3;

    function backButtonGlobalKeyUpHandler(event) {
        // Осуществляет переход назад при отпускании сочетания клавиши ALT+СТРЕЛКА ВЛЕВО или клавиши browserBack.
        if ((event.key === KEY_LEFT && event.altKey && !event.shiftKey && !event.ctrlKey) || (event.key === KEY_BROWSER_BACK)) {
            nav.back();
        }
    }

    app.getCurrentLanguage = function () {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        var language = localSettings.values["language"];
        if (!language) {
            language = Windows.System.UserProfile.GlobalizationPreferences.languages[0];
        }
        return language;
    }

    app.setCurrentLanguage = function (language) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        localSettings.values["language"] = language;
    }

    app.setLanguageFromSettings = function () {
        var language = WinJS.Application.getCurrentLanguage();
        var resourceNS = Windows.ApplicationModel.Resources.Core;
        var resourceMap = resourceNS.ResourceManager.current.mainResourceMap.getSubtree('Resources');
        resourceNS.ResourceManager.current.defaultContext.languages = new Array(language);
    }

    app.getUseLocalTime = function () {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        if (('useLocalTime' in localSettings.values)) {
            return localSettings.values["useLocalTime"];
        }
        return true;
        
    }

    app.setUseLocalTime = function(useLocalTime){
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        localSettings.values["useLocalTime"] = useLocalTime;
    }

    app.toUserTimeString = function (time) {
        if (!time) {
            time = new Date();
        }

        var useLocalTime = app.getUseLocalTime();

        var timeFormatter = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter("longtime");

        if (useLocalTime) {
            var timeString = timeFormatter.format(time);
        } else {
            var timeString = time.getUTCHours() + ':' + ((time.getUTCMinutes() < 10) ? ('0' + time.getUTCMinutes()) : time.getUTCMinutes()) + ':' + time.getUTCSeconds();
        }
        
        return timeString;
    }

    app.getUsedTimeZoneName = function () {
        var useLocalTime = app.getUseLocalTime();
        if (useLocalTime) {
            var timeFormatter = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter("timezone.full");
            var timeZoneString = timeFormatter.format(new Date());
            return timeZoneString;
        }
        return 'UTC, Coordinated Universal Time';
    }

    app.start();
})();
