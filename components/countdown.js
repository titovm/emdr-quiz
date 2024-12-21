export default function Countdown({ countdown }) {
  return (
    <p className={`mt-4 text-gray-600 ${countdown < 10 ? 'text-red-600 font-bold' : ''}`}>
      <span className="font-bold">Внимание!</span><br />Результаты сбросятся и вы будете перенаправлены на главную страницу через {countdown} секунд.
    </p>
  );
}