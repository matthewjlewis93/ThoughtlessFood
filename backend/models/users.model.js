import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      expires: 0,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const userData = mongoose.model("User", userSchema);

export default userData;