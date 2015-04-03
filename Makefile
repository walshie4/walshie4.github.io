run:
	bundle exec middleman
push:
	git push origin source
pull:
	git pull origin source
update: pull push
deploy: update
	middleman build
	middleman deploy

