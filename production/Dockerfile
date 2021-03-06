FROM node:12.22.2

HEALTHCHECK \
  --interval=6s \
  --timeout=6s \
  --start-period=15s \
  --retries=5 \
  CMD \
  wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

COPY . /opt/app
WORKDIR /opt/app/programs/server

ENV NPM_CONFIG_LOGLEVEL warn
ENV TZ UTC
ENV NODE_ENV production

RUN apt-get update && apt-get install -y \
    libxss1 \
    libxtst6 \
    libgconf-2-4 \
    wget \
    --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

RUN bash -c "time bash -c 'yarn \
  && npm cache clear --force \
  && mv /opt/app/node_modules /opt/node_modules/ \
  && cp -r /opt/app/programs/server/node_modules/. /opt/node_modules/ \
  && mv /opt/app/package.json /opt/'"

WORKDIR /opt

RUN ln -s node_modules app/programs/server/node_modules \
  && ln -s node_modules app/programs/web.browser/node_modules

WORKDIR /opt/app

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /opt/node_modules/

USER pptruser
ENV NODE_ICU_DATA /opt/app/programs/server/npm/node_modules/full-icu/
ENV PORT 3000
EXPOSE 3000

CMD ["/opt/app/entrypoint.sh"]
