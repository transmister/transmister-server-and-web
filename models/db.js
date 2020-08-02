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
            trim: true
        },
        key: {
            client: {
                public: {
                    type: String,
                    required: true,
                    trim: true
                }
            },
            server: {
                public: {
                    type: String,
                    required: true,
                    trim: true
                },
                private: {
                    type: String,
                    required: true,
                    trim: true
                }
            }
        },
        username: {
            type: String,
            required: false,
            trim: true
        },
    }, {
        timestamps: true
    }),
    users: new mongoose.Schema({
        username: {
            type: String,
            required: true,
            trim: true
        },
        passwordSHA512: {
            type: String,
            required: true,
            trim: true
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
