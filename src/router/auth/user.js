const express = require('express')
const auth = require('../../middleware/auth')

const User = require('../../model/auth/user')
const Reserve = require('../../model/reserve/reserve')

const router = new express.Router()

router.post('/auth/signup', async (req, res) => {
    try {
        console.log('deez nuts')
        console.log(req.body)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        const token = await user.generateAuthToken()

        await user.save()

        res.status(201).send({ user, token })

    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.post('/auth/user', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.get('/me', auth('user'), async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.get('/me/reservations', auth('user'), async (req, res) => {
    try {
        const reservations = await Reserve.find({ UserId: req.user.id }).populate('FlightId')
        res.send(reservations)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

module.exports = router