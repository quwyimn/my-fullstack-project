// src/components/admin/AdminStageManager.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { Stage } from '../../types';
import styles from '../../pages/AdminPage.module.css';

type StageFormData = Omit<Stage, 'id' | 'quizzes' | 'creature'>;

const AdminStageManager: React.FC = () => {
    const [stages, setStages] = useState<Stage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState<Stage | null>(null);
    const [formData, setFormData] = useState<StageFormData>({
        name: '',
        description: '',
        difficulty: 'Dễ',
        backgroundUrl: '',
        order: 0,
    });

    const navigate = (path: string) => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
    };

    const fetchStages = async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getStages();
            setStages(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStages();
    }, []);

    const handleOpenModal = (stage: Stage | null = null) => {
        setEditingStage(stage);
        if (stage) {
            setFormData({
                name: stage.name,
                description: stage.description,
                difficulty: stage.difficulty,
                backgroundUrl: stage.backgroundUrl,
                order: stage.order,
            });
        } else {
            setFormData({ name: '', description: '', difficulty: 'Dễ', backgroundUrl: '', order: stages.length + 1 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStage(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStage && editingStage.id) {
                await apiService.updateStage(editingStage.id, formData);
            } else {
                await apiService.createStage(formData);
            }
            handleCloseModal();
            fetchStages();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Lỗi khi lưu");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa màn chơi này không? Mọi câu hỏi liên quan cũng sẽ bị xóa.')) {
            try {
                await apiService.deleteStage(id);
                fetchStages();
            } catch (err) {
                alert(err instanceof Error ? err.message : "Lỗi khi xóa");
            }
        }
    };

    if (isLoading) return <div className={styles.loading}>Đang tải...</div>;
    if (error) return <div className={styles.error}>Lỗi: {error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Danh sách Màn chơi ({stages.length})</h2>
                <button onClick={() => handleOpenModal()} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Thêm Màn chơi mới</button>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Thứ tự</th>
                            <th>Tên Màn chơi</th>
                            <th>Độ khó</th>
                            <th style={{ width: '250px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.map(stage => (
                            <tr key={stage.id}>
                                <td>{stage.order}</td>
                                <td>{stage.name}</td>
                                <td>{stage.difficulty}</td>
                                <td>
                                    <button onClick={() => navigate(`/admin/stage/${stage.id}`)}>Quản lý Câu đố</button>
                                    <button onClick={() => handleOpenModal(stage)} style={{ marginLeft: '0.5rem' }}>Sửa</button>
                                    <button onClick={() => handleDelete(stage.id)} style={{ marginLeft: '0.5rem' }}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>{editingStage ? 'Chỉnh sửa Màn chơi' : 'Tạo Màn chơi mới'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={formGroupStyle}>
                                <label>Tên Màn chơi</label>
                                <input name="name" value={formData.name} onChange={handleFormChange} required style={inputStyle} />
                            </div>
                            <div style={formGroupStyle}>
                                <label>Mô tả</label>
                                <textarea name="description" value={formData.description} onChange={handleFormChange} required rows={3} style={inputStyle} />
                            </div>
                            <div style={formGroupStyle}>
                                <label>Độ khó</label>
                                <select name="difficulty" value={formData.difficulty} onChange={handleFormChange} style={inputStyle}>
                                    <option value="Dễ">Dễ</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Khó">Khó</option>
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label>Thứ tự</label>
                                <input name="order" type="number" value={formData.order} onChange={handleFormChange} required style={inputStyle} />
                            </div>
                            <div style={formGroupStyle}>
                                <label>URL Hình nền</label>
                                <input name="backgroundUrl" value={formData.backgroundUrl} onChange={handleFormChange} style={inputStyle} />
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
    width: '90%', maxWidth: '500px', color: 'white'
};
const formGroupStyle: React.CSSProperties = {
    marginBottom: '1rem', display: 'flex', flexDirection: 'column'
};
const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: '#111827', border: '1px solid #4b5563',
    borderRadius: '0.375rem', padding: '0.5rem 0.75rem', color: 'white',
    marginTop: '0.25rem', boxSizing: 'border-box'
};

export default AdminStageManager;