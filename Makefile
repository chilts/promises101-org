all: generate

new-post:
	npm run new-post

server:
	npm start

generate: clean
	npm run generate

commit:
	git commit -a -m 'Generated site'

release:
	rsync -a htdocs/ dirac.chilts.org:/var/lib/chilts-static/promises101.org

clean:
	find . -name '*~' -delete

.PHONY: clean
