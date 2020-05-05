import Binance from 'binance-api-node'
require('dotenv').config()

// Authenticated client, can make signed calls
const binance = Binance({
    apiKey: process.env.binance_API_KEY,
    apiSecret: process.env.binance_SECRET
})

export default binance