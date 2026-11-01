const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: '12 Weeks'
    },
    credits: {
      type: Number,
      default: 3
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1']
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats is required'],
      min: [0, 'Available seats cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);

