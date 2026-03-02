/**
 * Design System Binder
 *
 * Post-creation binding engine. After a component is rendered as a visual frame
 * with hardcoded hex values, this module generates Figma eval code that:
 *
 * 1. Walks the frame tree
 * 2. Matches fills/strokes to known color variables
 * 3. Binds them to Figma Variables (so they update when variables change)
 * 4. Applies Figma Text Styles to text nodes
 * 5. Can convert the frame to a Figma Component
 *
 * This is the bridge between "looks right" and "linked to the design system".
 */

import dsEngine from './ds-engine.js';

const { loadTokens, resolveToken, toHex } = dsEngine;

/**
 * Build a reverse map: hex color → variable name (without -- prefix).
 * Used to match rendered hex fills back to the variable they came from.
 */
export function buildReverseColorMap() {
  const { categories } = loadTokens();
  const map = {};

  for (const [key, val] of Object.entries(categories.colors || {})) {
    const hex = toHex(val);
    if (hex && hex.startsWith('#')) {
      const varName = key.replace(/^--/, '');
      const normalized = hex.toLowerCase();
      if (!map[normalized]) map[normalized] = varName;
    }
  }

  for (const [key, val] of Object.entries(categories.components || {})) {
    const hex = toHex(val);
    if (hex && hex.startsWith('#')) {
      const varName = key.replace(/^--/, '');
      const normalized = hex.toLowerCase();
      if (!map[normalized]) map[normalized] = varName;
    }
  }

  return map;
}

/**
 * Build a typography style map: "fontSize|fontWeight" → style name
 */
export function buildTypographyMap() {
  const { categories } = loadTokens();
  const typo = categories.typography || {};
  const styles = {};

  const styleGroups = [
    'heading/h1', 'heading/h2', 'heading/h3', 'heading/h4', 'heading/h5', 'heading/h6',
    'body/large', 'body/medium', 'body/small',
    'label/large', 'label/medium', 'label/small',
    'caption',
    'button/large', 'button/medium', 'button/small',
  ];

  for (const styleName of styleGroups) {
    const sizeKey = `--typography/${styleName}/font-size`;
    const weightKey = `--typography/${styleName}/font-weight`;
    const lineHeightKey = `--typography/${styleName}/line-height`;
    const familyKey = `--typography/${styleName}/font-family`;

    const size = typo[sizeKey];
    const weight = typo[weightKey];
    if (size && weight) {
      const key = `${parseInt(size)}|${weight}`;
      styles[key] = {
        name: `DS/${styleName}`,
        fontSize: parseInt(size),
        fontWeight: weight,
        lineHeight: lineHeightKey && typo[lineHeightKey] ? parseFloat(typo[lineHeightKey]) : null,
        fontFamily: familyKey && typo[familyKey] ? typo[familyKey] : 'DM Sans',
      };
    }
  }

  return styles;
}

/**
 * Generate Figma eval code that creates all Text Styles from the design system.
 */
