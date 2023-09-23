FROM node:18

# Create app directory
WORKDIR /usr/src/app
 
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

