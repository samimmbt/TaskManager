import axios from 'axios';
import { showTasks, createDayContainers, addTimeNumbers, scrollToCurrentDay, scrollToCurrentTime, fillDeital } from './UI'
import { getDayName, getMyDay, getMyMonth, getDaysFromMonth } from './TimeDate';
// import { addtask } from "./DataHandler";
//^_^ i didnt have a use for this for now but for version 2, yeah
export function getTasksOfDay(input) {
    let resultData = ""
    axios.get('http://localhost:3001/jobs', {
        params: {
            day: input
        }
    }).then(response => {
        // console.log(response.data);

        response.data.sort((a, b) => a.id - b.id); // sort by id in ascending order
        showTasks(response.data);

    }).catch((err) => {
        console.error(err)
    })

}

export function getTask(input) {
    return axios.get(`http://localhost:3001/jobs/${input}`, {
        params: {
            id: input
        }
    }).then(response => {
        // console.log(response.data);

        return response.data;
    }).catch((err) => {
        console.error(err)
    })

}

export function checked(data) {
    console.log(data);
    axios.patch(`http://localhost:3001/`, data)
        .then(response => {
            // console.log(response.data);
            return response.data;
        })
        .catch(err => {
            console.error(err);
        });
}

export function update(data) {
    // console.log(data);
    axios.put(`http://localhost:3001/jobs/${data.id}`, data)
        .then(response => {
            // console.log(response.data);
            return response.data;
        })
        .finally(() => {
            alert("Update Done! ^_^")
        })
        .catch(err => {
            console.error(err);
        });
}

export function save(data) {
    // console.log(data);
    axios.post(`http://localhost:3001/`, data)
        .then(response => {
            // console.log(response.data);
            return response.data;
        })
        .catch(err => {
            console.error(err);
        });
}

export function deleteData(id) {
    // console.log(id);
    axios.delete(`http://localhost:3001/jobs/${id}`)
        .then(response => {
            // console.log(response.data);
            return response.data;
        })
        .catch(err => {
            console.error(err);
        }).finally(() => { clearinputs(); alert("Delete Done! ^_^") });
}
function clearinputs() {
    document.getElementById("taskTitle").value = ""
    document.getElementById("taskStart").value = ""
    document.getElementById("taskEnd").value = ""
    document.getElementById("taskComm").value = ""
    document.getElementById("taskColor").value = ""
    document.getElementById("date").value = ""
    document.getElementById("completed").value = ""
}

window.addEventListener("load", () => {
    const path = window.location.pathname// get path name, the one that its in search bar right now
    const url = new URL(window.location.href);//convert string to new url so i can use it
    const jobID = url.searchParams.get("id");
    if (!path.match("/job")) {
        let job = document.getElementById('jobsContainer');
        let time = document.getElementById('time');
        getTasksOfDay(getMyDay())//first get today number then give it to tasks to display todays tasks defult
        createDayContainers(getDaysFromMonth(getMyMonth()));//first get this mounth number , give it to coverter so it can get if you are 28 or 30 or 31 , then creat element
        addTimeNumbers()
        scrollToCurrentDay()
        scrollToCurrentTime()

        document.getElementById("theme").addEventListener("click", () => {
            changeTheme()//version 2
        })

        time.addEventListener('scroll', function () {// when i scroll the hours sidebar it will scroll right one
            job.scroll({
                top: time.scrollTop,
            })
        })
        job.addEventListener('scroll', function () {// when i scroll the hours sidebar it will scroll right one
            time.scroll({
                top: job.scrollTop,
            })
        })
    } else if (path.match("/job") && jobID !== undefined && jobID !== null) {// i dont like empty things ---- also below codes are for job.html

        let task = getTask(jobID)
        fillDeital(task)
        document.getElementById("del").addEventListener("click", () => {
            var result = confirm("Are you sure you want to proceed?");// are you really sure?? ha??? 6_6
            if (result == true) {
                deleteData(jobID)
            } else {
                return
            }
        })
        document.getElementById("save").addEventListener("click", () => {
            let title = document.getElementById("taskTitle").value,
                startTime = document.getElementById("taskStart").value,
                finishTime = document.getElementById("taskEnd").value,
                comment = document.getElementById("taskComm").value,
                color = document.getElementById("taskColor").value,
                date = document.getElementById("date").value,
                day = document.getElementById("day").value,
                completed = document.getElementById("completed").value
            if (startTime >= finishTime) {
                alert("finish time can not be before start time, it's not time travel")// i warn you here is a place you can not travel to future!!
                return
            }
            if (title === "" || startTime === "" || finishTime === "" || color === "" || date === "" || day === "" || completed === "") {
                alert("Check the inputs they can not be empty! :/\nYou can leave comment empty!")//im careful here so data be clean
                return
            }
            if (completed === "true") {//i dont have a use for this now
                completed = true
            } else {
                completed = false
            }
            const taskData = {// creating data
                id: parseInt(jobID),
                day: day,
                title: title,
                date: date,
                starttime: startTime,
                finishtime: finishTime,
                completed: completed,
                comment: comment,
                color: color
            };
            update(taskData)
        })
    }
})