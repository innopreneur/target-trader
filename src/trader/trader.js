import { default as Kucoin } from '../exchanges/Kucoin'
import { remove, findIndex } from 'lodash'
import { sendMessage } from '../utils/messenger'
import { checkIfPairExists } from '../utils/operations'
import { sleep } from '../utils/wait'
import { logger } from '../server/middlewares'
require('dotenv').config()


//instantiate the exchange
var kucoin = new Kucoin()

// pairs to trade
global.pairs = []
//pause trading variable
var shouldTrade = true
var alertCoolOffPeriod = 300000



//pause trading
export function pauseTrading() {
    shouldTrade = false
}

//resume trading
export function resumeTrading() {
    shouldTrade = true
    startTrading()
}

// add pair 
export function addPair(config) {
    if (checkIfPairExists(config.symbol) == -1) {
        config.nextBuyAlert = Date.now()
        config.nextSellAlert = Date.now()
        global.pairs.push(config)
        console.log(global.pairs)
        return { code: 200, message: global.pairs }
    } else {
        logger.info(`Pair ${config.symbol} exists`)
        return { code: 409, message: global.pairs }
    }
}

export async function getOpenOrders() {
    //get all orders
    let resp = await kucoin.getOrders({ status: 'active' })
    let orders = resp.data.items
    logger.info(orders)
    return { code: 200, message: orders }

}

export async function stopTrading() {
    process.exit(0)
}

export async function startTrading() {
    while (shouldTrade) {
        for (var i = 0; i < global.pairs.length; i++) {
            await findTrade(pairs[i])
        }
        //sleep for 5 seconds
        await sleep(4)
    }
}


function getTimeToPrint() {
    let d = new Date()
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}

async function findTrade(pair) {
    try {
        console.log(`--------------- ${getTimeToPrint()} [${pair.symbol}] ----------------`)

        let ob = await kucoin.getBestPrice(pair.symbol)
        let buyPrice = ob.bestAsk
        console.log(`Best Buy @ ` + buyPrice)
        console.log(`Target Buy @ ` + pair.buyPrice)
        let sellPrice = ob.bestBid
        console.log(`Best Sell @ ` + sellPrice)
        console.log(`Target Sell @ ` + pair.sellPrice)


        if (pair.buyPrice > buyPrice && pair.nextBuyAlert < Date.now()) {



            sendMessage(`
           --- TARGET TRADER :: BUY ---

            [${pair.symbol}]
            Current Buy @ ${buyPrice}
            Target Buy @ ${pair.buyPrice}
            `)

            //set alert off
            pair.nextBuyAlert = Date.now() + alertCoolOffPeriod

        }

        //check conditions to place SELL order
        if (pair.sellPrice < sellPrice && pair.nextSellAlert < Date.now()) {

            sendMessage(`
            --- TARGET TRADER :: SELL ---
 
             [${pair.symbol}]
             Current Sell @ ${sellPrice}
             Target Sell @ ${pair.sellPrice}
             `)

            //set alert off
            pair.nextSellAlert = Date.now() + alertCoolOffPeriod
        }
    } catch (err) {
        console.error(err)
    }
}
