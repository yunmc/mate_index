export const THEME = {
    'PRIMARY': '#CCE3FF',
    // 字体颜色FFF
    'fc-1': '#1D2542',
    'fc-6': '#666666',
    'fc-3': '#333333',
    'fc-5': '#555555',
    'fc-9': '#999999',
    // 辅助色
    'ass-1': 'rgba(255, 255, 255, 0.7)',

    'red': '#FF0B0B',
    'fff': '#FFFFFF',
};

export const SHORTCUTS = [
    ['/^fs-(d+.{0,1}d{0,2})$/', ([, d = 1]) => ({ 'font-size': `${d}px` })],
    ['/^leh-(d+.{0,1}d{0,2})$/', ([, d = 1]) => ({ 'line-height': `${d}px` })],
    ['/^bg-(d+.{0,1}d{0,2})$/', ([, d = 1]) => ({ background: `${d}` })],
    ['center', 'flex-center-center'],
    // ['border-color', `border-1 border-${THEME.Cborder}`],
    ['bg', `background-${THEME.fff}`],
    ['full', 'h-screen w-screen overflow-hidden bg-cover bg-center'],
    ['position-center', 'absolute left-1/2 top-1/2 text-white -translate-x-1/2 -translate-y-1/2'],
    ['win-xl', 'w-1200 m-a'],
    ['bg-primary', `background-${THEME.PRIMARY}`],
    ['tab', 'h-59 w-92 font-size-20 fw-bold flex-center-center text-666666 cursor-pointer'],
    ['tab-current', 'h-59 w-92 font-size-20 fw-bold flex-center-center text-666666 cursor-pointer'],
    ['c-p', 'cursor-pointer'],
    {
        border_b: 'border-b-1 border-414267',
    },
];
