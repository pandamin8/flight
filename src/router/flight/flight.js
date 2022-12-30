const express = require('express')

const Flight = require('../../model/flight/flight')

const auth = require('../../middleware/auth')

const router = new express.Router()

router.post('/flight', auth('admin'), async (req, res) => {
    try {    
        const origin = req.body.origin
        const destination = req.body.destination

        if (origin === destination)
            throw new Error('Origin and destination can\'t be the same')

        const flight = new Flight({
            origin,
            destination,
            capacity: req.body.capacity,
            airline: req.body.airline,
            flightDate: req.body.flightDate
        })

        await flight.save()

        res.send(flight)

    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.get('/flight', async (req, res) => {
    try {
        const skip = req.query.skip || 0
        const limit = req.query.limit || 20

        const destination = req.query.destination ? '(?i)' + req.query.destination + '(?-i)' : '(.|\n)*?'
        const origin = req.query.origin ? '(?i)' + req.query.origin + '(?-i)' : '(.|\n)*?'

        const flights = await Flight.find({ destination: { $regex: destination }, origin: { $regex: origin } })
            .skip(skip)
            .limit(limit)
        
        res.send(flights)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.get('/flight/:id', async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id)
        if (!flight) return res.status(404).send({ error: 'flight not found' })
        res.send(flight)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.patch('/flight/:id', auth('admin'), async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id)
        if (!flight) return res.status(404).send({ error: 'flight not found' })

        const updates = Object.keys(req.body)

        updates.forEach((update) => flight[update] = req.body[update])
        await flight.save()

        res.send(flight)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.delete('/flight/:id', auth('admin'), async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id)
        if (!flight) return res.status(404).send({ error: e.message })
        await flight.remove()
        res.send({ msg: 'Flight deleted' })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

module.exports = router