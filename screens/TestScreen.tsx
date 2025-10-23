import React, { useState, useEffect } from 'react';
import { Quiz, Question, Answer } from '../types';
import { api } from '../services/mockApi';

const QuizList: React.FC<{ onSelectQuiz: (quiz: Quiz) => void }> = ({ onSelectQuiz }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getQuizzes().then(data => {
            setQuizzes(data);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 pb-20">
            <h1 className="text-3xl font-bold text-white mb-6">Выберите тест</h1>
            <div className="space-y-4">
                {quizzes.length > 0 ? quizzes.map(quiz => (
                    <div
                        key={quiz.id}
                        onClick={() => onSelectQuiz(quiz)}
                        className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    >
                        <h2 className="text-xl font-semibold text-cyan-400">{quiz.title}</h2>
                        <p className="text-gray-400">{quiz.questions.length} вопросов</p>
                    </div>
                )) : <p className="text-gray-400">Доступных тестов нет.</p>}
            </div>
        </div>
    );
};

const QuizRunner: React.FC<{ quiz: Quiz, onFinish: (score: number, total: number) => void }> = ({ quiz, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleAnswer = (answer: Answer) => {
        if (isAnswered) return;

        setSelectedAnswerId(answer.id);
        setIsAnswered(true);

        if (answer.is_correct) {
            setScore(s => s + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(i => i + 1);
                setIsAnswered(false);
                setSelectedAnswerId(null);
            } else {
                onFinish(score + (answer.is_correct ? 1 : 0), quiz.questions.length);
            }
        }, 1500);
    };
    
    const getButtonClass = (answer: Answer) => {
        if (!isAnswered) return 'bg-gray-700 hover:bg-cyan-600';
        if (answer.is_correct) return 'bg-green-600';
        if (selectedAnswerId === answer.id && !answer.is_correct) return 'bg-red-600';
        return 'bg-gray-700 opacity-50';
    };

    return (
        <div className="p-4 pb-20 flex flex-col h-screen">
            <div className="mb-4 text-center">
                <p className="text-gray-400">Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}</p>
                <p className="text-cyan-400 font-bold">Счет: {score}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg flex-grow flex flex-col">
                <h2 className="text-2xl font-semibold text-white mb-6">{currentQuestion.question_text}</h2>
                <div className="space-y-4">
                    {currentQuestion.answers.map(answer => (
                        <button
                            key={answer.id}
                            onClick={() => handleAnswer(answer)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg text-white font-medium transition-colors duration-300 ${getButtonClass(answer)}`}
                        >
                            {answer.answer_text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const QuizResult: React.FC<{ score: number, total: number, onRestart: () => void }> = ({ score, total, onRestart }) => {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
        <div className="p-4 text-center flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-white mb-4">Тест завершен!</h1>
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl">
                <p className="text-xl text-gray-300 mb-2">Ваш результат:</p>
                <p className="text-6xl font-bold text-cyan-400 mb-4">{score} / {total}</p>
                <p className="text-3xl font-bold" style={{color: percentage > 80 ? '#4ade80' : percentage > 50 ? '#facc15' : '#f87171'}}>{percentage}%</p>
            </div>
            <button
                onClick={onRestart}
                className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
            >
                К списку тестов
            </button>
        </div>
    );
};

export const TestScreen: React.FC = () => {
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);

    const handleFinish = (score: number, total: number) => {
        setQuizResult({ score, total });
        setSelectedQuiz(null);
    };

    const handleRestart = () => {
        setSelectedQuiz(null);
        setQuizResult(null);
    };

    if (quizResult) {
        return <QuizResult score={quizResult.score} total={quizResult.total} onRestart={handleRestart} />;
    }

    if (selectedQuiz) {
        return <QuizRunner quiz={selectedQuiz} onFinish={handleFinish} />;
    }

    return <QuizList onSelectQuiz={setSelectedQuiz} />;
};