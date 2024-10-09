from openai import OpenAI
import os
import json
import time

client = OpenAI(api_key = os.environ['OPENAI_API_KEY'])

STORY_ID = 'asst_QJULNvgbgB8cU1YgY5JzLAyr'
SKILL_ID = 'asst_JSej8B49OeeI7IwOUNp3dpKY'
ENEMY_ID = 'asst_ppQ8bsiqkd0w3G8N7tn7NUCb'
PENALTY_ID = 'asst_jjPhkdDYvzUWcto0DGh0x35r'
REWARD_ID = 'asst_YvLH1ztf6NC7qbLQGnlcUV4c'

def create_thread():
  return client.beta.threads.create()

def show_message(json_object):
  if 'Story' in json_object:
    for idx, choice in enumerate(json_object['Choices']):
      print(f'{idx+1}: {choice["text"]} ({choice["status"]}), Gold:({choice["gold"]}), ({choice["next_type"]})')
     

def run_thread(thread, user_message, assistant_id=STORY_ID):
  for idx in range(len(user_message)):
    user_message[idx]['text'] = str(user_message[idx]['text'])
  run = submit_message(user_message, thread, assistant_id)
  run = wait_run(run, thread)
  messages = get_message(thread)
  text = messages.data[0].content[0].text.value
  json_object=json.loads(text)

  show_message(json_object)
  time.sleep(0.5)
  return json_object


def run(thread, message):
  if 'Worldview' in message[0]['text']:
    # First message
    response = run_thread(thread, message, STORY_ID)
  elif 'next_type' in message[0]['text']:
    # Story selection
    if message[0]['text']['next_type'] == 'story':
      response = run_thread(thread, message, STORY_ID)
    elif message[0]['text']['next_type'] == 'combat':
      enemy = run_thread(thread, message, ENEMY_ID)
      enemy_info = str({'name':enemy['combat']['name'], 'description': enemy['combat']['description']})
      message = [
        {
          'type': 'text',
          'text': f'Make enemy skills for {enemy_info}'
        }
      ]
      skills = run_thread(thread, message, SKILL_ID)
      response = {'combat':dict(enemy['combat'], **skills)}
    elif message[0]['text']['next_type'] == 'reward':
      reward = run_thread(thread, message, REWARD_ID)
      choice =  message[0]['text']
      message = [
        {
          'type': 'text',
          'text': f'{choice}, Player earn {reward}'
        }
      ]
      story = run_thread(thread, message, STORY_ID)
      response = dict(story,**{'reward':reward})
    elif message[0]['text']['next_type'] == 'penalty':
      penalty = run_thread(thread, message, PENALTY_ID)
      choice =  message[0]['text']
      message = [
        {
          'type': 'text',
          'text': f'{choice}, Player get {penalty}'
        }
      ]
      story = run_thread(thread, message, STORY_ID)
      response = dict(story,**penalty)
    else:
      response = 'error'
      
  return response


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