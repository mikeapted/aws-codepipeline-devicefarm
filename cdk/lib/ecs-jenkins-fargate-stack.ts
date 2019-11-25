import cdk = require('@aws-cdk/core');
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
import elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");

export class EcsJenkinsFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVpc", {
      isDefault: true
    });

    const cluster = new ecs.Cluster(this, "MyJenkinsCluster", {
      vpc: vpc
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyJenkinsService", {
      assignPublicIp: true,
      cluster: cluster,
      cpu: 1024,
      desiredCount: 1,
      taskImageOptions: {
        containerPort: 8080,
        image: ecs.ContainerImage.fromRegistry("mikeapted/jenkins-master:withconfig"),
        environment: {
          JAVA_OPTS: "-Dhudson.DNSMultiCast.disabled=true"
        }
      },
      memoryLimitMiB: 2048,
      publicLoadBalancer: true
    });

    const loadBalancer = fargateService.loadBalancer as elbv2.ApplicationLoadBalancer;
    const listenerHTTP = loadBalancer.node.findChild('PublicListener') as elbv2.ApplicationListener;
    const targetGroup = listenerHTTP.node.findChild('ECSGroup') as elbv2.ApplicationTargetGroup;
    const targetGroupResource = targetGroup.node.findChild('Resource') as elbv2.CfnTargetGroup;
    targetGroupResource.addPropertyOverride('HealthCheckIntervalSeconds', '30');
    targetGroupResource.addPropertyOverride('HealthCheckPath', '/login');
    targetGroupResource.addPropertyOverride('HealthCheckPort', '8080');
    targetGroupResource.addPropertyOverride('HealthyThresholdCount', '2');
    targetGroupResource.addPropertyOverride('TargetGroupAttributes', [{ Key: 'deregistration_delay.timeout_seconds', 'Value': 15 }]);
    targetGroupResource.addPropertyOverride('UnhealthyThresholdCount', '5');

    const code = new codecommit.Repository(this, 'SourceCode', {
      repositoryName: 'mob-313-source-code'
    });
    const codeResource = code.node.findChild('Resource') as codecommit.CfnRepository;
    codeResource.addPropertyOverride('Code', {
      'S3': {
        'Bucket': 'reinvent2019-mob313',
        'Key': 'application.zip'
      }
    });

    const applicationAndTestBuild = new codebuild.PipelineProject(this, 'CdkBuild');
    const sourceOutput = new codepipeline.Artifact();
    const applicationAndTestBuildOutput = new codepipeline.Artifact('applicationAndTestBuildOutput');

    const jenkinsProvider = new codepipeline_actions.JenkinsProvider(this, 'JenkinsProvider', {
      providerName: 'Jenkins',
      serverUrl: fargateService.loadBalancer.loadBalancerDnsName,
      version: '3'
    });
    jenkinsProvider.node.addDependency(fargateService);

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: 'CodeCommit_Source',
              repository: code,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Build',
              project: applicationAndTestBuild,
              input: sourceOutput,
              outputs: [applicationAndTestBuildOutput],
            })
          ],
        },
        {
          stageName: 'Test',
          actions: [
            new codepipeline_actions.JenkinsAction({
              actionName: 'Test',
              inputs: [applicationAndTestBuildOutput],
              jenkinsProvider: jenkinsProvider,
              projectName: 'AWSDeviceFarmAppiumTest',
              type: codepipeline_actions.JenkinsActionType.TEST,
            })
          ],
        },
      ],
    });

    pipeline.node.addDependency(jenkinsProvider);

  }
}
