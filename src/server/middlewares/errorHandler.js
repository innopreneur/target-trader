/**
 * error handling middleware module
 */

const handleErrors = (arg, req, res, next) => {
    if (arg instanceof Error) {
        let resp = {}
        let message = arg.message ? arg.message : arg

        resp.success = false
        resp.message = message
        next({ code: 500, message: resp })
    } else {
        console.log(`ARG`, arg)
        next(arg)
    }
}


export { handleErrors } 