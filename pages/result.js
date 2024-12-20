// pages/result.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import questions from '../questions';
import { motion } from 'framer-motion';
import Layout from '../components/layout';
import Head from 'next/head';
import * as gtag from '../lib/gtag';

export default function Result() {
  const router = useRouter();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [passed, setPassed] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(null); // New state variable
  const [answers, setAnswers] = useState({}); // New state variable

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('answers') || '{}');
    setAnswers(savedAnswers);
    
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = savedAnswers[q.number];
      if (!userAnswer) return; // Skip if no answer
      
      // Check if question is multiple choice
      const isMultipleChoice = q.correctAnswer.length > 1;
      
      if (isMultipleChoice) {
        // Handle multiple choice questions
        const userArr = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        const userNums = userArr.map(Number);
        const correctNums = q.correctAnswer.map(Number);
        
        // Check if arrays match (same length and all values present)
        const isCorrect = 
          userNums.length === correctNums.length &&
          correctNums.every(num => userNums.includes(num));
          
        if (isCorrect) correct++;
      } else {
        // Handle single choice questions
        const userNum = Number(userAnswer);
        const correctNum = Number(q.correctAnswer[0]);
        
        if (userNum === correctNum) correct++;
      }
    });

    setCorrectAnswers(correct);
    
    const totalQuestions = questions.length;
    const percentage = (correct / totalQuestions) * 100;

    if (percentage > 70) {
      setPassed(true);
      sendEmail(correct, totalQuestions);
      gtag.event('quiz_result', {
        result: 'Pass',
        correct_answers: correct,
      });
    } else {
      setPassed(false);
      startCountdown();
      gtag.event('quiz_result', {
        result: 'Fail',
        correct_answers: correct,
      });
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
    let timeLeft = 90;
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
      <Head>
        <title>Тест EMDR - Результаты теста</title>
        <meta name="description" content="Результаты теста на знание базового протокола EMDR" />
      </Head>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="max-w-lg mx-auto bg-white p-8 rounded text-center"
      >
        {passed ? (
          <div className="text-gray-600">
            <h2 className="text-2xl font-semibold mb-4">
              Поздравляем! Вы прошли тест.
            </h2>
            <p className="text-lg mb-8">
              Вы ответили правильно на: {correctAnswers} из {questions.length} вопросов.
            </p>

            {/* Question Grid */}
            <div className="grid grid-cols-5 md:grid-cols-8 gap-4 mb-8 max-w-3xl mx-auto">
              {questions.map((q) => {
                const userAnswer = answers[q.number];
                // Skip if no answer
                if (!userAnswer) return false;

                const isCorrect = Array.isArray(q.correctAnswer) 
                  ? (() => {
                      // Convert userAnswer to array of numbers
                      const userArr = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
                      const userNums = userArr.map(Number);
                      const correctNums = q.correctAnswer.map(Number);
                      
                      // Check if arrays match (same length and all values present)
                      return userNums.length === correctNums.length &&
                        correctNums.every(num => userNums.includes(num));
                    })()
                  : Number(userAnswer) === Number(q.correctAnswer[0]);

                return (
                  <div
                    key={q.number}
                    className={`
                      relative group cursor-help
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}
                  >
                    {q.number}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-sm rounded w-48 hidden group-hover:block z-10">
                      {q.question}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Email status and loading state */}
            {loading ? (
              <p className="mt-4 text-blue-600">Отправляем почту...</p>
            ) : emailStatus ? (
              <p className={`mt-4 ${emailSent ? 'text-green-600' : 'text-red-600'}`}>
                {emailStatus}
              </p>
            ) : null}

            {/* Countdown */}
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
            <p className="text-lg mb-8">
              Вы ответили правильно на: <strong>{correctAnswers}</strong> из {questions.length} вопросов, к сожалению этого не достаточно для допуска ко второму модулю.
            </p>
            
            {/* Question Grid for failed attempt */}
            <div className="grid grid-cols-5 md:grid-cols-8 gap-4 mb-8 max-w-3xl mx-auto">
              {questions.map((q) => {
                const userAnswer = answers[q.number];
                // Skip if no answer
                if (!userAnswer) return false;

                const isCorrect = Array.isArray(q.correctAnswer) 
                  ? (() => {
                      // Convert userAnswer to array of numbers
                      const userArr = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
                      const userNums = userArr.map(Number);
                      const correctNums = q.correctAnswer.map(Number);
                      
                      // Check if arrays match (same length and all values present)
                      return userNums.length === correctNums.length &&
                        correctNums.every(num => userNums.includes(num));
                    })()
                  : Number(userAnswer) === Number(q.correctAnswer[0]);

                return (
                  <div
                    key={q.number}
                    className={`
                      relative group cursor-help
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}
                  >
                    {q.number}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-sm rounded w-48 hidden group-hover:block z-10">
                      {q.question}
                    </div>
                  </div>
                );
              })}
              
            </div>
            {/* Countdown */}
            {countdown !== null && (
                <div className="mt-4 text-gray-600">
                <p className="mt-4 text-gray-600">
                  Вы будете перенаправлены на главную страницу через {countdown} секунд.
                </p>
                </div>
              )}
          </div>
        )}
      </motion.div>
    </Layout>
  );
}