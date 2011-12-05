.PHONY: test docs coverage

test:
	@vows test/index-test.js --spec

coverage: clean cover

docs:
	@docco fixmyjs.js

cover:
	@jscoverage . /tmp/jscoverage --exclude=node_modules --exclude=packages --exclude=tests && \
	mv /tmp/jscoverage . && \
	vows test/index-test.js --cover-html && \
	google-chrome coverage.html

clean:
	@rm -rf jscoverage && rm -f coverage.html
