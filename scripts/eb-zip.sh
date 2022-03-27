#!/bin/sh

stat dev || mkdir dev

# Archive artifacts
zip dev/kormelon-api.zip -r ./ -x "*.git/*" "./@types/*" "./.circleci/*" "./coverage/*" "./scripts/*" "./src/*" "./tsconfig.json" "./nodemon.json" "./jest.config.ts"

# Setup eb config
mkdir .elasticbeanstalk
cat << EOF > .elasticbeanstalk/config.yml
deploy:
    artifact: dev/kormelon-api.zip
EOF