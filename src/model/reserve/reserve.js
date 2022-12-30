const mongoose = require('mongoose')

const reserveSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    FlightId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Flight'
    }
}, { timestamps: true })

const Reserve = mongoose.model('Reserve', reserveSchema)
module.exports = Reserve