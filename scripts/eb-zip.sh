#!/bin/sh

stat dev || mkdir dev

# Archive artifacts
zip dev/kormelon-api.zip -r ./

# Setup eb config
mkdir .elasticbeanstalk
cat << EOF > .elasticbeanstalk/config.yml
deploy:
    artifact: dev/kormelon-api.zip
EOF