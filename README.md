# College Course Registration System (MEAN Stack)

A complete, professional, and beginner-friendly College Course Registration Application built using the **MEAN Stack** (MongoDB Atlas, Express.js, Angular, Node.js). Developed specifically for academic practical examinations and project demonstrations.

---

## 1. Project Overview

The College Course Registration System provides a web portal for college students to:
1. **Browse Available Courses:** View catalog of 8 core engineering courses with department, duration, credits, and live seat vacancies.
2. **Inspect Course Details:** Examine course syllabus, objectives, credit values, and prerequisites via dedicated detail modals.
3. **Register for Courses:** Submit an Angular Reactive Form with robust client-side and server-side validation.
4. **Track Enrollments:** Review confirmed registrations on the *My Registrations* table.
5. **Cancel Registrations:** Cancel an enrollment with confirmation dialog, which automatically restores 1 seat back to the course.
6. **Live Academic Dashboard:** Monitor total courses, active registrations, and unique student counts in real-time.
7. **Cloud Persistence:** Permanent storage in **MongoDB Atlas** under the `college_course_registration` database.

---

## 2. Technology Stack

- **Frontend:** Angular (TypeScript, Reactive Forms, Component Architecture, Services, Router, HttpClient, Bootstrap 5, Bootstrap Icons)
- **Backend:** Node.js, Express.js, Express Router, CORS, Dotenv
- **Database & ODM:** MongoDB Atlas (Cloud Cluster: `StudentCluster`), Mongoose
- **Styling:** Custom Blue & White Academic Theme (`#0d47a1`, `#1565c0`)

---

## 3. Project File Structure

```
CourseRegistration/
│
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB Atlas connection with DNS & retry handling
│   │   └── seedCourses.js        # Initial seed dataset with 8 core engineering courses
│   ├── models/
│   │   ├── Course.js             # Mongoose schema for course catalog
│   │   └── Registration.js       # Mongoose schema for student registrations
│   ├── routes/
│   │   ├── courseRoutes.js       # REST APIs for course CRUD operations
│   │   └── registrationRoutes.js # REST APIs for enrollments, cancellation, and stats
│   ├── server.js                 # Express application entry point (Port 5000)
│   ├── .env                      # Environment variables (PORT, MONGO_URI)
│   ├── .env.example              # Sample environment template (safe for Git)
│   ├── .gitignore                # Excludes node_modules and .env
│   └── package.json              # Backend dependencies and run scripts
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── navbar/           # Navigation bar with mobile toggle
│   │   │   │   ├── home/             # Academic dashboard with stats and featured courses
│   │   │   │   ├── course-list/      # Course catalog with search, department filter & modal
│   │   │   │   ├── course-card/      # Reusable course card component with seat badges
│   │   │   │   ├── registration-form/# Reactive registration form with validations
│   │   │   │   └── my-registrations/ # Registrations table with cancellation confirmation
│   │   │   ├── services/
│   │   │   │   ├── course.service.ts       # HttpClient communication with /api/courses
│   │   │   │   └── registration.service.ts # HttpClient communication with /api/registrations
│   │   │   ├── models/
│   │   │   │   ├── course.model.ts         # TypeScript interfaces for courses
│   │   │   │   └── registration.model.ts   # TypeScript interfaces for registrations & stats
│   │   │   ├── app.routes.ts         # Angular routes configuration
│   │   │   ├── app.config.ts         # Application providers (Router, HttpClient)
│   │   │   ├── app.ts                # Root component definition
│   │   │   ├── app.html              # Layout shell with Navbar, RouterOutlet & Footer
│   │   │   └── app.css               # Component specific styling
│   │   ├── styles.css                # Global theme variables, tables, badges, cards
│   │   ├── index.html                # HTML entry point with Bootstrap 5 and Google Fonts
│   │   └── main.ts                   # Angular client bootstrap
│   ├── angular.json                  # Angular CLI configuration
│   ├── package.json                  # Frontend dependencies and build scripts
│   ├── tsconfig.json                 # TypeScript compiler configuration
│   └── .gitignore
│
├── .gitignore                        # Root gitignore protecting credentials and node_modules
└── README.md                         # Complete project documentation
```

---

## 4. Installed Packages

