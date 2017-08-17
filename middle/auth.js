const conn = require('../library/db')

function Authenticate(req, res, next) {
  let token = req.get("Authorization")

  if (!token) {
    res.status(401).json({
      message: "You are not authorized to view this information"
    })
  } else {
    token = token

    const sql = `
      SELECT * FROM validation
      WHERE token = ?
    `

    conn.query(sql, [token], function(err, results, fields){
      if (results.length > 0) {
        next()
      } else {
        res.status(401).json({
          message: "You are not authorized to view this information"
        })
      }
    })
  }
}

module.exports = Authenticate