import mongoose, { isObjectIdOrHexString } from "mongoose";

const UserSchema = new mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,

});

export default mongoose.model("User", UserSchema, "current_users");