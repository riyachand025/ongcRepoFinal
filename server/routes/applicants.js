const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('./auth');
const Applicant = require('../models/Applicant');
const { createEmailTransporter } = require('../index');

console.log('👥 [APPLICANTS_ROUTES] Initializing applicant routes');

// Get all applicants
router.get('/', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    console.log('📋 [APPLICANTS] Getting all applicants');
    const applicants = await Applicant.find().sort({ createdAt: -1 });
    console.log(`✅ [APPLICANTS] Found ${applicants.length} applicants`);
    
    res.json({
      success: true,
      data: applicants
    });
  } catch (error) {
    console.error('❌ [APPLICANTS] Error getting applicants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applicants'
    });
  }
});

// Get pending applicants
router.get('/pending', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    console.log('📋 [APPLICANTS] Getting pending applicants');
    const applicants = await Applicant.findPending().sort({ createdAt: -1 });
    console.log(`✅ [APPLICANTS] Found ${applicants.length} pending applicants`);
    
    res.json({
      success: true,
      data: applicants
    });
  } catch (error) {
    console.error('❌ [APPLICANTS] Error getting pending applicants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending applicants'
    });
  }
});

// Get shortlisted applicants
router.get('/shortlisted', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    console.log('📋 [APPLICANTS] Getting shortlisted applicants');
    const applicants = await Applicant.findShortlisted().sort({ 'shortlisted.shortlistedAt': -1 });
    console.log(`✅ [APPLICANTS] Found ${applicants.length} shortlisted applicants`);
    
    res.json({
      success: true,
      data: applicants
    });
  } catch (error) {
    console.error('❌ [APPLICANTS] Error getting shortlisted applicants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shortlisted applicants'
    });
  }
});

// Get approved applicants
router.get('/approved', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    console.log('📋 [APPLICANTS] Getting approved applicants');
    const applicants = await Applicant.findApproved().sort({ 'approved.approvedAt': -1 });
    console.log(`✅ [APPLICANTS] Found ${applicants.length} approved applicants`);
    
    res.json({
      success: true,
      data: applicants
    });
  } catch (error) {
    console.error('❌ [APPLICANTS] Error getting approved applicants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved applicants'
    });
  }
});

// Shortlist an applicant
router.post('/shortlist/:id', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, notes } = req.body;
    const shortlistedBy = req.user.email;
    
    console.log('📋 [SHORTLIST] Shortlisting applicant:', id);
    console.log('👤 [SHORTLIST] Shortlisted by:', shortlistedBy);
    
    const applicant = await Applicant.findById(id);
    if (!applicant) {
      console.log('❌ [SHORTLIST] Applicant not found');
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }
    
    await applicant.markAsShortlisted(shortlistedBy, reason, notes);
    console.log('✅ [SHORTLIST] Applicant shortlisted successfully');
    
    // Send shortlisting email
    try {
      const transporter = createEmailTransporter();
      const mailOptions = {
        from: `"ONGC Dehradun - SAIL" <${process.env.EMAIL_USER}>`,
        to: applicant.email,
        subject: 'Congratulations! You have been shortlisted',
        html: `
          <h1>Congratulations!</h1>
          <p>Dear ${applicant.name},</p>
          <p>We are pleased to inform you that your application for <strong>${applicant.appliedFor}</strong> has been shortlisted.</p>
          <p><strong>Registration Number:</strong> ${applicant.registrationNumber}</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          <p>We will contact you soon with further details.</p>
          <p>Best regards,<br>ONGC Dehradun Team</p>
        `
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('📧 [SHORTLIST] Shortlisting email sent:', info.messageId);
      
      // Record email in applicant history
      await applicant.addEmailRecord({
        to: applicant.email,
        subject: 'Congratulations! You have been shortlisted',
        content: mailOptions.html,
        status: 'sent',
        messageId: info.messageId
      });
      
    } catch (emailError) {
      console.error('❌ [SHORTLIST] Failed to send email:', emailError);
      // Still record the email attempt
      await applicant.addEmailRecord({
        to: applicant.email,
        subject: 'Congratulations! You have been shortlisted',
        content: 'Email failed to send',
        status: 'failed'
      });
    }
    
    res.json({
      success: true,
      message: 'Applicant shortlisted successfully',
      data: applicant
    });
    
  } catch (error) {
    console.error('❌ [SHORTLIST] Error shortlisting applicant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to shortlist applicant'
    });
  }
});

