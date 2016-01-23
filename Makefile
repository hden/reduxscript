.PHONY: clean

target/bundle.js:
	./node_modules/.bin/browserify index.js -o target/bundle.js -t babelify

clean:
	rm target/*
