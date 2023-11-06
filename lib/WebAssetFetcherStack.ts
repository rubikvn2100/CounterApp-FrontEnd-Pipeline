import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface WebAssetFetcherStackProps extends cdk.StackProps {
  webAssetsBucket: s3.Bucket;
}

export class WebAssetFetcherStack extends cdk.Stack {
  public readonly webAssetFetcher: lambda.Function;

  constructor(scope: Construct, id: string, props: WebAssetFetcherStackProps) {
    super(scope, id, props);

    this.webAssetFetcher = new lambda.Function(this, "WebAssetFetcher", {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset("./lambda_code/web_asset_fetcher"),
      handler: "index.handler",
      environment: {
        stageName: id,
        account: props.env?.account || "unset-account",
        region: props.env?.region || "unset-region",
        BUCKET_NAME: props.webAssetsBucket.bucketName,
      },
    });

    props.webAssetsBucket.grantRead(this.webAssetFetcher);
  }
}
