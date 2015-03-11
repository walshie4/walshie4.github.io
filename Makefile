run:
	bundle exec middleman
push:
	git push origin source
deploy: push
	middleman build
	middleman deploy

