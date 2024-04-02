# Open AI Assistants Api Sample

- The difference between the Open AI Assistants API and the Open AI ChatCompletion API
  - The Open AI Assistants API is used to create conversational chatbots that can be used to answer questions, provide
    suggestions, explain concepts, etc.

## Assistants

- The assistants api was built for various tasks and can be used for different purposes
  - programming assistant
  - math tutor
  - travel assistant
  - personal assistant
  - language instructor
  - ...
- Each assistant has a name, instructions, model, tools, and files
  - id: the unique id of the assistant
  - name: the name of the assistant
  - instructions: used to set the behavior and instructions of the assistant
  - model: the model used to call the assistant
  - tools: the tools that the assistant can use, such as code interpreter, retrieval, functions, etc.
  - files: the files used by the assistant for retrieval

## Threads

- A thread is created before a user starts a conversation with the assistant.
- The thread persists until the conversation is completed.
- The thread contains the user's questions and the assistant's responses.

## Messages

- The messages contain the user's questions and the assistant's responses and were stored in a particular thread.
- The messages are just a list of messages that are stored in a thread.

## Runs

- The runs api is used to run the assistant and get the response.
- The runs api runs, it reads the messages in a particular thread and generates the response.
- The runs api will not return the result immediately, and it is just a batch job that will be processed in the
  background.
- We have to retrieve the run result by calling the retrieve runs api and until the status returns completed.
