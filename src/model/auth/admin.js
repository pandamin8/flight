const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true })

adminSchema.methods.toJSON = function() {
    const admin = this
    const adminObject = admin.toObject()
    delete adminObject.password
    delete adminObject.tokens
    return adminObject
}

adminSchema.methods.generateAuthToken = async function() {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString() }, 'aksds')
    admin.tokens = admin.tokens.concat({ token })
    await admin.save()
    return token
}

adminSchema.statics.findByCredentials = async (username, password) => {
    const admin = await Admin.findOne({ username })    

    if (!admin) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return admin
}

// Hash the plain text password before saving
adminSchema.pre('save', async function (next) {
    const admin = this
        
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})


const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin