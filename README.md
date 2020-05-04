# API Access Tracker (Backend)

> One click deployment using [AWS Application Repositorry](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:717292065848:applications/api-access-tracker-backend)

This repository can be used to create backend service for tracking requests to webservices APIs. 

This repository creates an independent **AWS** stack (using serverless technologies), that can be used to receive API 
access events and store them to AWS DynamoDB.

## Purpose
If you want to log all requests made to your RESTFul web services, this repository will create an independent backend 
to store access details of requests being made to your web services.

These are many advantages of tracking requests to your web services:
* These logs can be used for API access auditing.
* These logs trails can be helpful in debugging connection issues clients and service.
* These logs can be used for various types of data analysis.

## How it works?
This service works in conjunction with [API Access Tracker Client](#api-access-tracker-client), to receive and store API access events. 

The [API Access Tracker Client](#api-access-tracker-client) generates AWS SQS events containing request and response details from your webservices, 
which are consumed by this service.
These AWS SQS events are processed by AWS Lambda functions and persisted in AWS DynamoDB.

Following data values, regarding each request, are received from the [API Access Tracker Client](#api-access-tracker-client):
* Request URL
* URL parameters
* Request body
* All headers of request
* HTTP response status
* HTTP response body

Following AWS services are used, by this service:
* AWS SQS
* AWS Lambda
* AWS Cloudformation
* AWS DynamoDB
* AWS CloudWatch

## How to setup your webservices?
You simply need to include one of the compatible [API Access Tracker Client](#api-access-tracker-client) in your project and setup this service 
in your AWS account, to start tracking calls to your APIs (webservices).

Below is a step-by-step guide on how to setup every thing.

**Setup the AWS Backend**
1. Create an AWS Account or use your existing account.
2. Deploy this service through [AWS SAM Repository](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:717292065848:applications/api-access-tracker-backend)
3. After the AWS Stack is setup successfully, you should see two SQS queues (starting with name `aal_`), 
two Lambda functions (starting with name `aal_`) and two DynamoDB tables (starting with name `aal_`).
4. Create an IAM user with programmatic credentials and provide it access to the created SQS queues. Below policy shows
 minimum access rights required. This user is used by your webservice client to publish events to the SQS queues. 
 Make sure you store API access credentials for this user (its only available once from AWS console) 
 ```$xslt
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "sqs:GetQueueUrl",
        "sqs:SendMessage",
        "sqs:CreateQueue"
      ],
      "Resource": "arn:aws:sqs:us-east-1:<Your-AWS-Account-ID>:aal_*"
    }
  ]
}
```

**Setup your webservices**
* Import one of the [API Access Tracker Client](#api-access-tracker-client) to your webservices project.
* Setup AWS credentials of AWS users in your project.

That's it, now whenever you make a request to any webservices in your project, the event will be stored in the AWS DynamoDB tables.

## API Access Tracker Client
Currently available **API Access Tracker Client** implementations:

|Repository      |Language                          |Demo Repository                         |
|----------------|-------------------------------|-----------------------------|
|[api-access-tracker-java-client](https://github.com/Actigence/api-access-tracker-java-client)|Java (Servlet) |[Demo](https://github.com/Actigence/api-access-tracker-java-client-demo) |
