TEST_FILES := $(shell find ./**/*.ts)


test: $(TEST_FILES)
	deno test test.ts
	deno check mod.ts