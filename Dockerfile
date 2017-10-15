# We're starting from the Node.js 6.10 container
FROM node:6.10

# Override NODE_ENV=production affecting npm install
# https://github.com/nodesource/docker-node
ENV NODE_ENV development

ARG ARTIFACTORY

WORKDIR /opt/placester/app

RUN curl -u$ARTIFACTORY https://placester.jfrog.io/placester/api/npm/auth > ~/.npmrc \
  && curl -u$ARTIFACTORY https://placester.jfrog.io/placester/api/npm/npm-local/auth/placester >> ~/.npmrc \
  # https://github.com/yarnpkg/yarn/issues/521
  # As temporary workaround for this, in Docker I just copy ~/.npmrc to /app/.npmrc.
  && cp ~/.npmrc .
  # set registry to placester npm if ALL npm packages are to be sourced from there
  # and not just the @placester scope
  # && npm config set registry https://placester.jfrog.io/placester/api/npm/npm

COPY yarn.lock package.json ./
RUN yarn install

COPY . ./