
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MenuItem } from '../types';
import { api } from '../services/mockApi';

const Flashcard: React.FC<{ item: MenuItem, onFlip: () => void, isFlipped: boolean }> = ({ item, onFlip, isFlipped }) => {
    return (
        <div className="w-full h-full perspective-1000" onClick={onFlip}>
            <div 
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
                {/* Front of card */}
                <div className="absolute w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg flex flex-col justify-end p-6 text-white">
                     <img src={item.image_url} alt={item.name} className="absolute top-0 left-0 w-full h-full object-cover -z-10" />
                     <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <h2 className="text-3xl font-bold leading-tight">{item.name}</h2>
                    <p className="text-sm text-white/80 mt-2">Нажмите, чтобы увидеть детали</p>
                </div>

                {/* Back of card */}
                <div className="absolute w-full h-full backface-hidden rounded-3xl shadow-2xl border border-white/20 bg-slate-900/60 backdrop-blur-lg flex flex-col p-6 overflow-y-auto card-back-scroll rotate-y-180">
                    <h2 className="text-2xl font-bold text-cyan-300 mb-3">{item.name}</h2>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{item.description}</p>
                    
                    {item.key_features?.ingredients && item.key_features.ingredients.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-white mb-2">Состав:</h3>
                            <div className="flex flex-wrap gap-2">
                                {item.key_features.ingredients.map((ing, idx) => (
                                    <span key={idx} className="bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">{ing}</span>
                                ))}
                            </div>
                        </div>
                    )}
                     
                    {item.key_features?.allergens && item.key_features.allergens.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-white mb-2">Аллергены:</h3>
                            <div className="flex flex-wrap gap-2">
                                {item.key_features.allergens.map((allergen, idx) => (
                                    <span key={idx} className="bg-amber-500/20 text-amber-300 text-xs font-medium px-2.5 py-1 rounded-full">{allergen}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-white/10">
                         <p className="text-3xl font-bold text-right text-emerald-400">{item.price} ₽</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LearnScreen: React.FC = () => {
    const [deck, setDeck] = useState<MenuItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [swipeClass, setSwipeClass] = useState('');
    const touchStartPos = useRef<number | null>(null);

    useEffect(() => {
        api.getMenuItems().then(items => {
            setDeck(items.sort(() => Math.random() - 0.5)); // Shuffle deck
            setIsLoading(false);
        });
    }, []);

    const currentItem = useMemo(() => deck[currentIndex], [deck, currentIndex]);

    const handleSwipe = (action: 'know' | 'repeat') => {
        if (!currentItem || swipeClass) return;

        setIsFlipped(false);
        
        setSwipeClass(action === 'know' ? 'animate-slide-out-right' : 'animate-slide-out-left');
        
        setTimeout(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1));
            setSwipeClass('');
        }, 400); // Match animation duration
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartPos.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartPos.current === null) return;
        
        const touchEndPos = e.changedTouches[0].clientX;
        const deltaX = touchEndPos - touchStartPos.current;
        const swipeThreshold = 50; // Minimum distance for a swipe

        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) { // Swiped right
                handleSwipe('know');
            } else { // Swiped left
                handleSwipe('repeat');
            }
        }
        
        touchStartPos.current = null;
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    if (!currentItem) {
        return (
            <div className="p-4 text-center h-screen flex flex-col items-center justify-center">
                <div className="relative p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-2xl text-center">
                    <span className="text-6xl">🎉</span>
                    <p className="mt-4 text-2xl font-bold text-white">Вы всё изучили!</p>
                    <p className="text-gray-300 mt-1">Отличная работа!</p>
                    <button 
                        onClick={() => {
                            setDeck(deck.sort(() => Math.random() - 0.5));
                            setCurrentIndex(0);
                        }}
                        className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                    >
                        Начать заново
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20 flex flex-col h-screen overflow-hidden items-center justify-center">
            <h1 className="text-3xl font-bold text-white mb-4 text-center opacity-80">Режим "Учить"</h1>
            <div className="flex-grow flex flex-col items-center justify-center relative w-full px-4">
                <div 
                    className={`w-full max-w-sm min-h-[500px] mb-6 transition-all duration-300 ${swipeClass}`}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {currentItem && <Flashcard item={currentItem} onFlip={() => setIsFlipped(!isFlipped)} isFlipped={isFlipped} />}
                </div>
                
                <div className="flex justify-around w-full max-w-sm">
                    <button 
                        onClick={() => handleSwipe('repeat')}
                        className="bg-rose-500/90 hover:bg-rose-500 text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-transform transform hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        Повторить
                    </button>
                    <button 
                        onClick={() => handleSwipe('know')}
                        className="bg-emerald-500/90 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-transform transform hover:scale-110"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        Знаю
                    </button>
                </div>
            </div>
            <div className="text-center text-gray-400 mt-4">
                Карточка {currentIndex + 1} из {deck.length}
            </div>
        </div>
    );
};
