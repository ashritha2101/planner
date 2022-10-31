//variables
let tasks = {};
let titles = [];

let sign_up_button = document.getElementById("sign-up-button");
sign_up_button.addEventListener("click", displaySignUnPage);
/**
 *display register page for new users.
 *
 */
function displaySignUnPage() {
  let register_page = document.getElementById("register-page");
  register_page.style.display = "block";
  let login_page = document.getElementById("login-page");
  login_page.style.display = "none";
  let dashboard_page = document.getElementById("user-dashboard");
  dashboard_page.style.display = "none";
}
let logout_button = document.getElementById("logout_button");
logout_button.addEventListener("click", displayLoginPage);
/**
 *display login page to enter inside dashboard.
 *
 */
function displayLoginPage() {
  let register_page = document.getElementById("register-page");
  register_page.style.display = "none";
  let login_page = document.getElementById("login-page");
  login_page.style.display = "block";
  let dashboard_page = document.getElementById("user-dashboard");
  dashboard_page.style.display = "none";
}
let login_link = document.getElementById("login-link");
login_link.addEventListener("click", displayLoginPage);
/**
 *display dashboard to view tasks.
 *
 * @param {*} username
 */
function displayDashboardPage(username) {
  console.log(username)
  document.getElementById("dashboard-user").innerHTML = username;
  let register_page = document.getElementById("register-page");
  register_page.style.display = "none";
  let login_page = document.getElementById("login-page");
  login_page.style.display = "none";
  let dashboard_page = document.getElementById("user-dashboard");
  dashboard_page.style.display = "block";
}
var currentDate = new Date().toDateString();
currentDate = currentDate.split(" ");
var day = document.getElementById("day");
day.innerHTML = currentDate[0];
var date = document.getElementById("date-month-year");
date.innerHTML = `${currentDate[2]} ${currentDate[1]} ${currentDate[3]}`;
(async function () {
  defaultFunction();

})();
/**
 * fetch the tasks in api and display it in each category.
 *
 */