### Backend (`backend/package.json`):
- `express` (`^4.21.2`): Fast, unopinionated web framework for Node.js REST APIs.
- `mongoose` (`^8.9.2`): Elegant MongoDB object modeling for Node.js.
- `cors` (`^2.8.5`): Middleware to allow cross-origin requests from the Angular development server.
- `dotenv` (`^16.4.7`): Loads environment variables from `.env`.
- `nodemon` (`^3.1.9`): Development tool for automatic server restart upon code changes.

### Frontend (`frontend/package.json`):
- `@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`, `@angular/common/http`: Official Angular framework packages.
- `@angular/cli`: Angular command-line tool.
- `rxjs`: Reactive Extensions for asynchronous stream handling.
- `zone.js`: Zone support for Angular change detection.
- `bootstrap 5.3.3` & `bootstrap-icons 1.11.3`: Modern styling and iconography.

---

## 5. MongoDB Database Configuration

- **Cluster:** `StudentCluster` on MongoDB Atlas
- **Database:** `college_course_registration`
- **Collections:**
  1. `courses`: Stores academic course catalog records.
  2. `registrations`: Stores student enrollment records.

### Course Schema Fields:
- `courseName`: String (required, trimmed)
- `courseCode`: String (required, unique, uppercase, trimmed)
- `department`: String (required, trimmed)
- `description`: String (course syllabus summary)
- `duration`: String (e.g., `"12 Weeks"`)
- `credits`: Number (e.g., `3` or `4`)
- `totalSeats`: Number (e.g., `60`)
- `availableSeats`: Number (cannot drop below `0`)
- `timestamps`: `createdAt`, `updatedAt`

### Registration Schema Fields:
- `studentName`: String (required, trimmed)
- `registerNumber`: String (required, uppercase, indexed)
- `email`: String (required, regex email validation)
- `mobile`: String (required, 10-digit validation)
- `department`: String (required)
- `year`: Number (required, 1 to 4)
- `courseId`: ObjectId reference to `Course` model
- `registrationDate`: Date (defaults to `Date.now`)
- `status`: String (enum: `['Confirmed', 'Cancelled']`)
- `timestamps`: `createdAt`, `updatedAt`

### Seeded Courses in MongoDB Atlas:
1. `CS201` - Data Structures (Computer Science and Engineering - 4 Credits, 60 Seats)
2. `CS202` - Database Management Systems (Computer Science and Engineering - 4 Credits, 60 Seats)
3. `AI301` - Artificial Intelligence (Artificial Intelligence and Data Science - 3 Credits, 50 Seats)
4. `AI302` - Machine Learning (Artificial Intelligence and Data Science - 4 Credits, 50 Seats)
5. `IT203` - Computer Networks (Information Technology - 3 Credits, 55 Seats)
6. `CS204` - Operating Systems (Computer Science and Engineering - 4 Credits, 60 Seats)
7. `IT205` - Web Technologies (Information Technology - 3 Credits, 55 Seats)
8. `CS306` - Cloud Computing (Computer Science and Engineering - 3 Credits, 45 Seats)

---

## 6. REST API Endpoints

### Course APIs:
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | Retrieve all available courses |
| `GET` | `/api/courses/:id` | Retrieve an individual course by ID or code |
| `POST` | `/api/courses` | Add a new course to the catalog |
| `PUT` | `/api/courses/:id` | Update course details (credits, duration, etc.) |
| `DELETE` | `/api/courses/:id` | Delete a course from the catalog |

### Registration APIs:
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/registrations` | Register a student (validates fields, checks seat availability, prevents duplicate enrollment, decrements available seats) |
| `GET` | `/api/registrations` | Retrieve all registrations with populated course details |
| `GET` | `/api/registrations/:id` | Retrieve a specific registration record by ID |
| `GET` | `/api/registrations/student/:registerNumber` | Retrieve registrations for a specific student |
| `DELETE` | `/api/registrations/:id` | Cancel a registration (changes status to `Cancelled` and restores 1 available seat) |
| `GET` | `/api/registrations/dashboard/stats` | Returns total courses, confirmed enrollments, and distinct students |

---

## 7. How to Run the Application

### Prerequisites:
- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)

### Step 1: Start the Backend Server
1. Open a terminal and navigate to the backend folder:
   ```powershell
   cd D:\CourseRegistration\backend
   ```
2. Ensure dependencies are installed:
   ```powershell
   npm install
   ```
3. Start the Node.js Express server:
   ```powershell
   npm start
   # or for auto-reload during development:
   npm run dev
   ```
4. The server runs at: **`http://localhost:5000`**

