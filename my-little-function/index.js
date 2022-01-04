const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    var result = {}
    if(!event.hasOwnProperty('queryStringParameters'))
    {
        result = {"body" : "No parameter."}
    }
    else if(event.queryStringParameters.type == "get")
    {
        result = {"body": await getCount()}
    }
    else if(event.queryStringParameters.type == "add")
    {
        await addCount()
        result = {"body": await getCount()}
    }
    else if(event.queryStringParameters.type == "addv2")
    {
        await addv2Count(event, {"amount": event.queryStringParameters.amount})
        result = {"body": await getCount()}
    }
    else
    {
        result = {"body" : "Nothing matching."}
    }
    result.headers = {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    }
    
    result.statusCode = 200
    callback(null, result);
};

const getCount = async (event, context) => {
    const data = await dynamodb.get({ TableName: "my-little-table", Key: {"key": "NijiCount"}})
    .promise()
    
    return data.Item.count
}

const addCount = async (event, context) => {
    const data = await dynamodb.get({ TableName: "my-little-table", Key: {"key": "NijiCount"}})
    .promise()
    
    await dynamodb.put({TableName: "my-little-table", Item: {key: "NijiCount", count: data.Item.count + 1}}).promise()
}

const addv2Count = async (event, context) => {
    const data = await dynamodb.get({ TableName: "my-little-table", Key: {"key": "NijiCount"}})
    .promise()
    var valueAdded = 1
    if (context.amount != null) valueAdded = parseInt(context.amount)
    await dynamodb.put({TableName: "my-little-table", Item: {key: "NijiCount", count: parseInt(data.Item.count) + valueAdded}}).promise()
}
/*
async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
}; */
