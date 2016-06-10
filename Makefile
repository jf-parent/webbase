deps:
	pip install -r requirements.txt

deps-dev:
	pip install -r requirements-dev.txt

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

test:
	flake8 server && py.test server/tests --instafail --html=last-report.html

test-debug:
	flake8 server && py.test server/tests --pdb

server-dev:
	flake8 server && python server/app.py

start-server-prod:
	scripts/start_server.sh

stop-server-prod:
	scripts/stop_server.sh

query:
	python scripts/query.py

reset-db:
	python scripts/reset_db.py

stats:
	cloc client
	cloc server
	parker dist-prod/static/scripts/style.css
