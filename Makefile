TS_FILES := $(shell find ./**/*.ts )
version = $(shell git tag --sort=committerdate | tail -1)
test: $(TS_FILES) 
	npm test

make clean:
	rm -rf dist
	
lib/util/artifacts/output.ts: lib/util/artifacts/makeOutput.ts lib/scripts/oldSpecToBuilder.ts
	npm run buildOutput

bundle:  fmt $(TS_FILES) .FORCE node_modules
	npx tsc-multi
	npx tsc --emitDeclarationOnly

check:
	npm run check

fmt: node_modules
	npx prettier --write "**/*.ts"

node_modules: package.json
	npm install

publish: bundle	
	cp package.json dist/package.json
	cp README.md dist/README.md
	cp LICENSE dist/LICENSE
	cd dist && npm publish
link: bundle	
	cp package.json dist/package.json
	cp README.md dist/README.md
	cp LICENSE dist/LICENSE
	cd dist && npm link
.FORCE: 