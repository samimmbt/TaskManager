// import express, { request, response } from 'express';
const express = require('express')
// import postgres from 'postgres';
// import 'dotenv/config';

const postgres = require('postgres');
// require('dotenv').config();

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (_, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const port = 3001

let PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID;


PGHOST = 'ep-curly-art-a5nxh43d.us-east-2.aws.neon.tech'
PGDATABASE = 'tasks_db'
PGUSER = 'samimmbt'
PGPASSWORD = 'ZQbSP2Gt7dBg'
ENDPOINT_ID = 'ep-curly-art-a5nxh43d'

const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});

async function deleteTask(jobID) {
    try {
        const result = await sql`DELETE FROM tasks WHERE id = ${jobID}`;
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAll() {
    try {
        const result = await sql`SELECT * FROM tasks`
        return result
    } catch (error) {
        // handle the error
        console.error(error)
    }
}

async function getTaskDetails(jobID) {
    try {
        const result = await sql`SELECT * FROM tasks WHERE id = ${jobID}`;
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function updateTask(jobID, updatedTask) {
    try {
        const result = await sql`UPDATE tasks SET
        title = ${updatedTask.title},
        date = ${updatedTask.date},
        starttime = ${updatedTask.starttime},
        finishtime = ${updatedTask.finishtime},
        completed = ${updatedTask.completed},
        comment = ${updatedTask.comment},
        color = ${updatedTask.color}
        WHERE id = ${jobID}
        RETURNING *`;

        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function setChekced(id, completed) {
    try {
        const res = await sql`UPDATE tasks SET
        completed = ${completed}
        WHERE id = ${id}
        `
        return res[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}
async function addTask(task) {
    try {

        console.log(`
            (${task.day},
            ${task.title},
            ${task.date},
            ${task.startTime},
            ${task.finishTime},
            ${task.completed},
            ${task.comment},
            ${task.color})`);
        if (Object.values(task).every((value) => value !== undefined && value !== null)) {//stackoverflow...
            // All data is defined and not null
            const result = await sql`INSERT INTO tasks (day,title, date, startTime, finishTime, completed, comment, color)
         VALUES (${task.day},${task.title},${task.date},${task.startTime},${task.finishTime},${task.completed},${task.comment},${task.color})`;

            return result;
        } else {
            return
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function updateId(id) {
    try {
        const result = await sql`ALTER SEQUENCE tasks_id_seq RESTART WITH ${id}`
    } catch (error) {
        console.error(error);
        return null;
    }
}

app.get('/jobs', (request, response) => {
    const title = request.query.title;
    const day = request.query.day;
    const data = getAll().then((result) => {
        let resultJobs = result;
        // console.log(result);
        if (title) {
            resultJobs = []
            if (result) {
                result.forEach(element => {
                    if (element.title.includes(title)) {
                        resultJobs.push(element)
                    }
                });
            }
        } else if (day) {
            resultJobs = []
            if (result) {
                result.forEach(element => {
                    if (element.day == day) {
                        resultJobs.push(element)
                    }
                });
            }
        }
        console.log(resultJobs)
        response.send(resultJobs)
    })
});

app.get('/jobs/:id', (request, response) => {
    const jobID = parseInt(request.params.id);
    console.log("id:" + jobID);
    let taskDetails = null
    if (jobID && jobID !== undefined) {
        console.log("id:: " + jobID);
        taskDetails = getTaskDetails(jobID);

        taskDetails.then((result) => {
            if (result) {
                console.log(result);
                response.send(result);
            }
        })
    } else {
        response.send().status(404)
    }
});

app.delete('/jobs/:id', (request, response) => {
    const jobID = parseInt(request.params.id);
    console.log("id:" + jobID);
    let taskDetails = null, update
    if (jobID && jobID !== undefined) {
        console.log("id:: " + jobID);
        taskDetails = deleteTask(jobID);
        update = updateId(jobID)
        console.log(update);
    }
    taskDetails.then((result) => {
        if (result) {
            console.log(result);
            response.send(result);
        }
    })
})

app.put('/jobs/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    const task = request.body;

    const updatedTask = await updateTask(id, task);
    if (updatedTask) {
        response.send(updatedTask);
    } else {
        response.sendStatus(404);
    }
});

app.post('/', (request, response) => {
    const task = request.body;
    console.log(task);
    if (task) {
        addTask(task)
    }
    response.send().status(204);
});

app.patch('/', (request, response) => {
    const id = request.body.id
    const isDone = request.body.completed
    console.log(`${id}  ${isDone}`);
    setChekced(id, isDone)
    response.send(isDone);
});

app.listen(port, () => console.log("port listen: http://localhost:" + port))