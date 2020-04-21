var express = require('express')
var router = express.Router()

var checkFile = function (req, file, cb) {
    console.log("checking file validity")
    cb(null, false)
}

var upload = require('multer')({ dest: 'uploads/', fileFilter: checkFile })


const uploadDir = 'uploads/'

router.get('/:uuid', function (req, res, next) {
    console.log('GET /picture uuid ' + req.params['uuid'])
    next()
},
    express.static('uploads')
)

router.post('/', upload.single('data'), function (req, res) {
    if (req.file === undefined) {
        res.sendStatus(400)
        return
    }

    console.log(req.file)

    res.send("post picture " + req.file.filename)
})

router.delete('/', function (req, res) {
    console.log("delete picture")
    res.send("delte picture")
})

module.exports = router
