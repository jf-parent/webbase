# https://www.gnu.org/software/sed/manual/html_node/Regular-Expressions.html
escape-all-bracket: sed-escape-right-bracket sed-escape-left-bracket

# TODO rewrite with lookaround
# ref: http://www.regular-expressions.info/lookaround.html
# Idempotent regex. e.g.: }} => {{"}}"}} / {{"}}"}} => {{"}}"}}
sed-escape-right-bracket:
	find "{{cookiecutter.project_name}}" -type f \( -iname '*.py' -or -iname '*.jsx' \) -print -exec sed -i '' 's/\([^"]\)\(}}\)/\1{{"\2"}}/g' {} \;

# TODO rewrite with lookaround
# ref: http://www.regular-expressions.info/lookaround.html
# Idempotent regex. e.g.: {{ => {{"{{"}} / {{"{{"}} => {{"{{"}}
sed-escape-left-bracket:
	find "{{cookiecutter.project_name}}" -type f \( -iname '*.py' -or -iname '*.jsx' \) -print -exec sed -i '' 's/\([^{]\)\({{\)\([^"]\)/\1{{"\2"}}\3/g' {} \;

cookiecutter: escape-all-bracket
	rm -fr Webbase
	cookiecutter .
	ln -s `pwd`/main/node_modules/ Webbase/node_modules
	cd Webbase && npm run build:dev
