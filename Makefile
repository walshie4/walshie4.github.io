run:
	bundle exec middleman
push:
	git push origin source
build:
	middleman build
deploy: build
	middleman deploy
