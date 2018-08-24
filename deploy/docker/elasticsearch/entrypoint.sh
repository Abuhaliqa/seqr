#!/usr/bin/env bash

env

set -x

#/usr/local/elasticsearch-6.0.0/bin/elasticsearch-keystore create
#/usr/local/elasticsearch-6.0.0/bin/elasticsearch-keystore add-file gcs.client.default.credentials_file /.config/client_secrets.json


mkdir -p /logs
chown elasticsearch /elasticsearch-data /logs


export ES_JAVA_OPTS="-Xms3g -Xmx5g"

su elasticsearch -c "/usr/local/elasticsearch-${ELASTICSEARCH_VERSION}/bin/elasticsearch \
    -E network.host=0.0.0.0 \
    -E http.port=${ELASTICSEARCH_SERVICE_PORT} \
    -E path.data=/elasticsearch-data \
    -E path.logs=/logs" &

# sleep indefinitely to prevent container from terminating
sleep 1000000000000
