export $(cat .env | grep -v ^# | xargs)

ssh -t $DEPLOY_TARGET 'cd /opt/jamplay-comment&&pm2 describe pixnode-corn-service > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start ./pm2.prod.json
else
  pm2 restart pixnode-corn-service
fi;'