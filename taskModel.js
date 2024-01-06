const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const taskSchema = new Schema({
    task: {type:String, required:true},
    date: {type:Date, default:Date.now},
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User'}
})

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;