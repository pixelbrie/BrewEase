
FROM node:20-alpine
WORKDIR /app


# Copy dependency files first
COPY package*.json ./
# Install dependencies inside container
RUN npm install
# Copy project
COPY . .
COPY index.html ./public/index.html

EXPOSE 5173
CMD ["npm", "run", "dev"]
