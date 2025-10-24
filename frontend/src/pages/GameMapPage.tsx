// src/pages/GameMapPage.tsx
import React, { useState, useEffect } from 'react';
import type { Stage } from '../types';
import { apiService } from '../services/apiService';
import StageNode from '../components/StageNode';
import styles from './GameMapPage.module.css';
import { useAuth } from '../hooks/useAuth';

const MAP_WIDTH = 2800;
const MAP_HEIGHT = 600;

// --- CUNG CẤP LẠI DỮ LIỆU CHO CÁC BIẾN NÀY ---
const stagePositions = [
    { top: '40%', left: '8%' }, { top: '65%', left: '18%' }, { top: '40%', left: '28%' },
    { top: '20%', left: '40%' }, { top: '50%', left: '52%' }, { top: '30%', left: '65%' },
    { top: '60%', left: '78%' }, { top: '40%', left: '92%' },
];

const pathSegments = [
    "M 224 240 C 300 240, 450 390, 504 390", "M 504 390 C 580 390, 720 240, 784 240",
    "M 784 240 C 880 240, 1020 120, 1120 120", "M 1120 120 C 1220 120, 1360 300, 1456 300",
    "M 1456 300 C 1550 300, 1720 180, 1820 180", "M 1820 180 C 1920 180, 2080 360, 2184 360",
    "M 2184 360 C 2280 360, 2480 240, 2576 240",
];
// ----------------------------------------------------

const GameMapPage: React.FC = () => {
    const { user } = useAuth(); 
    
    const [stages, setStages] = useState<Stage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const data = await apiService.getStages();
                setStages(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu màn chơi.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStages();
    }, []);

    const getStageStatus = (stageId: string, index: number): 'completed' | 'current' | 'locked' => {
        if (!user) return 'locked';
        if (user.completedStages.includes(stageId)) return 'completed';
        if (index === 0) return 'current';
        const prevStage = stages[index - 1];
        if (prevStage && user.completedStages.includes(prevStage.id)) return 'current';
        return 'locked';
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', paddingTop: '5rem' }}>Đang tải hải đồ...</div>;
    }
    if (error) {
        return <div style={{ textAlign: 'center', paddingTop: '5rem', color: '#f87171' }}>Lỗi: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Hải Đồ Phiêu Lưu</h1>
            <p className={styles.subtitle}>Cuộc hành trình khám phá thuật toán dưới đáy đại dương.</p>
            <div className={styles.map} style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
                <svg width={MAP_WIDTH} height={MAP_HEIGHT} style={{ position: 'absolute', top: 0, left: 0 }}>
                    {pathSegments.map((path, index) => {
                        const prevStage = stages[index];
                        const isPathUnlocked = prevStage && user?.completedStages.includes(prevStage.id);
                        return (
                            <g key={`path-${index}`}>
                                <path d={path} className={styles.pathBackground} />
                                {isPathUnlocked && <path d={path} className={styles.pathProgress} />}
                            </g>
                        );
                    })}
                </svg>
                {stages.map((stage, index) => {
                    const position = stagePositions[index];
                    if (!position) return null;
                    return (
                        <StageNode 
                            key={stage.id}
                            stage={stage}
                            status={getStageStatus(stage.id, index)}
                            top={position.top}
                            left={position.left}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default GameMapPage;