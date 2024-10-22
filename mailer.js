require('dotenv').config();  // Load environment variables from .env
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Get email from environment variables
    pass: process.env.EMAIL_PASS   // Get password from environment variables
  }
});


// Function to send welcome email
const sendWelcomeMail = async (toEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Welcome!',
    text: 'Thank you for contacting us. We will get back to you soon!'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent: ${info.response}`);
    return info; // Log and return the response info
  } catch (error) {
    console.error(`Error sending welcome email: ${error.message}`);
    throw error; // Log the error and re-throw it
  }
};
// 
const ReciveQueryMail = async (firstName, lastName, mobile, toEmail, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,  // Sending the query to admin/support email
    subject: 'Contact Query from Gloumastro',
    text: `You have received a new contact query.\n\nDetails:\nName: ${firstName} ${lastName}\nMobile: ${mobile}\nEmail: ${toEmail}\nMessage: ${message}\n\nPlease respond promptly.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Query email sent: ${info.response}`);
    return info;
  } catch (error) {
    console.error(`Error sending query email: ${error.message}`);
    throw error;
  }
};

// Function to send OTP
const sendOtpMail = async (toEmail, url) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Gloumastor password reset',
    text: `Your password reset url  is: ${url}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent: ${info.response}`);
    return info; // Log and return the response info
  } catch (error) {
    console.error(`Error sending OTP email: ${error.message}`);
    throw error; // Log the error and re-throw it
  }
};


const saveUserDetails = async ({ name, email, countryCode, mobileNo, city }) => {
  // Define mail options for the confirmation email
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email (your admin email)
    to: email,  // Send confirmation email to the user's email
    subject: 'Confirmation of Your Details Submission',
    text: `Dear ${name},\n\nThank you for submitting your details. Here is the information we received:\n\nName: ${name}\nEmail: ${email}\nMobile: ${countryCode} ${mobileNo}\nCity: ${city}\n\nWe will get back to you shortly.\n\nBest Regards,\nGloumastro Team`
  };

  try {

    console.log('Saving user details:', { name, email, countryCode, mobileNo, city });

    const info = await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}: ${info.response}`);

    return { message: 'User details saved and confirmation email sent.', info };
  } catch (error) {
    console.error(`Error saving user details or sending email: ${error.message}`);
    throw error;
  }
};

module.exports = { sendWelcomeMail, sendOtpMail ,ReciveQueryMail ,saveUserDetails};
