FROM node:8.9.1 as builder

COPY . /usr/app
WORKDIR /usr/app
ENV NODE_ENV production
RUN yarn global add typescript && \
  yarn add styled-components && \
  yarn install && \
  tsc && \
  rm -rf .git


FROM node:8.9-alpine
COPY --from=builder /usr/app /usr/app
WORKDIR /usr/app
ENV NODE_ENV production

RUN npm i --production -g --quiet --depth 0 modclean && \
  modclean -r -D /node_modules && \
  npm r -g --quiet modclean && du -ms .

EXPOSE 8080
CMD ["yarn", "start"]
