.PHONY: build server deploy links index help

build:
	eleventy

server:
	eleventy --serve

deploy:
	eleventy
	firebase deploy
	
links:
	node build/process.js

index:
	node build/index.js
	
help:
	# make build - build the site
	# make server - run a local server with reload on modify
	# make deploy - deploy to Google Firebase
	# make links - update the links and See Also's
