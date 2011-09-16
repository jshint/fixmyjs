require('./')("Use dot notation instead of square bracket notation when possible", {
  "foo['HOME'];": "foo.HOME;",
  "foo['bar'];": "foo.bar;",
  "foo['bar']; foo['baz'];": "foo.bar; foo.baz;",
  "foo['bar']['baz'];": "foo.bar.baz;",
  "foo['bar'].is['baz'];": "foo.bar.is.baz;",
  "foo['bar'].is['baz'].hello.world;": "foo.bar.is.baz.hello.world;",
  'super["cali"].fragilistic["expi"].ali.docious;': "super.cali.fragilistic.expi.ali.docious;",
  'hello["world"];\nlol["cats"];': 'hello.world;\nlol.cats;',
  'hello["return"];': 'hello["return"];',
  'foo["for"]; foo["that"]; foo[\'this\'];': 'foo["for"]; foo.that; foo[\'this\'];'
}).export(module);
