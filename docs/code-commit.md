### Setup a CodeCommit repository

- Open the CodeCommit [console page](https://us-west-2.console.aws.amazon.com/codesuite/codecommit/repositories?region=us-west-2)
- Click the "Create Repository" button
- Use the following values:
  - Repository name: aws-codepipeline-devicefarm
  - Description: Our sample Android application
- Click the Create button
- Setup the AWS [credential helper](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-https-unixes.html#setting-up-https-unixes-credential-helper)

#### Set your region to us-west-2

```bash
export AWS_DEFAULT_REGION=us-west-2
```

#### Clone this repository to your local workstation and migrate it to your new AWS CodeCommit repository

```bash
git clone --mirror https://github.com/mikeapted/aws-codepipeline-devicefarm.git aws-codepipeline-devicefarm
cd aws-codepipeline-devicefarm
git push https://git-codecommit.us-west-2.amazonaws.com/v1/repos/aws-codepipeline-devicefarm --all
cd ..
rm -rf aws-codepipeline-devicefarm
git clone https://git-codecommit.us-west-2.amazonaws.com/v1/repos/aws-codepipeline-devicefarm
cd aws-codepipeline-devicefarm
```
