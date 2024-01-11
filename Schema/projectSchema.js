const { Schema, model, models } = require("mongoose");

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: [true, "Project name is required"],
        maxLength: 50
    },
    description: {
        type: String,
        required: [true, "Project description is required"],
        maxLength: 700
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true],
        ref: "user"
    },
    tags: {
        type: [String],
        required: true,
        default: []
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        max: 20,
        min: 2
    },
    members: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: "user"
    },
    thumbnail: {
        type: String,
        required: true,
        default: ""
    },
    buttonClicks: {
        type: Number,
        required: true,
        default: 1
    },
    requests: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: "user"
    }
}, {
    timestamps: true,
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
})

exports.Project = models.project || model("project", projectSchema)