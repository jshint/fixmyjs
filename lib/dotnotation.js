var str = 'foo.["HOME"]';

var rx = {
  sqb: /\.\[["'][a-zA-Z_$][0-9a-zA-Z_$]*["']\]/,
  dot: /[a-zA-Z_$][0-9a-zA-Z_$]*/
};

var sqbNotation, dotNotation;

if (rx.sqb.test(str)) {
  sqbNotation = rx.sqb.exec(str);
  dotNotation = rx.dot.exec(sqbNotation[0]);

  str = str.replace(sqbNotation[0], "." + dotNotation[0]);
}

console.log(str);
