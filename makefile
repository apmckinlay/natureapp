.PHONY: build server fb s3 links index

build:
	eleventy

server:
	eleventy --serve

fb:
	eleventy
	firebase deploy
	
s3:
	aws s3 sync _site s3://naturecompanion.ca --exclude "*DS_Store" --acl public-read --delete --cache-control max-age=60

links:
	node build/process.js

index:
	node build/index.js
	
help:
	# make build - build the site
	# make server - run a local server with reload on modify
	# make fb - deploy to Google Firebase
	# make s3 - sync to Amazon S3
	# make links - update the links and See Also's
