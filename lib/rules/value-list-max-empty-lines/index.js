"use strict";

const _ = require("lodash");
const replaceEmptyLines = require("../../utils/replaceEmptyLines");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const styleSearch = require("style-search");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "value-list-max-empty-lines";

const messages = ruleMessages(ruleName, {
  expected: max =>
    `Expected no more than ${max} empty ${max === 1 ? "line" : "lines"}`
});

const rule = function(max, ...otherArgs) {
  const maxAdjacentNewlines = max + 1;
  const [, context] = otherArgs;

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: _.isNumber
    });
    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const { value } = decl;
      const repeatLFNewLines = _.repeat("\n", maxAdjacentNewlines);
      const repeatCRLFNewLines = _.repeat("\r\n", maxAdjacentNewlines);

      if (context.fix) {
        const { newline } = context;
        decl.value = replaceEmptyLines(value, maxAdjacentNewlines, newline);

        return decl;
      }

      styleSearch({ source: value, target: "\n" }, match => {
        let index = match.startIndex;
        const isCRLF = value[index - 1] === "\r";
        const substrFrom = index + 1;
        const substrTo = isCRLF ? maxAdjacentNewlines * 2 : maxAdjacentNewlines;
        const isExtraLF = value.substr(substrFrom, substrTo) ===
          repeatLFNewLines;
        const isExtraCRLF = value.substr(substrFrom, substrTo) ===
          repeatCRLFNewLines;

        if (isExtraLF || isExtraCRLF) {
          if (isCRLF) {
            index -= 1;
          }

          report({
            message: messages.expected(max),
            node: decl,
            index,
            result,
            ruleName
          });
        }
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
