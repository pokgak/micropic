var fs = require('fs')
var crypto = require('crypto')
var AdmZip = require('adm-zip')
var express = require('express')
var router = express.Router()
const imageThumbnail = require('image-thumbnail')
var sizeOf = require('image-size')

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

function extractPaths (path) {
    var paths = []

    var zip = new AdmZip(path)
    zip.getEntries().forEach(function (entry) {
        if (entry.isDirectory) {
            return
        }
        zip.extractEntryTo(entry, uploadDir, true, true)
        paths.push(entry.entryName)
    })
    return paths
}

function calculateThumbnailPercentage (dimensions) {
    return (dimensions.width <= 128 && dimensions.height <= 128) ? 100 : parseInt((32 / dimensions.width) * 100)
}

function getThumbnail (path) {
    var dimensions = sizeOf(path)
    var options = { percentage: calculateThumbnailPercentage(dimensions), responseType: 'base64' }
    return imageThumbnail(path, options)
}

router.post('/', upload.single('data'), function (req, res) {
    if (req.file === undefined) {
        res.sendStatus(400).end()
    }

    if (req.file.mimetype === 'application/zip') {
        var filenames = extractPaths(req.file.path)
    } else {
        var filenames = [req.file.filename]
    }

    var pictures = filenames.map(function (filename) {
        return new Promise((resolve, reject) => {
            getThumbnail(uploadDir + filename).then( thumbnail => resolve({
                'url': '/picture/' + filename,
                'thumbnail': thumbnail,
            }))
        })
    })
    Promise.all(pictures).then(function (results) {
        return res.send(results)
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