async function defaultFunction() {

  let taskData = await fetch("http://localhost:8000/get-task",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  let data = await taskData.json();
  tasks = await data;

  /**
   * update progress on shifting each tasks from one category to other.
   *
   */
  function updateprogress() {
    let sum = 0;
    for (let i = 0; i < Object.keys(tasks).length; i++) {
      let percent;
      if ((tasks[Object.keys(tasks)[i]].category) == "not-started") {
        percent = 0;
      }
      else if ((tasks[Object.keys(tasks)[i]].category) == "in-progress") {
        percent = 50;
      }
      else if ((tasks[Object.keys(tasks)[i]].category) == "completed") {
        percent = 100;
      }
      sum += percent;
    }
    let percentage_degree = document.getElementById("percentage-degree");
    let percentage_degree_value = Math.floor(`${sum / Object.keys(tasks).length}`)
    percentage_degree.innerHTML = `${percentage_degree_value} %`;
  }
  updateprogress();
  let notStartedList = document.getElementById("list-not-started");
  notStartedList.replaceChildren();
  let inProgressList = document.getElementById("list-in-progress");
  inProgressList.replaceChildren();
  let completedList = document.getElementById("list-completed");
  completedList.replaceChildren();
  updateCardCategories(tasks);
  titles = [];
  for (let i = 0; i < Object.keys(tasks).length; i++) {
    titles.push(tasks[Object.keys(tasks)[i]].title);
  }
}
/**
 * create the cards according to the data in json.
 *
 * @param {*} tasks
 */
function updateCardCategories(tasks) {

  for (let i = 0; i < Object.keys(tasks).length; i++) {
    createCard(tasks[Object.keys(tasks)[i]].title, tasks[Object.keys(tasks)[i]].start_date, tasks[Object.keys(tasks)[i]].end_date, `${tasks[Object.keys(tasks)[i]].category}`, `${tasks[Object.keys(tasks)[i]].actualenddate}`)
  }
}

/**
 * sort the tasks according to the direction of sort arrow.
 *
 * @param {json} tasks json containing all the task details
 * @param {string} order order in which the cards has to be sorted
 */
function sortCardCategories(tasks, order) {
  titles.sort(function (a, b) {
    var previousTask = tasks[a].start_date;
    var currentTask = tasks[b].start_date;
    if (order == "descending") {
      if (previousTask < currentTask)
        return 1;
      if (previousTask > currentTask)
        return -1;
    }
    else if (order == "ascending") {
      if (previousTask < currentTask)
        return -1;
      if (previousTask > currentTask)
        return 1;
    }
  })
  for (let i = 0; i < titles.length; i++) {
    createCard(tasks[titles[i]].title, tasks[titles[i]].start_date, tasks[titles[i]].end_date, tasks[titles[i]].category, tasks[titles[i]].actualenddate);
  }

}
/**
 * create a card dynamically with given details
 *
 * @param {string} title title of task
 * @param {date} start_date planned start date
 * @param {date} end_date planned end date
 * @param {string} category category of the task
 * @param {date} actualenddate actual end date of task
 */
function createCard(title, start_date, end_date, category, actualenddate) {

  var status;
  var leftArrow = document.createElement("img");
  leftArrow.setAttribute("class", "arrow-hover");
  var rightArrow = document.createElement("img");
  rightArrow.setAttribute("class", "arrow-hover");
  if (category == "not-started") {
    status = "list-not-started";
    rightArrow.src = "./assets/frontarrow_red.png"
  }
  else if (category == "in-progress") {
    status = "list-in-progress";
    leftArrow.src = "./assets/backarrow_yellow.png"
    rightArrow.src = "./assets/frontarrow_yellow.png"
  }
  else if (category == "completed") {
    status = "list-completed";
    leftArrow.src = "./assets/backarrow_green.png"
  }
  var task_card = document.getElementById(status);
  var task_detail_flex = document.createElement("div");
  task_detail_flex.setAttribute("class", "task_detail_flex");
  task_card.appendChild(task_detail_flex);
  var left_arrow = document.createElement("div");
  left_arrow.appendChild(leftArrow);
  var card = document.createElement("div");
  var right_arrow = document.createElement("div");
  right_arrow.appendChild(rightArrow);
  card.setAttribute("class", "card");
  card.setAttribute("id", `${title}`);
  task_detail_flex.appendChild(left_arrow);
  left_arrow.setAttribute("class", "backward-arrow");
  left_arrow.onclick = function () {
    shiftCard("left_arrow", category, title);
  }
  task_detail_flex.appendChild(card);
  task_detail_flex.appendChild(right_arrow);
  right_arrow.setAttribute("class", "forward-arrow");
  right_arrow.onclick = function () {
    shiftCard("right_arrow", category, title);
  }
  var task_details = document.createElement("div");
  var task_dates = document.createElement("div");
  card.appendChild(task_details);
  card.appendChild(task_dates);
  task_dates.setAttribute("class", "flex");
  task_details.setAttribute("class", "row-flex");
  var card_title = document.createElement("div");
  var card_edit = document.createElement("div");
  var card_delete = document.createElement("div");
  task_details.appendChild(card_title);
  task_details.appendChild(card_edit);
  task_details.appendChild(card_delete);
  card_title.setAttribute("class", "title");
  card_edit.setAttribute("class", "edit");
  card_delete.setAttribute("class", "delete");
  card_delete.setAttribute("id", `delete-button`);
  card_title.innerHTML = title;
  var edit_img = document.createElement("img");
  edit_img.setAttribute("class", "edit_image");
  edit_img.src = "assets/edit_icon.png";
  edit_img.onclick = function () {
    createEditForm(card_title.innerHTML);
  }
  card_edit.appendChild(edit_img);
  var del_img = document.createElement("img");
  del_img.setAttribute("class", "delete_image");
  del_img.onclick = function () {
    deleteSelectedTask(card_title.innerHTML);
  }
  del_img.src = "assets/delete_icon.png";
  card_delete.appendChild(del_img);
  var card_startdate = document.createElement("div");
  var card_arrow = document.createElement("div");
  var card_enddate = document.createElement("div");
  task_dates.appendChild(card_startdate);
  task_dates.appendChild(card_arrow);
  task_dates.appendChild(card_enddate);
  card_startdate.setAttribute("class", "start-date");
  let card_startdateText = document.createElement("div");
  let card_startdateValue = document.createElement("div");
  card_startdate.appendChild(card_startdateText)
  card_startdate.appendChild(card_startdateValue)
  card_enddate.setAttribute("class", "end-date");
  let card_enddateText = document.createElement("div");
  let card_enddateValue = document.createElement("div");
  card_enddate.appendChild(card_enddateText)
  card_enddate.appendChild(card_enddateValue)
  card_arrow.setAttribute("class", "arrow-button");
  var arrow_img = document.createElement("img");
  arrow_img.setAttribute("class", "arrow-img");
  arrow_img.src = "assets/arrow.png";
  card_arrow.appendChild(arrow_img);
  card_startdateText.innerHTML = "Start Date";
  card_startdateValue.innerHTML = start_date;
  card_enddateText.innerHTML = "Planned End Date"
  card_enddateValue.innerHTML = end_date;
  if (category == "completed") {
    let actualEndDate = document.createElement("div");
    card.appendChild(actualEndDate);
    let actualEndDateValue = document.createElement("div");
    let actualEndDateText = document.createElement("div");
    let actualEndDateImg = document.createElement("div");
    let actualEndDateImgbutton = document.createElement("img");
    actualEndDateImg.appendChild(actualEndDateImgbutton);
    actualEndDateImgbutton.src = "assets/arrow.png";
    actualEndDateImgbutton.setAttribute("class", "arrow-img-completed");
    actualEndDate.appendChild(actualEndDateText);
    actualEndDate.setAttribute("class", "actual-End-Date")
    actualEndDateText.setAttribute("class", "actual-End-Date-text")
    actualEndDate.appendChild(actualEndDateImg);
    actualEndDateImg.setAttribute("class", "actual-End-Date-img")
    actualEndDate.appendChild(actualEndDateValue);
    actualEndDateValue.setAttribute("class", "actual-End-Date-value")
    actualEndDateText.innerHTML = "Actual End Date";

    actualEndDateValue.innerHTML = `${actualenddate}`;
  }

}
/**
 * shift the task to the category user wishes to move
 *
 * @param {*} arrow_direction
 * @param {*} category
 * @param {*} title
 */
function shiftCard(arrow_direction, category, title) {
  shiftSelectedTask(arrow_direction, category, title);
}


var task_submit = document.getElementById("task-submit");
task_submit.addEventListener("click", displayTaskCard);
/**
 * add new task to not-started category.
 *
 */
async function displayTaskCard() {

  try {
    let title = document.getElementById("title").value;
    let start_date = document.getElementById("start_date").value;
    let end_date = document.getElementById("end_date").value;
    let users = {
      title: {
        title: title,
        start_date: start_date,
        end_date: end_date,
      },
    };

    let addTaskData = await fetch("http://localhost:8000/add-task", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(users),
    });

    if (addTaskData.ok) {
      alert(" Successfull");
    } else {
      alert("Invalid details");
    }
  } catch (error) {
    alert(error.message);
  }

  defaultFunction();

}
/**
 * shift the card and display actual end date for completed tasks.
 *
 * @param {string} arrowdirection
 * @param {string} category
 * @param {string} title
 */
