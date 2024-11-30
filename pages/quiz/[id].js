// pages/quiz/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import questions from '../../questions';
import { motion } from 'framer-motion';
import Layout from '../../components/layout';

const questionsPerPage = 10;
const totalPages = Math.ceil(questions.length / questionsPerPage);

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;
  const page = parseInt(id);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('answers') || '{}');
    // Ensure that multiple-choice answers are arrays
    const adjustedAnswers = {};
    Object.keys(savedAnswers).forEach((key) => {
      const question = questions.find((q) => q.number.toString() === key);
      const isMultipleChoice = question && question.correctAnswer.length > 1;
      if (isMultipleChoice) {
        // Ensure the answer is an array
        adjustedAnswers[key] = Array.isArray(savedAnswers[key])
          ? savedAnswers[key]
          : [savedAnswers[key]];
      } else {
        adjustedAnswers[key] = savedAnswers[key];
      }
    });
    setAnswers(adjustedAnswers);
  }, []);

  const handleAnswer = (qIndex, value, isMultipleChoice) => {
    let newAnswers = { ...answers };
    if (isMultipleChoice) {
      const existingAnswers = Array.isArray(newAnswers[qIndex])
        ? newAnswers[qIndex]
        : [];
      if (existingAnswers.includes(value)) {
        // Remove the answer if it's already selected
        newAnswers[qIndex] = existingAnswers.filter((v) => v !== value);
      } else {
        // Add the new answer
        newAnswers[qIndex] = [...existingAnswers, value];
      }
    } else {
      newAnswers[qIndex] = value;
    }
    setAnswers(newAnswers);
    localStorage.setItem('answers', JSON.stringify(newAnswers));
  };

  const handleNext = () => {
    if (page < 4) {
      router.push(`/quiz/${page + 1}`);
    } else {
      router.push('/result');
    }
  };

  const currentQuestions = questions.slice((page - 1) * 10, page * 10);

  if (!page) return null;

  return (
    <Layout>
      <motion.div
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        className="space-y-6"
      >
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(page / totalPages) * 100}%` }}
          ></div>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Страница {page} из {totalPages}
        </h2>
        {currentQuestions.map((q) => {
          const isMultipleChoice = q.correctAnswer.length > 1;
          return (
            <div key={q.number} className="bg-white p-6 rounded shadow">
              <p className="font-medium text-gray-600 mb-4">
                {q.number}) <strong>{q.question}</strong>
              </p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const inputName = `question-${q.number}`;
                  const inputValue = idx + 1;
                  const isChecked = isMultipleChoice
                    ? Array.isArray(answers[q.number]) &&
                      answers[q.number].includes(inputValue)
                    : answers[q.number] == inputValue;
                  return (
                    <div key={idx} className="flex items-center">
                      <label className="flex items-center text-gray-600">
                        <input
                          type={isMultipleChoice ? 'checkbox' : 'radio'}
                          name={
                            isMultipleChoice ? `${inputName}-${idx}` : inputName
                          }
                          value={inputValue}
                          checked={isChecked}
                          onChange={() =>
                            handleAnswer(q.number, inputValue, isMultipleChoice)
                          }
                          className="mr-2 focus:ring-blue-600"
                        />
                        {opt}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="text-center">
          <button
            onClick={handleNext}
            className="mt-6 bg-blue-600 text-white py-2 px-8 rounded hover:bg-blue-700 transition-colors"
          >
            {page < totalPages ? 'Next Page' : 'Submit'}
          </button>
        </div>
      </motion.div>
    </Layout>
  );
}