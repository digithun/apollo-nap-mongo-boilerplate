PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
docker tag gcr.io/$(gcloud config get-value project)/jamplay-web:$PACKAGE_VERSION gcr.io/$(gcloud config get-value project)/jamplay-web:latest

