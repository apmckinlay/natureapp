.PHONY: build server deploy links index files help

all: links index files

build:
	rm -rf _site
	npx @11ty/eleventy@2.0.1 --quiet

serve:
	npx @11ty/eleventy@2.0.1 --serve --quiet
	# firebase serve --only hosting --host 0.0.0.0

deploy: links index files
	firebase deploy
	
links:
	node build/process.js

index:
	node build/index.js
	
files: build
	ufind _site -type f | sed -f files.sed | sort > _includes/files.mustache
	npx @11ty/eleventy@2.0.1 --quiet
	
help:
	# make build - build the site
	# make server - run a local server with reload on modify
	# make deploy - deploy to Google Firebase
	# make links - update the links and See Also's
