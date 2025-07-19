import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as elasticache from "aws-cdk-lib/aws-elasticache";
import * as ses from "aws-cdk-lib/aws-ses";
import * as elasticbeanstalk from "aws-cdk-lib/aws-elasticbeanstalk";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Stack } from "aws-cdk-lib";

export class CdkInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const cloudFrontIpRangesParam = new cdk.CfnParameter(
      this,
      "cloudFrontIpRanges",
      {
        type: "String",
        description: "Comma-separated list of CloudFront IP ranges",
      },
    );

    const stack = Stack.of(this);

    const stageNameParam = new cdk.CfnParameter(this, "stageName", {
      type: "String",
      description: "Deployment stage name (e.g., dev, prod)",
    });

    const sesEmailParam = new cdk.CfnParameter(this, "sesEmail", {
      type: "String",
      description: "Verified SES email identity",
    });

    const cloudFrontIpRanges = cloudFrontIpRangesParam.valueAsString;
    const stageName = stageNameParam.valueAsString;
    const sesEmail = sesEmailParam.valueAsString;

    const ipRangesArray =
      typeof cloudFrontIpRanges === "string"
        ? cloudFrontIpRanges.split(",").filter((ip) => ip)
        : cloudFrontIpRanges;

    if (!ipRangesArray || ipRangesArray.length === 0) {
      throw new Error("cloudFrontIpRanges must not be empty");
    }

    // VPC for our services
    const vpc = new ec2.Vpc(this, "QuirelyVpc", {
      maxAzs: 2,
      natGateways: 0, //this is not free tier eligible but my backend needs to connect to the internet
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // S3 bucket for user images
    const quirelyBucket = new s3.Bucket(this, "QuirelyBucket", {
      bucketName:
        `quirely-${this.stackName}-${this.account}-${this.region}`.toLocaleLowerCase(),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Bucket policy for public read access for user images
    quirelyBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${quirelyBucket.bucketArn}/*`],
        principals: [new iam.AnyPrincipal()],
      }),
    );

    // S3 bucket for React frontend
    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      bucketName:
        `quirely-frontend-${this.stackName}-${this.account}-${this.region}`.toLowerCase(),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // S3 bucket for atrifacts
    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket", {
      bucketName:
        `quirely-artifacts-${this.stackName}-${this.account}-${this.region}`.toLowerCase(),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Create an Origin Access Identity for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "QuirelyOAI",
    );
    frontendBucket.grantRead(originAccessIdentity);

    // API Gateway (will be an origin for CloudFront)
    const api = new apigateway.RestApi(this, "QuirelyApi", {
      restApiName: `quirely-api-${this.stackName}`.toLocaleLowerCase(),
      deployOptions: { stageName },
    });

    // Security Groups
    const dbSecurityGroup = new ec2.SecurityGroup(
      this,
      "QuirelyDbSecurityGroup",
      { vpc },
    );
    const cacheSecurityGroup = new ec2.SecurityGroup(
      this,
      "QuirelyCacheSecurityGroup",
      { vpc },
    );
    const beanstalkSecurityGroup = new ec2.SecurityGroup(
      this,
      "QuirelyBeanstalkSecurityGroup",
      { vpc },
    );
    const albSecurityGroup = new ec2.SecurityGroup(
      this,
      "QuirelyAlbSecurityGroup",
      {
        vpc,
        description: "Security group for Elastic Beanstalk ALB",
        allowAllOutbound: true, // ALB needs outbound access to forward traffic
      },
    );
    const albSecurityGroup2 = new ec2.SecurityGroup(
      this,
      "QuirelyAlbSecurityGroup2",
      {
        vpc,
        description: "Additional security group for Elastic Beanstalk ALB",
        allowAllOutbound: true,
      },
    );

    // Split CloudFront IP ranges
    const half = Math.ceil(ipRangesArray.length / 2);
    const cloudFrontIpRanges1 = ipRangesArray.slice(0, half);
    const cloudFrontIpRanges2 = ipRangesArray.slice(half);

    dbSecurityGroup.addIngressRule(
      beanstalkSecurityGroup,
      ec2.Port.tcp(5432),
      "Allow Postgres from Beanstalk",
    );
    cacheSecurityGroup.addIngressRule(
      beanstalkSecurityGroup,
      ec2.Port.tcp(6379),
      "Allow Redis from Beanstalk",
    );

    // Add ingress rules for HTTP (port 80) to first security group
    cloudFrontIpRanges1.forEach((ipRange, index) => {
      albSecurityGroup.addIngressRule(
        ec2.Peer.ipv4(ipRange),
        ec2.Port.tcp(80),
        `Allow HTTP from CloudFront IP range ${index + 1}`,
      );
    });

    // Add ingress rules for HTTP (port 80) to second security group
    cloudFrontIpRanges2.forEach((ipRange, index) => {
      albSecurityGroup2.addIngressRule(
        ec2.Peer.ipv4(ipRange),
        ec2.Port.tcp(80),
        `Allow HTTP from CloudFront IP range ${index + half + 1}`,
      );
    });

    beanstalkSecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(80),
      "Allow HTTP from ALB",
    );
    beanstalkSecurityGroup.addIngressRule(
      albSecurityGroup2,
      ec2.Port.tcp(80),
      "Allow HTTP from ALB (second SG)",
    );
    beanstalkSecurityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow HTTPS outbound to external APIs",
    );

    // RDS PostgreSQL
    const dbInstance = new rds.DatabaseInstance(this, "QuirelyDatabase", {
      databaseName: `quirely-${this.stackName}`.toLowerCase(),
      credentials: rds.Credentials.fromGeneratedSecret("quirelyDbAdmin"),
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      allocatedStorage: 20,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [dbSecurityGroup],
      backupRetention: cdk.Duration.days(1),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      deletionProtection: true,
    });

    // ElastiCache Redis
    const cacheSubnetGroup = new elasticache.CfnSubnetGroup(
      this,
      "QuirelyCacheSubnetGroup",
      {
        description: "Subnet group for ElastiCache",
        subnetIds: vpc.selectSubnets({
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }).subnetIds,
      },
    );

    const cacheCluster = new elasticache.CfnCacheCluster(this, "QuirelyCache", {
      engine: "redis",
      cacheNodeType: "cache.t3.micro",
      numCacheNodes: 1,
      cacheSubnetGroupName: cacheSubnetGroup.ref,
      vpcSecurityGroupIds: [cacheSecurityGroup.securityGroupId],
    });

    // SES
    const sesEmailIdentity = new ses.EmailIdentity(
      this,
      "QuirelyEmailIdentity",
      {
        identity: ses.Identity.email(sesEmail), //TODO: configure domain/email verification manually in AWS console
      },
    );

    // Elastic Beanstalk IAM Role and Instance Profile
    const beanstalkRole = new iam.Role(this, "QuirelyBeanstalkRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AWSElasticBeanstalkWebTier",
        ),
      ],
    });
    quirelyBucket.grantReadWrite(beanstalkRole);
    sesEmailIdentity.grantSendEmail(beanstalkRole);
    beanstalkRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:PutObject", "s3:GetObject"],
        resources: [`${artifactsBucket.bucketArn}/*`],
      }),
    );
    beanstalkRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["cloudwatch:PutMetricData", "logs:PutLogEvents"],
        resources: ["*"],
      }),
    );

    // Create instance profile for Beanstalk
    const beanstalkInstanceProfile = new iam.CfnInstanceProfile(
      this,
      "QuirelyBeanstalkInstanceProfile",
      {
        roles: [beanstalkRole.roleName],
      },
    );

    // Create a new secret for application-level secrets
    const appSecrets = new secretsmanager.Secret(this, "QuirelyAppSecrets", {
      secretName: `quirely-app-secrets-${this.stackName}`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          // You will fill these values in the AWS Secrets Manager console later
          SMTP_USERNAME: "your-ses-smtp-username",
          SMTP_PASSWORD: "your-ses-smtp-password",
          JWT_EMAIL_SECRET: "generate-a-strong-random-string-here",
          UNSPLASH_ACCESS_KEY: "your-unsplash-key",
        }),
        generateStringKey: "placeholder",
      },
    });
    dbInstance.secret!.grantRead(beanstalkRole);
    appSecrets.grantRead(beanstalkRole);

    // Elastic Beanstalk for Spring Boot
    const beanStalkApp = new elasticbeanstalk.CfnApplication(
      this,
      "QuirelyApp",
      {
        applicationName: `quirely-${this.stackName}`.toLowerCase(),
      },
    );

    // CloudFront is the main entry point
    const distribution = new cloudfront.Distribution(
      this,
      "QuirelyDistribution",
      {
        defaultRootObject: "index.html",
        // Default behavior: serve the React App from the private S3 bucket
        defaultBehavior: {
          origin: new origins.S3Origin(frontendBucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        // API behavior: route /api/* requests to the API Gateway
        additionalBehaviors: {
          "/api/*": {
            origin: new origins.HttpOrigin(
              `${api.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
              {
                // Pass the path to the API Gateway
                originPath: `/${api.deploymentStage.stageName}`,
              },
            ),
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
            allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
            // Forward headers, cookies, and query strings to the backend
            cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
          },
        },
        // Adds custom error response for single page app routing
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.minutes(0),
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.minutes(0),
          },
        ],
      },
    );

    const beanstalkEnv = new elasticbeanstalk.CfnEnvironment(
      this,
      "QuirelyEnv",
      {
        applicationName: beanStalkApp.applicationName!,
        environmentName: `quirely-${this.stackName}-env`.toLocaleLowerCase(),
        solutionStackName: "64bit Amazon Linux 2023 v4.2.1 running Corretto 21",
        optionSettings: [
          {
            namespace: "aws:autoscaling:launchconfiguration",
            optionName: "IamInstanceProfile",
            value: beanstalkInstanceProfile.ref,
          },
          {
            namespace: "aws:autoscaling:launchconfiguration",
            optionName: "InstanceType",
            value: "t3.micro",
          },
          {
            namespace: "aws:ec2:vpc",
            optionName: "VPCId",
            value: vpc.vpcId,
          },
          {
            namespace: "aws:ec2:vpc",
            optionName: "Subnets",
            value: vpc.publicSubnets.map((subnet) => subnet.subnetId).join(","),
          },
          {
            namespace: "aws:ec2:vpc",
            optionName: "ELBSubnets",
            value: vpc.publicSubnets.map((subnet) => subnet.subnetId).join(","),
          },

          {
            namespace: "aws:ec2:vpc",
            optionName: "SecurityGroups",
            value: beanstalkSecurityGroup.securityGroupId,
          },
          {
            namespace: "aws:elasticbeanstalk:environment",
            optionName: "LoadBalancerType",
            value: "application",
          },
          {
            namespace: "aws:elb:loadbalancer",
            optionName: "SecurityGroups",
            value: [
              albSecurityGroup.securityGroupId,
              albSecurityGroup2.securityGroupId,
            ].join(","),
          },
          {
            namespace: "aws:elb:listener:80",
            optionName: "ListenerProtocol",
            value: "HTTP",
          },
          {
            namespace: "aws:elasticbeanstalk:environment:process:default",
            optionName: "HealthCheckPath",
            value: "/actuator/health",
          },
          {
            namespace: "aws:elasticbeanstalk:environment:process:default",
            optionName: "MatcherHTTPCode",
            value: "200",
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "DB_HOST",
            value: dbInstance.dbInstanceEndpointAddress,
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "DB_NAME",
            value: `quirely-${this.stackName}`.toLowerCase(),
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "REDIS_HOST",
            value: cacheCluster.attrRedisEndpointAddress,
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "REDIS_PORT",
            value: cacheCluster.attrRedisEndpointPort,
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "BUCKET_NAME",
            value: quirelyBucket.bucketName,
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "AWS_S3_REGION",
            value: this.region,
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "CLIENT_BASE_URL",
            value: `https://${distribution.distributionDomainName}`,
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "SMTP_HOST",
            value: `email-smtp.${this.region}.amazonaws.com`,
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "SMTP_PORT",
            value: "587",
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "SES_EMAIL",
            value: sesEmail,
          },

          // Pass Secret ARNs to the application
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "DB_SECRET_ARN",
            value: dbInstance.secret!.secretArn,
          },
          {
            namespace: "aws:elasticbeanstalk:application:environment",
            optionName: "APP_SECRETS_ARN",
            value: appSecrets.secretArn,
          },
        ],
      },
    );

    // Proxy to Beanstalk
    const beanstalkIntegration = new apigateway.HttpIntegration(
      `http://${beanstalkEnv.attrEndpointUrl}/{proxy}`,
      {
        httpMethod: "ANY",
        options: {
          requestParameters: {
            "integration.request.path.proxy": "method.request.path.proxy",
          },
        },
      },
    );

    const apiProxyResource = api.root.addProxy({
      defaultIntegration: beanstalkIntegration,
      defaultMethodOptions: {
        requestParameters: {
          "method.request.path.proxy": true,
        },
      },
    });

    // Outputs
    new cdk.CfnOutput(this, "CloudFrontDomain", {
      value: distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: frontendBucket.bucketName,
    });
    new cdk.CfnOutput(this, "UserImagesBucketName", {
      value: quirelyBucket.bucketName,
    });
    new cdk.CfnOutput(this, "ApiGatewayUrl", { value: api.url });
    new cdk.CfnOutput(this, "BeanstalkUrl", {
      value: beanstalkEnv.attrEndpointUrl,
    });
    new cdk.CfnOutput(this, "ArtifactsBucketName", {
      value: artifactsBucket.bucketName,
    });
    new cdk.CfnOutput(this, "BeanstalkApplicationName", {
      value: beanStalkApp.applicationName!,
    });
    new cdk.CfnOutput(this, "BeanstalkEnvironmentName", {
      value: beanstalkEnv.environmentName!,
    });
  }
}