async function shiftSelectedTask(arrowdirection, category, title) {

  let month1 = `${currentDate[1]}`.toLowerCase();
  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  let monthNumber = months.indexOf(month1) + 1;
  let shifttask = { arrowdirection: `${arrowdirection}`, category: `${category}`, title: `${title}`, shiftedDate: `${currentDate[3]}-${monthNumber}-${currentDate[2]}` };

  let data = await fetch("http://localhost:8000/shift-task", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(shifttask),
  });

  defaultFunction();

}


const modal = document.querySelector(".modal");
const trigger = document.querySelector(".add-task");
const closeButton = document.querySelector(".close-button");
const closeButton1 = document.querySelector(".close-button1");
function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

trigger.addEventListener("click", toggleModal);
closeButton1.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
let direction_arrow = document.getElementById("direction-arrow");
let direction_arrow_div = document.getElementById("sort");
direction_arrow_div.addEventListener("click", changeArrrowDirection);


/**
 * change the direction of sort arrow upon clicking it.
 *
 */
function changeArrrowDirection() {
  let notStartedList = document.getElementById("list-not-started");
  notStartedList.replaceChildren();
  let inProgressList = document.getElementById("list-in-progress");
  inProgressList.replaceChildren();
  let completedList = document.getElementById("list-completed");
  completedList.replaceChildren();
  let arrow_direction_src = direction_arrow.src.split(".");
  let arrow_direction = arrow_direction_src[0].split("/")[4];
  if (arrow_direction == "arrow_up") {
    direction_arrow.src = "assets/arrow_down.png";
    sortCardCategories(tasks, "descending");
  } else if (arrow_direction == "arrow_down") {
    direction_arrow.src = "assets/arrow_up.png";
    sortCardCategories(tasks, "ascending");
  }
}

