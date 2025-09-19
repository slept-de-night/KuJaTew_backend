
FROM node:24

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose the port your Express app listens on
EXPOSE 3000

# Command to run the compiled application
CMD ["node", "dist/server.js"]