/*global module */
/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *  Modified by Josh Perez <josh@goatslacker.com>
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

module.exports = {

  diffString: function (o, n) {
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');

    var out = this.diff(o === "" ? [] : o.split(/\s+/), n === "" ? [] : n.split(/\s+/)),
        str = "",
        oSpace = o.match(/\s+/g),
        nSpace = n.match(/\s+/g),
        i = 0,
        pre = "";

    if (oSpace === null) {
      oSpace = ["\n"];
    } else {
      oSpace.push("\n");
    }

    if (nSpace === null) {
      nSpace = ["\n"];
    } else {
      nSpace.push("\n");
    }

    if (out.n.length === 0) {
      for (i = 0; i < out.o.length; i += 1) {
        str += "\033[32m" + out.o[i] + oSpace[i] + "\033[39m";
      }
    } else {
      if (typeof out.n[0].text === "undefined") {
        for (n = 0; n < out.o.length && typeof out.o[n].text === "undefined"; n += 1) {
          str += "\033[31m" + out.o[n] + oSpace[n] + "\033[39m";
        }
      }

      for (i = 0; i < out.n.length; i += 1) {
        if (typeof out.n[i].text === "undefined") {
          str += "\033[32m" + out.n[i] + nSpace[i] + "\033[39m";
        } else {
          pre = "";

          for (n = out.n[i].row + 1; n < out.o.length && typeof out.o[n].text === "undefined"; n += 1) {
            pre += "\033[31m" + out.o[n] + oSpace[n] + "\033[39m";
          }
          str += "\033[90m" + out.n[i].text + "\033[39m" + nSpace[i] + pre;
        }
      }
    }

    return str;
  },

  diff: function (o, n) {
    var ns = {},
        os = {},
        i = 0;

    for (i = 0; i < n.length; i += 1) {
      if (typeof ns[n[i]] === "undefined") {
        ns[n[i]] = { rows: [], o: null };
      }
      ns[n[i]].rows.push(i);
    }

    for (i = 0; i < o.length; i += 1) {
      if (typeof os[o[i]] === "undefined") {
        os[o[i]] = { rows: [], n: null };
      }
      os[o[i]].rows.push(i);
    }

    for (i in ns) {
      if (ns[i].rows.length === 1 && typeof(os[i]) !== "undefined" && os[i].rows.length === 1) {
        n[ns[i].rows[0]] = { text: n[ns[i].rows[0]], row: os[i].rows[0] };
        o[os[i].rows[0]] = { text: o[os[i].rows[0]], row: ns[i].rows[0] };
      }
    }

    for (i = 0; i < n.length - 1; i += 1) {
      if (typeof n[i].text !== "undefined" && typeof n[i + 1].text === "undefined" && n[i].row + 1 < o.length && typeof o[n[i].row + 1].text === "undefined" && n[i + 1] === o[n[i].row + 1]) {
        n[i + 1] = { text: n[i + 1], row: n[i].row + 1 };
        o[n[i].row + 1] = { text: o[n[i].row + 1], row: i + 1 };
      }
    }

    for (i = n.length - 1; i > 0; i -= 1) {
      if (typeof n[i].text !== "undefined" && typeof n[i - 1].text === "undefined" && n[i].row > 0 && typeof o[n[i].row - 1].text === "undefined" && n[i - 1] === o[n[i].row - 1]) {
        n[i - 1] = { text: n[i - 1], row: n[i].row - 1 };
        o[n[i].row - 1] = { text: o[n[i].row - 1], row: i - 1 };
      }
    }

    return { o: o, n: n };
  }
};