// Approve a shortlisted applicant
router.post('/approve/:id', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, notes } = req.body;
    const approvedBy = req.user.email;
    
    console.log('📋 [APPROVE] Approving applicant:', id);
    console.log('👤 [APPROVE] Approved by:', approvedBy);
    
    const applicant = await Applicant.findById(id);
    if (!applicant) {
      console.log('❌ [APPROVE] Applicant not found');
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }
    
    if (!applicant.shortlisted.isShortlisted) {
      console.log('❌ [APPROVE] Applicant is not shortlisted');
      return res.status(400).json({
        success: false,
        message: 'Applicant must be shortlisted before approval'
      });
    }
    
    await applicant.markAsApproved(approvedBy, reason, notes);
    console.log('✅ [APPROVE] Applicant approved successfully');
    
    // Send approval email
    try {
      const transporter = createEmailTransporter();
      const mailOptions = {
        from: `"ONGC Dehradun - SAIL" <${process.env.EMAIL_USER}>`,
        to: applicant.email,
        subject: 'Congratulations! Your application has been approved',
        html: `
          <h1>Congratulations!</h1>
          <p>Dear ${applicant.name},</p>
          <p>We are delighted to inform you that your application for <strong>${applicant.appliedFor}</strong> has been approved!</p>
          <p><strong>Registration Number:</strong> ${applicant.registrationNumber}</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          <p>You will receive an offer letter shortly.</p>
          <p>Best regards,<br>ONGC Dehradun Team</p>
        `
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('📧 [APPROVE] Approval email sent:', info.messageId);
      
      // Record email in applicant history
      await applicant.addEmailRecord({
        to: applicant.email,
        subject: 'Congratulations! Your application has been approved',
        content: mailOptions.html,
        status: 'sent',
        messageId: info.messageId
      });
      
    } catch (emailError) {
      console.error('❌ [APPROVE] Failed to send email:', emailError);
      // Still record the email attempt
      await applicant.addEmailRecord({
        to: applicant.email,
        subject: 'Congratulations! Your application has been approved',
        content: 'Email failed to send',
        status: 'failed'
      });
    }
    
    res.json({
      success: true,
      message: 'Applicant approved successfully',
      data: applicant
    });
    
  } catch (error) {
    console.error('❌ [APPROVE] Error approving applicant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve applicant'
    });
  }
});

// Send multiple emails to an applicant
router.post('/:id/send-email', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, content, sendTo } = req.body;
    
    console.log('📧 [EMAIL] Sending email to applicant:', id);
    console.log('📧 [EMAIL] Subject:', subject);
    console.log('📧 [EMAIL] Send to:', sendTo);
    
    const applicant = await Applicant.findById(id);
    if (!applicant) {
      console.log('❌ [EMAIL] Applicant not found');
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }
    
    const emailAddress = sendTo || applicant.email;
    
    // Send email
    try {
      const transporter = createEmailTransporter();
      const mailOptions = {
        from: `"ONGC Dehradun - SAIL" <${process.env.EMAIL_USER}>`,
        to: emailAddress,
        subject: subject,
        html: content
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('📧 [EMAIL] Email sent successfully:', info.messageId);
      
      // Record email in applicant history
      await applicant.addEmailRecord({
        to: emailAddress,
        subject: subject,
        content: content,
        status: 'sent',
        messageId: info.messageId
      });
      
      res.json({
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId
      });
      
    } catch (emailError) {
      console.error('❌ [EMAIL] Failed to send email:', emailError);
      
      // Record failed email attempt
      await applicant.addEmailRecord({
        to: emailAddress,
        subject: subject,
        content: content,
        status: 'failed'
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: emailError.message
      });
    }
    
  } catch (error) {
    console.error('❌ [EMAIL] Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
});

// Get email history for an applicant
router.get('/:id/emails', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📧 [EMAILS] Getting email history for applicant:', id);
    
    const applicant = await Applicant.findById(id);
    if (!applicant) {
      console.log('❌ [EMAILS] Applicant not found');
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }
    
    console.log(`✅ [EMAILS] Found ${applicant.emailsSent.length} emails`);
    
    res.json({
      success: true,
      data: applicant.emailsSent
    });
    
  } catch (error) {
    console.error('❌ [EMAILS] Error getting email history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email history'
    });
  }
});

// Mark offer letter as sent
router.patch('/:id/offer-letter', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📋 [OFFER] Marking offer letter as sent for applicant:', id);
    
    const applicant = await Applicant.findById(id);
    if (!applicant) {
      console.log('❌ [OFFER] Applicant not found');
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }
    
    if (!applicant.approved.isApproved) {
      console.log('❌ [OFFER] Applicant is not approved');
      return res.status(400).json({
        success: false,
        message: 'Applicant must be approved before sending offer letter'
      });
    }
    
    await applicant.markOfferLetterSent();
    console.log('✅ [OFFER] Offer letter marked as sent');
    
    res.json({
      success: true,
      message: 'Offer letter marked as sent',
      data: applicant
    });
    
  } catch (error) {
    console.error('❌ [OFFER] Error marking offer letter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark offer letter as sent'
    });
  }
});

console.log('✅ [APPLICANTS_ROUTES] Applicant routes defined');

module.exports = router; 