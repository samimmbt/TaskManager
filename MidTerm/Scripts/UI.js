import { checked, getTasksOfDay } from "./MainScript";
import { getDayName, getMyDay, getMyYear, getMyMonth, getDaysFromMonth, getTime } from './TimeDate';
import { addtask } from "./DataHandler";

export function createDivElement(className, text = "", backgroundColor = "") {
  //just creating div element
  const divElement = document.createElement("div");
  divElement.classList.add(className);
  divElement.innerText = text;
  divElement.style.backgroundColor = backgroundColor;
  return divElement;
}

export function createDayContainers(numDays) {

  //part of Ui that based of month day 30 31 28 will create element
  let monthElement = document.getElementById("month");

  monthElement.innerHTML = "";

  for (let i = 1; i <= numDays; i++) {//normal loop
    let dayContainer = createDivElement("dayContainer", "")
    let toggle = 0;
    let dayText = createDivElement("dayText", i)
    let dayName = createDivElement("dayName", getDayName(`${getMyMonth()}/${i}/${getMyYear()}`))

    dayContainer.addEventListener("click", function () {
      //one use if click add class another time delete it
      if (toggle === 0) {
        dayContainer.classList.add("selectedDay")
        showTasks(getTasksOfDay(parseInt(dayText.textContent)))
        alert("Don't forget to click on me again :))")

        toggle = 1
      } else {
        dayContainer.classList.remove("selectedDay")
        toggle = 0
      }
    });

    if (i === getMyDay()) {
      //set today element class as currentDay
      dayText.classList.add("currentDay")
      document.getElementById("topRight").scrollIntoView({
        behavior: "smooth",
      });
    }
    dayContainer.appendChild(dayName)
    dayContainer.appendChild(dayText)
    monthElement.appendChild(dayContainer)
  }
}

export function addTimeNumbers() {// this will add 24 number element to ui in the left
  let parent = document.getElementById("time");
  parent.innerHTML = ""
  for (let index = 1; index <= 24; index++) {
    let time = createDivElement("time", index)
    if (index === getTime()) {
      time.classList.add("currentTime")
    } else if (getTime() === 0 && index === 24) {
      time.classList.add("currentTime")

    }
    parent.appendChild(time)
  }
}

export function scrollToCurrentDay() {//it's known from its name what will this do
  let topRightElement = document.getElementById("topRight");
  let containerOffset = topRightElement.offsetLeft; //from body i think till laft side of element
  let currentContainerOffset = document.querySelector(".dayText.currentDay").offsetLeft; // its offset
  let scrollPosition = currentContainerOffset - containerOffset - (topRightElement.offsetWidth / 2);
  topRightElement.scroll({
    left: scrollPosition,
    behavior: "smooth"
  });

}

export function scrollToCurrentTime() {//it's known from its name what will this do
  let topRightElement = document.getElementById("time");
  let containerOffset = topRightElement.offsetTop;
  let elem = document.querySelector(".time.currentTime")
  if (elem != null) {
    let currentContainerOffset = elem.offsetTop;
    let scrollPosition = currentContainerOffset - containerOffset - (topRightElement.offsetHeight / 2);
    topRightElement.scroll({
      top: scrollPosition,
      behavior: "smooth"
    });
  }
}

export function changeTheme() {
  //for version 2
}

function toggleDone(i) {
  console.log(document.getElementById(i));
}

function pointToWork() {
  //for version 2

}

function setAsDone(params) {

}

