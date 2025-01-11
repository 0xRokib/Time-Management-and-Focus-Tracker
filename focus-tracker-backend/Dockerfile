# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Run the build step to compile TypeScript code into JavaScript
RUN npm run build

# Expose the port that the app will run on
EXPOSE 5001

# Run the application
CMD ["node", "dist/server.js"]
