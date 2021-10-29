const {
  ComponentDialog, WaterfallDialog, DialogSet, DialogTurnStatus
} = require("botbuilder-dialogs");
const { LuisRecognizer } = require('botbuilder-ai');
const { rootDialog, helpDialog,applyLeaveDialog } = require('../constants/DialogIds');
const { ApplyleaveDialog, HelpDialog } = require('./index');

const parseMessage= 'parseMessage';

const luisConfig={
	applicationId: 'd7951441-ce00-4cf5-992b-cd0c42f64f6d',
	endpointKey: '519e4680f8dc464cae89035037a316fe',
	endpoint: 'https://lusinitesh.cognitiveservices.azure.com/'
}

class RootDialog extends ComponentDialog{
	constructor(conversationState){
	super(rootDialog);

	if(!conversationState) throw new Error('Conversation State is not defined');
        this.conversationState = conversationState;


	this.addDialog(new HelpDialog(conversationState));
	this.addDialog(new ApplyleaveDialog(conversationState));


	this.addDialog(new WaterfallDialog(parseMessage,[
		this.routeMessage.bind(this)
	]));

	   this.recognizer = new LuisRecognizer(luisConfig, {
      apiVersion: "v3",
    });

      

	this.initialDialogId = parseMessage;
  }


  async run(context,accessor){
	  try{
		  const dialogSet = new DialogSet(accessor);
		  dialogSet.add(this);
		  const dialogContext = await dialogSet.createContext(context);
		  const results = await dialogContext.continueDialog();
		  if(results && results.status == DialogTurnStatus.empty){
			  await dialogContext.beginDialog(this.id);
		  } else{
			  console.log('Dialog stack is empty');
		  }
	  }catch(err){
		  console.log(err);
	  }
  }


 async routeMessage(stepContext) {
      let luisresponse = await this.recognizer.recognize(stepContext.context);
      // luisresponse = luisresponse.luisResult;
      // console.log("Luis Response => ", JSON.stringify(luisresponse));
      let luisIntent = luisresponse.luisResult.prediction.topIntent;
      console.log(luisIntent);
      switch (luisIntent.toLowerCase()) {
        case "applyleave":
          return await stepContext.beginDialog(applyLeaveDialog, {
            luisResult : true,
            entities : luisresponse.luisResult.prediction.entities
          });


       /* case "leave status":
          return await stepContext.beginDialog(leaveStatusDialog,{
            luisResult : true,
            entities : luisresponse.luisResult.prediction.entities
          });
*/

        case "help":
          return await stepContext.beginDialog(helpDialog);

        default:
          stepContext.context.sendActivity(
            "Sorry, I am still learning can you please refresh your query"
          );
          return await stepContext.endDialog();
      }
      
    //return await stepContext.endDialog();
  }

 
}

module.exports.RootDialog= RootDialog;  