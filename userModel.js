const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: String,
});

userSchema.pre('save', function(next) {
    if(this.isModified('password') || this.isNew){
        const document = this;
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if(err) {
                next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        });
    } else {
        next();
    }
})

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);

module.exports= User;