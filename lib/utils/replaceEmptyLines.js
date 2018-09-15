"use strict";

const EMPTY_LINES_REGEXP = /(\r?\n)+/g;

/**
 *
 * @param {string} codeString
 * @param {number} possibleEmptyLines
 * @param {string} newline
 */
const replaceEmptyLines = (
  codeString,
  possibleEmptyLines,
  newline
) => {
  const linesString = newline.repeat(possibleEmptyLines);

  return codeString.replace(EMPTY_LINES_REGEXP, linesString);
};

module.exports = replaceEmptyLines;
