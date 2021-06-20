import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose  from 'mongoose';

import indexRouter from '../Routes/index';
import contactRouter from '../Routes/contact';


//modules for authentication
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';

//authentication objects
let localStrategy = passportLocal.Strategy; //alias


//App Configuration
const app = express();
export default app;

//DB configuration
import * as DBConfig from "./db";
mongoose.connect(DBConfig.LocalURI, {useNewUrlParser:true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
  console.log(`Conected to MongoDB at: ${DBConfig.HostName}`);
});

// view engine setup
app.set('views', path.join(__dirname, '../Views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../Client')));
app.use(express.static(path.join(__dirname, "../../node_modules")));


//Routing happens now
app.use('/', indexRouter);
app.use('/contact-list', contactRouter); //Defines a new area of our website called contact-list

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err : createError.HttpError, req : express.Request, res : express.Response, next : express.NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
