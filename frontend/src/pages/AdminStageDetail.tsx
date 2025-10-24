// src/pages/AdminStageDetail.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Quiz, Stage } from '../types';
import styles from './AdminPage.module.css';

type QuizFormData = Omit<Quiz, 'id'>;

interface AdminStageDetailProps {
    stageId: string;
}

const AdminStageDetail: React.FC<AdminStageDetailProps> = ({ stageId }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [stage, setStage] = useState<Stage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [formData, setFormData] = useState<QuizFormData>({
        question: '', options: ['', '', '', ''], correctAnswerIndex: 0,
        explanation: '', stageId: stageId, difficulty: 'Dễ',
    });

    const navigate = (path: string) => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
    };

    const fetchQuizzes = useCallback(async () => {
        setIsLoading(true);
        try {
            const [stageData, quizzesData] = await Promise.all([
                apiService.getStageById(stageId),
                apiService.getQuizzesByStageId(stageId)
            ]);
            setStage(stageData);
            setQuizzes(quizzesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    }, [stageId]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleOpenModal = (quiz: Quiz | null = null) => {
        setEditingQuiz(quiz);
        if (quiz) {
            setFormData({ ...quiz, stageId });
        } else {
            setFormData({ question: '', options: ['', '', '', ''], correctAnswerIndex: 0, explanation: '', stageId: stageId, difficulty: 'Dễ' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'correctAnswerIndex' ? parseInt(value) : value }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingQuiz && editingQuiz.id) {
                await apiService.updateQuiz(editingQuiz.id, formData);
            } else {
                await apiService.createQuiz(formData);
            }
            handleCloseModal();
            fetchQuizzes();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Lỗi khi lưu câu đố");
        }
    };

    const handleDelete = async (quizId: string) => {
        if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
            await apiService.deleteQuiz(quizId);
            setQuizzes(prev => prev.filter(q => q.id !== quizId));
        }
    };

    if (isLoading) return <div className={styles.loading}>Đang tải...</div>;
    if (error) return <div className={styles.error}>Lỗi: {error}</div>;

    return (
        <div className={styles.container}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: '1rem' }}>&larr; Quay lại Danh sách Màn chơi</button>
            <h1 className={styles.title}>Quản lý Câu đố cho: {stage?.name}</h1>
            
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button onClick={() => handleOpenModal()}>Thêm Câu đố mới</button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Câu hỏi</th>
                            <th style={{ width: '150px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map(quiz => (
                            <tr key={quiz.id}>
                                <td>{quiz.question}</td>
                                <td>
                                    <button onClick={() => handleOpenModal(quiz)}>Sửa</button>
                                    <button onClick={() => handleDelete(quiz.id)} style={{ marginLeft: '0.5rem' }}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>{editingQuiz ? 'Chỉnh sửa Câu đố' : 'Tạo Câu đố mới'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={formGroupStyle}>
                                <label>Nội dung câu hỏi</label>
                                <textarea name="question" value={formData.question} onChange={handleFormChange} required rows={3} style={inputStyle} />
                            </div>
                            {[0, 1, 2, 3].map(i => (
                                <div style={formGroupStyle} key={i}>
                                    <label>Lựa chọn {i + 1}</label>
                                    <input value={formData.options[i]} onChange={(e) => handleOptionChange(i, e.target.value)} required style={inputStyle} />
                                </div>
                            ))}
                            <div style={formGroupStyle}>
                                <label>Đáp án đúng</label>
                                <select name="correctAnswerIndex" value={formData.correctAnswerIndex} onChange={handleFormChange} style={inputStyle}>
                                    <option value={0}>Lựa chọn 1</option>
                                    <option value={1}>Lựa chọn 2</option>
                                    <option value={2}>Lựa chọn 3</option>
                                    <option value={3}>Lựa chọn 4</option>
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label>Giải thích</label>
                                <textarea name="explanation" value={formData.explanation} onChange={handleFormChange} required rows={3} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                <button type="button" onClick={handleCloseModal}>Hủy</button>
                                <button type="submit" style={{ marginLeft: '0.5rem' }}>Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Style cho Modal
const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 100,
};
const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#1f2937', padding: '2rem', borderRadius: '0.5rem',
    width: '90%', maxWidth: '600px', color: 'white', maxHeight: '90vh', overflowY: 'auto'
};
const formGroupStyle: React.CSSProperties = {
    marginBottom: '1rem', display: 'flex', flexDirection: 'column'
};
const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: '#111827', border: '1px solid #4b5563',
    borderRadius: '0.375rem', padding: '0.5rem 0.75rem', color: 'white',
    marginTop: '0.25rem', boxSizing: 'border-box'
};

export default AdminStageDetail;