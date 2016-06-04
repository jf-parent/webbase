deps:
	pip install -r requirements.txt

prometheus-dev:
	/opt/prometheus/prometheus -config.file /opt/prometheus/prometheus.yml

prometheus-prod:
	nohup /opt/prometheus/prometheus -config.file /opt/prometheus/prometheus.yml > logs/prometheus.log 2>&1&

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
	nohup server/app.py > logs/server.nout 2>&1&

query:
	python scripts/query.py
