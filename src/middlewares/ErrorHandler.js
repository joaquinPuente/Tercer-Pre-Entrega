import EnumsError from "../service/errors/EnumsError.js"

export default (error, req, res, next) =>{
    console.error('error  code',error.code);

    switch (error.code) {

    case EnumsError.BAD_REQUEST_ERROR:
        res.status(400).json({ status: 'error', message: error.message})
    break;

    case EnumsError.DATA_BASE_ERROR:
        res.status(500).json({ status: 'error', message: error.message})
    break;

    case EnumsError.INVALID_PARAM_ERROR:
        res.status(500).json({ status: 'error', message: error.message})
    break;
   
    default:
        res.status(500).json({status:'error', message: 'error desconocido desde el midleware'})
    break;
   
    }
}