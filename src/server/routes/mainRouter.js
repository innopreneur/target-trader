/**
 * router to handle all app routes
 */
import express from 'express'
import { logger } from '../middlewares'
import {
  startTrading,
  stopTrading,
  addPair,
  pauseTrading,
  resumeTrading,
  updatePrices,
  getOpenOrders
} from '../../trader/trader'
import { removePair } from '../../utils/operations'


const tradeRouter = express.Router()



// route to start trading
tradeRouter.get('/start',
  async (req, res, next) => {
    try {
      console.log("Trading Started")
      startTrading()
      let code = 200
      let message = "trading started"
      next({ code, message })
    }
    catch (error) {
      next(new Error(error))
    }
  })

// route to pause all trading
tradeRouter.get('/pause',
  async (req, res, next) => {
    try {
      pauseTrading()
      console.log("Trading Paused")
      let code = 200
      let message = "trading paused"
      next({ code, message })
    }
    catch (error) {
      next(new Error(error))
    }
  })

// route to resume all trading
tradeRouter.get('/resume',
  async (req, res, next) => {
    try {
      resumeTrading()
      console.log("Trading Resumed")
      let code = 200
      let message = "trading resumed"
      next({ code, message })
    }
    catch (error) {
      next(new Error(error))
    }
  })

// route to stop all trading
tradeRouter.get('/stop',
  async (req, res, next) => {
    try {
      stopTrading()
      console.log("Trading Stopped")
      let code = 200
      let message = "trading stopped"
      next({ code, message })
    }
    catch (error) {
      next(new Error(error))
    }
  })


// route to get all trading pairs
tradeRouter.get('/pairs',
  async (req, res, next) => {
    try {
      console.log("Getting all trading pairs")
      let code = 200
      next({ code, message: global.pairs })
    }
    catch (error) {
      next(new Error(error))
    }
  })

// route to get all trading pairs
tradeRouter.get('/orders',
  async (req, res, next) => {
    try {
      console.log("Getting open orders")
      let { code, message } = await getOpenOrders()
      next({ code, message })
    }
    catch (error) {
      next(new Error(error))
    }
  })

// route to add new trading Pair
tradeRouter.post('/addPair',
  async (req, res, next) => {
    try {
      console.log(req.body)
      //add pair to trader
      let { code, message } = addPair(req.body)
      console.log(`ROUTER`, { code, message })
      next({ code, message })
    }
    catch (error) {
      next(new Error(error))
    }
  })


// route to remove a trading Pair
tradeRouter.delete('/removePair',
  async (req, res, next) => {
    try {
      //remove pair from trading pairs
      let { code, message } = removePair(req.query.symbol)
      next({ code, message })
    }
    catch (error) {
      next(new Error(error))
    }
  })

// route to update Pair trade price levels
tradeRouter.post('/pricing',
  async (req, res, next) => {
    try {

      let { code, message } = updatePrices(req.body)
      next({ code, message })
    }
    catch (error) {
      next(new Error(error))
    }
  })



export default tradeRouter
