import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useQuestionnaireStore from '../features/questionnaire/questionnaireSlice';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const {
    questions,
    isLoading: isQuestionsLoading,
    isError,
    message,
    getQuestions,
    submitAnswers,
    submissionId,
    reset
  } = useQuestionnaireStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isAuthLoading && user?.token) {
      getQuestions();
    }
  }, [isAuthLoading, user, getQuestions]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (submissionId) {
      toast.success('Your responses have been submitted!');
      navigate('/professionals');
    }
  }, [isError, message, submissionId, navigate]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setTimeout(() => {
      if (currentQuestionIndex < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 300);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }
    if (user?.token) {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question: questionId,
        answer,
      }));
      submitAnswers(formattedAnswers, user.token);
    }
  };

  if (isAuthLoading || (isQuestionsLoading && questions.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <p className="text-lg text-brand-charcoal animate-pulse">
          Finalizing your registration...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 bg-[length:200%_200%] animate-gradient-pan">
      <div className="w-full max-w-2xl rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
        {questions.length > 0 && currentQuestionIndex < questions.length ? (
          <div>
            <div className="mb-8 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-pastel-purple">{currentQuestion.category}</span>
              <h2 className="mt-2 text-2xl font-bold text-brand-charcoal sm:text-3xl">
                {currentQuestion.text}
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              {currentQuestion.options.map((option: string) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                  className={`w-full rounded-lg p-4 text-left font-semibold transition-all duration-200 ${
                    answers[currentQuestion._id] === option
                      ? 'bg-pastel-purple text-white ring-2 ring-white shadow-lg'
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-12">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-pastel-pink transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="mt-2 text-right text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
             <h2 className="text-2xl font-bold text-brand-charcoal sm:text-3xl">
                Thank you for completing the check-in.
              </h2>
              <p className="mt-2 text-gray-600">Click submit to see your personalized recommendations.</p>
              <button
                onClick={handleSubmit}
                disabled={isQuestionsLoading}
                className="mt-6 rounded-lg bg-pastel-pink px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50"
              >
                {isQuestionsLoading ? 'Submitting...' : 'Submit & See Results'}
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnairePage;