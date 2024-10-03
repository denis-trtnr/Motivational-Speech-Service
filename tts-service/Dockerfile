# Base image for Python
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements.txt to the container
COPY requirements.txt /app/

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Expose the service port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
