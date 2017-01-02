#!/bin/bash

rm -fr Webbase
for f in configs/*.yml
do
    echo "[*]Running with config: $f"
    cookiecutter .. --no-input --config-file $f
	ln -s `pwd`/../main/node_modules/ Webbase/node_modules
    cd Webbase
    npm run build:travis
    npm run test
    if [ "$?" = "0" ]; then
        echo "Client side test success"
    else
        echo "Fix the problem before moving on..."
        exit 1
    fi
    make test
    if [ "$?" = "0" ]; then
        echo "[*]done with: $f"
        rm -fr Webbase
    else
        echo "Fix the problem before moving on..."
        exit 1
    fi
done
