(function () {
    "use strict";

    var nav = WinJS.Navigation;

    WinJS.Namespace.define("Application", {
        PageControlNavigator: WinJS.Class.define(
            // Определение функции конструктора для объекта PageControlNavigator.
            function PageControlNavigator(element, options) {
                this._element = element || document.createElement("div");
                this._element.appendChild(this._createPageElement());

                this.home = options.home;

                this._eventHandlerRemover = [];

                var that = this;
                function addRemovableEventListener(e, eventName, handler, capture) {
                    e.addEventListener(eventName, handler, capture);
                    that._eventHandlerRemover.push(function () {
                        e.removeEventListener(eventName, handler);
                    });
                };

                addRemovableEventListener(nav, 'navigating', this._navigating.bind(this), false);
                addRemovableEventListener(nav, 'navigated', this._navigated.bind(this), false);

                window.onresize = this._resized.bind(this);

                Application.navigator = this;
            }, {
                home: "",
                /// <field domElement="true" />
                _element: null,
                _lastNavigationPromise: WinJS.Promise.as(),
                _lastViewstate: 0,

                // Это текущий загруженный объект Page.
                pageControl: {
                    get: function () { return this.pageElement && this.pageElement.winControl; }
                },

                // Это корневой элемент текущей страницы.
                pageElement: {
                    get: function () { return this._element.firstElementChild; }
                },

                // Эта функция уничтожает навигатор страницы и его содержимое.
                dispose: function () {
                    if (this._disposed) {
                        return;
                    }

                    this._disposed = true;
                    WinJS.Utilities.disposeSubTree(this._element);
                    for (var i = 0; i < this._eventHandlerRemover.length; i++) {
                        this._eventHandlerRemover[i]();
                    }
                    this._eventHandlerRemover = null;
                },

                // Создает контейнер для загрузки новой страницы.
                _createPageElement: function () {
                    var element = document.createElement("div");
                    element.setAttribute("dir", window.getComputedStyle(this._element, null).direction);
                    element.style.position = "absolute";
                    element.style.visibility = "hidden";
                    element.style.width = "100%";
                    element.style.height = "100%";
                    return element;
                },

                // Извлечение списка элементов анимации для текущей страницы.
                // Если объект Page не определяет список, выполняется анимация всей страницы.
                _getAnimationElements: function () {
                    if (this.pageControl && this.pageControl.getAnimationElements) {
                        return this.pageControl.getAnimationElements();
                    }
                    return this.pageElement;
                },

                _navigated: function () {
                    this.pageElement.style.visibility = "";
                    WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
                },

                // Реагирует на навигацию, добавляя новые страницы в модель DOM. 
                _navigating: function (args) {
                    var newElement = this._createPageElement();
                    this._element.appendChild(newElement);

                    this._lastNavigationPromise.cancel();

                    var that = this;

                    function cleanup() {
                        if (that._element.childElementCount > 1) {
                            var oldElement = that._element.firstElementChild;
                            // Очистка и удаление предыдущего элемента 
                            if (oldElement.winControl) {
                                if (oldElement.winControl.unload) {
                                    oldElement.winControl.unload();
                                }
                                oldElement.winControl.dispose();
                            }
                            oldElement.parentNode.removeChild(oldElement);
                            oldElement.innerText = "";
                        }
                    }

                    this._lastNavigationPromise = WinJS.Promise.as().then(function () {
                        return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state);
                    }).then(cleanup, cleanup);

                    args.detail.setPromise(this._lastNavigationPromise);
                },

                // Реагирует на события изменения размера и вызывает функцию updateLayout
                // для текущей загруженной страницы.
                _resized: function (args) {
                    if (this.pageControl && this.pageControl.updateLayout) {
                        this.pageControl.updateLayout.call(this.pageControl, this.pageElement);
                    }
                },
            }
        )
    });
})();
