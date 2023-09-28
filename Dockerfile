FROM node:18

# Create app directory
WORKDIR /usr/src/app
 
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY ./src ./src

EXPOSE 3000

CMD ["npm", "run", "dev"]

