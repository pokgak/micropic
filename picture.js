var fs = require('fs')
var express = require('express')
var router = express.Router()

const ACCEPTED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
]

const uploadDir = 'uploads/'
var checkFile = function (req, file, cb) {
    console.log("checking file validity")

    if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}
var upload = require('multer')({ dest: uploadDir, fileFilter: checkFile })

router.get('/:id', express.static('uploads'))

router.post('/', upload.single('data'), function (req, res) {
    if (req.file === undefined) {
        res.sendStatus(400).end()
    }

    res.json({
        'urls': [
            '/' + uploadDir + req.file.filename,
        ]
    })
})

router.delete('/:id', function (req, res) {
    console.log("delete picture")
    fs.unlink(uploadDir + req.params['id'], (err) => {
        if (err) throw err;
        console.log("successfully deleted /" + uploadDir + req.params['id'])
    })
    res.sendStatus(204).end()
})

module.exports = router
