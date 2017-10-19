export $(cat .env | grep -v ^# | xargs)
rsync -avz ./dist/artifact.tar $DEPLOY_TARGET:/opt/comment-service-artifact.tar
ssh -t $DEPLOY_TARGET 'cd /opt && ls && mkdir -p jamplay-comment && tar -xvf comment-service-artifact.tar -C /opt/jamplay-comment'

