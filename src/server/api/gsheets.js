import { GoogleSpreadsheet } from 'google-spreadsheet'
import { logger } from '../middlewares/logger'

export default class Sheets {
    constructor({ sheetId, clientEmail, privKey }) {
        this.doc = new GoogleSpreadsheet(sheetId)
        this.creds = {
            client_email: clientEmail,
            private_key: privKey
        }
        this.authenticated = false
        this.sheet = null
    }

    async auth() {
        try {
            await this.doc.useServiceAccountAuth(this.creds)
        } catch (err) {
            throw new Error(err)
        }
    }

    async getSheet() {
        try {

            //authenticate if not authenticated
            if (!this.authenticated) {
                await this.auth()
                console.log("Authenticated")
            }

            //get spreadsheet info
            await this.doc.loadInfo()
            console.log(`title - `, this.doc.title)
            let sheet = this.doc.sheetsById[0]
            return sheet
        } catch (err) {
            console.error(err)
            throw new Error(err)
        }
    }


    async getRecordWithDate(date) {
        return new Promise(async (resolve, reject) => {
            try {

                let sheet = await this.getSheet()
                //get rows from sheet
                let rows = await sheet.getRows()

                //find the entry that we need
                let row = rows.find((_row) => {
                    return (_row.date === date)
                })

                if (row) {
                    resolve(row)
                } else {
                    resolve(404)
                }

            } catch (error) {
                logger.error("Error -" + error)
                resolve(500)
            }
        })
    }

    async getAllRecords() {
        let sheet = await this.getSheet()
        let rows = await sheet.getRows()
        return rows
    }

    async addRecord(data) {

        let sheet = await this.getSheet()

        let rowsBefore = await sheet.getRows()

        let added = await sheet.addRow(data)
        console.log(added)
        let rowsAfter = await sheet.getRows()

        if (added && rowsAfter.length == rowsBefore.length + 1)
            return 200

        return 500

    }

    async updateOappLikes(oappId, likes) {
        let sheet = await this.getSheet()
        let rows = await sheet.getRows()

        //find the entry that we need
        let row = rows.find((_row) => {
            return (_row.oappid === oappId)
        })

        if (!row) {
            return 404
        }

        //update the likes
        row.likes = likes

        //save the row
        let res = await new Promise((resolve, reject) => {
            //save row in gsheet
            row.save((err, done) => {
                if (!err) {
                    logger.info(`Oapp [${row.name}] likes updated to [${row.likes}]`)
                    resolve(200)
                } else {
                    logger.error(`Some error occured while updating Oapp [${row.name}] likes to [${row.likes}]`)
                    logger.error(err)
                    resolve(500)
                }
            })
        })

        return res
    }


    //get the sheets info from spreadsheets
    async _getSheetsInfo() {
        return await this.doc.loadInfo()
    }

}