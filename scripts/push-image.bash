PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

PACKAGE_NAME=$(cat package.json \
| grep name \
| head -1 \
| awk -F: '{ print $2 }' \
| sed 's/[",]//g' \
| tr -d '[[:space:]]')

# echo 'Start push image to project id: ' $(gcloud config get-value project), tag: $PACKAGE_VERSION, image: $PACKAGE_NAME
# gcloud docker -- push gcr.io/$(gcloud config get-value project)/$PACKAGE_NAME:$PACKAGE_VERSION
echo 'Start push image to project id: ' $(gcloud config get-value project), tag: latest, image: $PACKAGE_NAME
gcloud docker -- push gcr.io/$(gcloud config get-value project)/$PACKAGE_NAME:latest
