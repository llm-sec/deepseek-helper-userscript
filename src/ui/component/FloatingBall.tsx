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
        width: '56px',
        height: '56px',
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ballBefore: {
        content: '""',
        position: 'absolute' as const,
        width: '24px',
        height: '2px',
        backgroundColor: 'white',
        transition: 'transform 0.3s ease',
    },
    ballAfter: {
        content: '""',
        position: 'absolute' as const,
        width: '2px',
        height: '24px',
        backgroundColor: 'white',
        transition: 'transform 0.3s ease',
    },
    ballActive: {
        transform: 'rotate(45deg)',
    },
    menu: {
        position: 'fixed' as const,
        bottom: '20px',
        right: '20px',
        pointerEvents: 'none' as const,
        opacity: 0,
        transition: 'opacity 0.28s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        width: '300px',
        height: '300px',
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
        position: 'absolute' as const,
        whiteSpace: 'nowrap' as const,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        top: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0,
        transition: 'opacity 0.2s ease',
    },
    menuItemLabelVisible: {
        opacity: 1,
    }
};

const FloatingBall: React.FC<FloatingBallProps> = ({ menuConfig }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
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

    const calculatePosition = (index: number): { x: number, y: number } => {
        const total = menuConfig.length;
        // 使用固定位置而不是角度计算，确保布局一致
        switch (total) {
            case 1:
                return { x: 0, y: -120 };
            case 2:
                return index === 0 ? { x: -100, y: -60 } : { x: 0, y: -120 };
            case 3:
                switch (index) {
                    case 0: return { x: -100, y: -60 };
                    case 1: return { x: 0, y: -120 };
                    case 2: return { x: 100, y: -60 };
                    default: return { x: 0, y: 0 };
                }
            case 4:
                switch (index) {
                    case 0: return { x: -100, y: -60 };
                    case 1: return { x: -60, y: -100 };
                    case 2: return { x: 60, y: -100 };
                    case 3: return { x: 100, y: -60 };
                    default: return { x: 0, y: 0 };
                }
            default:
                // 如果有更多项目，使用圆形布局
                const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
                const radius = 120;
                return {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                };
        }
    };

    // 创建加号图标
    const renderPlusIcon = () => {
        return (
            <>
                <div style={{
                    ...inlineStyles.ballBefore,
                    transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                }} />
                <div style={{
                    ...inlineStyles.ballAfter,
                    transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                }} />
            </>
        );
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
            >
                {renderPlusIcon()}
            </div>
            <div
                style={{
                    ...inlineStyles.menu,
                    ...(isMenuOpen ? inlineStyles.menuActive : {})
                }}
                onMouseEnter={() => leaveTimer.current && clearTimeout(leaveTimer.current)}
                onMouseLeave={handleMouseLeave}
            >
                {menuConfig.map((item, index) => {
                    const { x, y } = calculatePosition(index);
                    const isHovered = hoveredItem === index;
                    
                    return (
                        <div
                            key={index}
                            style={{
                                ...inlineStyles.menuItem,
                                ...(isMenuOpen ? inlineStyles.menuItemActive : {}),
                                color: item.color,
                                transform: isMenuOpen ? `translate(${x}px, ${y}px)` : 'translate(0, 0)',
                                transitionDelay: `${index * 40}ms`,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                                hideMenu();
                            }}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <i className={`fas ${item.icon}`} style={{ fontSize: '20px' }} />
                            {item.label && (
                                <div
                                    style={{
                                        ...inlineStyles.menuItemLabel,
                                        ...(isHovered ? inlineStyles.menuItemLabelVisible : {})
                                    }}
                                >
                                    {item.label}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FloatingBall; 