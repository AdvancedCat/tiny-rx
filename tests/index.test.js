import Observable from '../src'

describe('Observable', () => {
    test('construct', () => {
        const fn = jest.fn()
        const ob = new Observable(fn)

        expect('_subscribe' in ob).toBe(true)
        expect(ob._subscribe === fn).toBe(true)
    })

    test('subscribe an observer', () => {
        let flag = false
        const cb = function (observer) {
            observer.next(1)
        }
        const ob = new Observable(cb)
        ob.subscribe({
            next: () => {
                flag = true
            },
        })

        expect(flag).toBe(true)
    })
})

describe('Operators', () => {
    test('of', () => {
        let result = ''
        let ob = Observable.of(1, 2, 3)
        ob.subscribe((val) => {
            result += val
        })
        expect(result).toBe('123')
    })

    test('from:non-promise', async () => {
        let result = ''
        Observable.from([1, 2, 3]).subscribe((val) => {
            result += val
        })
        expect(result).toBe('123')
    })

    test('from:promise', (done) => {
        Observable.from(Promise.resolve(1)).subscribe((val) => {
            expect(val).toBe(1)
            done()
        })
    })
})
