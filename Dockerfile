FROM arm32v7/node:11.0.0

# Create app directory
WORKDIR /usr/src/app

# Environment variables
ENV MONGODB_URI mongodb://mongo:27017/feedernet
ENV PORT 4000

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN npm install -g yarn
RUN yarn install
  
# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]
