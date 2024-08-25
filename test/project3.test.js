// Test AWS infrastructure

const cdk = require('aws-cdk-lib');
const { Template } = require('aws-cdk-lib/assertions');
const { Project3Stack } = require('../lib/project3-stack');

const app = new cdk.App();
const stack = new Project3Stack(app, 'Test-Project3Stack', {});
const template = Template.fromStack(stack);

// ======================================================== Unit/Assertions Test =====================================================

test('Bucket for canary has been created', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: "project3-canary-bucket"
    })
})

test('Canary has been created', () => {
    template.hasResource("AWS::Synthetics::Canary", "");
})

test('Canary runs every 5 minutes', () => {
    template.hasResourceProperties('AWS::Synthetics::Canary', {
        Schedule: {
            Expression: "rate(5 minutes)",
        }
    })
})

test('There are 11 alarms, includes 3 Latency, 3 Availability, 3 BrokenLinks', () => {
    template.resourceCountIs("AWS::CloudWatch::Alarm", 11);

    template.resourcePropertiesCountIs("AWS::CloudWatch::Alarm", {MetricName: "PageExecutionTime"}, 3)
    template.resourcePropertiesCountIs("AWS::CloudWatch::Alarm", {MetricName: "PageAvailability"}, 3)
    template.resourcePropertiesCountIs("AWS::CloudWatch::Alarm", {MetricName: "PageBrokenLinks"}, 3)
})

test('SNS has been created and has 2 email subscriptions', () => {
    template.hasResource("AWS::SNS::Topic", "");
    
    template.resourceCountIs("AWS::SNS::Subscription", 2);
})

// ======================================================== Snapshot Test =====================================================
// Might need to run "npm run test --updateSnapshot"
it('Matches the snapshot.', () => {
    expect(template.toJSON()).toMatchSnapshot();
});
    
