import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useQuestionnaireStore from '../features/questionnaire/questionnaireSlice';
import logoSrc from '../assets/logo-main.png';

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, isError, message, registerAndSubmit, reset: resetAuth } = useAuthStore();
  const { questions, isLoading: isQuestionsLoading, submissionId, getQuestions, submitAnswers, reset: resetQuest } = useQuestionnaireStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const googleAuthUrl = `${API_URL}/api/auth/google`;

  const [step, setStep] = useState('register');
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (user && user.googleId && !user.latestSubmissionId) {
      setStep('questionnaire');
    }
  }, [user]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      resetAuth();
    }
  }, [isError, message, resetAuth]);

  useEffect(() => {
    if (submissionId) {
        toast.success('Thank you! Your personalized recommendations are ready.');
        navigate('/professionals');
    }
  }, [submissionId, navigate]);

  useEffect(() => {
    if (step === 'questionnaire') {
      getQuestions();
    }
    return () => {
      resetAuth();
      resetQuest();
    };
  }, [step, getQuestions, resetAuth, resetQuest]);

  const handleRegisterDetailsSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      setStep('questionnaire');
    } else {
      toast.error('Please fill in all registration details.');
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentQuestionIndex(questions.length);
      }
    }, 300);
  };

  const handleFinalSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question: questionId,
      answer,
    }));

    if (user && user.googleId) {
      await submitAnswers(formattedAnswers, user.token);
    } else {
      const finalUserData = { ...formData, answers: formattedAnswers };
      await registerAndSubmit(finalUserData);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const progressPercentage = (currentQuestionIndex / questions.length) * 100;
  const isLoading = isAuthLoading || isQuestionsLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 bg-[length:200%_200%] animate-gradient-pan">
      <div className={`w-full ${step === 'register' ? 'max-w-md' : 'max-w-2xl'} space-y-8 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 transition-all duration-500 md:p-12`}>

        {step === 'register' ? (
          <div>
            <div className="text-center">
              <img src={logoSrc} alt="Sathi.care Logo" className="mx-auto h-12 w-auto" />
              <p className="mt-2 text-lg text-gray-700">Create your account to begin.</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleRegisterDetailsSubmit}>
              <div className="space-y-4 rounded-md">
                <input id="name" name="name" type="text" value={formData.name} onChange={onChange} required className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm" placeholder="Full Name" />
                <input id="email-address" name="email" type="email" value={formData.email} onChange={onChange} required className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm" placeholder="Email address" />
                <input id="password" name="password" type="password" value={formData.password} onChange={onChange} required className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm" placeholder="Password" />
              </div>
              <button type="submit" disabled={isQuestionsLoading} className="group relative flex w-full justify-center rounded-lg border border-transparent bg-pastel-pink px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-pastel-pink/70">
                {isQuestionsLoading ? 'Loading...' : 'Continue to Check-in'}
              </button>
            </form>
            <div className="relative my-6"><div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300/50" /></div><div className="relative flex justify-center text-sm"><span className="bg-white/0 px-2 text-gray-600 backdrop-blur-sm">Or continue with</span></div></div>
            <div><a href={googleAuthUrl} className="group relative flex w-full items-center justify-center rounded-lg border border-gray-300/50 bg-white px-4 py-3 text-lg font-semibold text-brand-charcoal shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2"><svg className="h-5 w-5 text-brand-charcoal" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg><span className="ml-3">Sign up with Google</span></a></div>
            <div className="mt-6 text-center text-sm"><p className="text-gray-600">Already have an account? <Link to="/login" className="font-medium text-pastel-purple hover:underline">Sign in</Link></p></div>
          </div>
        ) : (
          <div>
            {isQuestionsLoading || questions.length === 0 ? <p className="text-center text-brand-charcoal animate-pulse">Loading questions...</p> : (
              <div>
                {currentQuestionIndex < questions.length ? (
                  <div>
                    <div className="mb-8 text-center"><span className="text-sm font-semibold uppercase tracking-wider text-pastel-purple">{questions[currentQuestionIndex].category}</span><h2 className="mt-2 text-2xl font-bold text-brand-charcoal sm:text-3xl">{questions[currentQuestionIndex].text}</h2></div>
                    <div className="mt-6 space-y-4">
                      {questions[currentQuestionIndex].options.map((option: string) => (
                        <button key={option} onClick={() => handleAnswerSelect(questions[currentQuestionIndex]._id, option)} className={`w-full rounded-lg p-4 text-left font-semibold transition-all duration-200 ${answers[questions[currentQuestionIndex]._id] === option ? 'bg-pastel-purple text-white ring-2 ring-white shadow-lg' : 'bg-white/50 hover:bg-white hover:shadow-md'}`}>{option}</button>
                      ))}
                    </div>
                    <div className="mt-12">
                      <div className="h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full bg-pastel-pink transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div></div>
                      <p className="mt-2 text-right text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-brand-charcoal sm:text-3xl">Thank you for completing the check-in.</h2>
                    <p className="mt-2 text-gray-600">Click submit to create your account and see your personalized recommendations.</p>
                    <button onClick={handleFinalSubmit} disabled={isLoading} className="mt-6 rounded-lg bg-pastel-pink px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:bg-pastel-pink/70">{isLoading ? 'Submitting...' : 'Submit & Create Account'}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRegisterPage;