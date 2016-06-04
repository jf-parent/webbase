from prometheus_client import Gauge, Counter

db_session_gauge = Gauge('db_session_gauge', 'MongoDB session gauge')
db_session_counter = Counter('db_session_counter', 'MongoDB session counter')
active_user_gauge = Gauge('active_user_gauge', 'Nb of user logged in')
