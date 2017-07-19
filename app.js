const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const flash        = require('connect-flash');
const cors         = require('cors');

require('dotenv').config();

//(this sets up passport and our strategies)
require('./config/passport-config.js');


mongoose.connect('mongodb://localhost/planner-app'); // this is hardcoded that's why needs to be replaced
// mongoose.connect(process.env.MONGODB_URI);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
// app.locals.title = 'Express - Generated with IronGenerator';
app.locals.title = 'Planner-app';


//MIDDLEWARES COME BEFORE THE ROUTES

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

//we add this line of code after installing express-session
app.use(session({
  secret:'my planner app',
  resave: true,
  saveUninitialized: true
 }) );

 app.use(flash()); //this middleware has to come after session()

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  credentials: true,
  origin: [ 'http://localhost:4200' ]
}));


app.use ((req, res, next)=>{
  if(req.user){
    res.locals.user = req.user; // !!!!!!
  }
  next();
});

// ------ routes go here: -----------


const index = require('./routes/index');
app.use('/', index);

const myAuthRoutes = require('./routes/auth-routes.js');
app.use ('/', myAuthRoutes);

const myUserRoutes = require('./routes/user-routes.js');
app.use ('/', myUserRoutes);

const myTravelPlanRoutes = require('./routes/travelPlan-routes.js');
app.use('/', myTravelPlanRoutes);

const myCustomPlanRoutes = require('./routes/customPlan-routes.js');
app.use('/', myCustomPlanRoutes);

// ---------------------------------
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
