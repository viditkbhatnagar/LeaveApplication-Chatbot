const {
    ComponentDialog, WaterfallDialog
} = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const { helpDialog } = require('../constants/DialogIds');

const helpDialogWF1 = 'helpDialogWF1';

class HelpDialog extends ComponentDialog{

    constructor(conversationState){
        super(helpDialog);

        if(!conversationState) throw new Error('Conversation State is not defined');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(helpDialogWF1,[
            this.sendHelpSuggestions.bind(this)
        ]));

        this.initialDialogId = helpDialogWF1;
    }

    async sendHelpSuggestions(stepContext){
		await stepContext.context.sendActivity('I can help you with your leave application, kindly choose one option');
		await stepContext.context.sendActivity({
                attachments : [CardFactory.heroCard(
                    'Here are some suggestions that you can try',
                    null,
                    CardFactory.actions([
                        {
                            type : 'imBack',
                            title : 'Apply Leave',
                            value : 'Apply Leave'
                        },
                        {
                            type : 'imBack',
                            title : 'Leave Status',
                            value : 'Leave Status'
                        },
                        {
                            type : 'imBack',
                            title : 'Help',
                            value : 'Help'
                        }
                    ])
                )]
            });
	    	return await stepContext.endDialog();

 }

}

module.exports.HelpDialog = HelpDialog; 