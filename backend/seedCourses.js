const Course = require('../models/Course');

const initialCourses = [
  {
    courseName: 'Data Structures',
    courseCode: 'CS201',
    department: 'Computer Science and Engineering',
    description: 'Fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs, with algorithmic complexity analysis.',
    duration: '12 Weeks',
    credits: 4,
    totalSeats: 60,
    availableSeats: 60
  },
  {
    courseName: 'Database Management Systems',
    courseCode: 'CS202',
    department: 'Computer Science and Engineering',
    description: 'Relational database design, ER modeling, SQL queries, normalization, transaction management, and indexing techniques.',
    duration: '12 Weeks',
    credits: 4,
    totalSeats: 60,
    availableSeats: 60
  },
  {
    courseName: 'Artificial Intelligence',
    courseCode: 'AI301',
    department: 'Artificial Intelligence and Data Science',
    description: 'Introduction to search algorithms, knowledge representation, probabilistic reasoning, game theory, and expert systems.',
    duration: '14 Weeks',
    credits: 3,
    totalSeats: 50,
    availableSeats: 50
  },
  {
    courseName: 'Machine Learning',
    courseCode: 'AI302',
    department: 'Artificial Intelligence and Data Science',
    description: 'Supervised and unsupervised learning, regression, classification, clustering, neural networks, and model evaluation.',
    duration: '14 Weeks',
    credits: 4,
    totalSeats: 50,
    availableSeats: 50
  },
  {
    courseName: 'Computer Networks',
    courseCode: 'IT203',
    department: 'Information Technology',
    description: 'OSI and TCP/IP layered architecture, routing protocols, transport layer flow control, socket programming, and network security.',
    duration: '12 Weeks',
    credits: 3,
    totalSeats: 55,
    availableSeats: 55
  },
  {
    courseName: 'Operating Systems',
    courseCode: 'CS204',
    department: 'Computer Science and Engineering',
    description: 'Process management, CPU scheduling, inter-process communication, deadlock handling, memory management, and file systems.',
    duration: '12 Weeks',
    credits: 4,
    totalSeats: 60,
    availableSeats: 60
  },
  {
    courseName: 'Web Technologies',
    courseCode: 'IT205',
    department: 'Information Technology',
    description: 'Full-stack web application development covering HTML5, CSS3, modern JavaScript, responsive design, RESTful APIs, and frontend frameworks.',
    duration: '10 Weeks',
    credits: 3,
    totalSeats: 55,
    availableSeats: 55
  },
  {
    courseName: 'Cloud Computing',
    courseCode: 'CS306',
    department: 'Computer Science and Engineering',
    description: 'Cloud architecture, virtualization, distributed storage, IaaS/PaaS/SaaS models, serverless computing, and AWS/Azure cloud fundamentals.',
    duration: '12 Weeks',
    credits: 3,
    totalSeats: 45,
    availableSeats: 45
  }
];

const seedCoursesIfNeeded = async () => {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      console.log('[Database Seed] No courses found. Seeding 8 standard college courses...');
      await Course.insertMany(initialCourses);
      console.log('[Database Seed] 8 courses seeded successfully into MongoDB Atlas.');
    } else {
      console.log(`[Database Seed] Courses already present in database (${count} courses).`);
    }
  } catch (error) {
    console.error('[Database Seed Error]', error.message);
  }
};

module.exports = { initialCourses, seedCoursesIfNeeded };

