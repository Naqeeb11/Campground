//bug encounter in use of flash while registering  !!twice needed to click

var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),   
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    seedDB                = require("./seed");

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

//connection using environment variable-generally used to hide information
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});//this line protects our data privacy
//mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// mongoose.connect("mongodb+srv://naqeeb:1234@yelpcamp-6dkey.mongodb.net/test?retryWrites=true&w=majority",
//  {useNewUrlParser: true, useCreateIndex: true ,useUnifiedTopology: true, useFindAndModify: false
// }).then(() => {
//      console.log("Connected to db");
//  }).catch(err => {
//      console.log("error", err.message);
//  });
//  mongoose.connect("mongodb+srv://naqeeb:1234@yelpcamp-6dkey.mongodb.net/test?retryWrites=true&w=majority",
//   {useNewUrlParser: true, useCreateIndex: true ,useUnifiedTopology: true, useFindAndModify: false
//  });




app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//Passport Configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Control display of login, signup and logout - Middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

if(process.env.PORT)
{
 app.listen(process.env.PORT, function(){
     console.log("server started at designated port");
 });
} else {
    app.listen(900, function(){
        console.log("server started at port 900");
});
}
