deps:
	pip install -r requirements.txt

prometheus-dev:
	/opt/prometheus/prometheus -config.file configs/prometheus.yml

prometheus-prod:
	scripts/start_prometheus.sh

lint:
	@echo "====Python flake8===="
	flake8 server || true
	@echo "====Javascript eslin====t"
	npm run lint

deps-dev:
	pip install -r requirements-dev.txt

server-dev:
	flake8 server && python server/app.py

server-prod:
	scripts/start_server.sh

query:
	python scripts/query.py

stats:
	cloc client
	cloc server
	parker dist-prod/static/scripts/style.css
