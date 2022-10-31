const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
// render main page.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// fetch the tasks in json.
app.get("/get-task", (req, res) => {
  let taskdata = JSON.parse(fs.readFileSync("./data/task.json"));
  res.send(taskdata);
});
//delete a task from json.
app.post("/delete-task", function (req, res) {
  var task = JSON.parse(fs.readFileSync("./data/task.json"));
  let username = req.body.taskname;
  delete task[username];
  task = JSON.stringify(task);
  fs.writeFile("./data/task.json", task, () => { });
  res.end();
});
//move a task from one category to other.
app.post("/shift-task", function (req, res) {
  var task = JSON.parse(fs.readFileSync("./data/task.json"));
  let title = req.body.title;
  let arrowdirection = req.body.arrowdirection;
  let category = req.body.category;
  let shiftedDate = req.body.shiftedDate;

  let progress;
  let actualEndDate;
  if (category == "not-started" && arrowdirection == "right_arrow") {
    progress = "in-progress";
    actualEndDate = "";
  }
  else if (category == "in-progress" && arrowdirection == "left_arrow") {
    progress = "not-started";
    actualEndDate = "";
  }
  else if (category == "in-progress" && arrowdirection == "right_arrow") {
    progress = "completed";
    actualEndDate = shiftedDate;
  }
  else if (category == "completed" && arrowdirection == "left_arrow") {
    progress = "in-progress";
    actualEndDate = "";
  }
  task[title].category = `${progress}`;
  task[title].actualenddate = `${actualEndDate}`;
  task = JSON.stringify(task);
  fs.writeFile("./data/task.json", task, () => { });
  res.end();
});
// add a new task to json.
app.post("/add-task", function (req, res) {
  let data = JSON.parse(fs.readFileSync("./data/task.json"));
  let title = req.body.title.title;
  let start_date = req.body.title.start_date;
  let end_date = req.body.title.end_date;
  let actualenddate;
  if (title.length != 0 && start_date.length != 0 && end_date.length != 0) {
    data[`${title}`] = {
      title: `${title}`,
      start_date: `${start_date}`,
      end_date: `${end_date}`,
      category: "not-started",
      actualenddate: "",
    };
    data = JSON.stringify(data);
    fs.writeFile("./data/task.json", data, () => { });
    res.status(200).send("entered successfully");
    res.end();
  } else {
    res.status(404).send("Enter valid info");
    res.end();
  }
});
//edit a already existing task and display in dashboard.
app.post("/edit-task", function (req, res) {
  var task = JSON.parse(fs.readFileSync("./data/task.json"));

  let old_title = req.body.old_title;
  let new_title = req.body.new_title;
  let new_start_date = req.body.new_start_date;
  let new_end_date = req.body.new_end_date;
  let old_category = task[old_title].category;
  let old_actualenddate = task[old_title].actualenddate;

  res.end();
  if (new_title.length != 0 && new_start_date.length != 0 && new_end_date.length != 0) {
    delete task[old_title];
    task[`${new_title}`] = {
      title: `${new_title}`,
      start_date: `${new_start_date}`,
      end_date: `${new_end_date}`,
      category: `${old_category}`,
      actualenddate: `${old_actualenddate}`,
    };

    task = JSON.stringify(task);
    fs.writeFile("./data/task.json", task, () => { });
    res.end();

  }
  else {
    alert("enter valid values");
  }
});
//listen to port number 8000.
app.listen(8000);

//store new user's details in json.
app.post("/signup-page", function (req, res) {
  let username = req.body.username;
  let passwd = req.body.password;
  let data = JSON.parse(fs.readFileSync("./data/data.json"));
  console.log(data);
  if (data.hasOwnProperty(username)) {
    res.status(404).send("user already exist!");
    res.end();
  }
  else if (username.length != 0 && passwd.length != 0) {
    data[`${username}`] = {
      username: `${username}`,
      password: `${passwd}`,
    };
    data = JSON.stringify(data);
    fs.writeFile("./data/data.json", data, () => { });
    res.status(200).send("registered successfully");
    res.end();
  }
  else {
    res.status(404).send("Enter valid credentials");
    res.end();
  }
});
// validate login details.
app.post("/login-page", function (req, res) {
  let data = JSON.parse(fs.readFileSync("./data/data.json"));
  let username = req.body.username;
  let passwd = req.body.password;
  if (data.hasOwnProperty(username)) {
    console.log(data[username]);
    if (data[username].password == passwd) {
      res.status(200).send("Login successfull");
      res.end();
    }
    else {
      res.status(404).send("Invalid password");
      res.end();
    }
  }
  else {
    res.status(404).send("Username not found");
    res.end();
  }
});