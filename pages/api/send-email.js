// pages/api/send-email.js
import nodemailer from 'nodemailer';
import centres from '../../centres'; // Import centres

export default async function handler(req, res) {
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

  const mailOptions = {
    from: 'Ассоциация EMDR России <info@emdr.ru>',
    to: `${userData.email}, ${adminEmail}`, // Send to user and admin email
    subject: 'Результаты теста EMDR',
    html: `
      <p>Здравствуйте, ${userData.name},</p>
      <p>Поздравляем! Вы успешно прошли тест EMDR с результатом <strong>${correct} из ${totalQuestions}</strong>.</p>
      <p>Спасибо за участие.</p>
      <p>С наилучшими пожеланиями,<br/>Команда EMDR Quiz</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email failed' });
  }
}
