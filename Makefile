.PHONY: test docs coverage

test:
	@vows test/index-test.js --spec

docs:
	@docco fixmyjs.js

coverage:
	@node test/coveraje.js

coverage-server:
	@node test/coveraje.js server
