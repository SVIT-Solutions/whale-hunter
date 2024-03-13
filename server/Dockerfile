FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update

COPY pyproject.toml poetry.lock /

RUN pip install poetry

RUN poetry config virtualenvs.create false && \
    poetry install