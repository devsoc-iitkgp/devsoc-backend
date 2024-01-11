const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    mobNum: {
        type: Number,
        required: [true, 'Mobile Number is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    instituteName: {
        type: String,
        required: [true, 'Institute Name is required']
    },
    yearOfStudy: {
        type: Number,
        required: [true, 'Year of Study is required']
    },
    interests: {
        type: Array[String],
        required: true,
        default: []
    },
    projects: {
        type: Array[Schema.Types.ObjectId],
        required: true,
        default: []
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    bookmarks: {
        type: Array[Schema.Types.ObjectId],
        required: true,
        default: []
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

export default mongoose.model('User', userSchema);