TS_FILES := $(shell find ./**/*.ts )
version = $(shell git tag --sort=committerdate | tail -1)
test: $(TS_FILES) 
	npm test

make clean:
	rm -rf dist
# utils/test/output.ts: utils/test/config.json scripts/oldSpecToBuilder.ts
# 	cat utils/test/config.json | deno run scripts/oldSpecToBuilder.ts "../../mod" |deno fmt -  > utils/test/output.ts

bundle:  fmt $(TS_FILES) .FORCE node_modules
	npx tsc-multi
	npx tsc --emitDeclarationOnly

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