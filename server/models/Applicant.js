const mongoose = require('mongoose');

console.log('👤 [APPLICANT_MODEL] Initializing MongoDB Applicant model');

const applicantSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  
  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  
  // Educational Information
  education: {
    degree: String,
    institution: String,
    yearOfCompletion: Number,
    percentage: Number,
    cgpa: Number
  },
  
  // Technical Skills
  skills: [String],
  
  // Experience
  experience: {
    years: Number,
    description: String
  },
  
  // Application Details
  appliedFor: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Status and Processing
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Shortlisting Information
  shortlisted: {
    isShortlisted: {
      type: Boolean,
      default: false
    },
    shortlistedBy: String,
    shortlistedAt: Date,
    shortlistReason: String,
    shortlistNotes: String
  },
  
  // Approval Information
  approved: {
    isApproved: {
      type: Boolean,
      default: false
    },
    approvedBy: String,
    approvedAt: Date,
    approvalReason: String,
    approvalNotes: String,
    offerLetterSent: {
      type: Boolean,
      default: false
    },
    offerLetterSentAt: Date
  },
  
  // Email History
  emailsSent: [{
    to: String,
    subject: String,
    content: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'pending'],
      default: 'pending'
    },
    messageId: String
  }],
  
  // File Uploads
  documents: {
    resume: String,
    photo: String,
    certificates: [String]
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
applicantSchema.index({ email: 1 });
applicantSchema.index({ registrationNumber: 1 });
applicantSchema.index({ status: 1 });
applicantSchema.index({ 'shortlisted.isShortlisted': 1 });
applicantSchema.index({ 'approved.isApproved': 1 });
applicantSchema.index({ createdAt: -1 });

// Instance methods
applicantSchema.methods.markAsShortlisted = function(shortlistedBy, reason, notes) {
  this.status = 'shortlisted';
  this.shortlisted = {
    isShortlisted: true,
    shortlistedBy,
    shortlistedAt: new Date(),
    shortlistReason: reason,
    shortlistNotes: notes
  };
  this.updatedAt = new Date();
  return this.save();
};

applicantSchema.methods.markAsApproved = function(approvedBy, reason, notes) {
  this.status = 'approved';
  this.approved = {
    isApproved: true,
    approvedBy,
    approvedAt: new Date(),
    approvalReason: reason,
    approvalNotes: notes,
    offerLetterSent: false
  };
  this.updatedAt = new Date();
  return this.save();
};

applicantSchema.methods.markOfferLetterSent = function() {
  this.approved.offerLetterSent = true;
  this.approved.offerLetterSentAt = new Date();
  this.updatedAt = new Date();
  return this.save();
};

applicantSchema.methods.addEmailRecord = function(emailData) {
  this.emailsSent.push(emailData);
  this.updatedAt = new Date();
  return this.save();
};

// Static methods
applicantSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

applicantSchema.statics.findShortlisted = function() {
  return this.find({ 'shortlisted.isShortlisted': true });
};

applicantSchema.statics.findApproved = function() {
  return this.find({ 'approved.isApproved': true });
};

applicantSchema.statics.findPending = function() {
  return this.find({ status: 'pending' });
};

// Pre-save middleware
applicantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

console.log('✅ [APPLICANT_MODEL] Applicant model defined');

module.exports = mongoose.model('Applicant', applicantSchema); 