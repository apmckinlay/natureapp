.PHONY: eleventy server sync

eleventy:
	eleventy

server:
	eleventy --serve

sync:
	eleventy
	aws s3 sync _site s3://naturecompanion.ca --exclude "*DS_Store" --acl public-read --delete

links:
	node build/process.js
