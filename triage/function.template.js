'use strict';

const lambdaCfn = require('@mapbox/lambda-cfn');

const lambdaTemplate = lambdaCfn.build({
  name: 'triage',
  handler: 'triage/function.fn',
  memorySize: '1536',
  parameters: {
    PagerDutyApiKey: {
      Type: 'String',
      Description: '[secure] PagerDuty API key'
    },
    PagerDutyServiceId: {
      Type: 'String',
      Description: 'PagerDuty service ID'
    },
    PagerDutyFromAddress: {
      Type: 'String',
      Description: 'Email address of a valid PagerDuty user'
    },
    GitHubOwner: {
      Type: 'String',
      Description: 'Owner of Github repo'
    },
    GitHubRepo: {
      Type: 'String',
      Description: 'Github repository'
    },
    GitHubToken: {
      Type: 'String',
      Description: '[secure] GitHub OAuth Token'
    },
    SlackVerificationToken: {
      Type: 'String',
      Description: '[secure] Slack verification token for Dispatch Slack app'
    },
    KmsKey: {
      Type: 'String',
      Description: 'Cloudformation-kms stack name or KMS key ARN'
    }
  },
  statements: [
    {
      Effect: 'Allow',
      Action: [
        'kms:Decrypt'
      ],
      Resource: {
        'Fn::ImportValue': {
          'Ref': 'KmsKey'
        }
      }
    }
  ],
  eventSources: {
    webhook: {
      method: 'POST',
      apiKey: false,
      integration: {
        PassthroughBehavior: 'WHEN_NO_TEMPLATES',
        RequestTemplates: {
          'application/x-www-form-urlencoded': '{ "postBody" : $input.json("$")}'
        }
      }
    }
  }
});

module.exports = lambdaTemplate;
