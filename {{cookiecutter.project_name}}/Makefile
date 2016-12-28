help:
	@echo "-INSTALL-------------------------------------------------------"
	@echo "[*] 'deps': install python dependencies"
	@echo "[*] 'deps-dev': install pythno dev dependencies"
	@echo "-SERVICES------------------------------------------------------"
	@echo "[*] 'server-dev': start the server without detaching"
	@echo "[*] 'start-server-prod': start the server and detach"
	@echo "[*] 'stop-server-prod': stop the server from the pid file"
	@echo "[*] 'admin-dev': start the admin server without detaching"
	@echo "[*] 'start-admin-prod': start the admin server and detach"
	@echo "[*] 'stop-admin-prod': stop the admin server from the pid file"
	@echo "[*] 'queue-dev': start the queue service without detaching"
	@echo "[*] 'start-queue-prod': start the queue service and detach"
	@echo "[*] 'stop-queue-prod': stop the queue service from the pid file"
	@echo "[*] 'prometheus-dev': start the prometheus server without detaching"
	@echo "[*] 'start-prometheus-prod': start the prometheus server and detach"
	@echo "[*] 'stop-prometheus-prod': stop the prometheus server from the pid file"
	@echo "-DEV-----------------------------------------------------------"
	@echo "[*] 'new-model': create a new model skeleton file in server/model/"
	@echo "[*] 'new-migration-script': create a new migration script skeleton file in db_migration_scripts/"
	@echo "[*] 'new-route': create a new route skeleton file in client/routes/"
	@echo "[*] 'lint': lint the server and client code"
	@echo "[*] 'serve-cwd': server current working directory"
	@echo "[*] 'stats': show number of line of code for the server and client and some css stats"
	@echo "-TEST----------------------------------------------------------"
	@echo "[*] 'test-prod': run the test and output a html report"
	@echo "[*] 'test': flake8 the tests and run them"
	@echo "[*] 'test-debug': run test with the debug flag"
	@echo "-ADMIN---------------------------------------------------------"
	@echo "[*] 'query': query the database"
	@echo "[*] 'reset-db': reset the database"
	@echo "[*] 'init-db-sample-data': init the database with some sample data"

deps:
	pip install -r requirements.txt

deps-dev:
	pip install -r requirements-dev.txt

new-migration-script:
	cookiecutter https://github.com/jf-parent/webbase-cookiecutter-create-migration-script -o db_migration_scripts

new-model:
	cookiecutter https://github.com/jf-parent/webbase-cookiecutter-create-model -o server/model/

new-route:
	cookiecutter https://github.com/jf-parent/webbase-cookiecutter-create-route -o client/routes/

admin-dev:
	python admin/app.py

start-admin-prod:
	scripts/start_admin.sh

stop-admin-prod:
	scripts/stop_admin.sh

start-queue-prod:
	scripts/start_rqueue.sh

stop-queue-prod:
	scripts/stop_rqueue.sh

queue-dev:
	rq worker

prometheus-dev:
	/opt/prometheus/prometheus -config.file configs/prometheus.yml

start-prometheus-prod:
	scripts/start_prometheus.sh

stop-prometheus-prod:
	scripts/stop_prometheus.sh

lint:
	@echo "====Python flake8===="
	flake8 server || true
	@echo "====Javascript eslin====t"
	npm run lint

serve-cwd:
	python -m http.server 9010

test-prod:
	py.test server/tests --html=last-report.html

test:
	flake8 server && py.test server/tests --instafail

test-debug:
	flake8 server && py.test server/tests --pdb

server-dev:
	python server/app.py

start-server-prod:
	scripts/start_server.sh

stop-server-prod:
	scripts/stop_server.sh

query:
	python scripts/query.py

reset-db:
	python scripts/reset_db.py

init-db-sample-data:
	python scripts/init_db_sample_data.py

stats:
	cloc client
	cloc server
	parker dist-prod/static/scripts/style.css
