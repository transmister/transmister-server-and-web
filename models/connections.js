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
const connectionsSchame = new mongoose.Schema({
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

connectionsSchame.statics.findBySocketId = async (socketId) => {

    const row = await connectionsSchame.findOne({ socketId })

    if(!row) throw new Error('unable to find socketId')

    return row
}

connectionsSchame.pre('save', function(next) {
    if(!await connectionsSchame.findOneAndUpdate({ socketId: this.socketId }, this)){
        next();
    }
});

const Connections = mongoose.model('Connections', connectionsSchame)

module.exports = Connections
