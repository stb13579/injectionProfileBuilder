# injectionProfileBuilder
A chatbot to help you model and build injection profiles for Gatling load tests

## Requirements

- An Anthropic account with an API token

## How to start

1. Clone the project from GitHub
2. Add your API token to the `.env` file in the `back` directory.
3. In your local environment navigate to the `back`folder and run `npm start`. This starts a local server on port 3001.
4. Navigate to the `chatbot-frontend` folder and run `npm start`. This starts the front end on port 3000 and should open your web browser. If the web browser fails to open, use the address `localhost:3000` in your browser to open the web interface. 

## Known problems

- The bot should return code in Java unless you specify otherwise, but it often returns Scala.
- the bot mixes the open and closed work load models. 

## Future work

- Display readable charts in the front end
- Improve the prompt engineering
- Improve the design

## Feedback and contributions welcome

This is a hobby project. Feel free to submit ideas or PRs for improvement.