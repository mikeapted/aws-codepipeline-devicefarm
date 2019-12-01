[Back to main guide](../README.md) 

[Next: Create an AWS Device Farm project](device-farm.md) 

#### Setup your local environment and download artifacts

1. Create a working folder:

```bash
cd ~/Documents
mkdir mob313
cd mob313
```

2. Download the sample Android application from aws-samples:

```bash
wget https://github.com/aws-samples/aws-device-farm-sample-app-for-android/raw/master/prebuilt/app-debug.apk
```

or open the link in your browser and save the .apk locally.

3. Download the sample Appium/Cucumber tests for the sample app:

```bash
wget https://reinvent2019-mob313.s3-us-west-2.amazonaws.com/zip-with-dependencies.zip
```

or open the link in your browser and save the .apk locally.

4. Create a user for Jenkins to access Device Farm and Code Suite services

```bash
export AWS_DEFAULT_REGION=us-west-2
aws iam create-user --user-name jenkins-device-farm-access
aws iam attach-user-policy --policy-arn arn:aws:iam::aws:policy/AWSCodePipelineCustomActionAccess  --user-name jenkins-device-farm-access
aws iam attach-user-policy --policy-arn arn:aws:iam::aws:policy/AWSDeviceFarmFullAccess --user-name jenkins-device-farm-access
aws iam create-access-key --user-name jenkins-device-farm-access > creds.json; cat creds.json
```

[Next: Create an AWS Device Farm project](device-farm.md) 