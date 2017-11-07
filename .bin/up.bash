export $(cat .env | grep -v ^# | xargs)

ssh -t $DEPLOY_TARGET 'cd /opt/jamplay-comment-service&&pm2 describe jamplay-comment > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start ./pm2.prod.json
else
  pm2 restart jamplay-comment
fi;'