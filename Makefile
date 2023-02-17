TS_FILES := $(shell find ./**/*.ts )
version = $(shell git tag --sort=committerdate | tail -1)
test: $(TS_FILES) utils/test/output.ts
	deno test test.ts
	deno check mod.ts

utils/test/output.ts: utils/test/config.json scripts/oldSpecToBuilder.ts
	cat utils/test/config.json | deno run scripts/oldSpecToBuilder.ts "../../mod.ts" |deno fmt -  > utils/test/output.ts

bundle: test fmt $(TS_FILES)
	echo "Version: $(version)"
	deno run --allow-net --allow-write --allow-env --allow-run --allow-read build.ts $(version)

fmt:
	deno fmt

publish: bundle	
	cd lib && npm publish