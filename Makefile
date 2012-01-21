.PHONY: test docs coverage

test:
	@vows --spec

docs:
	@docco fixmyjs.js

coverage:
	@node test/travis-ci.js

coverage-server:
	@node test/travis-ci.js server
