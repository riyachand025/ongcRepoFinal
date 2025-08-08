import React, { useState, useEffect } from 'react';
import { Applicant } from '../types/applicant';
import { X, Send, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EmailModalProps {
  recipients: Applicant[];
  emailType: 'approval' | 'shortlisted';
  onClose: () => void;
  onSend: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ recipients, emailType, onClose, onSend }) => {
  const { token } = useAuth();
  const [emailsSent, setEmailsSent] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [attachTemplate, setAttachTemplate] = useState(true);
  const [lastSerial, setLastSerial] = useState(0);

  useEffect(() => {
    const sentEmails = localStorage.getItem(`ongc-sent-emails-${emailType}`);
    if (sentEmails) {
      setEmailsSent(new Set(JSON.parse(sentEmails)));
    }

    const savedLastSerial = localStorage.getItem('ongc-last-sail-serial');
    if (savedLastSerial) {
      setLastSerial(parseInt(savedLastSerial, 10));
    }
  }, [emailType]);

  const generateRegistrationNumber = (serial: number) => {
    const year = new Date().getFullYear();
    return `SAIL-${year}-${String(serial).padStart(4, '0')}`;
  };

  const generateApprovalEmail = (applicant: Applicant, serial: number) => {
    const registrationNumber = generateRegistrationNumber(serial);
    const term = applicant.term === 'Summer' ? 'ग्रीष्मकालीन' : 'शीतकालीन';
    const termEng = applicant.term;
    const name = applicant.name;
    const trainingArea = applicant.areasOfTraining || 'B.E/B.Tech Computer Science';
    const title = applicant.gender === 'Female' ? 'Ms.' : 'Mr.';

    return `नमस्ते,

प्रिय ${title} ${name},

ओएनजीसी देहरादून में ${term}/${termEng.toLowerCase()} प्रशिक्षण हेतु आपका आवेदन प्राप्त हुआ है।
आपकी पंजीकरण संख्या है: ${registrationNumber}

आपका प्रशिक्षण हेतु अनुरोध (${trainingArea}) विचाराधीन है।

कृपया संलग्न आवेदन फॉर्म का प्रिंट लें एवं संस्थान से अनुशंसा पत्र (निर्धारित प्रारूप में) प्राप्त करें।

पूर्ण आवेदन पत्र एवं आवश्यक संलग्नकों सहित निम्न पते पर प्रेषित करें:

कार्यालय प्रभारी – सेल (SAIL)
307-तीसरी मंज़िल, ओएनजीसी अकादमी
कौलागढ़ रोड, देहरादून – 248195
आपका आवेदन पत्र 30 अप्रैल 2025 तक अवश्य प्राप्त हो जाना चाहिए।

कृपया ध्यान दें कि यह केवल आवेदन की पावती है तथा प्रशिक्षण का आश्वासन नहीं है।

प्रशिक्षण की अंतिम पुष्टि (जिसमें मेंटर का विवरण शामिल होगा) केवल दस्तावेजों के प्राप्त होने एवं उनके सत्यापन के पश्चात ही दी जाएगी।

इस ईमेल का उत्तर न दें। अधिक जानकारी हेतु sailoa@ongc.co.in पर संपर्क करें तथा पंजीकरण संख्या अवश्य बताएं।

सादर,

I/c – SAIL का कार्यालय

Namaste,

Dear ${title} ${name},

Your application for ${termEng}/Winter Training at ONGC Dehradun has been received.
Your registration number is: ${registrationNumber}

Your request for training in the area(s) of ${trainingArea} is under consideration.

Please take a printout of the attached application form and obtain a recommendation letter from your institute in the prescribed format.

Submit the completed application form along with all required enclosures to the following address:

Officer In-Charge – SAIL (Student Academic Interface Learning)
307-Third Floor, ONGC Academy
KDMIPE Campus, Kaulagarh Road, Dehradun – 248195
Please ensure that your completed application reaches us by 30th April 2025.

Kindly note that this is only an acknowledgment of your application and does not guarantee allocation of training at ONGC.

Final confirmation of training (including mentor details) will be emailed only after receipt and verification of the submitted documents.

Please do not reply to this email. For any queries, contact us at sailoa@ongc.co.in and mention your registration number in all correspondence.

Thank you and regards,

Office of I/c – SAIL`;
  };

  const generateShortlistedEmail = (applicant: Applicant, serial: number) => {
    const registrationNumber = generateRegistrationNumber(serial);
    const term = applicant.term === 'Summer' ? 'ग्रीष्मकालीन' : 'शीतकालीन';
    const name = applicant.name;
    const mobile = applicant.mobileNo;
    const mentorName = applicant.mentorName || 'Mr. AJAY BISHT';
    const mentorDesignation = applicant.mentorDesignation || 'General Manager (Programming)';
    const mentorMobile = applicant.mentorMobileNo || '9428007168';
    const mentorLocation = applicant.mentorLocation || 'GEOPIC, ONGC Dehradun';

    return `प्रिय ${name}

(Mob. No. ${mobile})

(रजिस्ट्रेशन /Reg. No. : ${registrationNumber})

सेल-ओएनजीसी अकादमी की ओर से सादर नमस्कार !

यह सूचित किया जाता है कि आप ओएनजीसी, देहरादून में होने वाले आगामी ${term}/औद्योगिक प्रशिक्षण कार्यक्रम (एक/दो महीने की अवधि के लिए) में भाग लेंगे। यह प्रशिक्षण ओएनजीसी परिसर, देहरादून में ऑफलाइन मोड में संपन्न होगा। आपसे अनुरोध है कि प्रशिक्षण अवधि के दौरान निम्नलिखित निर्देशों का पालन करें, ताकि आप प्रशिक्षण से अधिकतम लाभ प्राप्त कर सकें:

·         प्रशिक्षण प्रत्येक कार्यदिवस में प्रातः 10:00 बजे से सायं 5:00 बजे तक आयोजित किया जाएगा। समय की पाबंदी और पूरे दिन की उपस्थिति अनिवार्य है।

·         प्रशिक्षण के दौरान स्वच्छ एवं औपचारिक पोशाक धारण करना अपेक्षित है।

·         कृपया ध्यान दें कि यह प्रशिक्षण अवैतनिक है और इससे ओएनजीसी में भविष्य में रोजगार की कोई गारंटी नहीं है।

·         प्रशिक्षण आपके स्वयं के जोखिम पर लिया जा रहा है। इस अवधि के दौरान यदि कोई दुर्घटना या चोट होती है, तो ओएनजीसी इसके लिए उत्तरदायी नहीं होगा।

·         नियमित उपस्थिति आवश्यक है। आपके मार्गदर्शक द्वारा उपस्थिति पत्रक (Attendance Sheet) तैयार किया जाएगा। किसी भी दिन अनुपस्थिति होने पर उचित कारण प्रस्तुत करना अपेक्षित होगा।

आपके मैंटर का विवरण इस प्रकार है/ Details of your mentor are as follows please contact your mentor for further instructions.

नाम/ Name: ${mentorName}

पद/ Designation: ${mentorDesignation}

मोबाइल न0/ Mobile Number: ${mentorMobile}

कार्यालय स्थान/ Office location: ${mentorLocation}

अपने प्रशिक्षण के समापन पर, आपको अपने प्रोजेक्ट रिपोर्ट की सॉफ्ट कॉपी मेंटर को जमा करानी होगी। आपके काम के मूल्यांकन के आधार पर, आपका मेंटर निम्नलिखित दस्तावेज़ों को sailoa@ongc.co.in पर प्रशिक्षण सेल को अग्रेषित करेगा।

• आपकी प्रोजेक्ट रिपोर्ट की सॉफ्ट कॉपी,

• विधिवत भरी और हस्ताक्षरित उपस्थिति पत्रक, और

• विधिवत हस्ताक्षरित प्रगति रिपो्ट/अंतिम मूल्यांकन फ़ॉर्म सफलतापूर्वक जमा करने और समीक्षा के बाद ही पूर्णता प्रमाणपत्र जारी किया जाएगा।

कृपया इस ईमेल की प्राप्ति की पुष्टि करें और उपरोक्त दिशानिर्देशों को समझने की पुष्टि करें।

हम आपको ONGC के साथ एक उपयोगी और समृद्ध प्रशिक्षण अनुभव की कामना करते हैं।

हमं िश्ास ै कि परि्षण कार्यक्रम आपके लिए एक महत्वपूर्ण और लाभकारी अनुभव सिद्ध होगा, और आप इसे पूरी गंभीरता व उत्साह के साथ पूरा करेंगे।


Greetings from SAIL-ONGC Academy!

We are pleased to confirm your participation in the upcoming Summer/Industrial Training for a period of one/two months at ONGC, Dehradun. The training will be conducted in offline mode at ONGC premises, and your physical presence is required throughout the training period. Please adhere to the following guidelines during your engagement:

The training will be held on all working days from 10:00 AM to 5:00 PM. Punctuality and full-day attendance are mandatory.
You are expected to wear clean and formal attire during training hours as a reflection of professionalism.
Please note that the training is unpaid and does not guarantee employment at ONGC.
The training is undertaken at your own risk. ONGC will not be liable for any injuries or incidents that may occur during this period.
Regular attendance is mandatory. Your mentor will maintain an official attendance sheet, and any absence must be duly justified.
At the conclusion of your training, you are required to submit a soft copy of your Project Report to the mentor. Based on the evaluation of your work, your mentor will forward the following documents to the training cell at sailoa@ongc.co.in.

·         A soft copy of your Project Report,

The duly filled & signed Attendance Sheet, and
The duly signed Progress Report/Final Evaluation Form.
A Completion Certificate will be issued only after successful submission and review.

Kindly acknowledge receipt of this email and confirm your understanding of the above guidelines.

We wish you a fruitful and enriching training experience with ONGC.


Warm regards,

-sd-

Shobha Negi

I/c SAIL, ONGC Academy

Dehradun

भारत का ऊर्जा सारथी

स्वच्छ भारत एक कदम स्वच्छ्ता की ओर

अस्वीकृति :

यह संदेश संबोधित प्राप्तकर्ता के उपयोग हेतु है और इसमें कानूनन विशेषाधिकृत तथा गोपनीय जानकारी भी हो सकती है। यदि इस संदेश का पाठक सही प्राप्तकर्ता या कार्मिक या प्राप्तकर्ता तक संदेश पहुंचाने वाला संदेशवाहक नही है, तो आपको एतद् द्वारा आगाह किया जाता है कि इस सूचना का किसी भी प्रकार का प्प्रसार, वितरण या प्रतिलिपि तैयार करना निषिद्ध है। यदि यह संदेश आपको किसी त्रुटिवश मिला हो तो कृपया इस ई-मेल को नष्ट कर दें एवं इसकी सूचना तत्काल ई-मेल द्वारा admin_ongcmail@ongc.co.in पर दें।

India's Energy Anchor

Swachh Bharat Making India Clean

Disclaimer:

This message is for the use of addressee and may contain legally privileged and private information. If the reader of this message is not the intended recipient, or employee or agent responsible for delivering the message to the recipient, you are
hereby cautioned that any dissemination, distribution or copying of this communication is prohibited. If you have received this transmission in error, please delete this mail and notify us immediately at admin_ongcmail@ongc.co.in`;
  };

  const eligibleRecipients = recipients.filter(recipient => !emailsSent.has(recipient.email));
  const alreadySentCount = recipients.length - eligibleRecipients.length;

  const handleSendEmails = async () => {
    setSending(true);
    setSentCount(0);
    let currentSerial = lastSerial;

    for (let i = 0; i < eligibleRecipients.length; i++) {
      const recipient = eligibleRecipients[i];
      currentSerial += 1;

      try {
        const emailContent =
          emailType === 'approval'
            ? generateApprovalEmail(recipient, currentSerial)
            : generateShortlistedEmail(recipient, currentSerial);

        const subject =
          emailType === 'approval'
            ? `ONGC Dehradun - Application Acknowledgment (Reg: ${generateRegistrationNumber(currentSerial)})`
            : `ONGC Dehradun - Training Confirmation (Reg: ${generateRegistrationNumber(currentSerial)})`;

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('ongc-auth-token')}`
          },
          body: JSON.stringify({
            to: recipient.email,
            subject: subject,
            html: `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap; font-size: 12px;">${emailContent}</pre>`,
            text: emailContent,
            attachTemplate: attachTemplate,
            applicantData: recipient,
            registrationNumber: generateRegistrationNumber(currentSerial),
          })
        });

        const result = await response.json();

        if (result.success) {
          console.log(`Email sent successfully to ${recipient.email}`);
          const newSentEmails = new Set([...emailsSent, recipient.email]);
          setEmailsSent(newSentEmails);
          setSentCount(prevCount => prevCount + 1);

          localStorage.setItem(`ongc-sent-emails-${emailType}`, JSON.stringify([...newSentEmails]));
          setLastSerial(currentSerial);
          localStorage.setItem('ongc-last-sail-serial', currentSerial.toString());
        } else {
          console.error(`Failed to send email to ${recipient.email}:`, result.message);
        }

      } catch (error: any) {
        console.error(`Error sending email to ${recipient.email}:`, error);
      }

      if (i < eligibleRecipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setSending(false);
    setTimeout(() => {
      onSend();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <span>
                Send {emailType === 'approval' ? 'Approval' : 'Training Confirmation'} Emails
              </span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-700">Total Recipients</p>
              <p className="text-2xl font-bold text-blue-900">{recipients.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-700">Ready to Send</p>
              <p className="text-2xl font-bold text-green-900">{eligibleRecipients.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Already Sent</p>
              <p className="text-2xl font-bold text-gray-900">{alreadySentCount}</p>
            </div>
          </div>

          {alreadySentCount > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {alreadySentCount} recipient{alreadySentCount !== 1 ? 's have' : ' has'} already received this email and will be skipped.
                </span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Recipients ({eligibleRecipients.length} new)
            </h4>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recipients.map((recipient, index) => (
                    <tr key={index} className={emailsSent.has(recipient.email) ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-2 text-sm text-gray-900">{recipient.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{recipient.email}</td>
                      <td className="px-4 py-2">
                        {emailsSent.has(recipient.email) ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Already Sent
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Ready
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Email Preview</h4>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={attachTemplate}
                  onChange={(e) => setAttachTemplate(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-900">
                  Attach Application Form Template (PDF)
                </span>
              </label>
              <p className="text-xs text-blue-700 mt-1">
                Students will receive a personalized ONGC internship application form pre-filled with their data.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                {eligibleRecipients.length > 0 ? (
                  emailType === 'approval'
                    ? generateApprovalEmail(eligibleRecipients[0], lastSerial + 1)
                    : generateShortlistedEmail(eligibleRecipients[0], lastSerial + 1)
                ) : (
                  'No new recipients to send emails to.'
                )}
              </pre>
            </div>
          </div>

          {sending && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium text-blue-900">
                  Sending emails... {sentCount} of {eligibleRecipients.length} sent
                </span>
              </div>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(sentCount / eligibleRecipients.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {!sending && sentCount > 0 && sentCount === eligibleRecipients.length && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Successfully sent {sentCount} email{sentCount !== 1 ? 's' : ''} {attachTemplate ? 'with PDF attachment' : ''}!
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Cancel'}
            </button>
            {eligibleRecipients.length > 0 && (
              <button
                onClick={handleSendEmails}
                disabled={sending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {sending
                    ? `Sending... (${sentCount}/${eligibleRecipients.length})`
                    : `Send ${eligibleRecipients.length} Email${eligibleRecipients.length !== 1 ? 's' : ''}${attachTemplate ? ' with PDF' : ''}`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;