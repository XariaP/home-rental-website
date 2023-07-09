#!/bin/bash
cd backend
source "venv/bin/activate"
./manage.py makemigrations
./manage.py migrate
./manage.py runserver & cd ../frontend/restify/ && npm start && fg