### Step 2: Start the Angular Frontend Application
1. Open a second terminal and navigate to the frontend folder:
   ```powershell
   cd D:\CourseRegistration\frontend
   ```
2. Start the Angular development server:
   ```powershell
   npm start
   # or
   ng serve --open
   ```
3. The frontend application runs at: **`http://localhost:4200`**

---

## 8. Step-by-Step Demonstration for Practical Examination

### Demo 1: View Dashboard & Course Catalog
1. Open your browser at `http://localhost:4200`.
2. Notice the live dashboard cards displaying:
   - **Total Available Courses:** 8
   - **Total Registered Courses**
   - **Total Students Registered**
3. Click **"Available Courses"** in the navigation bar.
4. Filter by department (e.g. *Artificial Intelligence and Data Science*) or search for "Machine Learning".
5. Click **"Details"** on any course card to display the complete course syllabus, credit allocation, and available seats modal.

### Demo 2: Student Registration & Validation
1. Click **"Register Course"** in the top navigation bar (or click "Register Now" on any course card to auto-select it).
2. Test client-side validations:
   - Leave fields blank and click **Submit Registration** $\rightarrow$ Validation messages appear under each required field.
   - Enter an invalid email (e.g. `alex.com`) $\rightarrow$ Error message "Please enter a valid email address".
   - Enter fewer than 10 digits in Mobile Number $\rightarrow$ Error message "Mobile number must contain exactly 10 digits".
3. Fill valid details:
   - **Student Name:** `Alex Johnson`
   - **Register Number:** `717821CS101`
   - **Email:** `alex.johnson@college.edu`
   - **Mobile:** `9876543210`
   - **Department:** `Computer Science and Engineering`
   - **Year of Study:** `3rd Year`
   - **Course Selection:** `Data Structures`
4. Click **Submit Registration**.
5. A green success alert appears with the generated **Registration ID** and confirmation details.
6. Check the course seat count $\rightarrow$ It automatically decreases by 1!

### Demo 3: Duplicate Registration Prevention
1. In the registration form, try to submit the exact same student `717821CS101` for `Data Structures` again.
2. The server blocks the duplicate with an error alert:
   > *"Student with Register Number 717821CS101 is already registered for Data Structures"*.

### Demo 4: View Registrations & Cancellation
1. Navigate to **"My Registrations"**.
2. The registration table displays:
   - Registration ID
   - Student Name & Email
   - Register Number
   - Course Name & Code
   - Department & Year
   - Registration Date & Time
   - Status (`Confirmed` badge)
   - Cancel button
3. Filter by student register number using the search bar.
4. Click **"Cancel"** $\rightarrow$ A professional confirmation modal opens asking to confirm cancellation.
5. Click **"Yes, Cancel Registration"**.
6. The record status updates to **`Cancelled`**, and **1 seat is automatically restored** to the course!
7. Trying to cancel again is disabled, preventing duplicate seat restoration.

---

## 9. How to Verify Records in MongoDB Atlas

1. Log into your [MongoDB Atlas Dashboard](https://cloud.mongodb.com).
2. Select cluster **`StudentCluster`** and click **Browse Collections**.
3. Under database **`college_course_registration`**:
   - Inspect **`courses`**: Verify the 8 course documents with their `availableSeats` count updated in real-time.
   - Inspect **`registrations`**: View the student registration documents with timestamps, student details, and `status` values (`Confirmed` / `Cancelled`).
4. **Network Whitelist Tip:** If accessing from a new network or mobile hotspot, ensure your current public IP is added under Atlas **Network Access** (or set `0.0.0.0/0` to allow connection from anywhere).

---

## 10. Conclusion

This College Course Registration System satisfies all academic project criteria:
- Complete MEAN Stack implementation (MongoDB, Express, Angular, Node.js).
- Modern, clean, responsive UI with a blue and white college portal aesthetic.
- Zero reliance on static frontend arrays; all data flows through REST APIs.
- Production-ready error handling, input validation, and business logic guarantees.

