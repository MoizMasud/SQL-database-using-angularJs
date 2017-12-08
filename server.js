var express = require('express'),
  mysql = require('mysql');
  //sequence = require('sequence').Sequence;

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gyms'
});
var app = express();
var un ='';
var obj1;
// Set view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Set express added functionality
app.use(require('body-parser').urlencoded({extended: false}));
//app.use(require('express-session')({secret: 'session', resave: true, saveUninitialized: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  //console.log("get req");
  res.render('home');
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.post('/signup', function (req, res) {

  var fname = req.body.fname,
    lname = req.body.lname,
    username = req.body.username,
    dOfBirth = req.body.dOfBirth,
    membershipNo = req.body.membershipNo,
    admin = 1,
    address = req.body.address,
    phoneNo = req.body.phoneNo;

  db.query(
    "INSERT INTO user" +
    "(fname, lname, username, dOfBirth, membershipNo, admin, address, phoneNo) " +
    "VALUES " +
    "('" + fname + "', '" + lname + "', '" + username + "', '" + dOfBirth +
    "', '" + membershipNo + "', '" + admin + "', '" + address + "', '" + phoneNo + "')",
    function (err, rows) {
      if (err) {
        res.redirect('/signup');
        console.log(err);
      } else {
        res.redirect('/signup');
        console.log("success #insert");
      }
    });
});

app.get('/login', function (req, res) {
  console.log("get req");
  res.render('login');
});

app.post('/login', function (req, res) {

  var userName = req.body.userName,
    membershipNo = req.body.membershipNo;

  db.query(
    "SELECT userName " +
    "FROM user " +
    "WHERE userName = '" + userName + "' AND membershipNo = '" + membershipNo + "'",
    function (err, rows) {
      if (err) {
        console.log("err..." +err);
        res.redirect('/login');
      }
      else {
        if(rows.length <= 0 ){
          res.redirect('/login');
        }
        else {
          console.log("rows..." + rows);
          un = userName;
          console.log("local" + un);
          res.redirect('/dashboard');
        }
      }

    });
});
app.get('/createWorkout', function (req, res) {
  res.render('createWorkout');
});
app.get('/workout', function (req, res) {
  var mes = [];
  var ex = [];
  db.query(
    "SELECT *" +
    " FROM routine WHERE userName ='"+un+"'",
    function (err, rows) {
      if (err) {
        console.log("create err..." +err);
        res.redirect('/login');
      }
      else {
        console.log("create succ..." + rows);
        for(var i = 0; i < rows.length; i++){
          mes.push(rows[i]);
          console.log("index" + i +" "+ rows[i]);
        }
        //res.render('workout',{
          //mes: mes
        //});
      }
    });
  db.query(
    "SELECT *" +
    " FROM exercise",
    function (err, exer) {
      if (err) {
        console.log("create err..." +err);
        res.redirect('/login');
      }
      else {
        //console.log("create succ..." + exer);
        for(var i = 0; i < exer.length; i++){
          ex.push(exer[i]);
          //console.log("index" + i +" "+ exer[i]);
        }
        res.render('workout',{
          mes: mes,
          ex: ex
        });
      }
    });

});
app.post('/workout', function (req, res) {
  var routine = req.body.cars, exercise = req.body.cars2;
  console.log("ROOT "+ routine + " and " + req);

  db.query(
    "INSERT INTO routineexercise " +
    "(routineId, exerciseId) " +
    "VALUES ('" + routine + "', '" + exercise +"')",
    function (err, rows) {
      if (err) {
        console.log("create err..." +err);
        res.redirect('/workout');
      }
      else {
        console.log("create succ..." + rows);
        res.redirect('/workout');
      }

    });
});
app.get('/viewworkout', function (req, res) {
  var mes = [];
  db.query(
    "SELECT *" +
    " FROM routine r, exercise e, routineexercise s WHERE s.routineId = r.routineId AND e.exerciseId = s.exerciseId",
    function (err, rows) {
      if (err) {
        console.log("create err..." +err);
        res.redirect('/dashboard');
      }
      else {
        //console.log("create succ..." + rows);
        for(var i = 0; i < rows.length; i++){
          mes.push(rows[i]);
          console.log("index" + i +" "+ rows[i]);
        }
        res.render('viewWorkout',{
          mes: mes
        });
      }
    });

});



