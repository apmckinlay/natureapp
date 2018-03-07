.PHONY: hugo sync server

hugo:
	hugo

sync:
	hugo --cleanDestinationDir
	aws s3 sync public s3://naturecompanion.ca --exclude "*DS_Store" --acl public-read --delete

server:
	hugo server --disableFastRender --renderToDisk --noHTTPCache

links:
	node build/process.js
