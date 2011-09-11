var foo = function () {
  // missing semicolon
  dowhatnow()
  var test = null;

  // missing semicolon
  // already defined test
  var test = 12

// missing semicolon
}

// missing space
foo.bar = function() {
  // missing space + semicolon
  return 2+2 - 1*4
};

function id() {
// unnecessary semicolon
};

// can be expressed in dot notation
foo["bar"]();
