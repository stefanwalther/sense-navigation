FROM node

ARG HOME_DIR="opt/sense-navigation-test"
ENV HOME_DIR $HOME_DIR
RUN mkdir -p $HOME_DIR
WORKDIR $HOME_DIR

COPY package.json ./
COPY . ./

RUN npm install --quiet
RUN npm run test:setup-webdriver
