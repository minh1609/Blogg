const mongoose = require("mongoose");
const exec = mongoose.Query.prototype.exec;
const redis = require("redis");
const util = require("util");

const client = redis.createClient("redis://localhost:6379");
client.get = util.promisify(client.get); // make function return a promise

//overwrite exec
mongoose.Query.prototype.exec = async function() {
    console.log("RUN QUERY");

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collections: this.mongooseCollection.name
        })
    );

    //see if we have value for key in redis
    const cacheValue = await client.get(key);
    //if we do, return it
    if (cacheValue) {
    }

    //if not, run q query to database, retrieve data from mongo

    //apply: invokes the function and allows  to pass in arguments as an array.
    const result = await exec.apply(this, arguments);
    console.log(result);
};
