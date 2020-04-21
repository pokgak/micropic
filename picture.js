var express = require('express')
var router = express.Router()

router.get('/:uuid', function (req, res, next) {
    console.log('GET /picture uuid ' + req.params['uuid'])
},
    express.static('uploaded')
)

router.post('/', function (req, res) {
    console.log("delete picture")
    res.send("post picture")
})

router.delete('/', function (req, res) {
    console.log("delete picture")
    res.send("delte picture")
})

module.exports = router
