FROM python:3.14-slim

RUN pip install uv

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv sync

COPY . .

EXPOSE 8000

RUN echo '#!/bin/bash\n\
cd /app/air_watcher_project\n\
uv run python manage.py migrate\n\
uv run python manage.py runserver 0.0.0.0:8000' > /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]

