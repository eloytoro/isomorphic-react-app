import style from './style.css';
import connectScreenSize from 'hocs/connectScreenSize';
import _ from 'lodash';


/**
 * Joins all parameters with a `-`
 * @returns {string}
 */
const snakeCase = (...args) => args.join('-');

export const propToClass = (prefix, prop, screen = {}) => {
  if (prop === undefined) return [];

  if (Array.isArray(prop)) {
    return [].concat(
      ...prop.map(item => propToClass(prefix, item, screen))
    );
  }

  const styleName = snakeCase(prefix, prop);
  const className = style[styleName];

  if (className === undefined) {
    const isProduction = process && process.env.NODE_ENV === 'production';
    if (!isProduction) throw new TypeError(`Invalid layout ${styleName}`);
    return [];
  }

  return [className];
};

/**
 * It joins the perpendicular and parallel align of the given query or class
 * into a single string separated by `-`
 * @param {object|string} align
 * @returns {object|string}
 */
export const parseAlign = (align) => {
  if (typeof align === 'object') return _.mapValues(align, parseAlign);
  const [parallel, perpendicular] = align.split(' ');
  return [
    `parallel-${parallel}`,
    `perpendicular-${perpendicular}`
  ];
};

const normalizeProp = (prop, screen) => {
  return _.isPlainObject(prop)
    ? _.find(prop, (value, key) => screen[key])
    : prop;
};

const mapScreenToProps = (screen, ownProps) => {
  const layoutKeys = ['align', 'direction', 'size', 'order'];
  const layoutValues = layoutKeys.map(key => normalizeProp(ownProps[key], screen));
  return _.zipObject(layoutKeys, layoutValues);
};

export const connectLayout = connectScreenSize(mapScreenToProps);
