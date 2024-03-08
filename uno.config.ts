import type { UserShortcuts } from 'unocss';
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss';

import presetRemToPx from '@unocss/preset-rem-to-px';
import { presetScalpel } from 'unocss-preset-scalpel';
import { SHORTCUTS, THEME } from './src/assets/unocss';

export default defineConfig({
    shortcuts: SHORTCUTS as UserShortcuts<any>,
    presets: [
        presetScalpel(
            // this is preset default value
            {
                /**
                 * define color name
                 */
                colors: THEME,
                /**
                 * the default unit you can omitted
                 * like width-1 mean this unit ⬇
                 */
                unit: 'px',
                /**
                 * write you like mediaQuery
                 */
                mediaQueries: {
                    sm: 'media (min-width: 640px)',
                    md: 'media (min-width: 768px)',
                    lg: 'media (min-width: 1024px)',
                    xl: 'media (min-width: 1280px)',
                    // supportGrid: 'supports (display: grid)'
                },
                // set all css has important
                important: false,
                // ignore some rules like ['flexBasis']
                ignoreRules: [],
                // convert unit v
                vToAny: {
                    unit: 'rem', // convert v to rem
                    rootValue: 16, // value ÷ this
                    unitPrecision: 5,
                    minPixelValue: 1,
                },
            }
        ),
        presetUno(),
        presetRemToPx(),
        presetAttributify(),
        presetIcons({
            scale: 1.2,
        }),
        presetTypography(),
        presetWebFonts({
            fonts: {
                sans: 'DM Sans',
                serif: 'DM Serif Display',
                mono: 'DM Mono',
            },
        }),
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()],
    theme: {
        colors: {
            primary: THEME.PRIMARY,
        },
    },
});
