const mongoose  = require('mongoose')

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
const linkersSchame = new mongoose.Schema({
    socketId:{
        type: String ,
        required: true,
        trim: true
    },
    key: {
        client: {
            public: {
                type: String ,
                required: true,
                trim: true
            }
        },
        server: {
            public: {
                type: String ,
                required: true,
                trim: true
            },
            private: {
                type: String ,
                required: true,
                trim: true
            }
        }
    }
}, {
    timestamps: true
});
const linkers = mongoose.model('Linkers', linkersSchame)

module.exports = linkers
