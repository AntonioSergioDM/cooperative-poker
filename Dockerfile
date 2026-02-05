# Use the official Node.js LTS image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy local files to container
COPY . .

# Install dependecies
RUN npm install


# Build project
RUN npm run build


# Start the script
CMD ["npm", "run", "start"]
