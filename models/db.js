const mongoose = require('mongoose')

/**
 * ### Supported methods
 * - `Model.deleteMany()`
 * - `Model.deleteOne()`
 * - `Model.find()`
 * - `Model.findById()`
 * - `Model.findByIdAndDelete()`
 * - `Model.findByIdAndRemove()`
 * - `Model.findByIdAndUpdate()`
 * - `Model.findOne()`
 * - `Model.findOneAndDelete()`
 * - `Model.findOneAndRemove()`
 * - `Model.findOneAndReplace()`
 * - `Model.findOneAndUpdate()`
 * - `Model.replaceOne()`
 * - `Model.updateMany()`
 * - `Model.updateOne()`
 */
const Schema = {
    connections: new mongoose.Schema({
        socketId: {
            type: String,
            required: true,
            trim: false
        },
        key: {
            client: {
                public: {
                    type: String,
                    required: true,
                    trim: false
                }
            },
            server: {
                public: {
                    type: String,
                    required: true,
                    trim: false
                },
                private: {
                    type: String,
                    required: true,
                    trim: false
                }
            }
        },
        username: {
            type: String,
            required: false,
            trim: false
        },
    }, {
        timestamps: true
    }),
    users: new mongoose.Schema({
        username: {
            type: String,
            required: true,
            trim: false
        },
        passwordSHA512: {
            type: String,
            required: true,
            trim: false
        }
    }, {
        timestamps: true
    })
}

const db = {
    connections: mongoose.model('connections', Schema.connections),
    users: mongoose.model('users', Schema.users)
}

module.exports = db
