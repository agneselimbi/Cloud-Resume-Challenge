import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import json
import uuid
import datetime

# Initialize the DynamoDB client
dynamodb = boto3.resource("dynamodb")

# define table name 
TBLE_NAME = "test"

# Access the dynamoDB table
table = dynamodb.Table(TBLE_NAME)


def lambda_handler(event,context):
    ip = event['requestContext']['identity']['sourceIp']
    print(ip)
    # Update existing items if they don't exist 
    try:
        if  event['httpMethod'] == 'POST':
            return update_visitor_count(table,ip)
        elif event['httpMethod'] =='GET':
            return get_visitor_count() 
        else:
            return{
                "statusCode":405,
                "body": json.dumps("Method Not Allowed")
            }
        
    except ClientError as e :
        response = {
            "statusCode":500,
            "body": json.dumps({"error":str(e)})
        }
    

def get_visitor_count():
    # Scan the table and retrieve all items
    response = table.scan()
    items = response.get('Items',[])

    # Sum the visitorcount values from all items
    total_visitor_count = sum(int(item['visit_count']) for item in items if 'visit_count' in item)
        

    return {
        'statusCode':200,
         "headers":{ "Access-Control-Allow-Origin":"*",
                     "Content-Type":"application/json",
         },
        'body': json.dumps({'total_visitor_count': total_visitor_count})
            }

def update_visitor_count (table,ip):
    ts = str(datetime.datetime.now().timestamp())
    try:
        table.update_item(
            Key = {
                'visitor_ip': ip
                  },
            UpdateExpression="SET  visit_count=if_not_exists(visit_count, :start) + :increment,ts= :ts",
            ExpressionAttributeValues={
            ':increment':1,
            ':start':0,
            ':ts' : ts            
            }
        )
        return {
            "statusCode":200,
            "headers":{ "Access-Control-Allow-Origin":"*",
                        "Content-Type":"application/json"},
            "body":json.dumps({"message":"Visitor added to table succesfully !"})
             }
    except ClientError as e:
        return {
            "statusCode":500,
            "body":json.dumps({"message":"Unable to insert new item to table","error":str(e)})
        }

    
    
