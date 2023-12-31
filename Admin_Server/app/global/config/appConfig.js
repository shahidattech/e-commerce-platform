module.exports = {
    "db": "mongodb://localhost:27017/mybrand",
    // "logdb": "mongodb://localhost:27017/cloudschoollog",
    // "mongodbClient": "mongodb://localhost:27017/cloudschoolpayment",
    //// for production
    // "db": "mongodb+srv://mybrand:globalpass@cluster0.8vbbk.mongodb.net/mybrand?retryWrites=true&w=majority",
    // "logdb": "mongodb+srv://mybrand:globalpass@cluster0.8vbbk.mongodb.net/mybrand?retryWrites=true&w=majority",
    // "mongodbClient": "mongodb://mybrand:globalpass@cluster0.8vbbk.mongodb.net/mybrand?retryWrites=true&w=majority",
    "httpPort": 7001,
    "httpsPort": 8001,
    "REDIS_HOST": "localhost",
    "REDIS_PORT": 6379,
    // "REDIS_HOST": "15.207.19.179",
    // "REDIS_PORT": 6379,
    "SSLOn": false,
    "Cloud name": '*********',
    "API Key": '*********',
    "API Secret": "*************",
    "JWT_TOKEN_MIX": "***********",
    "SECRECT_JWT_TOKEN_KEY": "************",
    "TAX" : 118,
    "SGST" : 0.09,
    "CGST": 0.09,
    "GST": 0.18,
    "AWS_S3_BUCKET" :"invoice-stored",
    "PROD_INVOICE_PATH":"",
    "ENVIRONMENT": "DEV",
    // "PROD_INVOICE_PATH": "/server/adminServer/MONTHLY_INVOICE_RESOURCES/",
    "PROD_INVOICE_PATH": "",
    //stage  
    medaiServerAddress: "http://*.*.*.*/api/v1/media/",
    synchServerAddress: "http://*.*.*.*/datasync/",
    // searchServerAddress: "http://54.204.251.56/api/search/"
};