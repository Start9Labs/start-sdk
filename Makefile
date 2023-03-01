TS_FILES := $(shell find ./**/*.ts )
version = $(shell git tag --sort=committerdate | tail -1)
# test: $(TS_FILES) utils/test/output.ts
# 	deno test test.ts
# 	deno check mod.ts

utils/test/output.ts: utils/test/config.json scripts/oldSpecToBuilder.ts
	cat utils/test/config.json | deno run scripts/oldSpecToBuilder.ts "../../mod" |deno fmt -  > utils/test/output.ts

bundle:  fmt $(TS_FILES) .FORCE node_modules
	rm -rf dist || true
	npx tsc-multi
	npx tsc --emitDeclarationOnly

fmt: node_modules
	npx prettier --write "**/*.ts"

node_modules: package.json
	npm install

publish: bundle	
	npm publish
.FORCE: 