# 1. Pull the official Node image
FROM node:18-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files first (this makes future builds much faster)
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your React code
COPY . .

# 6. Expose the React port
EXPOSE 3000

# 7. Start the development server
CMD ["npm", "start"]