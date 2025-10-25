// src/pages/StagePage.tsx
import React, { useState, useEffect } from 'react';
import type { Stage } from '../types';
import { apiService } from '../services/apiService';
import styles from './StagePage.module.css';
import { useAuth } from '../hooks/useAuth';

const XP_PER_QUESTION = 50;
const PASS_THRESHOLD = 4;

interface StagePageProps {
    stageId: string;
}

const StagePage: React.FC<StagePageProps> = ({ stageId }) => {
    const { user, updateUserProgress } = useAuth();
    
    const [stage, setStage] = useState<Stage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStage = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await apiService.getStageById(stageId);
                setStage(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu màn chơi.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStage();
    }, [stageId]);

    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [isStageFinished, setIsStageFinished] = useState(false);

    const navigate = (path: string) => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', paddingTop: '5rem' }}>Đang tải màn chơi...</div>;
    }
    if (error) {
        return <div style={{ textAlign: 'center', paddingTop: '5rem', color: '#f87171' }}>Lỗi: {error}</div>;
    }
    if (!stage) {
        return <div style={{ textAlign: 'center', paddingTop: '5rem' }}>Không tìm thấy dữ liệu màn chơi.</div>;
    }

    const handleSelectAnswer = (index: number) => {
        if (!isAnswerChecked) setSelectedAnswer(index);
    };

    const handleCheckAnswer = () => {
        if (selectedAnswer === null) return;
        setIsAnswerChecked(true);
        if (selectedAnswer === stage.quizzes[currentQuizIndex].correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuizIndex < stage.quizzes.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
        } else {
            const passed = score >= PASS_THRESHOLD;
            const xpGained = score * XP_PER_QUESTION;
            if (passed && user && !user.completedStages.includes(stage.id)) {
                updateUserProgress(stage.id, xpGained);
            }
            setIsStageFinished(true);
        }
    };

    if (isStageFinished) {
        const passed = score >= PASS_THRESHOLD;
        const xpGained = score * XP_PER_QUESTION;
        
        return (
            <div className={styles.container}>
                <div className={styles.completionBox}>
                    <i className={`fas ${passed ? 'fa-trophy' : 'fa-sad-tear'}`} style={{ color: passed ? '#facc15' : '#9ca3af' }}></i>
                    <h1>{passed ? 'Chúc mừng!' : 'Cố gắng lần sau!'}</h1>
                    <p>Bạn đã trả lời đúng {score}/{stage.quizzes.length} câu hỏi.</p>
                    {passed ? (
                        <p className={styles.xp}>Bạn nhận được {xpGained} XP!</p>
                    ) : (
                        <p>Bạn cần trả lời đúng ít nhất {PASS_THRESHOLD} câu để qua màn.</p>
                    )}
                    <button onClick={() => navigate('/')}>
                        <i className="fas fa-map-signs" style={{ marginRight: '8px' }}></i> Về lại bản đồ
                    </button>
                </div>
            </div>
        );
    }

    if (!stage.quizzes || stage.quizzes.length === 0) {
        return (
             <div className={styles.container} style={{ textAlign: 'center' }}>
                <p>Màn chơi này chưa có câu hỏi. Vui lòng quay lại sau.</p>
                <button onClick={() => navigate('/')} className={styles.backButton}>
                    <i className="fas fa-arrow-left"></i> Quay lại Bản đồ
                </button>
            </div>
        );
    }

    const currentQuiz = stage.quizzes[currentQuizIndex];

    return (
        <div className={styles.container}>
            <button onClick={() => navigate('/')} className={styles.backButton}>
                <i className="fas fa-arrow-left"></i> Quay lại Bản đồ
            </button>
            <div className={styles.quizBox}>
                <div className={styles.header}>
                    <h1>{stage.name}</h1>
                    <div style={{ textAlign: 'right' }}>
                        <div className={styles.progress}>
                            Câu hỏi <span>{currentQuizIndex + 1}</span> / {stage.quizzes.length}
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
                            Mức độ: <span style={{ color: '#e5e7eb', fontWeight: '500' }}>{currentQuiz.bloomTag}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.questionContainer}>
                    <h2>{currentQuiz.question}</h2>
                </div>
                <div className={styles.optionsGrid}>
                    {currentQuiz.options.map((option, index) => {
                        const isCorrect = index === currentQuiz.correctAnswerIndex;
                        let buttonClass = styles.optionButton;
                        if (isAnswerChecked) {
                            if (isCorrect) buttonClass += ` ${styles.correct}`;
                            else if (index === selectedAnswer) buttonClass += ` ${styles.incorrect}`;
                            else buttonClass += ` ${styles.disabled}`;
                        } else if (index === selectedAnswer) {
                            buttonClass += ` ${styles.selected}`;
                        }
                        return (
                            <button
                                key={index}
                                onClick={() => handleSelectAnswer(index)}
                                disabled={isAnswerChecked}
                                className={buttonClass}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
                {isAnswerChecked && (
                    <div className={`${styles.explanationBox} ${selectedAnswer === currentQuiz.correctAnswerIndex ? styles.explanationCorrect : styles.explanationIncorrect}`}>
                        <h3>{selectedAnswer === currentQuiz.correctAnswerIndex ? 'Chính xác!' : 'Chưa đúng!'}</h3>
                        <p>{currentQuiz.explanation}</p>
                    </div>
                )}
                <div className={styles.footer}>
                    {!isAnswerChecked ? (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={selectedAnswer === null}
                            className={`${styles.actionButton} ${styles.checkButton}`}
                        >
                            Kiểm tra
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className={`${styles.actionButton} ${styles.nextButton}`}
                        >
                            {currentQuizIndex < stage.quizzes.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
                            <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StagePage;