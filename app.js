const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const publicRoutes = require('./routes/public/routes')
const secureRoutes = require('./routes/secure/routes')
const Authenticate = require('./middle/auth') 


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use('/api', Authenticate, secureRoutes)
app.use('/api', publicRoutes)



app.listen(3000, function(){
  console.log("App running on port 3000")
})
