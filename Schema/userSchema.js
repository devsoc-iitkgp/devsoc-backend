const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    mobile: {
        type: Number,
        required: [true, 'Mobile Number is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    institute: {
        type: String,
        required: [true, 'Institute Name is required']
    },
    yearOfStudy: {
        type: Number,
        required: [true, 'Year of Study is required']
    },
    interests: {
        type: [String],
        required: true,
        default: []
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    bookmarks: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: "project"
    }
}, {
    virtuals: {
        id: {
            get() {
                return this._id
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
    },
});

userSchema.plugin(uniqueValidator, { error: '{PATH} already exists' })

exports.User = mongoose.models.user || mongoose.model("user", userSchema)