.PHONY: build server deploy links index files help

build:
	rm -r _site
	eleventy --quiet

serve:
	eleventy --serve --quiet

deploy: files index
	firebase deploy
	
links:
	node build/process.js

index:
	node build/index.js
	
files: build
	find _site -type f | sed '/DS_Store/d ; /404/d ; /offline/d ; \
		s/_site// ; s/index.html// ; s/.*/"&",/' \
		| sort > _includes/files.mustache
	eleventy --quiet
	
help:
	# make build - build the site
	# make server - run a local server with reload on modify
	# make deploy - deploy to Google Firebase
	# make links - update the links and See Also's
