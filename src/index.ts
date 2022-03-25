import Observable from './Observable'
import _Operators from './Operators'

// mixin
Object.keys(_Operators).forEach((op) => {
    Observable[op] = _Operators[op]
})

export const Operators = _Operators
export default Observable
