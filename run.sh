#!/bin/bash
root=$(pwd)
(cd api; export GOOGLE_APPLICATION_CREDENTIALS="${root}/apikey.json" && venv/bin/flask run --no-debugger &)
(cd frontend; npm start)
