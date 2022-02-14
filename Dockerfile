#
# ---- Build ----
FROM node:16.10.0-alpine3.11 as build

ARG RAZZLE_SESSION_TOKEN

ENV RAZZLE_SESSION_TOKEN=${RAZZLE_SESSION_TOKEN}

LABEL img.name="frontend/main" \
  img.description="Main frontend" \
  img.vcs-url="https://github.com/cardboxdev/frontend" \
  maintainer="Sergey Sova <mail@sergeysova.com>"
# img.version="0.1.7" \

# Workdir in build stage should be equal with release stage, razzle uses this path
WORKDIR /app

# install and cache node packages
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build


#
# ---- Release ----
FROM node:16.10.0-alpine3.11

WORKDIR /app

COPY --from=build /app/package.json /app/yarn.lock ./
RUN yarn install --production
COPY ./worker /app/worker
COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["yarn", "start:prod"]
