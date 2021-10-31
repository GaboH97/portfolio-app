import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Runtime } from '@aws-cdk/aws-lambda';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { LambdaRestApi, RestApi, Stage } from '@aws-cdk/aws-apigateway';
import { join } from 'path';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { Duration, RemovalPolicy } from '@aws-cdk/core';


interface UserPortfolioEntry {
  id: { S: string };
  firstName: { S: string };
  lastName: { S: string };
  profilePhoto: { S: string }
  title: { S: string };
  description: { S: string };
  experienceSummary: { S: string };
  userId?: { S: string };
  username?: { S: string };
}

export class PortfolioAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const usersTable = new Table(this, 'UsersTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'users',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const portfolioAppLambda = new NodejsFunction(this, 'portfolio-app-lambda', {
      entry: join(
        __dirname,
        "../portfolio-app-lambda",
        "handler.ts"
      ),
      depsLockFilePath: join(
        __dirname,
        "../portfolio-app-lambda",
        "package-lock.json"
      ),
      environment: {
        TABLE_NAME: usersTable.tableName,
        TWITTER_ACCESS_TOKEN_KEY: process.env.TWITTER_ACCESS_TOKEN_KEY!,
        TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
        TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY!,
        TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET!,
        TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN!
      },
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(10)
    })

    new AwsCustomResource(this, 'initDBResource', {
      onCreate: {
        service: 'DynamoDB',
        action: 'batchWriteItem',
        parameters: {
          RequestItems:{
            [usersTable.tableName]: this.generateBatch(this.getSampleData())
          },
        },
        physicalResourceId: PhysicalResourceId.of('initDBData')
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: [usersTable.tableArn] })
    });

    usersTable.grantReadWriteData(portfolioAppLambda);
    
    const apiGW = new LambdaRestApi(this, 'portfolioAPI', {
      description: "API Gateway for Portfolio API",
      handler: portfolioAppLambda,
      deployOptions:{
        stageName:'api'
      }
    });

  }

  private generateBatch = (items: UserPortfolioEntry[]): { PutRequest: { Item: UserPortfolioEntry } }[] => {
    return items.map((item) => {
      return { PutRequest: { Item: item } };
    });
  };

  /**
   * Sample data to populate DynamoDB Table
   * @returns 
   */
  private getSampleData = (): UserPortfolioEntry[] => {
    return [
      {
        id: { S: "1" },
        description: { S: "Adele Laurie Blue Adkins (Londres, 5 de mayo de 1988), conocida simplemente como Adele, es una cantante, compositora y multinstrumentista británica.3? Desde muy joven mostró su interés por la música y en 2006 egresó de la BRIT School de Artes Escénicas y" },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_2016.jpg/1280px-Adele_2016.jpg" },
        username: { S: "Adele" },
        title: { S: "Adele" },
        userId: { S: "184910040" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Blue " },
        firstName: { S: "Adele" }
      },
      {
        id: { S: "2" },
        description: { S: "Nicolás Maduro Moros (Caracas; 23 de noviembre de 1962) es un político, diplomático y dirigente sindical venezolano que ha ejercido como ministro de relaciones exteriores entre 2006 y 2012, como vicepresidente de la república desde 2012 al 2013 y presiden" },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Nicol%C3%A1s_Maduro_%282019-10-25%29_02.jpg" },
        username: { S: "NicolasMaduro" },
        title: { S: "Nicolás Maduro" },
        userId: { S: "1252764865" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Maduro" },
        firstName: { S: "Nicolass" }
      },
      {
        id: { S: "3" },
        description: { S: "Edward Christopher Sheeran (Halifax, Inglaterra; 17 de febrero de 1991), más conocido como Ed Sheeran, es un cantautor y músico británico.2? A corta edad, comenzó a cantar en la iglesia a la que asistía y también aprendió a tocar la guitarra. A l" },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Ed_Sheeran-6886.jpg/240px-Ed_Sheeran-6886.jpg" },
        username: { S: "Edd_sheerannn" },
        title: { S: "singer" },
        userId: { S: "1167467124" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Sheerann" },
        firstName: { S: "Edd" }
      },
      {
        id: { S: "4" },
        description: { S: "Shakira Isabel Mebarak Ripoll (Barranquilla; 2 de febrero de 1977), conocida artísticamente como Shakira, es una cantautora, productora discográfica, actriz, bailarina, empresaria, embajadora de buena voluntad de UNICEF y filántropa colombiana. Su alto ni" },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/d/de/Shakira2009.jpg" },
        username: { S: "shakira" },
        title: { S: "shakira" },
        userId: { S: "44409004" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Mebarak" },
        firstName: { S: "Shakira" }
      },
      {
        id: { S: "5" },
        description: { S: "Greta Tintin Eleonora Ernman Thunberg (Estocolmo, 3 de enero de 2003), más conocida como Greta Thunberg,nota 1? es una activista medioambiental sueca, centrada en los riesgos planteados por el calentamiento global." },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Greta_Thunberg%2C_11.10.2019_%28cropped%29.jpg/169px-Greta_Thunberg%2C_11.10.2019_%28cropped%29.jpg" },
        username: { S: "GretaThunberg" },
        title: { S: "Greta Thunberg" },
        userId: { S: "1006419421244678144" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Thumberg" },
        firstName: { S: "Greta" }
      },
      {
        id: { S: "6" },
        description: { S: "James David Rodríguez Rubio (Cúcuta, Norte de Santander, Colombia, 12 de julio de 1991) es un futbolista colombiano nacionalizado español.1? Juega como centrocampista y su equipo actual es el Everton Football Club de la Premier League de Inglaterra." },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/James_Rodriguez_Training_2019-04-10_FC_Bayern_Muenchen-1.jpg/200px-James_Rodriguez_Training_2019-04-10_FC_Bayern_Muenchen-1.jpg" },
        username: { S: "jamesdrodriguez" },
        title: { S: "James Rodríguez" },
        userId: { S: "280701704" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Rodriguez" },
        firstName: { S: "James" }
      },
      {
        id: { S: "7" },
        description: { S: "Taylor Alison Swift (Reading, Pensilvania; 13 de diciembre de 1989) es una cantante, compositora, productora, filántropa y actriz estadounidense. Criada en Wyomissing (Pensilvania), se mudó a Nashville (Tennessee) a los 14 años para realizar una carrera d" },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Taylor_Swift_2_-_2019_by_Glenn_Francis_%28cropped%29_3.jpg/200px-Taylor_Swift_2_-_2019_by_Glenn_Francis_%28cropped%29_3.jpg" },
        username: { S: "Tailor_Swift" },
        title: { S: "Tailor Swift" },
        userId: { S: "378618108" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Swift" },
        firstName: { S: "Taylor" }
      },
      {
        id: { S: "8" },
        description: { S: "William Henry Gates III (Seattle, Washington; 28 de octubre de 1955), mejor conocido como Bill Gates, es un empresario, informático y filántropo estadounidense, conocido por haber creado y fundado junto con Paul Allen, la empresa Microsoft. De igual forma" },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/191px-Bill_Gates_2018.jpg" },
        username: { S: "BillGates" },
        title: { S: "Bill Gates" },
        userId: { S: "50393960" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Gates" },
        firstName: { S: "Bill" }
      },
      {
        id: { S: "9" },
        description: { S: "Iván Duque Márquez (born 1 August 1976) is a Colombian politician and lawyer who is the current president of Colombia, in office since 7 August 2018. He was elected Colombias youngest president, as the candid" },
        profilePhoto: { S: "https://via.placeholder.com/150" },
        username: { S: "IvanDuque" },
        title: { S: "Iván Duque" },
        userId: { S: "77653794" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Duque" },
        firstName: { S: "Ivan" }
      },
      {
        id: { S: "10" },
        description: { S: "Barack Hussein Obama II born August 4, 1961) is an American politician and attorney who served as the 44th president of the United States from 2009 to 2017. A member of t" },
        profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/200px-President_Barack_Obama.jpg" },
        username: { S: "BarackObama" },
        title: { S: "Barack Obama" },
        userId: { S: "813286" },
        experienceSummary: { S: "Not specified" },
        lastName: { S: "Obama" },
        firstName: { S: "Barack" }
      }
    ]
  }
}