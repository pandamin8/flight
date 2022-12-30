const mongoose = require('mongoose')
const Reserve = require('../reserve/reserve')

const flightSchema = new mongoose.Schema({
    origin: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        trim: true
    },
    airline: {
        type: String,
        required: true,
        trim: true
    },
    flightDate: {
        type: Date,
        required: true,
        validate(value) {
            if (new Date(value).getTime() <  Date.now())
                throw new Error('Flight date is passed')
        }
    }
}, { timestamps: true })

flightSchema.virtual('reserves', {
    ref: 'Reserve',
    localField: '_id',
    foreignField: 'FlightId'
})

flightSchema.pre('remove', async function (next) {
    const flight = this
    await Reserve.deleteMany({ FlightId: flight.id })
    next()
})

const Flight = mongoose.model('Flight', flightSchema)
module.exports = Flight

