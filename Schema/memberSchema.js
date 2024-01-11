const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    socialMediaHandles: {
        type: Array[String],
        required: true,
        default: []
    },
    role: {
        type: String,
        required: true
    }
}, {
    virtuals: {
        id: {
            get() {
                return this.id
            }
        },
        totalMembers: {
            get() {
                return this.members?.length
            }
        }
    },
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id;
            return ret;
        }

    }
});

export default mongoose.model('Member', memberSchema);