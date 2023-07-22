#!/bin/bash
cd backend
source "venv/bin/activate"
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py loaddata p3.json
python3 manage.py runserver & cd ../frontend/restify/ && npm start && fg