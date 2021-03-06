const mongoose = require("mongoose");
const exec = mongoose.Query.prototype.exec;
const redis = require("redis");
const util = require("util");
const keys = require("../config/keys");

const client = redis.createClient(process.env.REDIS_URL || keys.redisUrl);
client.hget = util.promisify(client.hget); // make function return a promise

//cache(): Querry make use of cahe server
mongoose.Query.prototype.cache = function(option = {}) {
    //"this" reference query
    this.useCache = true;

    this.hashKey = JSON.stringify(option.key || "");
    return this;
};
//overwrite exec in query
mongoose.Query.prototype.exec = async function() {
    //"this" reference Query

    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    //whenever mongoose need to go to DB to get data, it go to redis first

    //get key from querry
    const key = JSON.stringify(
        Object.assign(
            {},
            this.getQuery(), //getQuery() return {_id:asdasdsad} {_user:asddweqsd}, in this case, there are 2 query send to database
            // {_id: ... } : find user has this id
            //{_user:asddweqsd}: fetch blog post belong to current user
            {
                collections: this.mongooseCollection.name // blogs, users
            }
        )
    );

    //see if we have value for key in redis
    const cacheValue = await client.hget(this.hashKey, key);
    //if we do, return data from redis
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        if (Array.isArray(doc)) {
            //model(arg) return model model
            //mongoose expect to get a Model object back, not JSON
            return doc.map(d => new this.model(d));
        } else {
            return new this.model(doc);
        }
    }

    //if not, go to DB, retrieve data from that, then store data in cache server

    //apply: invokes the function and allows  to pass in arguments as an array.
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result));
    return result;
};

module.exports = {
    //delete data in Redis base on hashkey
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
