var fs = require('fs')
var crypto = require('crypto')
var AdmZip = require('adm-zip')
var express = require('express')
var router = express.Router()

const ACCEPTED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'application/zip'
]

const uploadDir = 'uploads/'
router.get('/:id', express.static(uploadDir))



var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log("checking file validity")

        if (ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true)
        }
        else {
            cb(null, false)
        }
    },
})

function getFilename () {
    return crypto.randomBytes(16).toString('hex')
  }

function extractZip (path) {
    var urls = []

    var zip = new AdmZip(path)
    zip.getEntries().forEach(function (entry) {
        if (entry.isDirectory) {
            return
        }
        zip.extractEntryTo(entry, uploadDir, true, true)
        urls.push('/' + uploadDir + entry.entryName)
    })
    return urls
}

router.post('/', upload.single('data'), function (req, res) {
    if (req.file === undefined) {
        res.sendStatus(400).end()
    }

    var urls = []
    if (req.file.mimetype === 'application/zip') {
        urls = urls.concat(extractZip(req.file.path))
    }
    else {
        urls.push('/' + uploadDir + req.file.filename)
    }

    res.json({
        'urls': urls
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
