const express = require('express')
const auth = require('../../middleware/auth')

const Reserve = require('../../model/reserve/reserve')
const Flight = require('../../model/flight/flight')

const router = new express.Router()

router.post('/reserve/:id', auth('user'), async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id)
        if (!flight) return res.status(404).send({ error: 'Flight not found' })

        const now = Date.now()
        if (new Date(flight.flightDate) < now) throw new Error('It\'s too late to reserve this flight')

        if (flight.capacity <= 0) throw new Error('Flight has no capacity')

        const reserve = new Reserve({
            UserId: req.user._id,
            FlightId: req.params.id
        })

        flight.capacity = flight.capacity - 1
        await flight.save()

        await reserve.save()

        res.send(reserve)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.delete('/reserve/cancel/:id', auth('user'), async (req, res) => {
    try {
        const reserve = await Reserve.findById(req.params.id)
        if (!reserve) return res.status(404).send({ error: 'reserve not found' })

        const flight = await Flight.findById(reserve.FlightId)
        
        const now = Date.now()
        if (new Date(flight.flightDate) < now) throw new Error('It\'s too late to cancel this flight')

        reserve.remove()
        flight.capacity = flight.capacity + 1
        await flight.save()

        res.send({ msg: 'Reservation canceled' })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

module.exports = router