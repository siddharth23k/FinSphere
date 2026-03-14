const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    panNumber: { type: String },
    riskAppetite: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    virtualBalance: { type: Number, default: 100000 },
    totalInvested: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);