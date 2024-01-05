module.exports = {
    apps : [{
        name   : "MyLoginPage",
        script : "./server.js",
        env: {
            PORT: 3000,
            MONGO_URI: "mongodb+srv://maximelombardo2:wfulDjuLWYh9zRqY@cluster0.vlhtbx8.mongodb.net/?retryWrites=true&w=majority"
        }
    }]
};
