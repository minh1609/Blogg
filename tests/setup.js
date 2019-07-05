// contain all data test need to run
require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

//after 5s, test become fail
jest.setTimeout(5000);
