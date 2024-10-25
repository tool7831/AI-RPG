from openai import OpenAI
from openai.types.beta.assistant_stream_event import ThreadMessageDelta
import os
import json
import time

client = OpenAI(api_key = os.environ['OPENAI_API_KEY'])

STORY_ID = 'asst_U10YtSOIBjoZDxkHHeQ2reC2'
SKILL_ID = 'asst_JSej8B49OeeI7IwOUNp3dpKY'
ENEMY_ID = 'asst_ppQ8bsiqkd0w3G8N7tn7NUCb'
PENALTY_ID = 'asst_eamrmZCoV6BkSWd02GMogvYO'
REWARD_ID = 'asst_buxdXTPCyyxeqHbG0Yjgw1gg'
ENEMY_REWARD_ID = 'asst_vwf7NLsucECWPtb4bMcihfff'


def create_thread():
  return client.beta.threads.create()

def retrieve_thread(thread_id):
  return client.beta.threads.retrieve(thread_id)


def run_thread(thread, user_message, assistant_id=STORY_ID):
  run = submit_message(user_message, thread, assistant_id)
  run = wait_run(run, thread)
  messages = get_message(thread)
  text = messages.data[0].content[0].text.value
  json_object=json.loads(text)
  return json_object


def run(thread, message):
  if 'Worldview' in message[0]['text']:
    # First message
    for i in stream_submit_message(message, thread, STORY_ID):
      if i[0] == 'text':
          yield i[1].value
  elif 'next_type' in message[0]['text']:
    # Story selection
    if message[0]['text']['next_type'] == 'story':
      for i in stream_submit_message(message, thread, STORY_ID):
        if i[0] == 'text':
            yield i[1].value
    elif message[0]['text']['next_type'] == 'combat':
      yield "{"
      yield '"combat":'
      for i in stream_submit_message(message, thread, ENEMY_ID):
        if i[0] == 'text':
            yield i[1].value
      # enemy = run_thread(thread, message, ENEMY_ID)
      # enemy_info = str({'name':enemy['combat']['name'], 'description': enemy['combat']['description']})
      # image_url = create_enemy_image(enemy_info)
      # # enemy_info = str({'name':enemy['combat']['name'], 'description': enemy['combat']['description']})
      # message = [
      #   {
      #     'type': 'text',
      #     'text': f'Make rewards for this enemy.'
      #   }
      # ]
      # # rewards = run_thread(thread, message, ENEMY_REWARD_ID)
      # # response = dict({**enemy, **rewards})
      yield ","
      yield '"rewards":'
      # for i in stream_submit_message(message, thread, ENEMY_REWARD_ID):
      #   if i[0] == 'text':
      #       yield i[1].value
      # yield "}"
    elif message[0]['text']['next_type'] == 'reward':
      for i in stream_submit_message(message, thread, REWARD_ID):
        if i[0] == 'text':
            yield i[1].value
    elif message[0]['text']['next_type'] == 'penalty':
      for i in stream_submit_message(message, thread, PENALTY_ID):
        if i[0] == 'text':
            yield i[1].value
    else:
      response = 'error'
      yield response
  else:
    for i in stream_submit_message(message, thread, STORY_ID):
        if i[0] == 'text':
            yield i[1].value
  


def submit_message(user_message, thread, assistant_id=STORY_ID):
  for idx in range(len(user_message)):
    user_message[idx]['text'] = str(user_message[idx]['text'])
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

def stream_submit_message(user_message, thread, assistant_id=STORY_ID):
  for idx in range(len(user_message)):
    user_message[idx]['text'] = str(user_message[idx]['text'])
  client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=user_message
  )
  run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant_id,
    stream=True
  )
  for event in run:
    if isinstance(event, ThreadMessageDelta):
      data = event.data.delta.content
      for d in data:
        for token in d:
          yield token

def wait_run(run, thread):
  while run.status == "queued" or run.status == "in_progress":
    # connect thread and assistant
    run = client.beta.threads.runs.retrieve(
      thread_id=thread.id,
      run_id=run.id
    )
    time.sleep(0.1)
  return run

def get_message(thread):
  return client.beta.threads.messages.list(thread_id=thread.id)

# def create_enemy_image(prompt):
#   response = client.images.generate(
#   model="dall-e-3",
#   prompt=prompt,
#   size="1024x1024",
#   quality="standard",
#   n=1,
#   )
#   image_url = response.data[0].url
#   return image_url