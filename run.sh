#!/bin/bash
cd backend
source "venv/bin/activate"
./manage.py makemigrations
./manage.py migrate
./manage.py loaddata p3.json
./manage.py runserver & cd ../frontend/restify/ && npm start && fg