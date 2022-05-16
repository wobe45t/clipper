#!/bin/bash
# gunicorn main:app -w 2 -b :5000 -k uvicorn.workers.UvicornWorker --reload 
SQLALCHEMY_WARN_20=1 python -W always::DeprecationWarning main.py
