const NOOP = function () {}
export default class Observable {
    static operators
    _subscribe
    constructor(subscribe) {
        this._subscribe = subscribe
    }

    pipe(...operators) {
        return operators.reduce((prev, fn) => {
            fn(prev)
        }, this)
    }

    subscribe(observer) {
        const defaultObserver = {
            next: NOOP,
            error: NOOP,
            complete: NOOP,
        }

        if (typeof observer === 'function') {
            return this._subscribe({
                ...defaultObserver,
                next: observer,
            })
        } else {
            return this._subscribe({
                ...defaultObserver,
                ...observer,
            })
        }
    }
}

const emptyObservable = new Observable(NOOP)

// create operators
export function of(...args) {
    return new Observable((observer) => {
        try {
            args.forEach((arg) => {
                observer.next(arg)
            })
        } catch (err) {
            observer.error(err)
        } finally {
            observer.complete()
        }
        return {
            unsubscribe: NOOP,
        }
    })
}

export function fromEvent(dom, eventName) {
    if (!dom || !eventName) return emptyObservable

    return new Observable(function (observer) {
        const handler = (evt) => observer.next(evt)
        dom.addEventListener(eventName, handler)
        return {
            unsubscribe: () => {
                dom.removeEventListener(eventName, handler)
            },
        }
    })
}

// filter operators
export function map(fn) {
    return (observable) =>
        new Observable((observer) => {
            observable.subscribe({
                next: (val) => observer.next(fn(val)),
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
            })
        })
}

export function filter(fn) {
    return (observable) =>
        new Observable((observer) => {
            observable.subscribe({
                next: (val) => (fn(val) ? observer.next(val) : NOOP()),
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
            })
        })
}

export function take(count) {
    return (observable) =>
        new Observable((observer) => {
            let times = 0
            const subscription = observable.subscribe({
                next: function (val) {
                    times++
                    if (times <= count) {
                        observer.next(val)
                    } else {
                        observer.complete()
                        subscription.unsubscribe()
                    }
                },
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
            })
        })
}

Observable.operators = {
    of,
}
