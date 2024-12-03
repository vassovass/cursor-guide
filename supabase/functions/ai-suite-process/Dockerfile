FROM supabase/edge-runtime

# Install Python 3 and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install aisuite and its dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy function code
COPY . .