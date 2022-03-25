import Observable, { of } from '../src'

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

// describe('Operators', ()=>{
//     test('of', ()=>{

//     })
// })
