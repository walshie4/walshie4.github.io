run:
	bundle exec middleman
push:
	git push origin source
deploy:
	middleman build
	middleman deploy
