export $(cat .env | grep -v ^# | xargs)
yarn tsc
NODE_ENV=production yarn next -- build
rm -rf ./dist
mkdir -p dist
tar --exclude='.git' --exclude='.db' --exclude='.env' --exclude='./dist' --exclude='./dist/artifact.tar' --exclude='./node_modules' --exclude='./.vscode' -czf ./dist/artifact.tar ./
