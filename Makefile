.PHONY: all build dist clean deploy

PLUGIN_ID=com.proudcommerce.markdown-viewer
PLUGIN_VERSION=$(shell cat plugin.json | grep '"version"' | cut -d'"' -f4)
BUNDLE_NAME=$(PLUGIN_ID)-$(PLUGIN_VERSION).tar.gz

all: build

build:
	cd webapp && npm install && npm run build

dist: build
	rm -rf dist
	mkdir -p dist/bundle
	cp plugin.json dist/bundle/
	mkdir -p dist/bundle/webapp/dist
	cp webapp/dist/* dist/bundle/webapp/dist/
	cd dist/bundle && tar -czf ../$(BUNDLE_NAME) .
	@echo "\nPlugin built: dist/$(BUNDLE_NAME)"

clean:
	rm -rf dist
	rm -rf webapp/dist
	rm -rf webapp/node_modules
	rm -f *.tar.gz

deploy: dist
	@echo "Upload dist/$(BUNDLE_NAME) to your Mattermost server"

