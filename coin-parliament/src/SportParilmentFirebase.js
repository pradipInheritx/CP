const firebaseConfig = {
  apiKey: "7dbabc6107582f5bd2477bd932645012f5158541",
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: `G-${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`,
};

// {
// "type": "service_account",
// "project_id": "sportparliament-1f167",
// "private_key_id": "7dbabc6107582f5bd2477bd932645012f5158541",
// "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwLvH/hw87p60D\nA4rSxtI86EG9qobEtc2lDb0F6umk6GnNZVtqc2NbDk5dq+P2LlFGUSk/UW8FYqYC\nRQJmDsDDx1pAZ5onLdIBsPyPkegPXCZTS2aeBuPtOKywFOJTERD+DbBqvHSnmaI2\nrw7u9yQCiRTO9bxQB6g4rLOAGa5TsOSZQV+C5mKoO+nQ33Y9XwxlOPMsxbqZuHUS\nrEa5W5VMAodLwp/pkPLuE017XkGBCnDGN9KCu9X7bGqkReqOl1yttqGg2424N8pk\neg6MNj+dHvZACQt+P4Cr63hEvcvXoZLi+GMIbKi8FwA3rYKD3w6lbJAqgIVqGAaE\nz9A9LvS3AgMBAAECggEACT69ZipBK2E2G/VgoITcXWPWp0w+fC4KF4IsDBZyojur\n6aJK9MAPU6ThidrOQInXq/fwUSlFySOPEIlsgcx+Ywef/ccx+KJX5czSw/nlEoFE\nZZSMUviLl1QlA6xk3/UCTkKLol43ROAz+eifwPxpAFUPKXkNo6lzM14koTE3y55j\nZnY3WkD+LRxi9C8gYJ+pt3bXAQ3BudMA0ubdydkr2DRaGxF0XBiit2kXgg7MI4Az\nV46PhXOQ54EMAb3BMXlRYAqdgP9CiIpwk//sVnkrf8g/o2xG0WVXkF851nTCyO4L\nsuROt8l4h/TOvMrbxWkDa+wcPUaU0xf7maurHDrJmQKBgQDV5JTjo4s7K99xqbXq\n74AHxi5H3SZnrN9Kqtz3GdIgiYKvJIlwQfq17ywLVAWIG3uhCyQ4ukJHv7l7qkW7\nbeNZdxsrpjWNoAEPphBg7SsD+Cv7IykcZt7i0qQRZmrbGTNgsXdcIaCO3zaV8X2m\n1f0nk+WWG0JzWeQ+Gh5aF6KmqwKBgQDS3fE0vz8h+DAZH++Dbp8yipqG/fqtsvQ2\nsfmwyfiLNnZxGL2CURZwNQkigWWDZ8QMRMxbB3HcnRIHtN0NnNTaGHWt1pAAQiAq\nTAkHlwp9mhmCeDggsWHilBCsMixv1h10v2L7bkOz7ByV7Qmg2feTxk2SQtfIPiVw\nTimf1z6aJQKBgADz98Xb4K7uzxwOiYT2dDeUpngjgBxOJOCMSle/gbQraK2nGAWs\nBZXx7txOD4g/txlMl2i5S7pOHGF0rMLdBnpLkY9sOijbYaXUM5Z6+AoYfPmtem1p\n9+xCzABX2HoJbrUrlUCP1ctNK00XuluX8HzQp+E3VeB1shKkwyXbnRnpAoGAeI+I\nfx3xHJzn8xV9PWob/yub2h6QGou8cSEkn116iy2iXltEzqNJ7vGDvYS5432Ka3FS\nXaFOClKLonhYApZuZBuj/LY2Ms+b0FMUvpAu4U0f1KajgJ2qV39MYQd2vKJwyPU7\nxIFwmAgg999EqAC3OngglcU91jEh+qnVxpusITkCgYAIyzPmVXjvgMECVXHIT72T\ny1Q+w3Ls7ni5TlUbJVcxs89EqeHCp8Ouwrtnb4QE+GFBjBFogAWSreunJgEcdtD2\nsqRHw2MXTj1jY+kn2HBSuHxgDkfQBOTSopueJi9g5DtxW6ig36FfDHMiD92HsfmW\nnhdq0ieQLo9yN+JdZlDy6A==\n-----END PRIVATE KEY-----\n",
// "client_email": "firebase-adminsdk-kmuag@sportparliament-1f167.iam.gserviceaccount.com",
// "client_id": "106697936803091424662",
// "auth_uri": "https://accounts.google.com/o/oauth2/auth",
// "token_uri": "https://oauth2.googleapis.com/token",
// "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
// "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kmuag%40sportparliament-1f167.iam.gserviceaccount.com",
// "universe_domain": "googleapis.com"
// }