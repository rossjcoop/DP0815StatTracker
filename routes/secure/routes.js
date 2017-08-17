const express = require('express')
const router = express.Router()
const conn = require('../../library/db')


////////////////GET ACTIVITIES/////////////////////////

router.get('/activities', function (req, res, next){
const viewActivities =`
	SELECT * FROM activities
	`
	conn.query(viewActivities, function(err, results, fields){
    console.log(results)

    if(!err){
    res.json({
    	status: "Success!",
    	message: "Hello, here are your current activities:",
    	results: results})
	} else {
		console.log(err)
		res.json({
			status: "Failure",
			message: "Couldn't connect to your activities."
		})
	}
	})
});

////////////////POST AN ACTIVITY AND TRACK/////////////////////////////

router.post('/activities', function (req, res, next){

const activity = req.body.activity
const count = 1
const date = new Date().toISOString().slice(0, 10);

const addActivity =`
	INSERT INTO activities (activity)
	VALUES (?)`

	conn.query(addActivity, [activity], function(err, results, fields){   
    if(!err){
    	const activityId = results.insertId

    	const addActivityData = `
    	INSERT INTO activityData (ActivityId, Count, Date)
    	VALUES (?, ?, ?)`

    	conn.query(addActivityData, [activityId, count, date], function(err, results, fields){
    		if(!err){
    			res.json({
    			status: "Success!",
    			message: "Your activity has been posted and is tracking starting at 1."})
			} else {
				console.log(err)
				res.json({
				status: "Failure",
				message: "Couldn't add to your activities."
				})
			}
		})
    } else {
    	console.log(err)
		res.json({
		status: "Failure",
		message: "Couldn't add to your activities."
		})
	}
    })
});



//////////////////GET ONE ACTIVITY with Data////////////////////////////

router.get('/activities/:id', function(req, res, next){
	const viewActivity = `
	SELECT activities.activity, activityData.count, activityData.date FROM activities JOIN activityData ON activities.id = activityData.ActivityId
	WHERE activities.id = ?`

	const id = req.params.id

	conn.query(viewActivity, [id], function(err, results, fields){
	console.log(results)

	if(!err || results){
		res.json({
			status: "Success!",
			message: "Here is your activity you requested.",
			results: results})
	} else {
		console.log(err)
		res.json({
			status: "Failure",
			message: "Activity doesn't exist or couldn't request your activity."
		})
	}
	})
});


/////////////////UPDATE ONE ACTIVITY, ONLY THE NAME OF ACTIVITY/////////////////////////////////

router.patch('/activities/:id', function(req, res, next){
	
	const updateActivity = `
	UPDATE activities SET activity = ?
	WHERE id = ?`

	const id = req.params.id
	const newActivity = req.body.activity

	conn.query(newActivity, [id, updateActivity], function(err, results, fields){

	if(!err){
		res.json({
			status: "Success!",
			message: "Your activity has been updated."
		})
	} else {
		console.log(err)
		res.json({
			status: "Failure",
			message: "Activity couldn't be updated."
		})
	}
	})
});

//////////////DELETE ONE ACTIVITY, THE WHOLE THING///////////////////////////////////

router.delete('/activities/:id', function(req, res, next){
	const deleteActivity = `
	DELETE FROM activities
	WHERE id = ?;`

	const id = req.params.id

	conn.query(deleteActivity, [id], function(err, results, fields){
		if(!err){
		res.json({
			status: "Success!",
			message: "Your activity has been deleted."
		})
	} else {
		console.log(err)
		res.json({
			status: "Failure",
			message: "Activity doesn't exist or couldn't delete your activity."
		})
	}
	})
});




///////////////UPDATE DATA ON ONE ACTIVITY (TODAY)/////////////////////////////////////////

router.post('/activities/:id/stats', function (req, res, next){
	
	////GET CURRENT COUNT FOR THE ACTIVITY TODAY//////////////////////////////////////
	const selectCount =`
	SELECT ActivityId, Count, Date FROM activityData
	WHERE ActivityId = ? AND Date = ?;`

	const id = req.params.id
	const date = new Date().toISOString().slice(0, 10)
	

	conn.query(selectCount, [id, date], function(err, results, fields){
		if(!err || results !== undefined){
			const item = results[0]
			const count = item.Count
			const upcount = (count + 1)
			/////Now update the count on today's tracking////////////////////////////////
			const updateData = `
			UPDATE ActivityData
			SET Count = ? 
			WHERE ActivityID = ? AND Date = ?;`
	
			conn.query(updateData, [upcount, id, date], function(err, results, fields){
				if(!err){
    			res.json({
    			status: "Success!",
    			message: "Your data activity has been updated and is tracking."})
			} else {
				console.log(err)
				res.json({
				status: "Failure",
				message: "Activity doesn't exist, or couldn't update data to your activities."
				})
			}	
			})

		} else {
    		console.log(err)
			res.json({
			status: "Failure",
			message: "Couldn't update data to your activities."
		})
		}
	})
});

////////////////////////DELETE TRACKING DATA FOR TODAY///////////////////////////////////////


router.delete('/stats/:id', function(req, res, next){
	const deleteData = `
	DELETE FROM ActivityData
	WHERE Date = ?`

	const id = req.params.id
	const date = new Date().toISOString().slice(0, 10)

	conn.query(deleteData, [date], function(err, results, fields){
		if(!err){
		res.json({
			status: "Success!",
			message: "Your activity data for today has been deleted."
		})
	} else {
		console.log(err)
		res.json({
			status: "Failure",
			message: "Error deleting your activity."
		})
	}
	})
})


module.exports = router




