import AWS from "aws-sdk";
import {v4 as uuidv4} from "uuid";
import {promisify} from "util";
import {pbkdf2} from "crypto";

const pbkdf2Async = promisify(pbkdf2);
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function register(event: any, _: any, callback: any) {
  const requestBody = JSON.parse(event.body);
  const {name, email, password} = requestBody;

  const salt = uuidv4();
  const encodedBuf = await pbkdf2Async(password, salt, 10000, 64, "sha256");
  const encodedPassword = encodedBuf.toString("base64");

  const user = {
    id: uuidv4(),
    name,
    email,
    password: encodedPassword,
  };

  await dynamoDb
    .put({
      TableName: "users",
      Item: user,
    })
    .promise();

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "User successfully registered",
      data: user,
    }),
  };

  callback(null, response);
}

export function list(_: any, __: any, callback: any) {
  const onScan = (err, data) => {
    if (err) {
      console.log("Scan failed: ", JSON.stringify(err, null, 2));
      callback(err);
    } else {
      console.log("Scan succeeded");
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          users: data.Items,
        }),
      });
    }
  };
  dynamoDb.scan({TableName: "users"}, onScan);
}

export function get(event: any, _: any, callback: any) {
  const params = {
    TableName: "users",
    Key: {id: event.pathParameters.id},
  };

  dynamoDb
    .get(params)
    .promise()
    .then((result) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch((error) => {
      console.error(error);
      callback(new Error("Couldn't fetch user."));
    });
}
