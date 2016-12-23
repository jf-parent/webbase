# https://www.gnu.org/software/sed/manual/html_node/Regular-Expressions.html
escape-all-bracket: sed-escape-right-bracket sed-escape-left-bracket 

# Idempotent regex. e.g.: }} => {{"}}"}} / {{"}}"}} => {{"}}"}}
sed-escape-right-bracket:
	find "{{cookiecutter.project_name}}" -type f \( -iname '*.py' -or -iname '*.jsx' \) -print -exec sed -i '' 's/\([^"]\)\(}}\)/\1{{"\2"}}/g' {} \;

# Idempotent regex. e.g.: {{ => {{"{{"}} / {{"{{"}} => {{"{{"}}
sed-escape-left-bracket:
	find "{{cookiecutter.project_name}}" -type f \( -iname '*.py' -or -iname '*.jsx' \) -print -exec sed -i '' 's/\([^{]\)\({{\)\([^"]\)/\1{{"\2"}}\3/g' {} \;

copy-webbase:
	rm -fr "{{cookiecutter.project_name}}"
	mkdir "{{cookiecutter.project_name}}"
	cp -r ../webbase/* "{{cookiecutter.project_name}}"
	rm -fr "{{cookiecutter.project_name}}/.git"
	rm -fr "{{cookiecutter.project_name}}/platforms"
	rm -fr "{{cookiecutter.project_name}}/node_modules"
	rm -fr "{{cookiecutter.project_name}}/yarn.lock"
	rm -fr "{{cookiecutter.project_name}}/build"
	rm -fr "{{cookiecutter.project_name}}/www"
	rm -fr "{{cookiecutter.project_name}}/Webbase.egg-info/"
	rm -fr "{{cookiecutter.project_name}}/pid"
	rm -fr "{{cookiecutter.project_name}}/dist-dev"
	rm -fr "{{cookiecutter.project_name}}/dist"
	rm -fr "{{cookiecutter.project_name}}/releases"
	rm -fr "{{cookiecutter.project_name}}/logs"
	rm -fr "{{cookiecutter.project_name}}/__pycache__"
	rm -fr "{{cookiecutter.project_name}}/tests/tb_results"
	rm -fr "{{cookiecutter.project_name}}/tests/tests/states"
	find "{{cookiecutter.project_name}}" -name ".DS_STORE" -exec rm -rf {} \;
	find "{{cookiecutter.project_name}}" -name "*.pyc" -exec rm -rf {} \;

copy-webbase-fast:
	rm -fr "{{cookiecutter.project_name}}"
	cp -r main "{{cookiecutter.project_name}}"
	rm -fr "{{cookiecutter.project_name}}/node_modules"

cookiecutter: escape-all-bracket
	rm -fr Webbase
	cookiecutter .
	ln -s `pwd`/main/node_modules/ Webbase/node_modules
	cd Webbase && npm run build:dev
