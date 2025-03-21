from flask import Flask, request, jsonify
from google.cloud import bigquery
import uuid
from flask_cors import CORS  # 需要安装这个库

app = Flask(__name__)
CORS(app)  # 这会允许所有跨域请求

import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "hazel-chiller-454317-n2-d8a21af382bb.json"
# 连接 Google BigQuery
client = bigquery.Client()
dataset_id = "hazel-chiller-454317-n2.proj3todo"
table_id = f"{dataset_id}.todos"

### 获取所有 TODO ###
@app.route("/todos", methods=["GET"])
def get_todos():
    query = f"SELECT * FROM `{table_id}`"
    results = client.query(query).result()
    todos = [{"id": row.id, "task": row.task, "status": row.status} for row in results]
    return jsonify(todos)


@app.route("/todos", methods=["POST"])
def add_todo():
    data = request.get_json()
    task = data.get("task")
    status = data.get("status", "Pending")  # 默认状态是 Pending
    
    if not task:
        return jsonify({"error": "Task is required"}), 400

    # 生成 UUID 作为唯一 ID
    todo_id = str(uuid.uuid4())

    query = f"""
    INSERT INTO `{table_id}` (id, task, status)
    VALUES (@id, @task, @status)
    """
    
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("id", "STRING", todo_id),
            bigquery.ScalarQueryParameter("task", "STRING", task),
            bigquery.ScalarQueryParameter("status", "STRING", status)
        ]
    )
    
    client.query(query, job_config=job_config).result()
    
    return jsonify({"message": "TODO added successfully", "id": todo_id}), 201


### 修改 TODO ###
@app.route("/todos/<string:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    data = request.get_json()
    task = data.get("task")
    status = data.get("status")

    if not task and not status:
        return jsonify({"error": "At least one field (task or status) must be updated"}), 400

    # 先检查是否存在
    check_query = f"SELECT COUNT(*) AS count FROM `{table_id}` WHERE id = @todo_id"
    check_job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("todo_id", "STRING", todo_id)]
    )
    check_result = client.query(check_query, job_config=check_job_config).result()

    # 获取查询返回的行数
    row = list(check_result)[0]
    if row.count == 0:
        return jsonify({"error": "TODO not found"}), 404

    # 生成 SQL 语句
    set_clauses = []
    query_params = []

    if task:
        set_clauses.append("task = @task")
        query_params.append(bigquery.ScalarQueryParameter("task", "STRING", task))

    if status:
        set_clauses.append("status = @status")
        query_params.append(bigquery.ScalarQueryParameter("status", "STRING", status))

    query = f"""
    UPDATE `{table_id}`
    SET {", ".join(set_clauses)}
    WHERE id = @todo_id
    """

    query_params.append(bigquery.ScalarQueryParameter("todo_id", "STRING", todo_id))  # ✅ 改为 STRING

    job_config = bigquery.QueryJobConfig(query_parameters=query_params)
    client.query(query, job_config=job_config).result()

    return jsonify({"message": "TODO updated successfully"})



### 删除 TODO ###
@app.route("/todos/<string:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    # 先检查是否存在
    check_query = f"SELECT COUNT(*) AS count FROM `{table_id}` WHERE id = @todo_id"
    check_job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("todo_id", "STRING", todo_id)]
    )
    check_result = client.query(check_query, job_config=check_job_config).result()
    
    # 获取查询返回的行数
    row = list(check_result)[0]
    if row.count == 0:
        return jsonify({"error": "TODO not found"}), 404

    # 执行删除
    query = f"DELETE FROM `{table_id}` WHERE id = @todo_id"
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("todo_id", "STRING", todo_id)]
    )
    
    client.query(query, job_config=job_config).result()
    
    return jsonify({"message": "TODO deleted successfully"})




if __name__ == "__main__":
    app.run(debug=True)
