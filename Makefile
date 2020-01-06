install:
	npm install

gendiff:
	npx babel-node -- src/bin/gendiff.js -$(arg)

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage