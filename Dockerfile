# Use official Node.js image as base
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install nodemon globally for development
RUN npm install -g nodemon

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["sh", "-c", "npm run create-db && npm run migrate && npm run start"]
