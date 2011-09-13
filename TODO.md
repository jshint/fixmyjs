* Strings must use doublequote. (JSON)

* "A dot following a number can be confused with a decimal point.

* Unexpected space after '{a}'.

* Unexpected space before '{a}'.

* Line breaking error '{a}'.

* Extra comma.

---

* Try RegExp first, else do Chr. If doing Chr, get the true Chr count by
using config's indent and converting the tabs to spaces using following formula:

    character + (tabs * config.indent)

* DRY it up/refactor the regex.

* Add tests (single-line multi stmt, and all types of supported errs)
