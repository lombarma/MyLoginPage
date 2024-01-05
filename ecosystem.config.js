module.exports = {
    apps : [{
        name   : "MyLoginPage",
        script : "./server.js",
        env: {
            PORT: process.env.PORT,
            MONGO_URI: process.env.MONGO_URI
        }
    }]
};
