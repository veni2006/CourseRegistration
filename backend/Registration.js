const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    registerNumber: {
      type: String,
      required: [true, 'Register number is required'],
      trim: true,
      uppercase: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Year of study is required'],
      min: [1, 'Year must be at least 1'],
      max: [5, 'Year cannot exceed 5']
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required']
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed'
    }
  },
  {
    timestamps: true
  }
);

// Index to help search and prevent duplicate registrations quickly
registrationSchema.index({ registerNumber: 1, courseId: 1, status: 1 });

module.exports = mongoose.model('Registration', registrationSchema);

