# aws-codepipeline-devicefarm

Welcome to the aws-codepipeline-devicefarm project.

This project shows you how to AWS Device Farm, AWS CodePipeline, and AWS Code Build. The integration enables developers to build automated UX testing into their mobile development workflow.

## Architecture

## Project structure

- **app/** - contains a sample Android application source code we will use for testing

- **appium/** - contains or Appium UX tests

- **cfn/** - contains a CloudFormation stack representing the resources involved

## Required Software

Please install the following software in your local workstation before proceeding:

- [Git client](https://git-scm.com/downloads)

- [AWS Command Line Interface](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) (version 1.11.170 or greater)

- Configure your AWS credentials (access keys, AWS region, etc). At a minimum your credentials should allow you to create and manipulate resources associated withe the following AWS services: Amazon S3, AWS CodeCommit, AWS CodePipeline, AWS CodeBuild, AWS Lambda, AWS Device Farm, and AWS IAM.

```bash
aws configure
```

## Instructions

- [Setup a CodeCommit repository](/docs/code-commit.md)

### Create a CodeBuild job to build our APK and test bundle

- Open the CodeBuild [console page](https://us-west-2.console.aws.amazon.com/codesuite/codebuild/projects?region=us-west-2)
- Click the "Create build project" button
- Use the following values:
  - Project name: aws-codepipeline-devicefarm
  - Description: Our sample Android application build job
  - Source provider: AWS CodeCommit
  - Repository: aws-codepipeline-devicefarm
  - Reference type: Branch
  - Branch: master
  - Environment image: Managed image
  - Operating system: Ubuntu
  - Runtime(s): Standard
  - Service role: New service role
  - Role name: codebuild-aws-codepipeline-devicefarm-service-role
  - Build specifications: Use a buildspec file
  - Artifacts: No artifacts
  - Logs: defaults
- Click the Create button

### Create a CodePipeline pipeline

- Open the CodePipeline [console page](https://us-west-2.console.aws.amazon.com/codesuite/codepipeline/pipelines?region=us-west-2)
- Click the "Create pipeline" button
- Use the following values:
  - Pipeline name: aws-codepipeline-devicefarm
  - Description: Our sample Android application pipeline
  - Service role: New service role
  - Role name: (accept default)
  - Ensure "Allow AWS CodePipeline to create a service role so it can be used with this new pipeline" is checked
  - Next
  - Source provider: AWS CodeCommit 
  - Repository name: aws-codepipeline-devicefarm
  - Branch name: master
  - Change detection options: Amazon CloudWatch Events
  - Next
  - Build provider: AWS CodeBuild
  - Project name: aws-codepipeline-devicefarm
  - Next
  - Skip deploy stage
- Click the "Create pipeline" button

### Create a Device Farm project

- Open the CodePipeline [console page](https://us-west-2.console.aws.amazon.com/devicefarm/home?#/projects)
- Click the "Create a new project" button
- Use the following values:
  - Project name: aws-codepipeline-devicefarm

### Execute a manual test run

- Click the "Create a new run" button
- Use the following values:
  - Choose your application: Native application
  - App: app-debug.apk 
  - Run name: app-debug.apk Fuzz
  - Next Step
  - Test: Built-in: Fuzz
  - Next Step
  - Device Pool: Top Devices
  - Next Step
  - defaults
  - Next Step
  - Confirm and Start Run
  - Click on Run to see progress

### Add a Test stage to your Code Pipeline

- Get your AWS Device Farm project ARN
```bash
PROJECT_ARN=$(aws devicefarm list-projects | jq -r '.projects[] | select(.name=="aws-codepipeline-devicefarm") | .arn')
echo $PROJECT_ARN | sed -e 's/^.*://g'
aws devicefarm list-device-pools --arn $PROJECT_ARN | jq -r '.devicePools[] | select(.name=="Top Devices") | .arn'
```

- Open the CodePipeline [console page](https://us-west-2.console.aws.amazon.com/devicefarm/home?#/projects)
- Click the "aws-codepipeline-devicefarm" pipeline link
- Click "Edit" button
- At the bottom of the page click "Add stage" button
- Stage name: FuzzTest
- Add Stage
- Click "Add action group"
- Action name: Test
- Action provider: AWS Device Farm
- Input artifacts: BuildArtifact
- ProjectId: from above
- DevicePoolArn: from above
- AppType: Android
- App: app-debug.apk
- TestType: BUILTIN_FUZZ
- FuzzEventCount: 1000
- FuzzEventThrottle: 50
- Done
- Save
- Save
- Release Change
- Release

### Add an Appium action to your Test stage

- Open the CodePipeline [console page](https://us-west-2.console.aws.amazon.com/devicefarm/home?#/projects)
- Click the "aws-codepipeline-devicefarm" pipeline link
- Click "Edit" button
- At the bottom of the page click "Edit stage" button on Test stage
- Add action
- Click "Add action group"
- Action name: AppiumTest
- Action provider: AWS Device Farm
- Input artifacts: BuildArtifact
- ProjectId: aws-codepipeline-devicefarm
- DevicePoolArn: from above
- AppType: Android
- App: app-debug.apk
- TestType: APPIUM_JAVA_TESTNG
- Test: zip-with-dependencies.zip
- Done
- Save
- Save
- Release Change
- Release

### Clean Up

