const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const conn = require('../../library/db')



//////////////Add username/password/token to validation table/////////////////////////////

router.post('/register', function(req, res, next){
  const username = req.body.username
  const password = req.body.password
  const token = uuid()

  const sql = `
    INSERT INTO validation (username, password, token)
    VALUES (?, ?, ?)
  `

  bcrypt.hash(password, 10).then(function(hashedPassword){
    conn.query(sql, [username, hashedPassword, token], function(err, results, fields){
      res.json({
        message: 'User successfully registered',
        token: token
      })
    })
  })
})

////////////validate password and update token///////////////

router.post("/token", function(req, res, next){
  const username = req.body.username
  const password = req.body.password

  const sql = `
    SELECT password FROM validation
    WHERE username = ?
  `

  conn.query(sql, [username], function(err, results, fields){
    const hashedPassword = results[0].password

    bcrypt.compare(password, hashedPassword).then(function(result){
      if (result) {
        
        const token = uuid()

        const updateToken = `
          UPDATE validation
          SET token = ?
          WHERE username = ?
        `

        conn.query(updateToken, [token, username], function(err, results, fields){
          res.json({
          	message: 'Token updated!',
            token: token
          })
        })
      } else {
        res.status(401).json({
          message: 'Invalid Credentials'
        })
      }
    }).catch(function(err){
      console.log(err)
    })
  })
})



module.exports = router