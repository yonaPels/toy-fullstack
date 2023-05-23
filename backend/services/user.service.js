const fs = require('fs')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('secret-puk-1234')

const users = require('../data/user.json')


module.exports = {
    query,
    getById,
    remove,
    save,
    checkLogin,
    getLoginToken,
    validateToken

}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}


function checkLogin({ username, password }) {
    var user = users.find(user => {
        return user.username === username
    })
    if (user) {
        user = {
            _id: user._id,
            fullname: user.fullname,
            score: user.score
        }
        return Promise.resolve(user)
    }
    else return Promise.reject('Invalid login')

}

function query() {
    return Promise.resolve(users)
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found!')
    return Promise.resolve(user)
}

function remove(userId) {
    users = users.filter(user => user._id !== userId)
    return _saveUsersToFile()
    // return Promise.resolve('User removed')
}

function save(user) {
    user._id = _makeId()
    users.push(user)
    return _saveUsersToFile().then(() => user)

}

function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {

        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}