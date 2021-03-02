#!/bin/bash
(cd api; flask run &)
(cd frontend; npm start)
