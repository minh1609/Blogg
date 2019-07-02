const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    };
    const session = Buffer.from(JSON.stringify(sessionObject)).toString(
        "base64"
    );
    const sig = keygrip.sign("express:sess=" + session);

    return { session, sig };
};

// const session = "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWQxNmU1NDM5ZWEwYmIyZWEwMmRkM2Y0In19"
// > const Keygrip = require("keygrip")
// > const keygrip = new Keygrip(["123123123"])
// > keygrip.sign("express:sess="+session)
// 'Mgc2MrAFKnWx5oXz9jUZOFnKkEk'
