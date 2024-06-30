# AWS Backendless Private ChatGPT

This is a Serverless Application Model (SAM) template that sets up the infrastructure for a private GPT frontend application using AWS services. The application includes a website hosted on an S3 bucket with CloudFront distribution, user authentication via Cognito User Pool, and access to Amazon Bedrock foundation models for generative AI capabilities.

## Architecture
The architecture consists of the following components:

### Frontend Layer

- An S3 bucket to host the website files
- A CloudFront distribution for caching and serving the website content

### Auth Layer

- A Cognito User Pool for user authentication and authorization
- A Cognito User Pool Client for handling authentication flows
- An Identity Pool and authenticated IAM role for accessing AWS resources

### Bedrock Integration

- The authenticated IAM role has permissions to invoke Anthropic's Claude foundation models via Amazon Bedrock

## Deployment

To deploy the application, follow these steps:

1. Clone the repository

2. Install the AWS SAM CLI

3. Run `sam deploy --guided` to deploy the application stack

During the guided deployment, you'll be prompted to provide:

- The AWS region

- The desired environment (dev, test, prod)

- Other stack configuration parameters

After successful deployment, the CloudFront distribution URL, Cognito User Pool details, and other relevant outputs will be displayed.

## Usage
Visit the CloudFront distribution URL to access the website

Sign up or sign in using the Cognito User Pool

Interact with the application, which will leverage the Bedrock foundation models for generative AI capabilities

## Contributing
If you'd like to contribute to this project, please follow the standard GitHub workflow:

1. Fork the repository

2. Create a new branch for your feature/bug fix

3. Commit your changes

4. Push to the branch

5. Create a new Pull Request

## License
This project is licensed under the MIT License.

Note: This is a basic README covering the key aspects of the project. You may want to enhance it further with additional details, such as local development setup, testing instructions, code structure overview, and any other relevant information.