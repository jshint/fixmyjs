// trailing decimal
var a = 2.;

// leading decimal
var b = .0;

// array literal instead
var c = new Array();


// obj literal instead
var d = new Object();

// unexpected spaces
function e ( )
{
  // bad line breaks
  return
  {
    "foo": "bar"
  };
}

// use isNaN function for comparing
if (a === NaN) {
  // do nothing
}

function F(param) {
  this.param = param;
}

// missing parens when invoking constructor
var g = new F;

var h = (function i() {
  return "foo";

// need to move invocation inside the parens.
})();

// unnecessary intialization to undefined
var j = undefined;

// debugger not needed
debugger;
