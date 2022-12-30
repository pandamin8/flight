const express = require('express')

const Admin = require('../../model/auth/admin')

const router = new express.Router()

router.post('/auth/admin', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.username, req.body.password)
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})


module.exports = router