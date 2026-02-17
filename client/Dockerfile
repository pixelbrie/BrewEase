FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependency files first
COPY package*.json ./

# Install dependencies inside container
RUN npm install

# Copy project
COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
