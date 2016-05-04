/**
 * Author: Marek Zeman
 * Twitter: MarekZeman91
 * Site: http://marekzeman.cz
 * License: MIT
 * Version: 1
 * Revision: 4.5.2016 // created
 */
(function () {
    var Cache = {
        delegated: {},
        get: function (type, selector, useCapture) {
            var cache = Cache.delegated;
            var i, l = arguments.length;
            for (i = 0; i < l && cache; i++) {
                cache = cache[arguments[i]];
            }
            return cache;
        },
        set: function (type, selector, useCapture, item) {
            var cache = Cache.delegated;
            var i, l = arguments.length-1;
            for (i = 0; i < l; i++) cache = cache[arguments[i]] || (
                cache[arguments[i]] = i+1 === l ? [] : {}
            );
            return (cache.push(item), item);
        }
    };

    var proto = Element.prototype;
    var matches = (
        proto.matches            ||
        proto.oMatchesSelector   ||
        proto.msMatchesSelector  ||
        proto.mozMatchesSelector ||
        proto.webkitMatchesSelector
    );

    function targetHandler(event, selector, listener) {
        var target = event.target;

        do {
            if (!(target instanceof Element)) return;
            if (!matches.call(target, selector)) {
                target = target.parentNode;
                continue;
            }
            Object.defineProperty(event, 'currentTarget', {
                enumerable: true, writeable: true,
                configurable: true, value: target
            });
            if (listener.handleEvent) {
                listener.handleEvent.call(listener, event);
            }
            else {
                listener.call(this, event);
            }
            return;
        }
        while (target && target !== this);
    }

    proto.delegateEventListener = function (type, selector, listener, useCapture) {
        var obj = {selector: selector, listener: listener};
        this.addEventListener(type, obj.handler = function (event) {
            targetHandler.call(this, event, selector, listener);
        }, useCapture);
        Cache.set(type, selector, useCapture, obj);
    };

    proto.undelegateEventListener = function (type, selector, listener, useCapture) {
        var cache = Cache.get(type, selector, useCapture);
        for (var i = 0; (cache || [])[i]; i++) {
            if (cache[i].listener !== listener) continue;
            this.removeEventListener(type, cache[i].handler, useCapture);
            cache.splice(i--, 1);
        }
    };
})();
