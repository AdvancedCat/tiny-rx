import { NOOP } from './shared'

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
