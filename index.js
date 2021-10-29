const restify = require("restify");

const {
  BotFrameworkAdapter,
  MemoryStorage,
  ConversationState,
} = require("botbuilder");

const { BotActivityHandler} = require('./BotActivityHandler');
const { RootDialog } = require('./dialogs/RootDialog');

const adapter = new BotFrameworkAdapter({
  appId: "",
  appPassword: "",
});


adapter.onTurnError = async (context, error) => {
  if (error) {
    console.log(`Error Occured : ${error}`);
  }

  await context.sendActivity("An Error has occured in the Bot Framework");
};

const server = restify.createServer();
server.listen(3978, () => {
  console.log(`${server.name} listening to ${server.url}`);
});

const memory = new MemoryStorage();
let conversationState = new ConversationState(memory);

// activity handler
const rootDialog = new RootDialog(conversationState);
const mainBot = new BotActivityHandler(conversationState,rootDialog);

server.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await mainBot.run(context);
  });
});
