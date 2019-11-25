[Back to main guide](../README.md) 

[Previous](device-farm-console.md)

#### Deploy a CI/CD pipeline with Jenkins

1. Deploy the CloudFormation stack (~5 minutes)

```bash
```

2. Log into CloudFormation

```bash
```

3. Log into CodePipeline

4. Log into Jenkins

```bash
```

5. Update Jenkins config

Manage Jenkins -> Configure System -> AWS Device Farm (bottom)
AKID
SKID
Validate -> Save

6. Update Job config

Jenkins -> AWSDeviceFarmAppiumTest -> Configure -> Source Code Management
AWS Access Key
AWS Secret Key
Version

7. AWS CodePipeline Polling Log (wait for error to clear)

8. Watch logs in Jenkins

9. Once job is complete review Job overview and Jenkins dashboard

[Previous](device-farm-console.md)