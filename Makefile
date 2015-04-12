.PHONY: run, push, pull, update, deploy, build
run:
	bundle exec middleman
push:
	git push origin source
pull:
	git pull origin source
update: pull push
deploy: update build
	bundle exec middleman deploy
build:
	bundle exec middleman build

