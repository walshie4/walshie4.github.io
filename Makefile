.PHONY: run, push, pull, update, deploy, build, clean
clean:
	rm -rf build/
run:
	bundle exec middleman
push:
	git push origin source
pull:
	git pull origin source
update: pull push
deploy: update build
	bundle exec middleman deploy
build: clean
	bundle exec middleman build

