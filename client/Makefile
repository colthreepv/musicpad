RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
LBLUE="\033[1;34m"
LGREEN="\033[1;32m"
LPURPLE="\033[1;35m"
LGREY="\033[0;37m"
NC="\033[0;0m"

all: checknpm gruntjs checkdeps bower placeholders fixless
	grunt build

checknpm:
	@echo -n $(LBLUE)[Checking]$(NC) - node.js installation
	@npm --help > /dev/null
	@echo - $(GREEN)OK!$(NC)

gruntjs:
	@echo $(YELLOW)[Installing]$(NC) - Grunt.JS
	npm install

checkdeps:
	@echo
	@echo
	@echo $(LGREEN)----------------------------------------------------$(NC)
	@echo $(LGREEN)[Info]: $(NC)  Check Documentation in case of Errors
	@echo $(LGREEN)----------------------------------------------------$(NC)
	@echo
	@echo
	@sleep 1

	@echo -n $(LBLUE)[Checking]$(NC) - Bower Global installation
	@bower --help > /dev/null
	@echo - $(GREEN)OK!$(NC)

	@echo -n $(LBLUE)[Checking]$(NC) - Karma Global installation
	@karma --help > /dev/null
	@echo - $(GREEN)OK!$(NC)

	@echo -n $(LBLUE)[Checking]$(NC) - Grunt Global installation
	@grunt --help > /dev/null
	@echo - $(GREEN)OK!$(NC)

bower:
	@echo $(YELLOW)[Installing]$(NC) - Bower Dependancies
	bower install

placeholders:
	@echo -n $(LBLUE)[Compiling]$(NC) - angular-placeholders
	cd vendor/angular-placeholders;	npm install; grunt build

	@echo $(LGREEN)----------------------------------------------------$(NC)
	@echo $(LGREEN)[Info]: $(NC)  Done, clearing folder from node_modules
	@echo $(LGREEN)----------------------------------------------------$(NC)

	cd vendor/angular-placeholders; rm -rf node_modules

fixless:
	@echo $(YELLOW)[Fixing]$(NC) - Less version ~1.3.3
	mv node_modules/grunt-recess/node_modules/recess/package.json node_modules/grunt-recess/node_modules/recess/package.json.bad
	sed 's/"less": ">= 1.3.0"/"less": "~ 1.3.0"/g' node_modules/grunt-recess/node_modules/recess/package.json.bad > node_modules/grunt-recess/node_modules/recess/package.json
	cd node_modules/grunt-recess/node_modules/recess/; npm install

clean:
	grunt clean
	rm -rf vendor/*/
