import { remove, findIndex } from 'lodash'

export function checkIfPairExists(symbol) {
    return findIndex(global.pairs, { symbol })
}

// remove exisiting trading pair
export function removePair(symbol) {
    let _pair = remove(global.pairs, { symbol })
    if (_pair.length >= 1) {
        //found and removed
        logger.info(`Pair ${symbol} successfully removed`)
        return { code: 200, message: global.pairs }
    } else {
        //pair is not listed
        logger.info(`Pair ${symbol} is not being traded yet`)
        return { code: 404, message: global.pairs }
    }
}