var filter_button = document.getElementById("filter-task-button");
filter_button.addEventListener("click", filterTasks);

/**
 * filter the tasks accordinf to the string entered by user.
 *
 */
function filterTasks() {
  const query = document.getElementById("filter-task").value;
  if (query.length == 0) {
    alert("enter a string")
  }
  const re = RegExp(`.*${query.toLowerCase().split('').join('.*')}.*`);
  const matches = titles.filter(v => v.toLowerCase().match(re));
  let notStartedList = document.getElementById("list-not-started");
  notStartedList.replaceChildren();
  let inProgressList = document.getElementById("list-in-progress");
  inProgressList.replaceChildren();
  let completedList = document.getElementById("list-completed");
  completedList.replaceChildren();
  for (let i = 0; i < matches.length; i++) {
    createCard(tasks[matches[i]].title, tasks[matches[i]].start_date, tasks[matches[i]].end_date, tasks[matches[i]].category, tasks[matches[i]].actualenddate);
  }
}

/**
 * delete the preferred task.
 *
 * @param {*} taskname
 */
async function deleteSelectedTask(taskname) {
  let task = { taskname: `${taskname}` };
  var result = confirm("Are you sure you want to permanently delete this task?");
  if (result) {


    let data = await fetch("http://localhost:8000/delete-task", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    defaultFunction();
  }
  else {
    alert("Task not deleted")
  }
}


var oldtitle;
/**
 * create edit task form dynamically for each card with default values.
 *
 * @param {*} taskname
 */
async function createEditForm(taskname) {
  var edit_title = document.getElementById("edit-title-text");
  edit_title.value = `${tasks[taskname].title}`;
  var edit_start_date = document.getElementById("edit-start_date");
  edit_start_date.value = `${tasks[taskname].start_date}`;
  var edit_end_date = document.getElementById("edit-end_date");
  edit_end_date.value = `${tasks[taskname].end_date}`;
  document.getElementById('test').style.display = 'block';
  var dashboard = document.getElementById("dashboard");
  dashboard.style.opacity = "0.2";
  oldtitle = taskname;
}
var edit_new_data_button = document.getElementById("edit-submit-button");
edit_new_data_button.addEventListener("click", async () => {

  let new_title = document.getElementById("edit-title-text").value;
  let new_start_date = document.getElementById("edit-start_date").value;
  let new_end_date = document.getElementById("edit-end_date").value;
  let task = { old_title: `${oldtitle}`, new_title: `${new_title}`, new_start_date: `${new_start_date}`, new_end_date: `${new_end_date}` };

  let data = await fetch("http://localhost:8000/edit-task", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(task),
  });

  closePopup();
  await defaultFunction();

})
var exit_edit = document.getElementById("exit-edit");
exit_edit.addEventListener("click", closePopup);
function closePopup() {

  document.getElementById('test').style.display = 'none';
  var dashboard = document.getElementById("dashboard");
  dashboard.style.opacity = "1";
}


var reg_sign_up_button = document.getElementById("reg-sign-up");
reg_sign_up_button.addEventListener("click", registerNewUser);

/**
 * store the new user's details in json in register page.
 *
 */
async function registerNewUser() {

  let username = document.getElementById("reg-user").value;
  let password = document.getElementById("reg-password").value;
  if (username.length != 0 && password.length != 0) {
    let user = { username: `${username}`, password: `${password}` };
    let data = await fetch("http://localhost:8000/signup-page", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    document.getElementById("reg-user").value = "";
    document.getElementById("reg-password").value = "";
    displayLoginPage();
  }
  else {
    alert("enter valid details");
  }
}
var login_sign_in_button = document.getElementById("login-sign-in");
login_sign_in_button.addEventListener("click", checkLoginDetails);
/**
 * validate login credentials.
 *
 */
async function checkLoginDetails() {
  try {
    let username = document.getElementById("login-user").value;
    let password = document.getElementById("login-password").value;
    let login_data = {};
    login_data = { username: `${username}`, password: `${password}` };
    console.log(login_data);
    let loginData = await fetch("http://localhost:8000/login-page", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(login_data),
    });
    console.log(loginData);
    if (loginData.ok) {
      alert("Login Successfull");
      document.getElementById("login-user").value = "";
      document.getElementById("login-password").value = "";
      displayDashboardPage(username);
    }
    else {
      alert("Enter valid details");
    }
  }
  catch (error) {
    alert(error.message);
  }
}