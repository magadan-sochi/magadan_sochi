import React, { useState } from 'react';
import { NewQuiz, NewQuestion, NewAnswer, QuestionType } from '../../types';
import { api } from '../../services/mockApi';

interface QuizEditorScreenProps {
    onNavigate: (view: string) => void;
}

const initialAnswerState: NewAnswer = { answer_text: '', is_correct: false, is_trap: false };
const initialQuestionState: NewQuestion = { question_text: '', question_type: QuestionType.SINGLE_CHOICE, answers: [initialAnswerState] };
const initialQuizState: NewQuiz = { title: '', questions: [initialQuestionState] };

export const QuizEditorScreen: React.FC<QuizEditorScreenProps> = ({ onNavigate }) => {
    const [quiz, setQuiz] = useState<NewQuiz>(initialQuizState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleQuizTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuiz(prev => ({...prev, title: e.target.value}));
    };
    
    const handleQuestionChange = (qIndex: number, value: string) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].question_text = value;
        setQuiz(prev => ({...prev, questions: newQuestions}));
    };

    const handleAnswerChange = (qIndex: number, aIndex: number, value: string) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].answers[aIndex].answer_text = value;
        setQuiz(prev => ({...prev, questions: newQuestions}));
    };
    
    const handleCorrectAnswerToggle = (qIndex: number, aIndex: number) => {
         const newQuestions = [...quiz.questions];
         // For single choice, unselect others
         newQuestions[qIndex].answers.forEach((ans, idx) => {
            ans.is_correct = idx === aIndex;
            if (idx === aIndex) ans.is_trap = false; // Cannot be correct and a trap
         });
         setQuiz(prev => ({...prev, questions: newQuestions}));
    };

    const handleTrapToggle = (qIndex: number, aIndex: number) => {
        const newQuestions = [...quiz.questions];
        const answer = newQuestions[qIndex].answers[aIndex];
        if (answer.is_correct) return; // A correct answer can't be a trap
        answer.is_trap = !answer.is_trap;
        setQuiz(prev => ({...prev, questions: newQuestions}));
    };

    const addAnswer = (qIndex: number) => {
        const newQuestions = [...quiz.questions];
        if (newQuestions[qIndex].answers.length < 5) { // Limit answers
            newQuestions[qIndex].answers.push({...initialAnswerState});
            setQuiz(prev => ({...prev, questions: newQuestions}));
        }
    };
    
    const addQuestion = () => {
        setQuiz(prev => ({...prev, questions: [...prev.questions, {...initialQuestionState, answers: [{...initialAnswerState}]}]}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            const newQuiz = await api.createQuiz(quiz);
            if(newQuiz) {
                alert(`Тест "${newQuiz.title}" успешно создан!`);
                onNavigate('home');
            } else {
                throw new Error("Не удалось создать тест.");
            }
        } catch(err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 pb-24">
             <div className="flex items-center mb-6">
                 <button onClick={() => onNavigate('home')} className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-3xl font-bold text-white">Редактор тестов</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white/5 p-4 rounded-lg">
                    <label htmlFor="quizTitle" className="block text-sm font-medium text-gray-300">Название теста</label>
                    <input type="text" id="quizTitle" value={quiz.title} onChange={handleQuizTitleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" />
                </div>

                {quiz.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-white/5 p-4 rounded-lg space-y-4">
                         <label className="block text-sm font-medium text-gray-300">Вопрос {qIndex + 1}</label>
                         <textarea value={q.question_text} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} required rows={2} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" />
                        
                        <div className="space-y-2">
                            {q.answers.map((a, aIndex) => (
                                <div key={aIndex} className="flex items-center space-x-2">
                                    <input type="text" placeholder={`Ответ ${aIndex + 1}`} value={a.answer_text} onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)} required className="flex-grow bg-gray-800 border-gray-600 rounded-md shadow-sm text-white p-2" />
                                    <button type="button" title="Отметить как правильный" onClick={() => handleCorrectAnswerToggle(qIndex, aIndex)} className={`p-2 rounded-full ${a.is_correct ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                     <button type="button" title="Отметить как ловушку" onClick={() => handleTrapToggle(qIndex, aIndex)} className={`p-2 rounded-full ${a.is_trap ? 'bg-amber-500' : 'bg-gray-600 hover:bg-gray-500'} ${a.is_correct ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addAnswer(qIndex)} className="text-sm text-cyan-400 hover:text-cyan-300">+ Добавить ответ</button>
                    </div>
                ))}

                <button type="button" onClick={addQuestion} className="w-full text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    + Добавить вопрос
                </button>

                 {error && <p className="text-red-400 text-center">{error}</p>}
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50">
                    {isSubmitting ? "Сохранение..." : "Сохранить тест"}
                </button>
            </form>
        </div>
    );
};