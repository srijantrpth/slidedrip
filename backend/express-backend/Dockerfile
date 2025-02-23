# Use an official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for caching dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Expose the application port
EXPOSE 5000

# Start the Express server using npm run dev
CMD ["npm", "run", "dev"]
