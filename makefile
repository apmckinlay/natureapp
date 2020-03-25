.PHONY: eleventy server sync

eleventy:
	eleventy

server:
	eleventy --serve

sync:
	eleventy
	aws s3 sync _site s3://naturecompanion.ca --exclude "*DS_Store" --acl public-read --delete --cache-control max-age=60

links:
	node build/process.js

index:
	node build/index.js