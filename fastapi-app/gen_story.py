from openai import OpenAI
import os
import json
import time
import requests

client = OpenAI(api_key = os.environ['OPENAI_API_KEY'])

STORY_ID = 'asst_QJULNvgbgB8cU1YgY5JzLAyr'
SKILL_ID = 'asst_JSej8B49OeeI7IwOUNp3dpKY'
ENEMY_ID = 'asst_ppQ8bsiqkd0w3G8N7tn7NUCb'
PENALTY_ID = 'asst_jjPhkdDYvzUWcto0DGh0x35r'
REWARD_ID = 'asst_YvLH1ztf6NC7qbLQGnlcUV4c'
ENEMY_REWARD_ID = 'asst_vwf7NLsucECWPtb4bMcihfff'

def create_thread():
  return client.beta.threads.create()

def retrieve_thread(thread_id):
  return client.beta.threads.retrieve(thread_id)


def run_thread(thread, user_message, assistant_id=STORY_ID):
  for idx in range(len(user_message)):
    user_message[idx]['text'] = str(user_message[idx]['text'])
  run = submit_message(user_message, thread, assistant_id)
  run = wait_run(run, thread)
  messages = get_message(thread)
  text = messages.data[0].content[0].text.value
  json_object=json.loads(text)
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
      # enemy_info = str({'name':enemy['combat']['name'], 'description': enemy['combat']['description']})
      # image_url = create_enemy_image(enemy_info)
      # # enemy_info = str({'name':enemy['combat']['name'], 'description': enemy['combat']['description']})
      message = [
        {
          'type': 'text',
          'text': f'Make rewards for this enemy.'
        }
      ]
      rewards = run_thread(thread, message, ENEMY_REWARD_ID)
      response = dict({**enemy, **rewards})
    elif message[0]['text']['next_type'] == 'reward':
      response = run_thread(thread, message, REWARD_ID)
    elif message[0]['text']['next_type'] == 'penalty':
      response = run_thread(thread, message, PENALTY_ID)
    else:
      response = 'error'
  else:
    response = run_thread(thread, message, STORY_ID)
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

def create_enemy_image(prompt):
  response = client.images.generate(
  model="dall-e-3",
  prompt=prompt,
  size="1024x1024",
  quality="standard",
  n=1,
  )
  image_url = response.data[0].url
  return image_url