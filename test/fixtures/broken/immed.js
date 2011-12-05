(function () { })();

(function () {
})();

//(function () { })(); (function () { })(); // broke this line in favor of the lines below

(function () {
})(1, 2, 3);

(function () {
})((2 + 2), foo(1, 2, 3, (4 + 0), [1, 2, 3], { a: 1 }, bar()), null);

(function () {

})(function () { return function () { return function () { return 1; }; }; });
