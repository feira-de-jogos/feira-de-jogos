all: stop start

stop:
	docker compose down

start:
	docker compose up -d

clean:
	docker ps -a -q | xargs docker rm
	docker images -q | xargs docker rmi -f

stop-matrix:
	docker stop nuvem-matrix-1
	docker stop nuvem-matrix-db-1

clean-matrix: stop-matrix
	docker rm nuvem-matrix-1
	docker rm nuvem-matrix-db-1
	rm -rf matrix-db
