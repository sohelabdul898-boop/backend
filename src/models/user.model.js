import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avtar: {
        type: String,//cloudnary
        required: true
    },
    coverImg: {
        type: String
    },
    WatchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true
}
)
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password =  await bcrypt.hash(this.password, 10)
})
userSchema.method.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.method.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCES_TOKEN_EXPIRE,
        }
    )
}
userSchema.method.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIREY
        }
    )
}
export const User = mongoose.model("User", userSchema)