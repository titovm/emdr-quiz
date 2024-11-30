// pages/result.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import questions from '../questions';
import { motion } from 'framer-motion';
import Layout from '../components/layout';

export default function Result() {
  const router = useRouter();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [passed, setPassed] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(null); // New state variable

  useEffect(() => {
    const userAnswers = JSON.parse(localStorage.getItem('answers'));
    let correct = 0;
    // Scoring logic
    questions.forEach((q) => {
      const userAnswer = userAnswers[q.number];
      const correctAnswers = q.correctAnswer; // This is an array
      if (Array.isArray(correctAnswers) && correctAnswers.length > 1) {
        // Multiple correct answers
        if (Array.isArray(userAnswer)) {
          // Sort both arrays for comparison
          const sortedUserAnswer = userAnswer.sort();
          const sortedCorrectAnswers = correctAnswers.sort();
          // Check if arrays are equal
          const isCorrect =
            sortedUserAnswer.length === sortedCorrectAnswers.length &&
            sortedUserAnswer.every(
              (val, index) => val === sortedCorrectAnswers[index]
            );
          if (isCorrect) {
            correct++;
          }
        }
      } else {
        // Single correct answer
        if (parseInt(userAnswer) === correctAnswers[0]) {
          correct++;
        }
      }
    });
    setCorrectAnswers(correct); // Set the number of correct answers

    const totalQuestions = questions.length;
    const percentage = (correct / totalQuestions) * 100;

    if (percentage > 70) {
      setPassed(true);
      sendEmail(correct, totalQuestions);
    } else {
      setPassed(false);
      startCountdown(); // Start countdown immediately
    }
  }, []);

  const sendEmail = async (correct, totalQuestions) => {
    setLoading(true); // Start loading indicator
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData, correct, totalQuestions }),
      });
      if (response.ok) {
        setEmailStatus('Письмо с результатом отправлено.');
        setEmailSent(true); // Email sent successfully
        startCountdown(); // Start countdown after email is sent
      } else {
        setEmailStatus('Не удалось отправить письмо.');
        setEmailSent(false); // Email failed to send
      }
    } catch (error) {
      console.error(error);
      setEmailStatus('Во время отправки возникла ошибка.');
      setEmailSent(false); // Email failed to send
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Function to start the countdown
  const startCountdown = () => {
    let timeLeft = 15;
    setCountdown(timeLeft);

    const timer = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        localStorage.clear();
        router.push('/');
      }
    }, 1000);
  };

  return (
    <Layout>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="max-w-lg mx-auto bg-white p-8 rounded shadow text-center"
      >
        {passed ? (
          <div className="text-gray-600">
            <h2 className="text-2xl font-semibold mb-4">
              Поздравляем! Вы прошли тест.
            </h2>
            <p className="text-lg">
              Вы ответили правильно на: {correctAnswers} из {questions.length} вопросов.
            </p>
            {/* Display email sending status */}
            {loading ? (
              <p className="mt-4 text-blue-600">Отправляем почту...</p>
            ) : emailStatus ? (
              <p
                className={`mt-4 ${
                  emailSent ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {emailStatus}
              </p>
            ) : null}
            {/* "Try Again" Button */}
            {!loading && emailStatus && !emailSent && (
              <button
                onClick={() => sendEmail(correctAnswers, questions.length)}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Попробуйте еще раз
              </button>
            )}
            {/* Display countdown if email is sent */}
            {emailSent && countdown !== null && (
              <p className="mt-4 text-gray-600">
                Вы будете перенаправлены на главную страницу через {countdown} секунд.
              </p>
            )}
          </div>
        ) : (
          <div className="text-gray-600">
            <h2 className="text-2xl font-semibold mb-4">
              К сожалению, вы не прошли тест, попробуйте еще раз.
            </h2>
            <p className="text-lg">
              Вы ответили правильно на: <strong>{correctAnswers}</strong> из {questions.length} вопросов.
            </p>
            <p className="text-lg mb-4">
              Страница перенаправится на главную через {countdown} секунд.
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}