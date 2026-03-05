/**
 * Component Registry — CDS Design System
 *
 * Maps CDS components to Figma JSX blueprints.
 * All token values sourced from ds-engine.js which reads the CDS token spec.
 *
 * Source of truth: https://github.com/rahulbhide-opengov/CDS-Design-System
 *
 * Components: Button, IconButton, ButtonGroup, TextField, Select,
 * Checkbox, Radio, Switch, ToggleButton, Chip, Avatar,
 * Card, Dialog, Tooltip, Snackbar, Alert, Skeleton,
 * List, Navigation, Breadcrumb, Stepper, Timeline,
 * DataTable, DatePicker, PageHeading, SectionHeading,
 * FormLayout, Accordion, Tabs, AppBar, Badge, Progress
 */

import dsEngine from './ds-engine.js';

const { resolveToken, px, toHex, getOpacity, getComponentTokens, getTypographyStyle, getColorGroup } = dsEngine;

const t = (name) => resolveToken(name) || '';
const h = (name) => toHex(name);
const p = (name) => px(name);

function colors() {
  return {
    primary: h('--colors/primary/main'),
    primaryLight: h('--colors/primary/light'),
    primary100: h('--colors/primary/100'),
    primary200: h('--colors/primary/200'),
    primary400: h('--colors/primary/400'),
    primaryDark: h('--colors/primary/dark'),
    primaryContrast: h('--colors/primary/contrast-text'),
    secondary: h('--colors/secondary/main'),
    secondaryLight: h('--colors/secondary/light'),
    secondaryDark: h('--colors/secondary/dark'),
    secondaryContrast: h('--colors/secondary/contrast-text'),
    error: h('--colors/error/main'),
    errorContrast: h('--colors/error/contrast-text'),
    errorLight: h('--colors/error/light'),
    warning: h('--colors/warning/main'),
    warningLight: h('--colors/warning/light'),
    success: h('--colors/success/main'),
    successLight: h('--colors/success/light'),
    info: h('--colors/info/main'),
    infoLight: h('--colors/info/light'),
    textPrimary: h('--colors/text/primary'),
    textSecondary: h('--colors/text/secondary'),
    textTertiary: h('--colors/text/tertiary'),
    textDisabled: h('--colors/text/disabled'),
    textHint: h('--colors/text/hint'),
    bgDefault: h('--colors/background/default'),
    bgPaper: h('--colors/background/paper'),
    bgTertiary: h('--colors/background/tertiary'),
    bgElevation1: h('--colors/background/paper-elevation-1'),
    grey50: h('--colors/grey/50'),
    grey100: h('--colors/grey/100'),
    grey200: h('--colors/grey/200'),
    grey300: h('--colors/grey/300'),
    grey400: h('--colors/grey/400'),
    grey500: h('--colors/grey/500'),
    grey700: h('--colors/grey/700'),
    grey900: h('--colors/grey/900'),
    border: h('--colors/border/default'),
    borderFocus: h('--colors/border/focus'),
    divider: h('--colors/divider'),
    actionHover: h('--colors/action/hover'),
    actionSelected: h('--colors/action/selected'),
    actionDisabled: h('--colors/action/disabled'),
    actionDisabledBg: h('--colors/action/disabled-background'),
    primaryStateHover: t('--colors/primary-states/hover'),
    primaryStateSelected: t('--colors/primary-states/selected'),
    primaryStateFocusVisible: t('--colors/primary-states/focus-visible'),
  };
}

function radius(name) {
  return p(`--border-radius/${name}`);
}

function spacing(n) {
  return p(`--spacing/${n}`);
}

const components = {};

// ---------------------------------------------------------------------------
// BUTTON — CDS: weight 500, sizes 28/32/40, radius 4
// ---------------------------------------------------------------------------
components.button = {
  name: 'Button',
  description: 'CDS action button with contained, outlined, and text variants',
  variants: ['contained', 'outlined', 'text'],
  sizes: ['small', 'medium', 'large'],
  colors: ['primary', 'secondary', 'error'],

  render({ variant = 'contained', size = 'medium', label = 'Button', color = 'primary', disabled = false } = {}) {
    const c = colors();
    const btnH = p(`--sizing/button/${size}`);
    const typo = getTypographyStyle(`button/${size}`);
    const fontSize = typo ? parseInt(typo['font-size']) : 14;
    const fontWeight = typo ? typo['font-weight'] : '500';
    const r = radius('button');
    const px_pad = size === 'small' ? 16 : size === 'large' ? 26 : 22;

    const colorMap = {
      primary: { bg: c.primary, text: c.primaryContrast, border: c.primary },
      secondary: { bg: c.secondary, text: c.secondaryContrast, border: c.secondary },
      error: { bg: c.error, text: c.errorContrast, border: c.error },
    };
    const col = colorMap[color] || colorMap.primary;

    if (disabled) {
      col.bg = c.actionDisabledBg;
      col.text = c.actionDisabled;
      col.border = c.actionDisabledBg;
    }

    if (variant === 'contained') {
      return `<Frame name="Button/${variant}/${size}" h={${btnH}} flex="row" items="center" justify="center" px={${px_pad}} bg="${col.bg}" rounded={${r}} gap={8}>
  <Text size={${fontSize}} weight="${fontWeight}" color="${col.text}">${label}</Text>
</Frame>`;
    }

    if (variant === 'outlined') {
      return `<Frame name="Button/${variant}/${size}" h={${btnH}} flex="row" items="center" justify="center" px={${px_pad}} bg="${c.bgPaper}" stroke="${col.border}" strokeWidth={1} rounded={${r}} gap={8}>
  <Text size={${fontSize}} weight="${fontWeight}" color="${col.bg}">${label}</Text>
</Frame>`;
    }

    return `<Frame name="Button/${variant}/${size}" h={${btnH}} flex="row" items="center" justify="center" px={${px_pad}} rounded={${r}} gap={8}>
  <Text size={${fontSize}} weight="${fontWeight}" color="${col.bg}">${label}</Text>
</Frame>`;
  },

  renderAll() {
    const items = [];
    for (const variant of this.variants) {
      for (const size of this.sizes) {
        items.push(this.render({ variant, size, label: `${variant} ${size}` }));
      }
    }
    return items;
  }
};

