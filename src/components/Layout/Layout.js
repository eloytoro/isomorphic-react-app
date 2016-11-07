import React, { PropTypes } from 'react';
import classnames from 'classnames';
import style from './style.css';
import { parseAlign, propToClass, connectLayout } from './commons';

/**
 * The <Layout /> element works as the container of many child flexboxes.
 * Its direction determines whether the children display forming rows or columns
 * across its length.
 * The align parameter is a string that determines where are the children placed
 * and aligned. Its composed in two parts; parallel and perpendicular.
 * Parallel:
 * - start (default)
 * - center
 * - end
 * - space around
 * - space between
 * Perpendicular:
 * - start
 * - center
 * - end
 * - stretch (default)
 * Note: the <Layout /> component can also act as a <Flex /> component when the
 * size parameter is passed
 *
 * Examples
 *
 * ```html
 * <Layout>
 *   <Flex /><Flex /><Flex />
 * </Layout>
 * ```
 *
 * Defaults to a row layout with 'start stretch' alignment
 *
 * ```
 * |[   ][   ][   ]|
 * |[ 1 ][ 2 ][ 3 ]|
 * |[   ][   ][   ]|
 * ```
 *
 * ---
 *
 * ```html
 * <Layout direction="column">
 *   <Flex /><Flex /><Flex />
 * </Layout>
 * ```
 *
 * ```
 * |[   1   ]|
 * |[   2   ]|
 * |[   3   ]|
 * ```
 *
 * ---
 *
 * ```html
 * <Layout align="center center">
 *   <Flex /><Flex /><Flex />
 * </Layout>
 * ```
 *
 * ```
 * |               |
 * |   [1][2][3]   |
 * |               |
 * ```
 *
 * ---
 *
 * ```html
 * <Layout align="space-between center">
 *   <Flex /><Flex /><Flex />
 * </Layout>
 * ```
 *
 * ```
 * |               |
 * | [1]  [2]  [3] |
 * |               |
 * ```
 *
 * @param {string} direction - either 'row' or 'column'
 * @param {number:object} size - the percent size of the element
 * @param {number:object} order - the order placing
 * @param {string} align - children alignment ('parallel perpendicular')
 * @param {boolean} wrap - wether to allow the flex elements to wrap around parent
 * @param {boolean} nowrap - same as wrap={false}
 * @param {boolean} fill - the layout will try to fill its parent element entirely
 * @param {boolean} reverse - reverse the order flex components inside are displayed
 * @returns {Element}
*/
export const Layout = ({
  children,
  component = 'div',
  className = '',
  direction = 'row',
  size,
  order,
  fill = false,
  align = 'start stretch',
  wrap = false,
  screenSize,
  ...props
}) => (
  React.createElement(
    component,
    {
      ...props,
      className: classnames(
        className,
        ...propToClass('align', parseAlign(align), screenSize),
        ...propToClass('layout', direction, screenSize),
        ...propToClass('flex', size, screenSize),
        ...propToClass('flex-order', order, screenSize),
        { [style.wrap]: wrap,
          [style.fill]: fill }
      )
    },
    children
  )
);

Layout.propTypes = {
  children: PropTypes.node,
  screenSize: PropTypes.object,
  className: PropTypes.string,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  order: PropTypes.number,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  direction: PropTypes.string,
  fill: PropTypes.bool,
  align: PropTypes.string,
  wrap: PropTypes.bool
};

export default connectLayout(Layout);
