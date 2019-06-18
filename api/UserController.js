const userService = require("../service/UserService");
const accountService = require("../service/AccountService");
const docService = require("../service/DocService");

const async = require('async');


//================================================================
const login = (result) => {
    userService.login(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, result: fResp.data, msg: "Giriş Başarılı" });
            result.res.status(200).end();
        }
    });
}

//================================================================
const register = (result) => {
    async.waterfall(
        [
            function(callback) {
                userService.register(result, (fResp) => {
                    if (fResp.err !== undefined) {
                        result.res.json({ success: false, error: fResp.err });
                        result.res.status(404).end();
                    } else {
                        callback(null, fResp.data.insertedItem);
                    }
                })
            },
            function(insertedItem, callback) {
                accountService.register(result, insertedItem, (fResp) => {
                    if (fResp.err !== undefined) {
                        result.res.json({ success: false, error: fResp.err });
                        result.res.status(404).end();
                    } else {
                        callback(null, insertedItem);
                    }
                })
            },
            function(insertedItem, callback) {
                userService.sendSimpleEmail4Register(insertedItem, (fResp) => {
                    if (fResp.err !== undefined) {
                        result.res.json({ success: false, error: fResp.err });
                        result.res.status(404).end();
                    } else {
                        result.res.json({ success: true, msg: "Hesabınızı aktif etmek için üye olduğunuz mail adresinizi kontrol ediniz.." })
                        callback(null, "");
                    }
                })
            }
        ],
        function(err) {
            console.log(err);
        }
    )
}

//================================================================
const allUser = (result) => {
    userService.allUser(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, result: fResp.data });
            result.res.status(200).end();
        }
    });
}

//================================================================
const getUser = (result) => {
    userService.getUser(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, result: fResp.data });
            result.res.status(200).end();
        }
    })
}

//================================================================
const updateUser = (result) => {
    userService.updateUser(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, result: fResp.data });
            result.res.status(200).end();
        }
    });
}

//================================================================
const sendEmail4ForgetPassword = (result) => {
    async.waterfall([
            function(callback) {
                userService.updateUser(result, (fResp) => {
                    if (fResp.err !== undefined) {
                        result.res.json({ success: false, error: fResp.err })
                        result.res.status(400).end();
                    } else callback(null, fResp.data);
                })
            },
            function(updatedItem, callback) {
                userService.sendEmail4ForgetPassword(updatedItem, (fResp) => {
                    if (fResp.err !== undefined) {
                        result.res.json({ success: false, error: fResp.err });
                        result.res.status(404).end();
                    } else {
                        result.res.json({ success: true, result: fResp.data, msg: "Şifrenizi tekrar almanız için mail gönderilmiştir" });
                        result.res.status(200).end();
                    }
                });
            }
        ],
        function(err) {
            console.log(err);
        }
    )

}




//================================================================
module.exports = {
    login,
    register,
    allUser,
    getUser,
    updateUser,
    sendEmail4ForgetPassword
};