"use strict";

const postcss = require("postcss");
const replaceEmptyLines = require("../replaceEmptyLines");

describe("replaceEmptyLines", () => {
  describe("LF", () => {
    it("removes second empty line", () => {
      const invalid = 'a {\n' +
        'padding: 10px\n\n' +
        '10px;\n}';
      const valid = '10px\n10px';

      expect(run(invalid, 1, '\n')).toBe(valid);
    });

    it("removes third empty line", () => {
      const invalid = 'a {\n' +
        'padding: 10px\n\n\n' +
        '10px\n}';
      const valid = '10px\n\n10px';

      expect(run(invalid, 2, '\n')).toBe(valid);
    });

    it("do nothing with one empty line", () => {
      const valid = 'a {\npadding: 10px\n10px\n}';
      const expected = '10px\n10px';

      expect(run(valid, 1, '\n')).toBe(expected);
    });

    it("do nothing with no empty line", () => {
      const valid = 'a {\npadding: 10px 10px\n}';
      const expected = '10px 10px';

      expect(run(valid, 1, '\n')).toBe(expected);
    });
  });
  describe("CRLF", () => {
    it("removes second empty line", () => {
      const invalid = 'a {\r\n' +
        'padding: 10px\r\n\r\n' +
        '10px;\r\n}';
      const valid = '10px\r\n10px';

      expect(run(invalid, 1, '\r\n')).toBe(valid);
    });

    it("removes third empty line", () => {
      const invalid = 'a {\r\n' +
        'padding: 10px\r\n\r\n\r\n' +
        '10px\r\n}';
      const valid = '10px\r\n\r\n10px';

      expect(run(invalid, 2, '\r\n')).toBe(valid);
    });

    it("do nothing with one empty line", () => {
      const valid = 'a {\r\npadding: 10px\r\n10px\r\n}';
      const expected = '10px\r\n10px';

      expect(run(valid, 1, '\r\n')).toBe(expected);
    });

    it("do nothing with no empty line", () => {
      const valid = 'a {\r\npadding: 10px 10px\r\n}';
      const expected = '10px 10px';

      expect(run(valid, 1, '\r\n')).toBe(expected);
    });
  });
});

function run(cssCode, possibleEmptyLines, lineEnding) {
  const decl = postcss.parse(cssCode).first.first;

  return replaceEmptyLines(decl.value, possibleEmptyLines, lineEnding);
}
