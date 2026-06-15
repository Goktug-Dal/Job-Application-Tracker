# 1. Pull the official Python image
FROM python:3.12-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy over the requirements file you just made
COPY requirements.txt .

# 4. Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of your Django code into the container
COPY . .

# 6. Expose the port Django runs on
EXPOSE 8000

# 7. Start the Django server, binding it to 0.0.0.0 so the outside world can see it
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]