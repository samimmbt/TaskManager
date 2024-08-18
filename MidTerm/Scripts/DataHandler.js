import { showTasks, closePopup } from './UI'
import { getTask, getTasksOfDay, save } from "./MainScript";
import { getDayName, getMyDay, getMyYear, getMyMonth, getDaysFromMonth, getTime } from './TimeDate';

function checkDuplicateTasks(date, startTime, finishTime) {

  let tasksForDate = getTasksOfDay(date)
  if (tasksForDate !== undefined) {
    for (let i = 0; i < tasksForDate.length; i++) {
      let task = tasksForDate[i]
      if (task.startTime === startTime && task.finishTime === finishTime) {
        return true // Duplicate task found
      }
    }
  }
  return false // No duplicate task found
}

function checkUniqueColor(color, tasks) {
  for (let day in tasks) {
    let tasksForDate = tasks[day]
    for (let i = 0; i < tasksForDate.length; i++) {
      let task = tasksForDate[i]
      if (task.color === color) {
        return false // Same color found
      }
    }
  }
  return true; // Unique color
}

function clearinputs() {
  document.getElementById("taskTitle").value = ""
  document.getElementById("taskStart").value = ""
  document.getElementById("taskEnd").value = ""
  document.getElementById("taskComm").value = ""
  document.getElementById("taskColor").value = ""

}

export function addtask() {
  let dateitem = document.querySelector(".selectedDay > .dayText")

  if (dateitem === null) {
    dateitem = document.querySelector(".currentDay").textContent
    alert("You didnt choose a day, by defult " + dateitem + " is selected")
  } else {
    dateitem = dateitem.textContent
  }

  const date = parseInt(dateitem)
  console.log(date);
  let tasks = getTask()
  let title = document.getElementById("taskTitle").value
  let startTime = document.getElementById("taskStart").value
  let finishTime = document.getElementById("taskEnd").value
  let comment = document.getElementById("taskComm").value
  let color = document.getElementById("taskColor").value

  if (title === "" || startTime === "" || finishTime === "" || color === "" || date === "") {
    alert("Check the inputs they can not be empty! :/\nYou can leave comment empty!")
    return
  }

  if (startTime >= finishTime) {
    alert("finish time can not be before start time, it's not time travel")
    return
  }

  if (checkDuplicateTasks(date, startTime, finishTime)) {
    alert("A task with the same start and end time already exists")
    return
  }
  if (!checkUniqueColor(color, tasks)) {
    alert("A task with the same color already exists. Please choose a unique color")
    return
  }

  let newTask = {
    title: title,
    day: date,
    date: `${getMyYear()}-${getMyMonth()}-${date}`,
    startTime: startTime,
    finishTime: finishTime,
    completed: false,
    comment: comment,
    color: color
  }
  console.log(newTask);

  save(newTask)

  showTasks(getTasksOfDay(getMyDay()))
  clearinputs()
  closePopup(document.getElementById("popup"))
  
}
