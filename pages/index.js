// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '../components/layout';
import centres from '../centres'; // Import the centres
import Head from 'next/head'; // Import Head from next/head

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', email: '', centreId: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userData', JSON.stringify(userData));
    router.push('/quiz/1');
  };

  return (
    <Layout>
      <Head>
        <title>Тест EMDR</title>
        <meta name="description" content="Тест на знание базового протокола EMDR" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-md mx-auto bg-white p-8 rounded"
      >
        <h2 className="text-2xl font-semibold text-gray-600 mb-6 text-center">
          Тест на знание базового протокола EMDR
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="ФИО"
            required
            value={userData.name}
            onChange={(e) =>
              setUserData({ ...userData, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          {/* Select Field for Centre */}
          
          <select
            required
            value={userData.centreId}
            onChange={(e) =>
              setUserData({ ...userData, centreId: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>
              Выберите центр обучения
            </option>
            {centres.map((centre) => (
              <option key={centre.id} value={centre.id}>
                {centre.name}
              </option>
            ))}
          </select>
          <p className='text-sm dark:text-gray-700'>В этом центре вы собираетесь обучаться второму модулю и аминистратору будут отправлены Ваши результаты.</p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Начать тест
          </button>
        </form>
      </motion.div>
    </Layout>
  );
}