function getMonthFromYear(year) {
  let monthList = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // Assuming that the year entered is a positive integer
  if (year > 0) {
    return monthList[(year % 12) - 1];
  } else {
    return "Invalid year entered.";
  }
}

function getDaysFromMonth(month) {
  let daysInMonth = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
  };

  // Check if the month entered is valid
  if (month in daysInMonth) {
    return daysInMonth[month];
  } else {
    return "Invalid month entered.";
  }
}

function getDayName(fullDate) {
  let dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(fullDate).getDay()];
  return dayName;
}

function getMyDay() {
  let timestamp = Date.now(); // Get the current timestamp
  let date = new Date(timestamp); // Create a new Date object from the timestamp
  return date.getDate();
}

function getMyMonth() {
  let timestamp = Date.now(); // Get the current timestamp
  let date = new Date(timestamp); // Create a new Date object from the timestamp
  return date.getMonth() + 1;
}

function getMyYear() {
  let timestamp = Date.now(); // Get the current timestamp
  let date = new Date(timestamp); // Create a new Date object from the timestamp
  return date.getFullYear()
}

function getTime() {
  let time = Date.now()
  let timeItem = new Date(time)
  return timeItem.getHours()
}

export {getDayName,getMyDay,getMyMonth,getMyYear,getDaysFromMonth,getMonthFromYear,getTime}