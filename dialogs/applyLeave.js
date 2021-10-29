 const {
    ComponentDialog, WaterfallDialog, ChoicePrompt, ChoiceFactory, NumberPrompt, TextPrompt
} = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const{ applyLeaveDialog } = require('../constants/DialogIds');
const { confirmLeave} = require('../cards/cards'); 

const applyLeaveDialogWF1 = 'applyLeaveDialogWF1';
const ChoicePromptDialog = 'ChoicePromptDialog';
const NumberPromptDialog = 'NumberPromptDialog';
const TextPromptDialog = 'TextPromptDialog';
let  dialogState
class ApplyLeaveDialog extends ComponentDialog{

    constructor(conversationState){
        super(applyLeaveDialog);

        if(!conversationState) throw new Error('Conversation State is not defined');

        this.conversationState = conversationState;

	this.applyLeaveStateAccessor = this.conversationState.createProperty('ApplyLeaveState');

	this.addDialog(new ChoicePrompt(ChoicePromptDialog));
	this.addDialog(new NumberPrompt(NumberPromptDialog));
	this.addDialog(new TextPrompt(TextPromptDialog));

        this.addDialog(new WaterfallDialog(applyLeaveDialogWF1,[
	    this.preProcessedEntity.bind(this),
      this.askleavetype.bind(this),
	    this.askNoOfDays.bind(this),
	    this.askleavedate.bind(this),
	    this.applyApplication.bind(this)
        ])); 

        this.initialDialogId = applyLeaveDialogWF1;
    }


 async preProcessedEntity(stepContext) {
    try {
      if (stepContext.options && stepContext.options.luisResult) {
        // console.log(stepContext.options.entities);

        let numberEntity = stepContext.options.entities.number
          ? stepContext.options.entities.number[0]
          : null;

        let leaveTypesEntity = stepContext.options.entities.leaveType
          ? stepContext.options.entities.leaveType[0][0]
          : null;

        let dateTimeEntity = stepContext.options.entities.datetimeV2
          ? stepContext.options.entities.datetimeV2
          : null;

        let dateFrameObj = {};

        if (dateTimeEntity != null) {
          dateTimeEntity.forEach((subEntities, index) => {
            if (subEntities.type === "duration") {
              dateFrameObj["duration"] = subEntities.values[0]["timex"]
                .replace("P", "")
                .replace("D", "");
            }

            if (subEntities.type === "date") {
              dateFrameObj["date"] =
                subEntities.values[0]["resolution"][0]["value"];
            }
          });
        }

        stepContext.values.Entities = {
          numberEntity,
          leaveTypesEntity,
          dateFrameObj,
        };

        console.log( stepContext.values.Entities);

        return stepContext.next();
      }
    } catch (error) {
      console.log(error);
    }
  }

    async askleavetype(stepContext) {
        if (stepContext.values.Entities.leaveTypesEntity) {
          return await stepContext.next();
        } else {
          return await stepContext.prompt(choicePromptDialog,{
            prompt: "Please help me with the type of leave you want to apply for",
            choices: ChoiceFactory.toChoices([
              "Sick Leave",
              "Casual Leave",
              "Earned Leave",
            ]),
          });
        }
    }

       async askNoOfDays(stepContext){
        dialogState = await this.applyLeaveStateAccessor.get(
            stepContext.context,
            {}
          );
          if (stepContext.values.Entities.leaveTypesEntity) {
            dialogState.leaveType = stepContext.values.Entities.leaveTypesEntity;
          } else {
            dialogState.leaveType = stepContext.result.value;
          }
      
          if (!stepContext.values.Entities.dateFrameObj.duration) {
            return await stepContext.prompt(
              NumberPromptDialog,
              `For How many days you want to apply for?`
            );
          } else {
            return await stepContext.next();
          }
        }

   async askleavedate(stepContext){
        if (stepContext.values.Entities.dateFrameObj.duration) {
            dialogState.leaveDays = stepContext.values.Entities.dateFrameObj.duration;
          } else {
            let days = stepContext.result;
            console.log(days);
          }
      
          if (!stepContext.values.Entities.dateFrameObj.date) {
            return await stepContext.prompt(
              TextPromptDialog,
              `From which date you want to apply for you leave application`
            );
          } else {
            return await stepContext.next();
          }
    }  

       async applyApplication(stepContext){

        if (stepContext.values.Entities.dateFrameObj.date) {

            dialogState.leaveDate = stepContext.values.Entities.dateFrameObj.date;

          } else {
            const result = await this.validateDate(stepContext.result);
            if (!result.success) {
              return await stepContext.context.sendActivity(
                "This date is not valid for your Leave"
              );
            }
            console.log(result);

            dialogState.leaveDate = result.date;

          }

          await stepContext.context.sendActivity({
            attachments: [
              CardFactory.adaptiveCard(
                confirmLeave(
                  dialogState.leaveType,
                  dialogState.leaveDays,
                  dialogState.leaveDate

                )
           ), 
          ],
          });

        await stepContext.context.sendActivity('your leave have been applied')
         console.log(dialogState)
        return await stepContext.endDialog();

        }
    async validateDate(input) {
            try {
              const results = Recognizers.recognizeDateTime(
                input,
                Recognizers.Culture.English
              );
              const now = new Date();
              const earliest = now.getTime() + 60 * 60 * 1000;
              let output;
              results.forEach((result) => {
                result.resolution.values.forEach((resolution) => {
                  const datevalue = resolution.value || resolution.start;
                  const datetime =
                    resolution.type === "time"
                      ? new Date(`${now.toLocaleDateString()} ${datevalue}`)
                      : new Date(datevalue);
                  if (datetime && earliest < datetime.getTime()) {
                    output = { success: true, date: datetime.toLocaleDateString() };
                    return;
                  }
                });
              });
              return (
                output || {
                  success: false,
                  message: "I'm sorry, please enter a date at least an hour out.",
                }
              );
            } catch (error) {
              return {
                success: false,
                message:
                  "I'm sorry, I could not interpret that as an appropriate date. Please enter a date at least an hour out.",
              };
            }
          }
  

}

module.exports.ApplyLeaveDialog = ApplyLeaveDialog; 