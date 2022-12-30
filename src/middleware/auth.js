const jwt = require('jsonwebtoken')

const User = require('../model/auth/user')
const Admin = require('../model/auth/admin')

const auth = (mode) => {
    return async function(req, res, next) {
        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, 'aksds')

            if (mode === 'user') {
                const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

                if (!user)
                    throw new Error()
                
                req.token = token
                req.user = user
                next()
            } else if (mode === 'admin') {
                const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token })

                if (!admin)
                    throw new Error()
                
                req.token = token
                req.admin = admin
                next()
            }
    
        } catch (e) {
            res.status(401).send({ error: 'Please authenticate.' })
        }
    }
}

module.exports = auth