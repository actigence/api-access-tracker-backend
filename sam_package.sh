# Helper shell script to package this application for publishing to AWS SAM Application repository
sam package \
  --template-file template.yaml \
  --output-template-file packaged.yaml \
  --s3-bucket actigence-api-access-tracker-backend
