const mongoose = require('mongoose');
const User = require('./userModel');
const Schema = mongoose.Schema;
const taskSchema = new Schema({
    task: {type:String, required:true},
    date: {type:Date, default:Date.now()},
    user: {type:User},
    done: {type:Boolean}
})

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;