// ---------------------------------------------------------------------------
// ICON BUTTON — CDS: touch target 48px min
// ---------------------------------------------------------------------------
components.iconbutton = {
  name: 'Icon Button',
  description: 'CDS icon-only button',
  sizes: ['small', 'medium', 'large'],

  render({ size = 'medium', variant = 'default' } = {}) {
    const c = colors();
    const dim = p(`--sizing/button/${size}`);
    const touchDim = Math.max(dim, 48);
    const iconSize = p(`--sizing/icon/${size === 'large' ? 'large' : size === 'small' ? 'small' : 'medium'}`);
    const bg = variant === 'contained' ? c.primary : 'transparent';
    const iconColor = variant === 'contained' ? '#ffffff' : c.textTertiary;

    return `<Frame name="IconButton/${size}" w={${touchDim}} h={${touchDim}} flex="row" items="center" justify="center" rounded={${touchDim}} bg="${bg}">
  <Frame w={${iconSize}} h={${iconSize}} bg="${iconColor}" rounded={${Math.round(iconSize * 0.2)}} opacity={0.7} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BUTTON GROUP
// ---------------------------------------------------------------------------
components.buttongroup = {
  name: 'Button Group',
  description: 'CDS group of related buttons',

  render({ buttons = ['One', 'Two', 'Three'], variant = 'outlined' } = {}) {
    const c = colors();
    const r = radius('button');

    const items = buttons.map(btn =>
      `  <Frame h={32} px={16} flex="row" items="center" justify="center" stroke="${c.border}" strokeWidth={1}>
    <Text size={14} weight="500" color="${c.primary}">${btn}</Text>
  </Frame>`
    ).join('\n');

    return `<Frame name="ButtonGroup" flex="row" rounded={${r}} overflow="hidden">
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TEXT FIELD — CDS: radius 4, sizes 28/32/40
// ---------------------------------------------------------------------------
components.textfield = {
  name: 'Text Field',
  description: 'CDS form input with outlined and filled variants',
  variants: ['outlined', 'filled'],
  sizes: ['small', 'medium', 'large'],

  render({ variant = 'outlined', size = 'medium', label = 'Label', placeholder = 'Enter text...', error = false, helperText = '', readOnly = false } = {}) {
    const c = colors();
    const inputH = p(`--sizing/input/${size}`);
    const r = radius('input');
    const labelStyle = getTypographyStyle(`input/label/${size}`) || {};
    const labelSize = parseInt(labelStyle['font-size'] || '14');
    const valueStyle = getTypographyStyle(`input/value/${size}`) || {};
    const valueSize = parseInt(valueStyle['font-size'] || '16');
    const helperStyle = getTypographyStyle('input/helper') || {};
    const helperSize = parseInt(helperStyle['font-size'] || '14');
    const borderColor = error ? c.error : c.border;
    const labelColor = error ? c.error : c.textSecondary;

    const readOnlyBg = readOnly ? 'rgba(75,63,255,0.04)' : (variant === 'filled' ? c.bgElevation1 : c.bgPaper);

    const fieldContent = variant === 'filled'
      ? `<Frame name="Input Container" w="fill" h={${inputH}} flex="row" items="center" px={12} bg="${readOnlyBg}" roundedTL={${r}} roundedTR={${r}} stroke="${borderColor}" strokeWidth={1}>
    <Text size={${valueSize}} color="${readOnly ? c.textPrimary : c.textDisabled}" w="fill">${placeholder}</Text>
  </Frame>`
      : `<Frame name="Input Container" w="fill" h={${inputH}} flex="row" items="center" px={12} bg="${readOnlyBg}" stroke="${borderColor}" strokeWidth={1} rounded={${r}}>
    <Text size={${valueSize}} color="${readOnly ? c.textPrimary : c.textDisabled}" w="fill">${placeholder}</Text>
  </Frame>`;

    const helperJsx = helperText
      ? `\n  <Text size={${helperSize}} color="${error ? c.error : c.textSecondary}">${helperText}</Text>`
      : '';

    return `<Frame name="TextField/${variant}/${size}" w={280} flex="col" gap={4}>
  <Text size={${labelSize}} weight="400" color="${labelColor}">${label}</Text>
  ${fieldContent}${helperJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SELECT / AUTOCOMPLETE
// ---------------------------------------------------------------------------
components.select = {
  name: 'Select',
  description: 'CDS dropdown select',

  render({ label = 'Country', placeholder = 'Select...', options = ['United States', 'Canada', 'United Kingdom'], open = true } = {}) {
    const c = colors();
    const r = radius('input');

    const dropdownJsx = open
      ? `\n  <Frame name="Dropdown" w="fill" flex="col" bg="${c.bgPaper}" rounded={${r}} stroke="${c.border}" strokeWidth={1} shadow="0 4 12 #0000001a">
${options.map(opt => `    <Frame w="fill" h={40} flex="row" items="center" px={12}>
      <Text size={14} color="${c.textPrimary}">${opt}</Text>
    </Frame>`).join('\n')}
  </Frame>`
      : '';

    return `<Frame name="Select" w={280} flex="col" gap={4}>
  <Text size={14} weight="400" color="${c.textSecondary}">${label}</Text>
  <Frame w="fill" h={32} flex="row" items="center" px={12} bg="${c.bgPaper}" stroke="${c.border}" strokeWidth={1} rounded={${r}} gap={8}>
    <Text size={14} color="${c.textDisabled}" w="fill">${placeholder}</Text>
    <Text size={12} color="${c.textSecondary}">▼</Text>
  </Frame>${dropdownJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CHECKBOX
// ---------------------------------------------------------------------------
components.checkbox = {
  name: 'Checkbox',
  description: 'CDS checkbox with label',

  render({ checked = false, label = 'Accept terms', disabled = false } = {}) {
    const c = colors();
    const boxColor = checked ? c.primary : c.textTertiary;
    const bg = checked ? c.primary : 'transparent';

    return `<Frame name="Checkbox" flex="row" items="center" gap={8}>
  <Frame w={20} h={20} rounded={2} stroke="${boxColor}" strokeWidth={2} bg="${bg}" flex="row" items="center" justify="center">
    ${checked ? `<Text size={14} weight="700" color="#ffffff">✓</Text>` : ''}
  </Frame>
  <Text size={14} color="${disabled ? c.textDisabled : c.textPrimary}">${label}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// RADIO — CDS primary color for checked state
// ---------------------------------------------------------------------------
components.radio = {
  name: 'Radio',
  description: 'CDS radio button group',

  render({ options = ['Option A', 'Option B', 'Option C'], selected = 0, label = 'Choose one' } = {}) {
    const c = colors();

    const items = options.map((opt, i) => {
      const isSelected = i === selected;
      const ringColor = isSelected ? c.primary : c.textTertiary;
      return `  <Frame flex="row" items="center" gap={8}>
    <Frame w={20} h={20} rounded={20} stroke="${ringColor}" strokeWidth={2} flex="row" items="center" justify="center">
      ${isSelected ? `<Frame w={10} h={10} bg="${c.primary}" rounded={10} />` : ''}
    </Frame>
    <Text size={14} color="${c.textPrimary}">${opt}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="RadioGroup" flex="col" gap={12}>
  <Text size={14} weight="500" color="${c.textPrimary}">${label}</Text>
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SWITCH — CDS primary track color
// ---------------------------------------------------------------------------
components.switch = {
  name: 'Switch',
  description: 'CDS toggle switch',

  render({ checked = false, label = 'Enable notifications', disabled = false } = {}) {
    const c = colors();
    const trackColor = checked ? c.primary : c.grey500;
    const thumbColor = checked ? '#ffffff' : '#fafafa';

    return `<Frame name="Switch" flex="row" items="center" gap={12}>
  <Frame w={42} h={22} bg="${trackColor}" rounded={11} px={2} flex="row" items="center">
    <Frame w={18} h={18} bg="${thumbColor}" rounded={18} shadow="0 1 3 #00000033" />
  </Frame>
  <Text size={14} color="${disabled ? c.textDisabled : c.textPrimary}">${label}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TOGGLE BUTTON
// ---------------------------------------------------------------------------
components.togglebutton = {
  name: 'Toggle Button',
  description: 'CDS toggle button group',

  render({ options = ['Left', 'Center', 'Right'], selected = 1 } = {}) {
    const c = colors();

    const items = options.map((opt, i) => {
      const isSelected = i === selected;
      const bg = isSelected ? c.actionSelected : 'transparent';
      return `  <Frame h={32} px={16} flex="row" items="center" justify="center" bg="${bg}" stroke="${c.border}" strokeWidth={1}>
    <Text size={14} weight="${isSelected ? '600' : '400'}" color="${isSelected ? c.primary : c.textPrimary}">${opt}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="ToggleButtonGroup" flex="row" rounded={${radius('button')}} overflow="hidden">
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CHIP — CDS: radius extraSmall (2px), sizes 28/32/40
// ---------------------------------------------------------------------------
components.chip = {
  name: 'Chip',
  description: 'CDS compact element for filters and tags',
  variants: ['filled', 'outlined'],

  render({ variant = 'filled', label = 'Chip', color = 'default', deletable = false, size = 'medium' } = {}) {
    const c = colors();
    const chipH = p(`--sizing/chip/${size}`);
    const px_val = 12;
    const r = radius('chip');
    const iconSize = 18;
    const typo = getTypographyStyle(`chip/${size}`) || {};
    const fontSize = parseInt(typo['font-size'] || '14');

    let bgColor, textColor;
    if (color === 'primary') {
      bgColor = variant === 'filled' ? c.primary100 : c.bgPaper;
      textColor = c.primary;
    } else if (color === 'secondary') {
      bgColor = variant === 'filled' ? c.secondaryLight : c.bgPaper;
      textColor = c.secondary;
    } else if (color === 'error') {
      bgColor = variant === 'filled' ? c.errorLight : c.bgPaper;
      textColor = variant === 'filled' ? '#ffffff' : c.error;
    } else {
      bgColor = variant === 'filled' ? c.grey300 : c.bgPaper;
      textColor = c.textPrimary;
    }
    const strokeAttr = variant === 'outlined' ? ` stroke="${c.border}" strokeWidth={1}` : '';

    const deleteIcon = deletable
      ? `\n    <Frame w={${iconSize}} h={${iconSize}} bg="${textColor}" rounded={${iconSize / 2}} opacity={0.6} />`
      : '';

    return `<Frame name="Chip/${variant}/${size}" h={${chipH}} flex="row" items="center" px={${px_val}} gap={4} bg="${bgColor}" rounded={${r}}${strokeAttr}>
  <Text size={${fontSize}} weight="500" color="${textColor}">${label}</Text>${deleteIcon}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// AVATAR — CDS: sizes 24/40/56
// ---------------------------------------------------------------------------
components.avatar = {
  name: 'Avatar',
  description: 'CDS user avatar',
  sizes: ['small', 'medium', 'large'],

  render({ size = 'medium', initials = 'AB', color = 'primary' } = {}) {
    const c = colors();
    const dim = p(`--sizing/avatar/${size}`);
    const bg = color === 'primary' ? c.primary : color === 'secondary' ? c.secondary : c.grey400;
    const typo = getTypographyStyle(`avatar/${size}`) || {};
    const fontSize = parseInt(typo['font-size'] || String(Math.round(dim * 0.35)));

    return `<Frame name="Avatar/${size}" w={${dim}} h={${dim}} bg="${bg}" rounded={${dim}} flex="row" items="center" justify="center">
  <Text size={${fontSize}} weight="400" color="#ffffff">${initials}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BADGE
// ---------------------------------------------------------------------------
components.badge = {
  name: 'Badge',
  description: 'CDS notification badge',

  render({ count = 5, color = 'error' } = {}) {
    const c = colors();
    const bg = color === 'primary' ? c.primary : c.error;

    return `<Frame name="Badge" w={20} h={20} bg="${bg}" rounded={10} flex="row" items="center" justify="center">
  <Text size={12} weight="500" color="#ffffff">${count}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// CARD — CDS: radius small (4px), elevation 1
// ---------------------------------------------------------------------------
components.card = {
  name: 'Card',
  description: 'CDS content container',
  variants: ['elevated', 'outlined'],

  render({ variant = 'elevated', title = 'Card Title', subtitle = '', body = 'Card content goes here.', hasActions = false, width = 320 } = {}) {
    const c = colors();
    const r = radius('card');
    const h3 = getTypographyStyle('heading/h4') || {};

    const strokeAttr = variant === 'outlined' ? ` stroke="${c.border}" strokeWidth={1}` : '';
    const shadowAttr = variant === 'elevated' ? ' shadow="0 2 4 #0000001a"' : '';
    const subtitleJsx = subtitle
      ? `\n    <Text size={12} color="${c.textSecondary}" w="fill">${subtitle}</Text>`
      : '';
    const actionsJsx = hasActions
      ? `\n  <Frame name="Actions" w="fill" flex="row" gap={8} justify="end" pt={8}>
    ${components.button.render({ variant: 'text', size: 'small', label: 'Cancel' })}
    ${components.button.render({ variant: 'contained', size: 'small', label: 'Confirm' })}
  </Frame>`
      : '';

    return `<Frame name="Card/${variant}" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${r}} p={${spacing(4)}}${strokeAttr}${shadowAttr} overflow="hidden" gap={${spacing(3)}}>
  <Frame name="Header" w="fill" flex="col" gap={4}>
    <Text size={${parseInt(h3['font-size'] || '20')}} weight="${h3['font-weight'] || '600'}" color="${c.textPrimary}" w="fill">${title}</Text>${subtitleJsx}
  </Frame>
  <Text size={14} color="${c.textSecondary}" w="fill">${body}</Text>${actionsJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DIALOG — CDS: title weight 600, content 14px
// ---------------------------------------------------------------------------
components.dialog = {
  name: 'Dialog',
  description: 'CDS modal dialog',

  render({ title = 'Dialog Title', body = 'Are you sure you want to proceed?', confirmLabel = 'Confirm', cancelLabel = 'Cancel' } = {}) {
    const c = colors();
    const tok = getComponentTokens('dialog');
    const r = radius('dialog');
    const maxW = parseInt(tok['max-width'] || '560');
    const contentPad = parseInt(tok['content-padding'] || '24');
    const titleH = parseInt(tok['title-height'] || '64');
    const actionsH = parseInt(tok['actions-height'] || '52');
    const actionsSpacing = parseInt(tok['actions-spacing'] || '8');
    const dialogTypo = getTypographyStyle('dialog/title') || {};

    return `<Frame name="Dialog/Backdrop" w={800} h={600} flex="col" items="center" justify="center" bg="#00000052">
  <Frame name="Dialog" w={${maxW}} flex="col" bg="${c.bgPaper}" rounded={${r}} shadow="0 8 24 #00000033" overflow="hidden">
    <Frame name="Title" w="fill" h={${titleH}} flex="row" items="center" px={${contentPad}}>
      <Text size={${parseInt(dialogTypo['font-size'] || '20')}} weight="${dialogTypo['font-weight'] || '600'}" color="${c.textPrimary}" w="fill">${title}</Text>
    </Frame>
    <Frame name="Content" w="fill" flex="col" px={${contentPad}} pb={${contentPad}}>
      <Text size={14} color="${c.textSecondary}" w="fill">${body}</Text>
    </Frame>
    <Frame name="Actions" w="fill" h={${actionsH}} flex="row" items="center" justify="end" px={${contentPad}} gap={${actionsSpacing}}>
      ${components.button.render({ variant: 'text', size: 'medium', label: cancelLabel })}
      ${components.button.render({ variant: 'contained', size: 'medium', label: confirmLabel })}
    </Frame>
  </Frame>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// ALERT — CDS: 4 severities, radius 4px
// ---------------------------------------------------------------------------
components.alert = {
  name: 'Alert',
  description: 'CDS alert/notification banner',
  variants: ['error', 'warning', 'info', 'success'],

  render({ severity = 'info', title = '', message = 'This is an alert message.', hasClose = true } = {}) {
    const c = colors();
    const bgMap = { error: '#fdeded', warning: '#fff4e5', info: '#e5f6fd', success: '#edf7ed' };
    const colorMap = { error: c.error, warning: c.warning, info: c.info, success: c.success };
    const bg = bgMap[severity] || bgMap.info;
    const fg = colorMap[severity] || colorMap.info;
    const r = radius('alert');
    const alertTitleTypo = getTypographyStyle('alert/title') || {};

    const titleJsx = title
      ? `\n    <Text size={${parseInt(alertTitleTypo['font-size'] || '18')}} weight="${alertTitleTypo['font-weight'] || '600'}" color="${fg}">${title}</Text>`
      : '';
    const closeJsx = hasClose
      ? `\n  <Text size={18} color="${fg}" opacity={0.6}>✕</Text>`
      : '';

    return `<Frame name="Alert/${severity}" w={400} flex="row" items="start" px={16} py={12} bg="${bg}" rounded={${r}} gap={12}>
  <Text size={22} color="${fg}">ℹ</Text>
  <Frame flex="col" gap={4} grow={1}>${titleJsx}
    <Text size={14} color="${fg}" w="fill">${message}</Text>
  </Frame>${closeJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TOOLTIP
// ---------------------------------------------------------------------------
components.tooltip = {
  name: 'Tooltip',
  description: 'CDS contextual information popup',

  render({ text = 'Tooltip text' } = {}) {
    const tok = getComponentTokens('tooltip');
    const pxVal = parseInt(tok['padding-horizontal'] || '8');
    const pyVal = parseInt(tok['padding-vertical'] || '4');
    const r = radius('tooltip');

    return `<Frame name="Tooltip" flex="row" items="center" px={${pxVal}} py={${pyVal}} bg="#616161" rounded={${r}}>
  <Text size={12} weight="500" color="#ffffff">${text}</Text>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SNACKBAR
// ---------------------------------------------------------------------------
components.snackbar = {
  name: 'Snackbar',
  description: 'CDS brief notification',

  render({ message = 'Action completed successfully', hasAction = true, actionLabel = 'Undo' } = {}) {
    const c = colors();
    const tok = getComponentTokens('snackbar');
    const w = parseInt(tok['width'] || '344');
    const minH = parseInt(tok['min-height'] || '48');
    const pxVal = parseInt(tok['padding-horizontal'] || '16');

    const actionJsx = hasAction
      ? `\n  <Text size={14} weight="500" color="${c.primary}">${actionLabel}</Text>`
      : '';

    return `<Frame name="Snackbar" w={${w}} h={${minH}} flex="row" items="center" px={${pxVal}} bg="#323232" rounded={4} gap={8}>
  <Text size={14} color="#ffffff" w="fill">${message}</Text>${actionJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SKELETON
// ---------------------------------------------------------------------------
components.skeleton = {
  name: 'Skeleton',
  description: 'CDS loading placeholder',

  render({ variant = 'card', width = 320 } = {}) {
    const c = colors();
    const skeletonBg = c.grey300;

    if (variant === 'text') {
      return `<Frame name="Skeleton/text" w={${width}} flex="col" gap={8}>
  <Frame w="fill" h={12} bg="${skeletonBg}" rounded={2} />
  <Frame w={${Math.round(width * 0.8)}} h={12} bg="${skeletonBg}" rounded={2} />
  <Frame w={${Math.round(width * 0.6)}} h={12} bg="${skeletonBg}" rounded={2} />
</Frame>`;
    }

    return `<Frame name="Skeleton/card" w={${width}} flex="col" gap={12} p={16} bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1}>
  <Frame w="fill" h={180} bg="${skeletonBg}" rounded={${radius('medium')}} />
  <Frame w={${Math.round(width * 0.7)}} h={16} bg="${skeletonBg}" rounded={2} />
  <Frame w="fill" h={12} bg="${skeletonBg}" rounded={2} />
  <Frame w={${Math.round(width * 0.5)}} h={12} bg="${skeletonBg}" rounded={2} />
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PROGRESS
// ---------------------------------------------------------------------------
components.progress = {
  name: 'Progress',
  description: 'CDS progress bar / circular indicator',

  render({ variant = 'linear', value = 60 } = {}) {
    const c = colors();

    if (variant === 'circular') {
      return `<Frame name="Progress/circular" w={40} h={40} rounded={40} stroke="${c.primary}" strokeWidth={4} bg="transparent" flex="row" items="center" justify="center">
  <Text size={12} weight="500" color="${c.textPrimary}">${value}%</Text>
</Frame>`;
    }

    return `<Frame name="Progress/linear" w={200} flex="col" gap={4}>
  <Frame w="fill" h={4} bg="${c.grey200}" rounded={2}>
    <Frame w={${Math.round(200 * value / 100)}} h={4} bg="${c.primary}" rounded={2} />
  </Frame>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// LIST
// ---------------------------------------------------------------------------
components.list = {
  name: 'List',
  description: 'CDS vertical list',

  render({ items = [
    { primary: 'Inbox', secondary: '12 new messages' },
    { primary: 'Starred', secondary: '4 items' },
    { primary: 'Sent', secondary: 'Last sent 2h ago' },
    { primary: 'Drafts', secondary: '2 drafts' },
  ], width = 320 } = {}) {
    const c = colors();

    const listItems = items.map(item =>
      `  <Frame w="fill" h={56} flex="row" items="center" px={16} gap={16}>
    <Frame w={40} h={40} bg="${c.bgElevation1}" rounded={20} flex="row" items="center" justify="center">
      <Frame w={20} h={20} bg="${c.textTertiary}" rounded={4} opacity={0.4} />
    </Frame>
    <Frame flex="col" gap={2} grow={1}>
      <Text size={14} weight="500" color="${c.textPrimary}">${item.primary}</Text>
      <Text size={12} color="${c.textSecondary}">${item.secondary}</Text>
    </Frame>
  </Frame>`
    ).join('\n');

    return `<Frame name="List" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1} overflow="hidden">
${listItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// NAVIGATION (SIDENAV) — CDS: drawer width 240
// ---------------------------------------------------------------------------
components.navigation = {
  name: 'Navigation',
  description: 'CDS sidebar navigation',

  render({ items = ['Dashboard', 'Users', 'Settings', 'Reports', 'Help'], activeIndex = 0, variant = 'default' } = {}) {
    const c = colors();
    const tok = getComponentTokens('nav');
    const w = variant === 'slim' ? parseInt(tok['width-slim'] || '64') : parseInt(tok['width-default'] || '240');
    const itemH = parseInt(tok['item-height'] || '48');
    const itemPx = parseInt(tok['item-padding-horizontal'] || '16');
    const iconSize = parseInt(tok['icon-size'] || '24');
    const iconSpacing = parseInt(tok['icon-spacing'] || '16');

    const navItems = items.map((item, i) => {
      const isActive = i === activeIndex;
      const bg = isActive ? 'rgba(75,63,255,0.08)' : 'transparent';
      const textColor = isActive ? c.primary : c.textPrimary;
      const bgAttr = isActive ? ` bg="${bg}"` : '';
      return `  <Frame name="NavItem/${item}" w="fill" h={${itemH}} flex="row" items="center" px={${itemPx}} gap={${iconSpacing}}${bgAttr} rounded={8}>
    <Frame w={${iconSize}} h={${iconSize}} bg="${textColor}" rounded={4} opacity={0.4} />
    <Text size={14} weight="${isActive ? '600' : '400'}" color="${textColor}" w="fill">${item}</Text>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Navigation/${variant}" w={${w}} h={600} flex="col" bg="${c.bgPaper}" py={8} gap={2} stroke="${c.border}" strokeWidth={1}>
  <Frame name="Logo" w="fill" h={64} flex="row" items="center" px={${itemPx}} gap={12}>
    <Frame w={32} h={32} bg="${c.primary}" rounded={8} />
    <Text size={16} weight="600" color="${c.textPrimary}">App Name</Text>
  </Frame>
  <Frame name="Divider" w="fill" h={1} bg="${c.divider}" />
${navItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// APP BAR — CDS: height 64 desktop, elevation 4
// ---------------------------------------------------------------------------
components.appbar = {
  name: 'App Bar',
  description: 'CDS top navigation bar',

  render({ title = 'App Title', hasMenu = true, hasActions = true } = {}) {
    const c = colors();
    const h = 64;

    const menuIcon = hasMenu
      ? `  <Frame w={24} h={24} bg="#ffffff" rounded={4} opacity={0.8} />`
      : '';
    const actions = hasActions
      ? `  <Frame flex="row" gap={8}>
    <Frame w={24} h={24} bg="#ffffff" rounded={4} opacity={0.7} />
    <Frame w={24} h={24} bg="#ffffff" rounded={4} opacity={0.7} />
  </Frame>`
      : '';

    return `<Frame name="AppBar" w={1440} h={${h}} flex="row" items="center" px={24} bg="${c.primary}" gap={16} shadow="0 2 4 #0000001a">
${menuIcon}
  <Text size={20} weight="600" color="#ffffff" w="fill">${title}</Text>
${actions}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TABS — CDS: primary selected indicator
// ---------------------------------------------------------------------------
components.tabs = {
  name: 'Tabs',
  description: 'CDS navigation tabs',

  render({ tabs = ['Tab One', 'Tab Two', 'Tab Three'], activeIndex = 0 } = {}) {
    const c = colors();

    const tabItems = tabs.map((tab, i) => {
      const isActive = i === activeIndex;
      const textColor = isActive ? c.primary : c.textSecondary;
      const indicator = isActive ? `\n    <Frame w="fill" h={2} bg="${c.primary}" />` : `\n    <Frame w="fill" h={2} bg="transparent" />`;

      return `  <Frame flex="col" items="center" px={16} py={12} grow={1}>
    <Text size={14} weight="500" color="${textColor}">${tab}</Text>${indicator}
  </Frame>`;
    }).join('\n');

    return `<Frame name="Tabs" w={400} flex="row" bg="${c.bgPaper}" stroke="${c.border}" strokeWidth={1}>
${tabItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// BREADCRUMB
// ---------------------------------------------------------------------------
components.breadcrumb = {
  name: 'Breadcrumb',
  description: 'CDS navigation breadcrumb trail',

  render({ items = ['Home', 'Products', 'Laptops', 'MacBook Pro'] } = {}) {
    const c = colors();
    const tok = getComponentTokens('breadcrumb');
    const itemSpacing = parseInt(tok['item-spacing'] || '8');

    const crumbs = items.map((item, i) => {
      const isLast = i === items.length - 1;
      const color = isLast ? c.textPrimary : c.textSecondary;
      const separator = isLast ? '' : `\n    <Text size={14} color="${c.textDisabled}">/</Text>`;
      return `  <Text size={14} color="${color}" weight="${isLast ? '500' : '400'}">${item}</Text>${separator}`;
    }).join('\n');

    return `<Frame name="Breadcrumb" flex="row" items="center" gap={${itemSpacing}}>
${crumbs}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// STEPPER
// ---------------------------------------------------------------------------
components.stepper = {
  name: 'Stepper',
  description: 'CDS multi-step progress indicator',

  render({ steps = ['Details', 'Address', 'Payment', 'Review'], activeStep = 1, orientation = 'horizontal' } = {}) {
    const c = colors();
    const tok = getComponentTokens('stepper');
    const stepSize = parseInt(tok['step-size'] || '40');
    const connH = parseInt(tok['connector-height'] || '2');
    const labelSpacing = parseInt(tok['label-spacing'] || '8');

    if (orientation === 'horizontal') {
      const stepItems = steps.map((step, i) => {
        const isActive = i === activeStep;
        const isCompleted = i < activeStep;
        const dotBg = isActive || isCompleted ? c.primary : c.textDisabled;
        const textColor = isActive ? c.primary : isCompleted ? c.textPrimary : c.textDisabled;
        const connector = i < steps.length - 1
          ? `\n    <Frame grow={1} h={${connH}} bg="${isCompleted ? c.primary : c.border}" />`
          : '';

        return `  <Frame flex="col" items="center" gap={${labelSpacing}}>
    <Frame w={${stepSize}} h={${stepSize}} bg="${dotBg}" rounded={${stepSize}} flex="row" items="center" justify="center">
      <Text size={14} weight="600" color="#ffffff">${i + 1}</Text>
    </Frame>
    <Text size={14} weight="${isActive ? '600' : '400'}" color="${textColor}">${step}</Text>
  </Frame>${connector}`;
      }).join('\n');

      return `<Frame name="Stepper/horizontal" flex="row" items="center" gap={16} w="fill">
${stepItems}
</Frame>`;
    }

    const stepItems = steps.map((step, i) => {
      const isActive = i === activeStep;
      const isCompleted = i < activeStep;
      const dotBg = isActive || isCompleted ? c.primary : c.textDisabled;
      const textColor = isActive ? c.primary : isCompleted ? c.textPrimary : c.textDisabled;
      const connector = i < steps.length - 1
        ? `\n      <Frame w={${connH}} grow={1} bg="${isCompleted ? c.primary : c.border}" />`
        : '';

      return `  <Frame flex="row" gap={12}>
    <Frame flex="col" items="center">
      <Frame w={${stepSize}} h={${stepSize}} bg="${dotBg}" rounded={${stepSize}} flex="row" items="center" justify="center">
        <Text size={14} weight="600" color="#ffffff">${i + 1}</Text>
      </Frame>${connector}
    </Frame>
    <Frame flex="col" gap={4} pb={20}>
      <Text size={14} weight="${isActive ? '600' : '400'}" color="${textColor}">${step}</Text>
    </Frame>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Stepper/vertical" flex="col" w={300}>
${stepItems}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------------
components.timeline = {
  name: 'Timeline',
  description: 'CDS vertical timeline',

  render({ events = [
    { title: 'Order Placed', description: 'Your order has been confirmed', status: 'completed' },
    { title: 'Processing', description: 'Order is being prepared', status: 'active' },
    { title: 'Shipped', description: 'Awaiting shipment', status: 'pending' },
  ] } = {}) {
    const c = colors();
    const tok = getComponentTokens('timeline');
    const dotSize = parseInt(tok['dot-size'] || '12');
    const connW = parseInt(tok['connector-width'] || '2');
    const spacing_h = parseInt(tok['spacing-horizontal'] || '16');
    const spacing_v = parseInt(tok['spacing-vertical'] || '24');

    const items = events.map((ev, i) => {
      const dotColor = ev.status === 'completed' || ev.status === 'active' ? c.primary : c.textDisabled;
      const isLast = i === events.length - 1;
      const connector = isLast ? '' : `\n      <Frame w={${connW}} grow={1} bg="${c.border}" />`;

      return `  <Frame name="TimelineItem/${ev.title}" w="fill" flex="row" gap={${spacing_h}}>
    <Frame flex="col" items="center" w={${dotSize + 8}}>
      <Frame w={${dotSize}} h={${dotSize}} bg="${dotColor}" rounded={${dotSize}} />${connector}
    </Frame>
    <Frame flex="col" gap={4} pb={${isLast ? 0 : spacing_v}}>
      <Text size={14} weight="600" color="${c.textPrimary}">${ev.title}</Text>
      <Text size={12} color="${c.textSecondary}">${ev.description}</Text>
    </Frame>
  </Frame>`;
    }).join('\n');

    return `<Frame name="Timeline" w={300} flex="col">
${items}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DATA TABLE — CDS: header 50px, cell 50px, header weight 600
// ---------------------------------------------------------------------------
components.datatable = {
  name: 'Data Table',
  description: 'CDS tabular data display',

  render({ columns = ['Name', 'Email', 'Role', 'Status'], rows = [
    ['John Doe', 'john@example.com', 'Admin', 'Active'],
    ['Jane Smith', 'jane@example.com', 'Editor', 'Active'],
    ['Bob Wilson', 'bob@example.com', 'Viewer', 'Inactive'],
  ], width = 800 } = {}) {
    const c = colors();
    const tok = getComponentTokens('table');
    const headerH = parseInt(tok['header-height'] || '50');
    const rowH = parseInt(tok['row-height'] || '50');
    const cellPx = parseInt(tok['cell-padding-horizontal'] || '16');
    const colW = Math.floor(width / columns.length);

    const headerCells = columns.map(col =>
      `    <Frame w={${colW}} h={${headerH}} flex="row" items="center" px={${cellPx}}>
      <Text size={14} weight="600" color="${c.textPrimary}">${col}</Text>
    </Frame>`
    ).join('\n');

    const dataRows = rows.map((row, ri) =>
      `  <Frame name="Row ${ri + 1}" w="fill" flex="row" stroke="${c.border}" strokeWidth={1}>
${row.map((cell, ci) =>
      `    <Frame w={${colW}} h={${rowH}} flex="row" items="center" px={${cellPx}}>
      <Text size={14} color="${c.textPrimary}">${cell}</Text>
    </Frame>`
    ).join('\n')}
  </Frame>`
    ).join('\n');

    return `<Frame name="DataTable" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1} overflow="hidden">
  <Frame name="Header" w="fill" flex="row" bg="${c.grey50}">
${headerCells}
  </Frame>
${dataRows}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// DATE PICKER
// ---------------------------------------------------------------------------
components.datepicker = {
  name: 'Date Picker',
  description: 'CDS calendar date selector',

  render({ month = 'February 2026', selectedDay = 15 } = {}) {
    const c = colors();
    const tok = getComponentTokens('datepicker');
    const calW = parseInt(tok['calendar-width'] || '320');
    const headerH = parseInt(tok['header-height'] || '56');
    const daySize = parseInt(tok['day-button-size'] || '40');

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const weekdayJsx = weekdays.map(d =>
      `    <Frame w={${daySize}} h={${daySize}} flex="row" items="center" justify="center">
      <Text size={12} weight="500" color="${c.textSecondary}">${d}</Text>
    </Frame>`
    ).join('\n');

    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const dayRows = [];
    for (let i = 0; i < days.length; i += 7) {
      const row = days.slice(i, i + 7).map(d => {
        const isSelected = d === selectedDay;
        const bg = isSelected ? c.primary : 'transparent';
        const textColor = isSelected ? '#ffffff' : c.textPrimary;
        return `      <Frame w={${daySize}} h={${daySize}} flex="row" items="center" justify="center" bg="${bg}" rounded={${daySize}}>
        <Text size={14} color="${textColor}">${d}</Text>
      </Frame>`;
      }).join('\n');
      dayRows.push(`    <Frame flex="row">\n${row}\n    </Frame>`);
    }

    return `<Frame name="DatePicker" w={${calW}} flex="col" bg="${c.bgPaper}" rounded={${radius('dialog')}} stroke="${c.border}" strokeWidth={1} shadow="0 4 12 #0000001a" overflow="hidden">
  <Frame name="Header" w="fill" h={${headerH}} flex="row" items="center" justify="center" px={16} gap={8}>
    <Text size={14} color="${c.textSecondary}">◀</Text>
    <Text size={16} weight="600" color="${c.textPrimary}" w="fill">${month}</Text>
    <Text size={14} color="${c.textSecondary}">▶</Text>
  </Frame>
  <Frame name="Weekdays" w="fill" flex="row" px={8}>
${weekdayJsx}
  </Frame>
  <Frame name="Days" w="fill" flex="col" px={8} pb={8}>
${dayRows.join('\n')}
  </Frame>
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// PAGE HEADING
// ---------------------------------------------------------------------------
components.pageheading = {
  name: 'Page Heading',
  description: 'CDS page title with breadcrumbs and actions',

  render({ title = 'Page Title', breadcrumbs = ['Home', 'Section'], description = '', chips = [], hasActions = false, variant = 'desktop' } = {}) {
    const c = colors();
    const isMobile = variant === 'mobile';
    const titleSize = isMobile ? 32 : 48;
    const containerPad = isMobile ? spacing(4) : spacing(8);

    const breadcrumbJsx = breadcrumbs.length > 0
      ? `\n  ${components.breadcrumb.render({ items: [...breadcrumbs, title] })}`
      : '';
    const chipsJsx = chips.length > 0
      ? `\n  <Frame flex="row" gap={8}>\n${chips.map(ch => `    ${components.chip.render({ label: ch, variant: 'filled' })}`).join('\n')}\n  </Frame>`
      : '';
    const descJsx = description
      ? `\n  <Text size={14} color="${c.textSecondary}" w="fill">${description}</Text>`
      : '';
    const actionsJsx = hasActions
      ? `\n  <Frame flex="row" gap={8}>
    ${components.button.render({ variant: 'outlined', size: 'medium', label: 'Edit' })}
    ${components.button.render({ variant: 'contained', size: 'medium', label: 'Create New' })}
  </Frame>`
      : '';

    return `<Frame name="PageHeading/${variant}" w={${isMobile ? 390 : 1200}} flex="col" gap={8} p={${containerPad}}>
  ${breadcrumbJsx}
  <Text size={${titleSize}} weight="600" color="${c.textPrimary}" w="fill">${title}</Text>${chipsJsx}${descJsx}${actionsJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// SECTION HEADING
// ---------------------------------------------------------------------------
components.sectionheading = {
  name: 'Section Heading',
  description: 'CDS section title with optional action',

  render({ title = 'Section Title', description = '', hasAction = false, actionLabel = 'View All' } = {}) {
    const c = colors();
    const descJsx = description
      ? `\n  <Text size={14} color="${c.textSecondary}" w="fill">${description}</Text>`
      : '';
    const actionJsx = hasAction
      ? `\n  ${components.button.render({ variant: 'text', size: 'small', label: actionLabel })}`
      : '';

    return `<Frame name="SectionHeading" w="fill" flex="row" items="center" gap={16}>
  <Frame flex="col" gap={4} grow={1}>
    <Text size={20} weight="600" color="${c.textPrimary}">${title}</Text>${descJsx}
  </Frame>${actionJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// FORM LAYOUT
// ---------------------------------------------------------------------------
components.formlayout = {
  name: 'Form Layout',
  description: 'CDS structured form',

  render({ title = 'Form Title', fields = [
    { label: 'First Name', placeholder: 'Enter first name' },
    { label: 'Last Name', placeholder: 'Enter last name' },
    { label: 'Email', placeholder: 'email@example.com' },
    { label: 'Password', placeholder: '••••••••' },
  ], hasSubmit = true } = {}) {
    const c = colors();
    const tok = getComponentTokens('form');
    const fieldSpacing = parseInt(tok['field-spacing-vertical'] || '24');
    const maxW = parseInt(tok['field-max-width'] || '500');

    const fieldsJsx = fields.map(f =>
      `  ${components.textfield.render({ label: f.label, placeholder: f.placeholder, size: 'medium' })}`
    ).join('\n');

    const submitJsx = hasSubmit
      ? `\n  <Frame flex="row" gap={12} pt={8}>
    ${components.button.render({ variant: 'text', size: 'medium', label: 'Cancel' })}
    ${components.button.render({ variant: 'contained', size: 'medium', label: 'Submit' })}
  </Frame>`
      : '';

    return `<Frame name="FormLayout" w={${maxW}} flex="col" gap={${fieldSpacing}} p={${spacing(4)}} bg="${c.bgPaper}" rounded={${radius('card')}} stroke="${c.border}" strokeWidth={1}>
  <Text size={24} weight="600" color="${c.textPrimary}">${title}</Text>
  <Frame name="Divider" w="fill" h={1} bg="${c.divider}" />
${fieldsJsx}${submitJsx}
</Frame>`;
  }
};

// ---------------------------------------------------------------------------
// ACCORDION
// ---------------------------------------------------------------------------
components.accordion = {
  name: 'Accordion',
  description: 'CDS expandable sections',

  render({ items = [
    { title: 'Section 1', content: 'Content for section 1.', expanded: true },
    { title: 'Section 2', content: 'Content for section 2.', expanded: false },
    { title: 'Section 3', content: 'Content for section 3.', expanded: false },
  ], width = 400 } = {}) {
    const c = colors();

    const sections = items.map(item => {
      const contentJsx = item.expanded
        ? `\n    <Frame w="fill" flex="col" px={16} pb={16}>
      <Text size={14} color="${c.textSecondary}" w="fill">${item.content}</Text>
    </Frame>`
        : '';

      return `  <Frame name="AccordionItem" w="fill" flex="col" stroke="${c.border}" strokeWidth={1}>
    <Frame w="fill" h={48} flex="row" items="center" px={16} gap={8}>
      <Text size={14} weight="500" color="${c.textPrimary}" w="fill">${item.title}</Text>
      <Text size={14} color="${c.textSecondary}">${item.expanded ? '▲' : '▼'}</Text>
    </Frame>${contentJsx}
  </Frame>`;
    }).join('\n');

    return `<Frame name="Accordion" w={${width}} flex="col" bg="${c.bgPaper}" rounded={${radius('card')}} overflow="hidden">
${sections}
</Frame>`;
  }
};


// ============================================================================
// REGISTRY API
// ============================================================================

export function getComponent(name) {
  const key = name.toLowerCase().replace(/[\s\-_]/g, '');
  return components[key] || null;
}

export function listComponents() {
  return Object.entries(components).map(([key, comp]) => ({
    key,
    name: comp.name,
    description: comp.description,
    variants: comp.variants || [],
    sizes: comp.sizes || [],
    colors: comp.colors || [],
  }));
}

export function renderComponent(name, options = {}) {
  const comp = getComponent(name);
  if (!comp) return null;
  return comp.render(options);
}

export function renderAllVariants(name) {
  const comp = getComponent(name);
  if (!comp || !comp.renderAll) {
    return comp ? [comp.render()] : [];
  }
  return comp.renderAll();
}

export function buildPage(pageConfig) {
  const {
    name = 'Page',
    width = 1440,
    bg = colors().bgDefault,
    sections = []
  } = pageConfig;

  const sectionJsx = sections.map(section => {
    const jsx = renderComponent(section.component, section.options || {});
    if (!jsx) return '';

    const wrap = section.wrapper || {};
    const sectionW = wrap.w || 'fill';
    const sectionBg = wrap.bg ? ` bg="${wrap.bg}"` : '';
    const sectionP = wrap.p ? ` p={${wrap.p}}` : ` p={${spacing(8)}}`;
    const sectionItems = wrap.items ? ` items="${wrap.items}"` : ' items="center"';

    return `  <Frame name="${section.component}" w="${sectionW}" flex="col"${sectionItems}${sectionP}${sectionBg}>
    ${jsx}
  </Frame>`;
  }).join('\n');

  return `<Frame name="${name}" w={${width}} flex="col" bg="${bg}">
${sectionJsx}
</Frame>`;
}

export default {
  getComponent,
  listComponents,
  renderComponent,
  renderAllVariants,
  buildPage,
  components,
};
