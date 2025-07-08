import React, { useState, useEffect, useRef } from 'react';
// 移除CSS模块导入，改用内联样式
// import styles from './FloatingBall.module.css';

interface MenuItemConfig {
    icon: string;
    color: string;
    action: () => void;
    label?: string;
}

interface FloatingBallProps {
    menuConfig: MenuItemConfig[];
}

// 内联样式定义
const inlineStyles = {
    container: {
        position: 'fixed' as const,
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
    },
    ball: {
        width: '56px',
        height: '56px',
        background: '#2196F3',
        borderRadius: '50%',
        position: 'relative' as const,
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.25)',
        transition: 'all 0.28s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    ballActive: {
        transform: 'rotate(225deg)',
    },
    menu: {
        position: 'fixed' as const,
        bottom: '20px',
        right: '20px',
        pointerEvents: 'none' as const,
        opacity: 0,
        transition: 'opacity 0.28s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    menuActive: {
        opacity: 1,
        pointerEvents: 'auto' as const,
    },
    menuItem: {
        position: 'absolute' as const,
        width: '48px',
        height: '48px',
        background: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        opacity: 0,
        transform: 'translate(0, 0)',
        transition: 'all 0.28s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    menuItemActive: {
        opacity: 1,
    },
    menuItemLabel: {
        marginLeft: '8px',
        fontSize: '14px',
    }
};

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
        <div style={inlineStyles.container} ref={containerRef}>
            <div
                style={{
                    ...inlineStyles.ball,
                    ...(isMenuOpen ? inlineStyles.ballActive : {})
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={toggleMenu}
            />
            <div
                style={{
                    ...inlineStyles.menu,
                    ...(isMenuOpen ? inlineStyles.menuActive : {})
                }}
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
                            style={{
                                ...inlineStyles.menuItem,
                                ...(isMenuOpen ? inlineStyles.menuItemActive : {}),
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
                            {item.label && <span style={inlineStyles.menuItemLabel}>{item.label}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FloatingBall; 