import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },   // 👈 Add this
  name: String,
  desc: String,
  joinedOn: { type: Date, default: Date.now },
  points: { type: Number, default: 0 }
});

export default mongoose.model("users", userSchema);
