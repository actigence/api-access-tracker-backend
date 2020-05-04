# Helper shell script to publish this application to AWS SAM Application repository
sam publish \
  --template packaged.yaml \
  --region us-east-1
