const express = require('express')

const Admin = require('./model/auth/admin')

require('./db/mongoose')

const app = express()

app.use(express.json())

// Loading routers
app.use(require('./router/auth/user'))
app.use(require('./router/auth/admin'))
app.use(require('./router/flight/flight'))
app.use(require('./router/reserve/reserve'))

const generateAdmin = async () => {
    const admin = await Admin.findOne({ username: 'admin' })
    if (!admin) {
        await Admin.create({ username: 'admin', password: 'admin' })
    }
}

generateAdmin()

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})