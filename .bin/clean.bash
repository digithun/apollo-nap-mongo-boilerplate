find -E . -regex '.*\.(js|map|d\.ts)' -not -path "./node_modules/*" -not -path  "./.next/*" -delete
