export $(cat .env | grep -v ^# | xargs)
rsync -avz ./dist/artifact.tar root@188.166.251.184:/opt/comment-service-artifact.tar
ssh -t root@188.166.251.184 'cd /opt && ls && mkdir -p jamplay-comment-service && tar -xvf comment-service-artifact.tar -C /opt/jamplay-comment-service'

