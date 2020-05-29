import * as cdk from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';

export default function getSSMParams(scope: cdk.Construct) {
  // *****************************************************
  // Host names

  // Production Environment
  const PRODUCTION_REACT_HOSTNAME = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'PRODUCTION_REACT_HOSTNAME', {
      parameterName: '/REACT_HOSTNAME'
    }
  );
  const PRODUCTION_API_HOSTNAME = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'PRODUCTION_API_HOSTNAME', {
      parameterName: '/API_HOSTNAME'
    }
  );
  const PRODUCTION_SOCKET_HOSTNAME = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'PRODUCTION_SOCKET_HOSTNAME', {
      parameterName: '/SOCKET_HOSTNAME'
    }
  );
  const PRODUCTION_ADPAGE_HOSTNAME = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'PRODUCTION_ADPAGE_HOSTNAME', {
      parameterName: '/ADPAGE_HOSTNAME'
    }
  );

  // Test Environment
  const TEST_REACT_HOSTNAME = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TEST_REACT_HOSTNAME', {
      parameterName: '/TEST/REACT_HOSTNAME'
    }
  );
  const TEST_API_HOSTNAME = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TEST_API_HOSTNAME', {
      parameterName: '/TEST/API_HOSTNAME'
    }
  );
  const TEST_SOCKET_HOSTNAME = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TEST_SOCKET_HOSTNAME', {
      parameterName: '/TEST/SOCKET_HOSTNAME'
    }
  );
  const TEST_ADPAGE_HOSTNAME = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TEST_ADPAGE_HOSTNAME', {
      parameterName: '/TEST/ADPAGE_HOSTNAME'
    }
  );

  // *****************************************************
  // Db configurations
  const DB_HOST = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'DB_HOST', {
      parameterName: '/DB_HOST'
    }
  );
  const DB_PASSWORD = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'DB_PASSWORD', {
      parameterName: '/DB_PASSWORD',
      version: 1
    }
  );
  const DB_PORT = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'DB_PORT', {
      parameterName: '/DB_PORT',
      version: 1
    }
  );
  const DB_USER = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'DB_USER', {
      parameterName: '/DB_USER'
    }
  );
  const DB_DATABASE = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'DB_DATABASE', {
      parameterName: '/DB_DATABASE'
    }
  );
  const DB_CHARSET = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'DB_CHARSET', {
      parameterName: '/DB_CHARSET',
    }
  );

  // *****************************************************
  // Session Store DB configurations
  const SESSION_STORE_DB_DATABASE = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'SESSION_STORE_DB_DATABASE', {
      parameterName: '/SESSION_STORE_DB_DATABASE'
    }
  );
  const SESSION_STORE_DB_HOST = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'SESSION_STORE_DB_HOST', {
      parameterName: '/SESSION_STORE_DB_HOST'
    }
  );
  const SESSION_STORE_DB_PORT = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'SESSION_STORE_DB_PORT', {
      parameterName: '/SESSION_STORE_DB_PORT', version: 1
    }
  );
  const SESSION_STORE_DB_PASSWORD = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'SESSION_STORE_DB_PASSWORD', {
      parameterName: '/SESSION_STORE_DB_PASSWORD', version: 1
    }
  );
  const SESSION_STORE_DB_USER = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'SESSION_STORE_DB_USER', {
      parameterName: '/SESSION_STORE_DB_USER'
    }
  );

  // *****************************************************
  // Keys for authentication

  // Twitch login
  const TWITCH_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/TWITCH_CLIENT_ID', {
      parameterName: '/TWITCH_CLIENT_ID', version: 1
    }
  );
  const TWITCH_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/TWITCH_CLIENT_SECRET', {
      parameterName: '/TWITCH_CLIENT_SECRET', version: 1
    }
  );

  // Google login
  const GOOGLE_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'GOOGLE_CLIENT_ID', {
      parameterName: '/GOOGLE_CLIENT_ID', version: 1
    }
  );
  const GOOGLE_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'GOOGLE_CLIENT_SECRET', {
      parameterName: '/GOOGLE_CLIENT_SECRET', version: 1
    }
  );

  // Kakao login
  const KAKAO_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'KAKAO_CLIENT_ID', {
      parameterName: '/KAKAO_CLIENT_ID', version: 1
    }
  );

  // Naver login
  const NAVER_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'NAVER_CLIENT_ID', {
      parameterName: '/NAVER_CLIENT_ID', version: 1
    }
  );
  const NAVER_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'NAVER_CLIENT_SECRET', {
      parameterName: '/NAVER_CLIENT_SECRET', version: 1
    }
  );

  // Naver Cloud Platform for BizMessage
  const NAVER_CLOUD_ACCESS_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'NAVER_CLOUD_ACCESS_KEY', {
      parameterName: '/NAVER_CLOUD_ACCESS_KEY', version: 1
    }
  );
  const NAVER_CLOUD_BIZMESSAGE_SERVICE_ID = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'NAVER_CLOUD_BIZMESSAGE_SERVICE_ID', {
      parameterName: '/NAVER_CLOUD_BIZMESSAGE_SERVICE_ID'
    }
  );
  const NAVER_CLOUD_SECRET_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'NAVER_CLOUD_SECRET_KEY', {
      parameterName: '/NAVER_CLOUD_SECRET_KEY', version: 1
    }
  );

  // Iamport payment
  const IMP_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'IMP_KEY', {
      parameterName: '/IMP_KEY', version: 1
    }
  );
  const IMP_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'IMP_SECRET', {
      parameterName: '/IMP_SECRET', version: 1
    }
  );

  // S3 access credentials for Image Store
  const S3_ACCESS_KEY_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'S3_ACCESS_KEY_ID', {
      parameterName: '/S3_ACCESS_KEY_ID', version: 1
    }
  );
  const S3_ACCESS_KEY_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'S3_ACCESS_KEY_SECRET', {
      parameterName: '/S3_ACCESS_KEY_SECRET', version: 1
    }
  );

  // Google Map Api key
  const GOOGLE_MAP_API_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'GOOGLE_MAP_API_KEY', {
      parameterName: '/GOOGLE_MAP_API_KEY', version: 1
    }
  );

  // Onad User crypto cipher credentials
  const CIPHER_IV = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'CIPHER_IV', {
      parameterName: '/CIPHER_IV', version: 1
    }
  );
  const CIPHER_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'CIPHER_KEY', {
      parameterName: '/CIPHER_KEY', version: 1
    }
  );

  // twitch-api-Crawler credentials
  const CRAWL_TWITCH_API_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'CRAWL_TWITCH_API_CLIENT_SECRET', {
      parameterName: '/CRAWL_TWITCH_API_CLIENT_SECRET', version: 1
    }
  );
  const CRAWL_TWITCH_API_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'CRAWL_TWITCH_API_KEY', {
      parameterName: '/CRAWL_TWITCH_API_KEY', version: 1
    }
  );
  const CRAWL_YOUTUBE_API_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'CRAWL_YOUTUBE_API_KEY', {
      parameterName: '/CRAWL_YOUTUBE_API_KEY', version: 1
    }
  );

  // Twitch chatbot - onadyy oauth token
  const TWITCH_BOT_OAUTH_TOKEN = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'TWITCH_BOT_OAUTH_TOKEN', {
      parameterName: '/TWITCH_BOT_OAUTH_TOKEN', version: 1
    }
  );

  // *******************************************************
  // Mail credentials for Mailing service
  const MAIL_ID = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'MAIL_ID', { parameterName: '/MAIL_ID' }
  );
  const MAIL_PASSWORD = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'MAIL_PASSWORD', {
      parameterName: '/MAIL_PASSWORD', version: 1
    }
  );

  // *******************************************************
  // Slack webhook
  const SLACK_ALARM_URL = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'SLACK_ALARM_URL', {
      parameterName: '/SLACK_ALARM_URL', version: 1
    }
  );

  // *******************************************************
  // Adpick affid
  const ADPICK_AFF_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'ADPICK_AFF_ID', {
      parameterName: '/ADPICK_AFF_ID', version: 1
    }
  );

  return {
    TEST_REACT_HOSTNAME,
    TEST_API_HOSTNAME,
    TEST_SOCKET_HOSTNAME,
    PRODUCTION_ADPAGE_HOSTNAME,
    PRODUCTION_REACT_HOSTNAME,
    PRODUCTION_API_HOSTNAME,
    PRODUCTION_SOCKET_HOSTNAME,
    TEST_ADPAGE_HOSTNAME,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
    DB_DATABASE,
    DB_CHARSET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    IMP_KEY,
    IMP_SECRET,
    KAKAO_CLIENT_ID,
    MAIL_ID,
    MAIL_PASSWORD,
    NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET,
    NAVER_CLOUD_ACCESS_KEY,
    NAVER_CLOUD_BIZMESSAGE_SERVICE_ID,
    NAVER_CLOUD_SECRET_KEY,
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    S3_ACCESS_KEY_ID,
    S3_ACCESS_KEY_SECRET,
    SESSION_STORE_DB_DATABASE,
    SESSION_STORE_DB_HOST,
    SESSION_STORE_DB_PORT,
    SESSION_STORE_DB_PASSWORD,
    SESSION_STORE_DB_USER,
    GOOGLE_MAP_API_KEY,
    CIPHER_IV,
    CIPHER_KEY,
    CRAWL_TWITCH_API_CLIENT_SECRET,
    CRAWL_TWITCH_API_KEY,
    CRAWL_YOUTUBE_API_KEY,
    TWITCH_BOT_OAUTH_TOKEN,
    SLACK_ALARM_URL,
    ADPICK_AFF_ID
  };
}
