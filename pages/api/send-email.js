// pages/api/send-email.js
const nodemailer = require('nodemailer');
import centres from '../../centres'; // Import centres

const sendEmail = async (req, res) => {
  const { userData, correct, totalQuestions } = req.body;

  // Get the selected centre based on the centreId
  const selectedCentre = centres.find(
    (centre) => centre.id === userData.centreId
  );

  // Get the administrator's email
  const adminEmail = selectedCentre ? selectedCentre.adminEmail : null;

  // Ensure adminEmail exists
  if (!adminEmail) {
    return res.status(400).json({ message: 'Invalid centre selected' });
  }

  // Configure your SMTP server details
  const transporter = nodemailer.createTransport({
    host: "postbox.cloud.yandex.net",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content for the user
  const userMailOptions = {
    from: 'Ассоциация EMDR России <info@emdr.ru>',
    to: userData.email,
    subject: 'Результаты теста EMDR',
    html: `
      <p>Здравствуйте, ${userData.name},</p>
      <p>Поздравляем! Вы успешно прошли тест EMDR с результатом <strong>${correct} из ${totalQuestions}</strong>.</p>
      <p>Спасибо за участие.</p>
      <p>С наилучшими пожеланиями,<br/>Ассоциация EMDR Россия</p>
    `,
  };

  // Email content for the admin
  const adminMailOptions = {
    from: 'Ассоциация EMDR России <info@emdr.ru>',
    to: adminEmail,
    subject: 'Результаты теста EMDR',
    html: `
      <p>Здравствуйте,</p>
      <p><strong>${userData.name} (${userData.email})</strong> прошел тест EMDR с результатом <strong>${correct} из ${totalQuestions}</strong>.</p>
      <p>С уважением,<br/>Ассоциация EMDR Россия</p>
    `,
  };

  try {
    // Send email to the user
    await transporter.sendMail(userMailOptions);
    // Send email to the admin
    await transporter.sendMail(adminMailOptions);
    res.status(200).json({ message: 'Emails sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email failed' });
  }
};

export default sendEmail;