function add() {
  document.getElementById("popup").style.display = "flex"
}
//booooooooooooooooooooooooooooooomm
export function showTasks(data) { //a heavy function for showing tasks its better you dont waste your time here it works 
  let isDone = false
  let job = document.getElementById('jobsContainer')
  let itemsContainer = document.querySelector(".panel.bottom.left.panel_bg1.shadow-bg1")
  let svg = `<svg fill="currentColor" class="plus" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>`
  //plus icon using svg
  let plus = createDivElement("add")
  job.innerHTML = `<div style="margin-top: 2450px"></div>`
  itemsContainer.innerHTML = ""
  // console.log("show task: "+data); //for test uses
  if (typeof data !== 'undefined') {
    // console.log(data[1]); //for test uses
    for (let i = 0; i < data.length; i++) {
      let workItem = createDivElement("workItem")
      let checkBox = document.createElement("input")
      let title = createDivElement("title", data[i].title)
      let color = createDivElement("color", "", data[i].color)
      //bar items: column like things
      let bar = document.createElement("a")
      let lable = document.createElement("label")
      const barHeight = calculateBarHeight(data[i].starttime, data[i].finishtime);
      const marginTop = calculateMarginTop(data[i].starttime);
      let id = data[i].id
      title.id=`t${i}`
      if (data[i].completed) {// check task as done
        title.classList.add("done")
        checkBox.checked = true
      }
      checkBox.addEventListener("change", ()=>{

        if(checkBox.checked){
          document.getElementById(`t${i}`).classList.add("done")
          isDone = true
        }else{
        document.getElementById(`t${i}`).classList.remove("done")
        isDone = false
      }
      const data = {
        id: id,
        completed:isDone
      }
      checked(data)
      location.reload()
      })
      workItem.addEventListener("click",()=>{

      })
      color.addEventListener("click", pointToWork)

      lable.classList.add('checkBoxLable')
      lable.style.backgroundColor = data[i].color
      lable.addEventListener("click", setAsDone())
      lable.setAttribute("for", id)
      lable.innerHTML = `<svg viewBox="0,0,50,50">
    <path d="M5 30 L 20 45 L 45 5"></path>
    </svg>`; // check box svg tick shape

      bar.classList.add("bar")
      bar.href = "./job?id=" + id
      bar.style.backgroundColor = data[i].color

      checkBox.classList.add("checkbox_input")
      checkBox.type = "checkBox"
      checkBox.id = id

      bar.style.height = barHeight + 'px';
      bar.style.marginTop = marginTop + 'vh';

      workItem.appendChild(title)
      workItem.appendChild(color)
      itemsContainer.appendChild(workItem)
      bar.appendChild(checkBox)
      bar.appendChild(lable)
      job.appendChild(bar);

    }
    plus.innerHTML = svg
    plus.addEventListener("click", add)
    itemsContainer.appendChild(plus)
  } else {
    console.log("data not found");
    return
  }
}

function calculateBarHeight(startTime, finishTime) { //for bar items height here i convert hour to height its not that good but it works
  const startHour = parseInt(startTime.slice(0, 2));
  const finishHour = parseInt(finishTime.slice(0, 2));
  const timeDifference = Math.abs(finishHour - startHour);
  // console.log(timeDifference);

  return 7 + timeDifference * 100;
}

function calculateMarginTop(startTime) {
  let baseMarginTop = 9;
  const heightPerElement = 12;
  let margin = 5
  let startHour = parseInt(startTime.slice(0, 2))
  if (startHour > 1 && startHour <= 12) {
    baseMarginTop = 5
    margin = baseMarginTop + (startHour * heightPerElement)
  } else if (startHour >= 13 && startHour <= 22) {
    baseMarginTop = 7
    margin = baseMarginTop + (startHour * (heightPerElement + 0.2))
  } else {
    baseMarginTop = 9
    margin = baseMarginTop + (startHour * (heightPerElement + 0.4))
  }
  return margin
}

export function closePopup(item) {
  item.style.display = "none"
}

export function fillDeital(array) {// dont check it its correct :/ when it works its good :))
  array.then((result) => {
    document.getElementById("taskTitle").value = result.title
    document.getElementById("taskStart").value = result.starttime
    document.getElementById("taskEnd").value = result.finishtime
    document.getElementById("taskComm").value = result.comment
    document.getElementById("taskColor").value = result.color
    document.getElementById("completed").value = result.completed
    document.getElementById("date").value = result.date.slice(0, 10)
    document.getElementById("day").value = result.day

  })
}
