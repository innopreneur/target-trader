const api = require('kucoin-node-api')
import axios from 'axios'
require('dotenv').config()

export default class Kucoin {
    constructor() {
        const config = {
            apiKey: process.env.kucoin_API_KEY,
            secretKey: process.env.kucoin_SECRET,
            passphrase: process.env.kucoin_PASSWORD,
            environment: 'live'
        }

        api.init(config)
    }

    async placeOrder(ticker, amount, price, side, type = "limit", remark = "") {
        try {
            let params = {
                clientOid: Date.now(),
                side,
                symbol: ticker,
                type,
                price,
                size: amount,
                remark
            }
            console.log(params)
            return await api.placeOrder(params)
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    }

    async getOrders(params) {
        try {
            return await api.getOrders(params)
        } catch (err) {
            console.error(err)
        }
    }

    async getOrderbook(ticker) {
        try {
            return await api.getPartOrderBook({ amount: 20, symbol: ticker })
        } catch (err) {
            console.error(err)
        }
    }


    async getBestPrice(ticker) {
        try {
            let url = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${ticker}`
            let response = await axios(url)
            let resp = await response.data
            if (resp.code != "200000") {
                return Error(JSON.stringify(resp))
            }
            return resp.data
        } catch (err) {
            console.error(err)
        }
    }


    async  getAccounts() {
        try {
            const config = {
                apiKey: process.env.kucoin_API_KEY,
                secretKey: process.env.kucoin_SECRET,
                passphrase: process.env.kucoin_PASSWORD,
                environment: 'live'
            }

            api.init(config)

            let r = await api.getAccounts()
            console.log(r.data)
        } catch (err) {
            console.log(err)
        }
    }

    async getKlineCandles(period, startDate, endDate, ticker) {
        let url = `https://api.kucoin.com/api/v1/market/candles?type=${period}&symbol=${ticker}&startAt=${startDate}&endAt=${endDate}`
        let response = await axios(url)
        let resp = await response.data
        if (resp.code != "200000") {
            return Error(JSON.stringify(resp))
        }
        return resp.data
    }
}