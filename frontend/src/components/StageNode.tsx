// src/components/StageNode.tsx
import React from 'react';
import type { Stage } from '../types';
import styles from './StageNode.module.css';

interface StageNodeProps {
    stage: Stage;
    status: 'completed' | 'current' | 'locked';
    top: string;
    left: string;
}

const StageNode: React.FC<StageNodeProps> = ({ stage, status, top, left }) => {
    
    const handleClick = () => {
        if (status !== 'locked') {
            window.dispatchEvent(new CustomEvent('navigate', { detail: { path: `/stage/${stage.id}` } }));
        }
    };

    const statusConfig = {
        locked: { className: styles.locked, icon: 'fa-lock', borderColor: '#4b5563' },
        current: { className: styles.current, icon: 'fa-compass', borderColor: '#2dd4bf' },
        completed: { className: styles.completed, icon: 'fa-anchor', borderColor: '#6366f1' },
    };

    const config = statusConfig[status];
    const isClickable = status !== 'locked';

    return (
        <div className={styles.nodeWrapper} style={{ top, left }}>
            <button onClick={handleClick} disabled={!isClickable} className={`${styles.nodeButton} ${config.className}`}>
                <i className={`fas ${config.icon}`}></i>
                {status === 'current' && <div className={styles.ping}></div>}
            </button>
            <div className={styles.tooltip} style={{ borderColor: config.borderColor }}>
                <h3>{stage.name}</h3>
                <p>{stage.description}</p>
                <div>Độ khó: {stage.difficulty}</div>
            </div>
        </div>
    );
};

export default StageNode;