const mongoose = require('mongoose');
const Applicant = require('./models/Applicant');
require('dotenv').config();

async function createSampleApplicants() {
  console.log('👤 [APPLICANT_MODEL] Initializing MongoDB Applicant model');
  console.log('✅ [APPLICANT_MODEL] Applicant model defined');
  
  console.log('👥 Creating Sample Applicants...');
  
  try {
    console.log('🗄️ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ongc-internship');
    console.log('✅ Connected to MongoDB successfully');
    
    // Drop existing indexes to avoid conflicts
    console.log('🗑️ Dropping existing indexes...');
    try {
      await Applicant.collection.dropIndexes();
      console.log('✅ Dropped existing indexes');
    } catch (error) {
      console.log('ℹ️ No indexes to drop or error dropping indexes:', error.message);
    }
    
    // Clear existing applicants
    await Applicant.deleteMany({});
    console.log('🧹 Cleared existing applicants');
    
    // Create sample applicants using the existing schema
    const sampleApplicants = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91-9876543210',
        dateOfBirth: new Date('1998-05-15'),
        gender: 'Male',
        address: {
          street: '123 Tech Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        },
        education: {
          degree: 'Bachelor of Technology in Computer Science',
          institution: 'Mumbai University',
          yearOfCompletion: 2023,
          percentage: 85,
          cgpa: 8.5
        },
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
        experience: {
          years: 1,
          description: 'Full-stack development experience with React and Node.js'
        },
        appliedFor: 'Software Developer Intern',
        registrationNumber: 'APP001',
        status: 'pending'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '+91-9876543211',
        dateOfBirth: new Date('1999-03-20'),
        gender: 'Female',
        address: {
          street: '456 Innovation Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India'
        },
        education: {
          degree: 'Bachelor of Engineering in Information Technology',
          institution: 'Bangalore University',
          yearOfCompletion: 2023,
          percentage: 88,
          cgpa: 8.8
        },
        skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'AWS'],
        experience: {
          years: 1,
          description: 'Backend development experience with Spring Boot and MySQL'
        },
        appliedFor: 'Backend Developer Intern',
        registrationNumber: 'APP002',
        status: 'pending'
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '+91-9876543212',
        dateOfBirth: new Date('1997-11-10'),
        gender: 'Male',
        address: {
          street: '789 Data Street',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India'
        },
        education: {
          degree: 'Master of Science in Data Science',
          institution: 'Delhi University',
          yearOfCompletion: 2023,
          percentage: 92,
          cgpa: 9.2
        },
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Tableau'],
        experience: {
          years: 0,
          description: 'Fresh graduate with strong academic background in data science'
        },
        appliedFor: 'Data Science Intern',
        registrationNumber: 'APP003',
        status: 'pending'
      }
    ];
    
    const createdApplicants = await Applicant.insertMany(sampleApplicants);
    console.log('✅ Created', createdApplicants.length, 'sample applicants');
    
    console.log('\n📋 Sample Applicants Created:');
    createdApplicants.forEach((applicant, index) => {
      console.log(`${index + 1}. ${applicant.name} (${applicant.email})`);
      console.log(`   Applied for: ${applicant.appliedFor}`);
      console.log(`   Registration: ${applicant.registrationNumber}`);
      console.log(`   Status: ${applicant.status}\n`);
    });
    
    // Test shortlisting functionality
    console.log('📋 Testing shortlisting functionality...');
    const rahul = await Applicant.findOne({ email: 'rahul.sharma@email.com' });
    if (rahul) {
      await rahul.markAsShortlisted('HR Manager', 'Strong technical skills', 'Excellent communication and problem-solving abilities');
      console.log('✅ Shortlisted:', rahul.name);
    }
    
    // Test approval functionality
    console.log('📋 Testing approval functionality...');
    const priya = await Applicant.findOne({ email: 'priya.patel@email.com' });
    if (priya) {
      await priya.markAsShortlisted('HR Manager', 'Good backend skills', 'Promising candidate with strong technical background');
      await priya.markAsApproved('HR Manager', 'Meets all requirements', 'Ready for onboarding and team integration');
      console.log('✅ Approved:', priya.name);
    }
    
    // Get final statistics
    const totalApplicants = await Applicant.countDocuments();
    const shortlistedCount = await Applicant.countDocuments({ 'shortlisted.isShortlisted': true });
    const approvedCount = await Applicant.countDocuments({ 'approved.isApproved': true });
    
    console.log('\n📊 Final Statistics:');
    console.log(`   Total Applicants: ${totalApplicants}`);
    console.log(`   Shortlisted: ${shortlistedCount}`);
    console.log(`   Approved: ${approvedCount}`);
    
    console.log('\n🎉 Sample data creation completed successfully!');
    console.log('💡 You can now test the applicant management system with real data.');
    
  } catch (error) {
    console.error('❌ Error creating sample applicants:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createSampleApplicants(); 