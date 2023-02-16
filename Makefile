TS_FILES := $(shell find ./**/*.ts )
version = $(shell git tag --sort=committerdate | tail -1)
test: $(TS_FILES)
	deno test test.ts
	deno check mod.ts

bundle: test fmt $(TS_FILES)
	echo "Version: $(version)"
	deno run --allow-net --allow-write --allow-env --allow-run --allow-read build.ts $(version)

fmt:
	deno fmt

publish: bundle	
	cd lib && npm publish