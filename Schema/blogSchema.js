const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const blogSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    content:{
        type: String,
        required: [true,'Content is required']
    },
    tagline:{
        type: String,
        required: [true,'Tagline is required']
    },
    thumbnail:{
        type: String,
        required: [true,'Thumbnail is required']
    },
    date:{
        type: Date,
        required: [true,'Date is required']
    },
    author:{
        type: String,
        required: [true,'Author is required']
    },
    upvotes:{
        type: Number,
        required: true,
        default: 0
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        default: "",
        minLength: 3
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
    }
});

blogSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

exports.Blog = mongoose.models.blog || mongoose.model('blog', blogSchema);