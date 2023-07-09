#!/bin/bash
cd backend

# Create virtual environment
virtualenv -p "/usr/bin/python3.9" venv
source "venv/bin/activate"

# Install required packages
pip3 install django
pip3 install djangorestframework
pip3 install markdown       # Markdown support for the browsable API.
pip3 install django-filter  # Filtering support
pip3 install djangorestframework-simplejwt
pip3 install django-cors-headers 
pip3 install pillow

# Run migrations
./manage.py makemigrations
./manage.py migrate

# Setup Frontend
cd ../frontend
npm install react-router-dom
npm install --save-dev express cors  # Allow cross origin resource sharing
npm install --save react-image-upload
npm install date-fns

# deactivate