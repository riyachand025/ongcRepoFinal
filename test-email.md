# Email Testing Guide

## Current Email Configuration (From Screenshot):
- EMAIL_HOST: smtp.gmail.com ✅
- EMAIL_PORT: 587 ✅  
- EMAIL_USER: joshivikas7645@gmail.com ✅
- EMAIL_PASS: babg yhqg aeat jujv ✅ (App Password)

## Test Email Directly:

You can test if emails are working by trying to send a test email through your application.

## Common Email Issues:

1. **Gmail App Password Expired**
   - Gmail app passwords sometimes expire
   - Need to regenerate new app password

2. **Less Secure Apps Setting**
   - Gmail might have disabled less secure apps
   - Use App Password instead of regular password

3. **Rate Limiting**
   - Gmail has sending limits
   - Too many emails too quickly can trigger blocks

4. **Environment Variables**
   - Check if EMAIL_* variables are properly set in Render

## To Debug Email Issue:

1. **Check Render Logs:**
   - Go to Render dashboard
   - Click on your service
   - Check logs for email errors

2. **Test with Simple Email:**
   - Try sending one simple test email
   - Check what error appears

3. **Verify Gmail Settings:**
   - Make sure 2FA is enabled
   - App password is still valid

## Let me know:
- What specific email functionality is failing?
- What error message you see?
- When it started failing?