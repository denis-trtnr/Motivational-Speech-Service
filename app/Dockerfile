FROM node:slim
EXPOSE 8080
WORKDIR /app
COPY package.json /app/
RUN npm install
# COPY index.html /app/
# COPY style.css /app/
# COPY client.js /app/
#COPY server.js /app/
COPY . /app/
CMD ["node", "/app/server.js"]