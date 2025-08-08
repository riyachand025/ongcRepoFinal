# ONGC Internship ATS - Excel Upload & Processing System

A comprehensive Applicant Tracking System for ONGC Dehradun internship applications with Excel upload capabilities.

## Features

- **Excel File Upload**: Drag-and-drop interface for .xlsx, .xls, and .csv files
- **Data Processing**: Automatic parsing and validation of applicant data
- **Computed Fields**: Auto-calculation of term, quota category, and late application status
- **MongoDB Integration**: Robust database storage with proper schema design
- **Dashboard**: Advanced filtering, search, and export capabilities
- **Responsive Design**: Modern UI optimized for desktop workflow

## Technology Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **File Processing**: xlsx and papaparse libraries
- **Authentication**: JWT-based (ready for implementation)

## Installation

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

## Database Schema

The system processes Excel files with the following columns:
- Email address
- Instruction Acknowledged
- Training Acknowledgement
- Name (in capital)
- Age (in years)
- Gender
- Category
- Address
- Mobile No.
- Email
- Father/Mother's Name
- Father/Mother's Occupation
- Name of the present Institute
- Areas of Training offered by ONGC, Dehradun
- Present Semester
- Last Semester SGPA
- Percentage in 10+2
- Applicant's Declaration_01
- Applicant's Declaration_02
- Applicant's Declaration_03
- Designation
- CPF
- Section
- Location
- Mobile No. (mentor)
- Mentor details available
- Guardian Occupation details
- Mentor CPF
- Mentor Name
- Mentor Designation
- Mentor Section
- Mentor Location
- Mentor Email
- Preference Criteria
- Referred by
- Status

## Computed Fields

- **Term**: Summer (April-September) or Winter (October-March)
- **Quota Category**: General or Reserved (based on SC/ST/OBC category)
- **Late Application**: Flagged if application is late and mentor support is available

## API Endpoints

- `POST /api/upload` - Upload and process Excel file
- `GET /api/applicants` - Get paginated applicants with filters
- `GET /api/applicants/:id` - Get specific applicant
- `PUT /api/applicants/:id` - Update applicant
- `DELETE /api/applicants/:id` - Delete applicant
- `GET /api/stats` - Get application statistics

## Usage

1. **Upload Excel File**: Use the drag-and-drop interface to upload applicant data
2. **Preview Data**: Review processed data and validation results
3. **Confirm Import**: Save validated data to MongoDB
4. **Dashboard**: View, filter, and manage applications

## Configuration

Create a `.env` file in the server directory:
```
MONGODB_URI=mongodb://localhost:27017/ongc-internship
JWT_SECRET=your-secret-key-here
PORT=3001
```

## Features in Detail

### File Upload
- Supports Excel (.xlsx, .xls) and CSV files
- Real-time validation and error reporting
- Progress tracking during processing

### Data Processing
- Automatic field mapping from Excel columns
- Validation of required fields
- Duplicate detection and prevention
- Computed field generation

### Dashboard
- Advanced filtering by term, category, status, mentor assignment
- Real-time search functionality
- Export to CSV
- Responsive data table with pagination





### Error Handling
- Comprehensive error reporting during upload
- Validation warnings for malformed data
- Graceful handling of duplicate entries