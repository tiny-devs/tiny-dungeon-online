FROM denoland/deno:alpine

EXPOSE 1995

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (this is re-run only when deps.ts is modified).
# Ideally this will download and compile _all_ external files used in mod.ts.
COPY deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
# COPY . .
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

ENV SHELL /bin/sh

# These are passed as deno arguments when run with docker:
CMD ["run", "--allow-all", "main.ts"]