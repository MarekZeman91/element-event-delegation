/**
 * Author: Marek Zeman
 * Twitter: MarekZeman91
 * License: MIT
 * Version: 1.01
 * Revision: 20.7.2016 // Better support for minification
 */
(function () {
    var delegated = {};

    function get(type, selector, useCapture) {
        var cache = delegated, args = arguments;
        var i, l = args.length;
        for (i = 0; i < l && cache; i++) {
            cache = cache[args[i]];
        }
        return cache;
    }

    function set(type, selector, useCapture, item) {
        var cache = delegated, args = arguments;
        var i, l = args.length - 1;
        for (i = 0; i < l; i++) cache = cache[args[i]] || (
            cache[args[i]] = i + 1 === l ? [] : {}
        );
        return (cache.push(item), item);
    }

    var proto = Element.prototype;
    var matchesFn = 'MatchesSelector';
    var matches = (
        proto.matches ||
        proto['o' + matchesFn] ||
        proto['ms' + matchesFn] ||
        proto['moz' + matchesFn] ||
        proto['webkit' + matchesFn]
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

    var delegateFn = 'delegateEventListener';
    proto[delegateFn] = function (type, selector, listener, useCapture) {
        var obj = {selector: selector, listener: listener};
        this.addEventListener(type, obj.handler = function (event) {
            targetHandler.call(this, event, selector, listener);
        }, useCapture);
        set(type, selector, useCapture, obj);
    };

    proto['un' + delegateFn] = function (type, selector, listener, useCapture) {
        var cache = get(type, selector, useCapture);
        for (var i = 0; (cache || [])[i]; i++) {
            if (cache[i].listener !== listener) continue;
            this.removeEventListener(type, cache[i].handler, useCapture);
            cache.splice(i--, 1);
        }
    };
})();
