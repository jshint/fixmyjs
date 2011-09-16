require('./')("Array literal should be used instead of constructor", {
  "foo['HOME']": "foo.HOME",
  "foo['bar']": "foo.bar",
  "foo['bar']['baz']": "foo.bar.baz",
  "foo['bar'].is['baz']": "foo.bar.is.baz",
  "foo['bar'].is['baz'].hello.world": "foo.bar.is.baz.hello.world",
  'super["cali"].fragilistic["expi"].ali.docious': "super.cali.fragilistic.expi.ali.docious",
  'hello["world"]\nlol["cats"]': 'hello.world\nlol.cats'
}).export(module);
