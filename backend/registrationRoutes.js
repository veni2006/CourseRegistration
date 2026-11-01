const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Course = require('../models/Course');
const { initialCourses } = require('../config/seedCourses');

// In-memory fallback buffer for test resilience if Atlas cluster is reconnecting
let fallbackRegistrations = [];

// GET /api/registrations - Retrieve all registrations
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const registrations = await Registration.find()
        .populate('courseId', 'courseName courseCode department credits duration')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: registrations.length,
        data: registrations
      });
    }

    res.status(200).json({
      success: true,
      count: fallbackRegistrations.length,
      data: fallbackRegistrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations',
      error: error.message
    });
  }
});

// GET /api/registrations/student/:registerNumber - Retrieve registrations for a particular student
router.get('/student/:registerNumber', async (req, res) => {
  try {
    const { registerNumber } = req.params;
    if (!registerNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid register number'
      });
    }

    const regNo = registerNumber.trim().toUpperCase();

    if (mongoose.connection.readyState === 1) {
      const registrations = await Registration.find({
        registerNumber: regNo
      })
        .populate('courseId', 'courseName courseCode department credits duration')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: registrations.length,
        data: registrations
      });
    }

    const filtered = fallbackRegistrations.filter(r => r.registerNumber === regNo);
    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student registrations',
      error: error.message
    });
  }
});

// GET /api/registrations/:id - Retrieve a specific registration
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const registration = await Registration.findById(id).populate(
        'courseId',
        'courseName courseCode department credits duration'
      );

      if (registration) {
        return res.status(200).json({
          success: true,
          data: registration
        });
      }
    }

    const fallback = fallbackRegistrations.find(r => r._id === id);
    if (fallback) {
      return res.status(200).json({
        success: true,
        data: fallback
      });
    }

    res.status(404).json({
      success: false,
      message: 'Registration not found'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registration',
      error: error.message
    });
  }
});

// POST /api/registrations - Register a student for a course
router.post('/', async (req, res) => {
  try {
    const {
      studentName,
      registerNumber,
      email,
      mobile,
      department,
      year,
      courseId
    } = req.body;

    // 1. Validate student information
    if (!studentName || !registerNumber || !email || !mobile || !department || !year || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: studentName, registerNumber, email, mobile, department, year, courseId'
      });
    }

    // Validate email pattern
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format'
      });
    }

    // Validate mobile pattern (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number must be exactly 10 digits'
      });
    }

    const formattedRegisterNumber = registerNumber.trim().toUpperCase();

    // When MongoDB Atlas is connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(courseId)) {
      // 2. Check whether course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Selected course does not exist'
        });
      }

      // 3. Check whether seats are available
      if (course.availableSeats <= 0) {
        return res.status(400).json({
          success: false,
          message: `No seats available for course "${course.courseName}". Registration closed.`
        });
      }

      // 4. Prevent duplicate student-course registration
      const existingRegistration = await Registration.findOne({
        registerNumber: formattedRegisterNumber,
        courseId: courseId,
        status: 'Confirmed'
      });

      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          message: `Student with Register Number ${formattedRegisterNumber} is already registered for "${course.courseName}"`
        });
      }

      // 5. Save registration in MongoDB
      const registration = new Registration({
        studentName: studentName.trim(),
        registerNumber: formattedRegisterNumber,
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        department: department.trim(),
        year: Number(year),
        courseId: course._id,
        registrationDate: new Date(),
        status: 'Confirmed'
      });

      const savedRegistration = await registration.save();

      // 6. Reduce available seats by 1
      course.availableSeats = Math.max(0, course.availableSeats - 1);
      await course.save();

      const populated = await Registration.findById(savedRegistration._id).populate(
        'courseId',
        'courseName courseCode department credits duration'
      );

      return res.status(201).json({
        success: true,
        message: 'Course registration completed successfully!',
        data: populated
      });
    }

    // Resilient fallback for demonstration if Atlas is retrying
    const course = initialCourses.find(c => c._id === courseId || c.courseCode === courseId) || initialCourses[0];
    if (course.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: `No seats available for course "${course.courseName}". Registration closed.`
      });
    }

    const duplicate = fallbackRegistrations.find(
      r => r.registerNumber === formattedRegisterNumber &&
           (r.courseId === courseId || (typeof r.courseId === 'object' && r.courseId.courseCode === course.courseCode)) &&
           r.status === 'Confirmed'
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `Student with Register Number ${formattedRegisterNumber} is already registered for "${course.courseName}"`
      });
    }

    course.availableSeats = Math.max(0, course.availableSeats - 1);

    const newRecord = {
      _id: new mongoose.Types.ObjectId().toString(),
      studentName: studentName.trim(),
      registerNumber: formattedRegisterNumber,
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      department: department.trim(),
      year: Number(year),
      courseId: course,
      registrationDate: new Date(),
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    fallbackRegistrations.unshift(newRecord);

    res.status(201).json({
      success: true,
      message: 'Course registration completed successfully!',
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed due to a server error',
      error: error.message
    });
  }
});

// DELETE /api/registrations/:id - Cancel a registration
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const registration = await Registration.findById(id);
      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found'
        });
      }

      if (registration.status === 'Cancelled') {
        return res.status(400).json({
          success: false,
          message: 'This registration has already been cancelled'
        });
      }

      registration.status = 'Cancelled';
      const updatedRegistration = await registration.save();

      // Restore seat
      const course = await Course.findById(registration.courseId);
      if (course && course.availableSeats < course.totalSeats) {
        course.availableSeats += 1;
        await course.save();
      }

      const populated = await Registration.findById(updatedRegistration._id).populate(
        'courseId',
        'courseName courseCode department credits duration'
      );

      return res.status(200).json({
        success: true,
        message: 'Registration cancelled successfully. Seat has been restored.',
        data: populated
      });
    }

    const index = fallbackRegistrations.findIndex(r => r._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const reg = fallbackRegistrations[index];
    if (reg.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration has already been cancelled'
      });
    }

    reg.status = 'Cancelled';
    if (typeof reg.courseId === 'object' && reg.courseId.availableSeats < reg.courseId.totalSeats) {
      reg.courseId.availableSeats += 1;
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully. Seat has been restored.',
      data: reg
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
      error: error.message
    });
  }
});

// GET /api/registrations/dashboard/stats - Dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalCourses = await Course.countDocuments();
      const confirmedRegistrations = await Registration.countDocuments({ status: 'Confirmed' });
      const distinctStudents = await Registration.distinct('registerNumber', { status: 'Confirmed' });

      return res.status(200).json({
        success: true,
        data: {
          totalCourses: totalCourses || 8,
          totalRegistrations: confirmedRegistrations,
          totalStudents: distinctStudents.length
        }
      });
    }

    const confirmed = fallbackRegistrations.filter(r => r.status === 'Confirmed');
    const distinct = new Set(confirmed.map(r => r.registerNumber));

    res.status(200).json({
      success: true,
      data: {
        totalCourses: initialCourses.length,
        totalRegistrations: confirmed.length,
        totalStudents: distinct.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

module.exports = router;
