import Observable from './Observable'
import { NOOP } from './shared'

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

export function from(params) {
    if (Array.isArray(params)) {
        return of(...params)
    }

    return new Observable((observer) => {
        let canceled = false
        Promise.resolve(params)
            .then((res) => {
                if (!canceled) {
                    observer.next(res)
                    observer.complete()
                }
            })
            .catch((err) => {
                observer.error(err)
            })
        return {
            unsubscribe: () => (canceled = true),
        }
    })
}

export function interval(delay) {
    return new Observable((observer) => {
        let count = 0
        observer.next(count)
        const timer = setInterval(() => {
            observer.next(++count)
        }, delay)

        return {
            unsubscribe: () => clearInterval(timer),
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

export function tap(fn) {
    return (observable) =>
        new Observable((observer) => {
            observable.subscribe({
                next: (val) => {
                    fn(val)
                    observer.next(val)
                },
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
            })
        })
}

export default {
    of,
    from,
    fromEvent,
    interval,
    map,
    filter,
    take,
    tap,
}
