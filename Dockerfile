# Use the official Node.js 14 base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Nest.js application listens on (e.g., 3000)
EXPOSE 3000

# Start the Nest.js application
CMD ["npm", "start"]
