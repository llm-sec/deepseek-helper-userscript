import React, { useState, useEffect, useRef } from 'react';
import styles from './FloatingBall.module.css';

interface MenuItemConfig {
    icon: string;
    color: string;
    action: () => void;
    label?: string;
}

interface FloatingBallProps {
    menuConfig: MenuItemConfig[];
}

const FloatingBall: React.FC<FloatingBallProps> = ({ menuConfig }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const enterTimer = useRef<number | null>(null);
    const leaveTimer = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const showMenu = () => {
        if (isMenuOpen) return;
        setMenuOpen(true);
    };

    const hideMenu = () => {
        if (!isMenuOpen) return;
        setMenuOpen(false);
    };

    const handleMouseEnter = () => {
        if (enterTimer.current) clearTimeout(enterTimer.current);
        enterTimer.current = window.setTimeout(showMenu, 200);
    };

    const handleMouseLeave = () => {
        if (enterTimer.current) clearTimeout(enterTimer.current);
        leaveTimer.current = window.setTimeout(hideMenu, 300);
    };
    
    const toggleMenu = (e: React.TouchEvent) => {
        e.preventDefault();
        isMenuOpen ? hideMenu() : showMenu();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                hideMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            if (enterTimer.current) clearTimeout(enterTimer.current);
            if (leaveTimer.current) clearTimeout(leaveTimer.current);
        };
    }, []);

    const calculateAngle = (index: number): number => {
        const total = menuConfig.length;
        const startAngle = -Math.PI / 2 - (135 * Math.PI / 180) / 2;
        const angleStep = total > 1 ? (135 * Math.PI / 180) / (total - 1) : 0;
        return startAngle + angleStep * index;
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div
                className={`${styles.ball} ${isMenuOpen ? styles.active : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={toggleMenu}
            />
            <div
                className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}
                onMouseEnter={() => leaveTimer.current && clearTimeout(leaveTimer.current)}
                onMouseLeave={handleMouseLeave}
            >
                {menuConfig.map((item, index) => {
                    const angle = calculateAngle(index);
                    const radius = 120;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    return (
                        <div
                            key={index}
                            className={styles.menuItem}
                            style={{
                                color: item.color,
                                transform: `translate(${x}px, ${y}px)`,
                                transitionDelay: `${index * 40}ms`,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                                hideMenu();
                            }}
                        >
                            <i className={`fas ${item.icon}`} />
                            {item.label && <span className={styles.menuItemLabel}>{item.label}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FloatingBall; 