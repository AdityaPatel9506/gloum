const express = require('express');
const { sendWelcomeMail, sendOtpMail ,ReciveQueryMail,saveUserDetails} = require('../mailer');
const router = express.Router();

// Route 1: Contact form submission (for queries)
router.post('/contact', async (req, res) => {
  console.log(req.body);
  const { firstName,lastName,mobile, email, message } = req.body;

  // Log the contact form details (for debugging purposes or database storage)
  // console.log('Received contact form submission:', { name, email, message });

  try {
  
    await ReciveQueryMail(firstName,lastName,mobile, email, message);
    await sendWelcomeMail(email);
    // Respond back to the user
    res.status(200).json({ message: 'Thank you for contacting us! A confirmation email has been sent to your address.' });
  } catch (error) {
    console.error('Error sending thank you email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email.' });
  }
});



// Route 2: Send a welcome message to the user's email
router.post('/send-welcome', async (req, res) => {
  const { email } = req.body;

  try {
    await sendWelcomeMail(email);
    res.status(200).json({ message: 'Welcome email sent successfully!' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});


// business contacts 

router.post('/submitDetails', async (req, res) => {
  console.log(req.body);
  
  // Destructure the fields from the request body
  const { name, email, countryCode, mobileNo, city } = req.body;

  try {
   
    await saveUserDetails({ name, email, countryCode, mobileNo, city });
    await sendWelcomeMail(email);

    // Respond back to the user upon successful submission
    res.status(200).json({ message: 'Your details have been submitted successfully!' });
  } catch (error) {
    console.error('Error submitting details:', error);
    res.status(500).json({ error: 'Failed to submit your details. Please try again.' });
  }
});



module.exports = router;
