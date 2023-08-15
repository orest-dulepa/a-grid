release:
	git checkout develop
	git pull origin develop
	$(eval VERSION ?= $(shell cd seller && npm version --no-git-tag-version prerelease))
	git checkout -b release/$(VERSION)
	git add .
	git commit -m "release: $(VERSION)"
	git push origin release/$(VERSION)
	gh pr create \
		--title "release: $(VERSION) to DEVELOP" \
		--body "" \
		--base develop \
		--head release/$(VERSION)
	gh pr create \
		--title "release: $(VERSION) to MAIN" \
		--body "" \
		--base main \
		--head release/$(VERSION)

deploy-dev:
	firebase use ag-edgekit-dev
	npm run deploy:functions
	npm run deploy:rules
	npm run deploy:indexes

deploy-prod:
	firebase use ag-edgekit-prod
	npm run deploy:functions
	npm run deploy:rules
	npm run deploy:indexes

install-seller:
	cd seller && npm install
	cd seller/functions && npm install

install-buyer:
	cd buyer && npm install
	cd buyer/functions && npm install

install:
	make install-seller
	make install-buyer
