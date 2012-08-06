function bind(fn, ctx) {
  return function () {
    fn.apply(ctx, arguments);
  };
}
