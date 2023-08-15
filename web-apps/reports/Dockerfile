# Use the official Python image.
# https://hub.docker.com/_/python
FROM python:3.7-slim

# Set an environment to stream logs.
ENV PYTHONUNBUFFERED=TRUE

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY ./requirements.txt requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

COPY . ./

# Run the web service on container startup. 
CMD exec uvicorn main:app --host 0.0.0.0 --port 8080
