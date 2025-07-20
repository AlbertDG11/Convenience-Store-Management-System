FROM python:3.11-alpine

WORKDIR /app

# Install system dependencies for MySQL
RUN apk add --no-cache \
    gcc \
    musl-dev \
    mariadb-dev \
    pkgconfig \
    mariadb-client

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Start command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]