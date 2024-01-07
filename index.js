const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
//const app = express.Router();
const app = express();
const User = require('./userModel');
const Task = require('./taskModel');

app.set('view engine', 'ejs');

user1 = new User({
    username: "maxime",
    password: "test",
    email: "test@test.com"
});

/*user1.save()
    .then(doc => {
        console.log(doc);
    })
    .catch(err => {
        console.error(err);
    })*/

async function checkUserInDB(username){
    try{
        const usersFound = await User.find({
            username: username
        });
        return usersFound.length > 0;
    } catch(err){
        console.error(err);
        return false;
    }
}

async function createUserInDB(user){
    if(await checkUserInDB(user.username, user.password)){
        console.log("not possible");
        return;
    }
    try{
        const doc = await user.save();
        console.log(doc);
    }
    catch(err) {
        console.error(err);
    }
}

//createUserInDB(user1);

let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json());

app.use(session({
    secret: 'goliath',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Utilisateur non trouvé.' });
            }

            const isMatch = await user.validatePassword(password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Mot de passe incorrect.' });
            }
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.findById({_id : id});
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/firstPage.html')
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.use("/public", express.static(__dirname + "/public"));

app.get('/myTasks', (req, res) => {
    if(req.isAuthenticated()){
        //res.send('<h1>Page protégée</h1>');
        Task.find({user:req.user})
            .then(tasks => {
                res.render('myTasks', {tasks:tasks});
            });
    }
    else{
        res.redirect('/login');
    }
});

app.get('/createTask', (req, res) => {
    res.sendFile(__dirname + '/views/createTask.html');
});
app.post('/createTask', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    let task = new Task({
        task: req.body.task,
        user: req.user._id
    });

    task.save()
        .then((doc) => {
            res.redirect('/myTasks');
            console.log("Task created : " + doc);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Erreur lors de la création de tâche.");
        })
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: false }),
    (req, res) => {
        res.redirect('/myTasks');
    }
);


app.get('/logout', (req, res) => {
    req.logout(function(err){
        if(err) {
            return next(err)
        }
        res.redirect('/');
    });
});

app.get('/signin', (req, res) => {
    res.sendFile(__dirname + "/views/signin.html");
})

app.post('/signin', (req, res) => {
    let user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    try{
        createUserInDB(user);
        res.redirect('/login')
    }
    catch (err) {
        console.error("User not created", err);
    }
});


module.exports=app