export function generateTextStylesCode() {
  const typoMap = buildTypographyMap();
  const lines = [`(async function() {`];
  lines.push(`  const existing = figma.getLocalTextStyles();`);
  lines.push(`  const existingNames = new Set(existing.map(s => s.name));`);
  lines.push(`  let created = 0;`);

  for (const [, style] of Object.entries(typoMap)) {
    const fontStyle = parseInt(style.fontWeight) >= 700 ? 'Bold'
      : parseInt(style.fontWeight) >= 500 ? 'Medium' : 'Regular';

    const cleanFamily = style.fontFamily.replace(/['"]/g, '').split(',')[0].trim();

    lines.push(`  if (!existingNames.has(${JSON.stringify(style.name)})) {`);
    lines.push(`    try {`);
    lines.push(`      await figma.loadFontAsync({ family: ${JSON.stringify(cleanFamily)}, style: ${JSON.stringify(fontStyle)} });`);
    lines.push(`      const s = figma.createTextStyle();`);
    lines.push(`      s.name = ${JSON.stringify(style.name)};`);
    lines.push(`      s.fontName = { family: ${JSON.stringify(cleanFamily)}, style: ${JSON.stringify(fontStyle)} };`);
    lines.push(`      s.fontSize = ${style.fontSize};`);
    if (style.lineHeight) {
      const lhValue = style.lineHeight > 4 ? style.lineHeight : style.fontSize * style.lineHeight;
      lines.push(`      s.lineHeight = { value: ${Math.round(lhValue)}, unit: 'PIXELS' };`);
    }
    lines.push(`      created++;`);
    lines.push(`    } catch(e) {}`);
    lines.push(`  }`);
  }

  lines.push(`  return 'Created ' + created + ' text styles';`);
  lines.push(`})()`);
  return lines.join('\n');
}

/**
 * Generate Figma eval code that binds all fills/strokes in a frame tree
 * to their matching Figma Variables, and applies Text Styles to text nodes.
 *
 * @param {string} frameName - Name of the frame to bind (finds most recent match)
 */
export function generateBindingCode(frameName) {
  const reverseMap = buildReverseColorMap();
  const typoMap = buildTypographyMap();

  const lines = [`(async function() {`];

  // Find the frame
  lines.push(`  const target = figma.currentPage.children`);
  lines.push(`    .filter(n => n.name === ${JSON.stringify(frameName)} || n.name.startsWith(${JSON.stringify(frameName + '/')}))`);
  lines.push(`    .pop();`);
  lines.push(`  if (!target) return 'Frame not found: ${frameName}';`);

  // Get all local variables for matching
  lines.push(`  const allVars = figma.variables.getLocalVariables('COLOR');`);
  lines.push(`  const floatVars = figma.variables.getLocalVariables('FLOAT');`);
  lines.push(`  const textStyles = figma.getLocalTextStyles();`);

  // Build lookup helpers
  lines.push(`  function findVar(name) { return allVars.find(v => v.name === name); }`);
  lines.push(`  function findFloatVar(name) { return floatVars.find(v => v.name === name); }`);
  lines.push(`  function findTextStyle(name) { return textStyles.find(s => s.name === name); }`);

  // Color hex to variable name map (injected from Node.js side)
  lines.push(`  const colorMap = ${JSON.stringify(reverseMap)};`);

  // Typography map
  lines.push(`  const typoMap = ${JSON.stringify(typoMap)};`);

  // Figma RGB to hex helper
  lines.push(`  function rgbToHex(c) {`);
  lines.push(`    if (!c) return '';`);
  lines.push(`    const r = Math.round((c.r || 0) * 255);`);
  lines.push(`    const g = Math.round((c.g || 0) * 255);`);
  lines.push(`    const b = Math.round((c.b || 0) * 255);`);
  lines.push(`    return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');`);
  lines.push(`  }`);

  // Recursive binding walker
  lines.push(`  let boundColors = 0, boundStrokes = 0, boundText = 0, boundRadius = 0;`);
  lines.push(`  function walkAndBind(node) {`);

  // Bind fills
  lines.push(`    if (node.fills && Array.isArray(node.fills) && node.fills.length > 0) {`);
  lines.push(`      const fill = node.fills[0];`);
  lines.push(`      if (fill.type === 'SOLID' && fill.color) {`);
  lines.push(`        const hex = rgbToHex(fill.color).toLowerCase();`);
  lines.push(`        const varName = colorMap[hex];`);
  lines.push(`        if (varName) {`);
  lines.push(`          const v = findVar(varName);`);
  lines.push(`          if (v) {`);
  lines.push(`            try {`);
  lines.push(`              const newFill = figma.variables.setBoundVariableForPaint(fill, 'color', v);`);
  lines.push(`              node.fills = [newFill];`);
  lines.push(`              boundColors++;`);
  lines.push(`            } catch(e) {}`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);

  // Bind strokes
  lines.push(`    if (node.strokes && Array.isArray(node.strokes) && node.strokes.length > 0) {`);
  lines.push(`      const stroke = node.strokes[0];`);
  lines.push(`      if (stroke.type === 'SOLID' && stroke.color) {`);
  lines.push(`        const hex = rgbToHex(stroke.color).toLowerCase();`);
  lines.push(`        const varName = colorMap[hex];`);
  lines.push(`        if (varName) {`);
  lines.push(`          const v = findVar(varName);`);
  lines.push(`          if (v) {`);
  lines.push(`            try {`);
  lines.push(`              const newStroke = figma.variables.setBoundVariableForPaint(stroke, 'color', v);`);
  lines.push(`              node.strokes = [newStroke];`);
  lines.push(`              boundStrokes++;`);
  lines.push(`            } catch(e) {}`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);

  // Bind corner radius to variable if it matches a known token
  lines.push(`    if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {`);
  lines.push(`      const rVarNames = [`);
  lines.push(`        'border-radius/small', 'border-radius/medium', 'border-radius/button',`);
  lines.push(`        'border-radius/large', 'border-radius/xl', 'border-radius/pill'`);
  lines.push(`      ];`);
  lines.push(`      for (const rn of rVarNames) {`);
  lines.push(`        const fv = findFloatVar(rn);`);
  lines.push(`        if (fv) {`);
  lines.push(`          try {`);
  lines.push(`            const val = Object.values(fv.valuesByMode)[0];`);
  lines.push(`            if (val === node.cornerRadius) {`);
  lines.push(`              node.setBoundVariable('cornerRadius', fv);`);
  lines.push(`              boundRadius++;`);
  lines.push(`              break;`);
  lines.push(`            }`);
  lines.push(`          } catch(e) {}`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);

  // Apply text styles
  lines.push(`    if (node.type === 'TEXT') {`);
  lines.push(`      const key = node.fontSize + '|' + (node.fontWeight || (node.fontName ? (node.fontName.style === 'Bold' ? '700' : node.fontName.style === 'Medium' ? '500' : '400') : '400'));`);
  lines.push(`      const match = typoMap[key];`);
  lines.push(`      if (match) {`);
  lines.push(`        const ts = findTextStyle(match.name);`);
  lines.push(`        if (ts) {`);
  lines.push(`          try {`);
  lines.push(`            node.textStyleId = ts.id;`);
  lines.push(`            boundText++;`);
  lines.push(`          } catch(e) {}`);
  lines.push(`        }`);
  lines.push(`      }`);

  // Also bind text fills to color variables
  lines.push(`      if (node.fills && Array.isArray(node.fills) && node.fills.length > 0) {`);
  lines.push(`        const fill = node.fills[0];`);
  lines.push(`        if (fill.type === 'SOLID' && fill.color) {`);
  lines.push(`          const hex = rgbToHex(fill.color).toLowerCase();`);
  lines.push(`          const varName = colorMap[hex];`);
  lines.push(`          if (varName) {`);
  lines.push(`            const v = findVar(varName);`);
  lines.push(`            if (v) {`);
  lines.push(`              try {`);
  lines.push(`                const newFill = figma.variables.setBoundVariableForPaint(fill, 'color', v);`);
  lines.push(`                node.fills = [newFill];`);
  lines.push(`                boundColors++;`);
  lines.push(`              } catch(e) {}`);
  lines.push(`            }`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);

  // Recurse into children
  lines.push(`    if ('children' in node) {`);
  lines.push(`      for (const child of node.children) { walkAndBind(child); }`);
  lines.push(`    }`);
  lines.push(`  }`);

  lines.push(`  walkAndBind(target);`);
  lines.push(`  return 'Bound: ' + boundColors + ' fills, ' + boundStrokes + ' strokes, ' + boundRadius + ' radii, ' + boundText + ' text styles';`);
  lines.push(`})()`);

  return lines.join('\n');
}

/**
 * Generate code to convert a frame into a Figma Component.
 */
export function generateComponentConversionCode(frameName) {
  const lines = [`(function() {`];
  lines.push(`  const frame = figma.currentPage.children`);
  lines.push(`    .filter(n => n.name === ${JSON.stringify(frameName)} || n.name.startsWith(${JSON.stringify(frameName + '/')}))`);
  lines.push(`    .pop();`);
  lines.push(`  if (!frame || frame.type !== 'FRAME') return 'Frame not found: ${frameName}';`);
  lines.push(`  const component = figma.createComponentFromNode(frame);`);
  lines.push(`  return 'Converted to component: ' + component.name + ' (id: ' + component.id + ')';`);
  lines.push(`})()`);
  return lines.join('\n');
}

/**
 * Generate the full setup code: push variables + create text styles.
 * Returns an array of { label, code } objects to run in sequence.
 */
export function generateFullSetupSteps() {
  return [
    { label: 'Creating text styles', code: generateTextStylesCode() },
  ];
}

export default {
  buildReverseColorMap,
  buildTypographyMap,
  generateTextStylesCode,
  generateBindingCode,
  generateComponentConversionCode,
  generateFullSetupSteps,
};
