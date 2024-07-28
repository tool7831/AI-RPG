from openai import OpenAI
import os
import json
import time
import Combat

client = OpenAI(api_key = os.environ['OPENAI_API_KEY'])

STORY_ID = 'asst_QJULNvgbgB8cU1YgY5JzLAyr'
SKILL_ID = 'asst_JSej8B49OeeI7IwOUNp3dpKY'

def create_thread():
  return client.beta.threads.create()

def show_message(json_object):
  if 'Story' in json_object:
    for idx, choice in enumerate(json_object['Choices']):
      print(f'{idx+1}: {choice["text"]} ({choice["status"]}), Gold:({choice["gold"]}), ({choice["next_type"]})')
     

def run_thread(user_message, thread, assistant_id=STORY_ID):
  run = submit_message(user_message, thread, assistant_id)
  run = wait_run(run, thread)
  messages = get_message(thread)
  text = messages.data[0].content[0].text.value
  json_object=json.loads(text)

  show_message(json_object)
  time.sleep(0.5)
  return json_object


def start_thread(thread, start_message, assistant_id=STORY_ID):
  # create thread and add first message in thread
  run_thread(start_message, thread, assistant_id)

  for i in range(10):
    user_message = input()
    print(user_message)
    if user_message == "quit":
      break
    response = run_thread(user_message, thread, assistant_id)
    if 'Combat' in response:
      run_thread(str(response['Combat']), thread, SKILL_ID)


def submit_message(user_message, thread, assistant_id=STORY_ID):
  client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=user_message
  )
  run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant_id,
  )
  return run


def wait_run(run, thread):
  while run.status == "queued" or run.status == "in_progress":
    # connect thread and assistant
    run = client.beta.threads.runs.retrieve(
      thread_id=thread.id,
      run_id=run.id
    )
    time.sleep(0.5)
  return run

def get_message(thread):
  return client.beta.threads.messages.list(thread_id=thread.id)