app.post('/createWorkout', function (req, res) {
  var routine = routine +1;
  var routineName = req.body.routineName,
    description = req.body.description,
    userName = un,
    id = req.body.id,
    time = req.body.time,
    date = formatDate( new Date().toLocaleString() ) ;
  db.query(
    "INSERT INTO routine " +
    "(routineId, routineName, routineDate, timetaken, userName, description) " +
    "VALUES ('"+ id +"', '"+routineName +"', '"+ date + "'," + time +",'" + userName + "', '" + description + "')",
    function (err, rows) {
      if (err) {
        console.log("create err..." +err);
        res.redirect('/createWorkout');
      }
      else {
        console.log("create succ..." + rows);
        res.redirect('/workout');
      }

    });
});

app.listen(3000, function () {
  console.log("Listening on port 3000...");
});

app.get('/dashboard', function (req, res) {
  var mes = [];
  var ave = [];
  db.query(
    "SELECT MAX(Chest) FROM bodyMeasurements WHERE userName='"+un+"'" , function (err, chest) {
      if (err) {
        console.log(err);
      } else {
        var chest = JSON.stringify(chest);
        var slice = chest.slice(15, -2);
        ave.push( slice);
        console.log("chest "+ ave);
        console.log("chest  or " + chest.RowDataPacket);
      }
    });
  db.query(
    "SELECT MAX(waist) FROM bodyMeasurements WHERE userName='"+un+"'" , function (err, waist) {
      if (err) {

      } else {
        var chest = JSON.stringify(waist);
        var slice = chest.slice(15, -2);
        ave.push( slice);//  waist);
        //console.log(ave);
      }
    });
  db.query(
    "SELECT MAX(hips) FROM bodyMeasurements WHERE userName='"+un+"'" , function (err, hips) {
      if (err) {

      } else {
        var chest = JSON.stringify(hips);
        var slice = chest.slice(14, -2);
        ave.push( slice );
      }
    });
  db.query(
    "SELECT MAX(thighs) FROM bodyMeasurements WHERE userName='"+un+"'" , function (err, thighs) {
      if (err) {

      } else {
        var chest = JSON.stringify(thighs);
        var slice = chest.slice(16, -2);
        ave.push( slice );
      }
    });
  db.query(
    "SELECT MAX(calves) FROM bodyMeasurements WHERE userName='"+un+"'" , function (err, calves) {
      if (err) {

      } else {
        var chest = JSON.stringify(calves);
        var slice = chest.slice(16, -2);
        ave.push( slice );
      }
    });
  db.query(
    "SELECT MAX(biceps) FROM bodyMeasurements WHERE userName='"+un+"'" , function (err, biceps) {
      if (err) {

      } else {
        var chest = JSON.stringify(biceps);
        var slice = chest.slice(16, -2);
        ave.push( slice );
      }
    });
  db.query(
    "SELECT MAX(weight) FROM bodyMeasurements WHERE userName='"+un+"'" , function (err, weight) {
      if (err) {

      } else {
        var chest = JSON.stringify(weight);
        var slice = chest.slice(16, -2);
        ave.push( slice );
      }
    });
  db.query(
    "SELECT MAX(height) FROM bodyMeasurements WHERE userName='"+un+"'" , function (err, height) {
      if (err) {

      } else {
        var chest = JSON.stringify(height);
        var slice = chest.slice(16, -2);
        ave.push( slice );
      }
    });


  db.query(
    "SELECT *" +
    " FROM bodyMeasurements WHERE userName ='"+un+"'",
    function (err, rows) {
      if (err) {
        console.log("create err..." +err);
        res.redirect('/login');
      }
      else {
        console.log("create succ..." + rows);
        for(var i = 0; i < rows.length; i++){
          mes.push(rows[i]);
          console.log("index" + i +" "+ rows[i]);

        }
        res.render('dashboard',{
          mes: mes,
          ave: ave
        });
      }

    });


});

//function someControllerFunc($scope, $element){

//}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
//db.end();
