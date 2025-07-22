const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
app.use(express.json())
const dbPath = path.join(__dirname, 'covid19IndiaPortal.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
const chngFormat = dataObj => {
  return {
    stateId: dataObj.state_id,
    stateName: dataObj.state_name,
    population: dataObj.population,
  }
}
const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        next()
      }
    })
  }
}
///API 1

//API 1
app.post('/login', async (request, response) => {
  const {username, password} = request.body
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      }
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})
//API 2
app.get('/states/', authenticateToken, async (request, response) => {
  const selectUserQuery = `SELECT * FROM state;`
  const Details = await db.all(selectUserQuery)
  const newDetails = Details.map(chngFormat)
  response.send(newDetails)
})
app.get('/states/:stateId/', authenticateToken, async (request, response) => {
  const {stateId} = request.params
  const selectUserQuery = `SELECT * FROM state WHERE state_id = ${stateId};`
  const Details = await db.get(selectUserQuery)
  const newDetails = {
    stateId: Details.state_id,
    stateName: Details.state_name,
    population: Details.population,
  }
  response.send(newDetails)
})
///API 2
app.post('/districts/', authenticateToken, async (request, response) => {
  const districtsDetails = request.body
  const {districtName, stateId, cases, cured, active, deaths} = districtsDetails
  const addQuery = `
    INSERT INTO
      district (district_name,state_id,cases,cured,active,deaths)
    VALUES
      (
        '${districtName}',
         ${stateId},
         ${cases},
         ${cured},
         ${active},
         ${deaths}
      );`

  const dbResponse = await db.run(addQuery)
  response.send('District Successfully Added')
})
app.get(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const getQuery = `
    SELECT
      *
    FROM
      district
    WHERE
      district_id = ${districtId};`
    const m = await db.get(getQuery)
    const mt = {
      districtId: m.district_id,
      districtName: m.district_name,
      stateId: m.state_id,
      cases: m.cases,
      cured: m.cured,
      active: m.active,
      deaths: m.deaths,
    }
    response.send(mt)
  },
)
app.delete(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const deleteQuery = `
    DELETE FROM
      district
    WHERE
      district_id = ${districtId};`
    await db.run(deleteQuery)
    response.send('District Removed')
  },
)

app.put(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const Details = request.body
    const {districtName, stateId, cases, cured, active, deaths} = Details
    const updateQuery = `
    UPDATE
      district
    SET
      district_name='${districtName}',
      state_id=${stateId},
      cases= ${cases},
      cured = ${cured},
      active  = ${active},
      deaths = ${deaths}
    WHERE
       district_id = ${districtId};`
    await db.run(updateQuery)
    response.send('District Details Updated')
  },
)
app.get(
  '/states/:stateId/stats/',
  authenticateToken,
  async (request, response) => {
    const {stateId} = request.params
    const query = `
        SELECT
            SUM(d.cases) AS totalCases,
            SUM(d.cured) AS totalCured,
            SUM(d.active) AS totalActive,
            SUM(d.deaths) AS totalDeaths
        FROM
            district AS d
        JOIN
            state AS s ON d.state_id = s.state_id
        WHERE
            s.state_id = ${stateId}
    `
    const m = await db.get(query)
    const mt = {
      totalCases: m.totalCases,
      totalCured: m.totalCured,
      totalActive: m.totalActive,
      totalDeaths: m.totalDeaths,
    }

    response.send(mt)
  },
)

initializeDBAndServer()
module.exports = app
