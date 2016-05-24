deps:
	pip install -r requirements.txt

deps-dev:
	pip install -r requirements-dev.txt

server-dev:
	python server/app.py

server-prod:
	nohup server/app.py > logs/server.nout 2>&1&

query:
	python scripts/query.py
