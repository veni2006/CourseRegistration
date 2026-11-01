const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const { initialCourses } = require('../config/seedCourses');

// Working memory copy initialized from seed
let dynamicCourses = initialCourses.map((c, index) => ({
  ...c,
  _id: `67253a6a1234567890abcdef0${index + 1}`
}));

// GET /api/courses - Retrieve all available courses
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const courses = await Course.find().sort({ createdAt: 1 });
      if (courses.length > 0) {
        return res.status(200).json({
          success: true,
          count: courses.length,
          data: courses
        });
      }
    }

    res.status(200).json({
      success: true,
      count: dynamicCourses.length,
      data: dynamicCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
      error: error.message
    });
  }
});

// GET /api/courses/:id - Retrieve an individual course
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const course = await Course.findById(id);
      if (course) {
        return res.status(200).json({
          success: true,
          data: course
        });
      }
    }

    const matched = dynamicCourses.find(
      c => c._id === id || c.courseCode.toUpperCase() === id.toUpperCase()
    );

    if (matched) {
      return res.status(200).json({
        success: true,
        data: matched
      });
    }

    res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course',
      error: error.message
    });
  }
});

// POST /api/courses - Add a new course
router.post('/', async (req, res) => {
  try {
    const {
      courseName,
      courseCode,
      department,
      description,
      duration,
      credits,
      totalSeats,
      availableSeats
    } = req.body;

    if (!courseName || !courseCode || !department || totalSeats === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseName, courseCode, department, and totalSeats'
      });
    }

    const code = courseCode.trim().toUpperCase();

    if (mongoose.connection.readyState === 1) {
      const existing = await Course.findOne({ courseCode: code });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Course with code ${code} already exists`
        });
      }

      const newCourse = new Course({
        courseName: courseName.trim(),
        courseCode: code,
        department: department.trim(),
        description: description || '',
        duration: duration || '12 Weeks',
        credits: Number(credits) || 3,
        totalSeats: Number(totalSeats),
        availableSeats: availableSeats !== undefined ? Number(availableSeats) : Number(totalSeats)
      });

      const saved = await newCourse.save();
      return res.status(201).json({
        success: true,
        message: 'Course added successfully',
        data: saved
      });
    }

    // Dynamic memory fallback
    if (dynamicCourses.some(c => c.courseCode.toUpperCase() === code)) {
      return res.status(400).json({
        success: false,
        message: `Course with code ${code} already exists`
      });
    }

    const newObj = {
      _id: new mongoose.Types.ObjectId().toString(),
      courseName: courseName.trim(),
      courseCode: code,
      department: department.trim(),
      description: description || '',
      duration: duration || '12 Weeks',
      credits: Number(credits) || 3,
      totalSeats: Number(totalSeats),
      availableSeats: availableSeats !== undefined ? Number(availableSeats) : Number(totalSeats)
    };

    dynamicCourses.push(newObj);

    res.status(201).json({
      success: true,
      message: 'Course added successfully',
      data: newObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add course',
      error: error.message
    });
  }
});

// PUT /api/courses/:id - Update course details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Course.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (updated) {
        return res.status(200).json({
          success: true,
          message: 'Course updated successfully',
          data: updated
        });
      }
    }

    const index = dynamicCourses.findIndex(c => c._id === id || c.courseCode.toUpperCase() === id.toUpperCase());
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    dynamicCourses[index] = { ...dynamicCourses[index], ...req.body };

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: dynamicCourses[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
});

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Course.findByIdAndDelete(id);
      if (deleted) {
        return res.status(200).json({
          success: true,
          message: 'Course deleted successfully',
          data: deleted
        });
      }
    }

    const index = dynamicCourses.findIndex(c => c._id === id || c.courseCode.toUpperCase() === id.toUpperCase());
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const deleted = dynamicCourses.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
});

module.exports = router;
