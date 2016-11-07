import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { propToClass, connectLayout } from './commons';


/**
 * The <Flex /> element serves as both a column and a row, depending on its
 * <Layout /> direction.
 * Both the size and order parameters can take the form of a number or an object
 * if a media query needs to be specified.
 * The supported queries are:
 * - mobile
 * - small
 * - medium
 * - large
 * - the `>` operator, which means greater than (`> small`)
 *
 * Examples
 *
 * ```
 * // first on mobile, second on small and third on greater than small resolutions
 * <Flex order={{
 *   'mobile': 0,
 *   'small': 1,
 *   '> small': 2
 * }} />
 * // first on greater than small, second on mobile and third on small resolutions
 * <Flex order={{
 *   'mobile': 1,
 *   'small': 2,
 *   '> small': 0
 * }} />
 * // first on small, second on greater than small and third on mobile resolutions
 * <Flex order={{
 *   'mobile': 2,
 *   'small': 0,
 *   '> small': 1
 * }} />
 * ```
 *
 * ```
 * <Flex size={{
 *   'mobile': 50,
 *   'small': 30,
 *   '> small': 20
 * }} />
 * <Flex size="100">
 * ```
 * @param {number:object} size - the percent size of the element
 * @param {number:object} order - the order placing
 * @returns {Element}
*/
export const Flex = ({
  children,
  className = '',
  order,
  component = 'div',
  size = 'initial',
  screenSize,
  ...props
}) => (
  React.createElement(
    component,
    {
      ...props,
      className: classnames(
        ...propToClass('flex', size, screenSize),
        ...propToClass('flex-order', order, screenSize),
        className
      )
    },
    children
  )
);

Flex.propTypes = {
  children: PropTypes.node,
  screenSize: PropTypes.object,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  className: PropTypes.string,
  order: PropTypes.number,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default connectLayout(Flex);
