import { ActivityHandler } from 'botbuilder';
import random from 'math-random';

const SUGGESTED_ACTIONS = {
  to: null,
  actions: [{
    type: 'imBack',
    value: 'What is on my list?'
  }, {
    type: 'imBack',
    value: 'I need to buy magazines.'
  }, {
    type: 'imBack',
    value: 'Mark buy magazines as completed.'
  }]
};

async function sendHelp(context) {
  await context.sendActivity({
    speak: 'You could say, "what is on my list?", "I need to buy magazines", or "mark buy magazines as completed."',
    suggestedActions: SUGGESTED_ACTIONS,
    text: [
      'You could say:',
      '',
      '- What is on my list?',
      '- I need to buy magazines.',
      '- Mark buy magazines as completed.',
    ].join('\n'),
    type: 'message',
  });
}

async function sendReduxEvent(context, action) {
  await context.sendActivity({
    name: 'redux action',
    type: 'event',
    value: action
  });
}

export default class Bot extends ActivityHandler {
  constructor() {
    super();

    this.onMembersAdded(async (context, next) => {
      await context.sendActivity({
        attachments: [{
          contentType: 'x-todobot-tasks',
        }],
        text: [
          'Hello, William! Here are your tasks.'
        ].join('\n'),
        type: 'message'
      });

      await sendHelp(context);
      await next();
    });

    this.onEvent(async (context, next) => {
      const { activity: { name, value } } = context;

      if (name === 'redux state') {
        const { state, store } = value;

        switch (state) {
          case 'welcome':
            const incompletedTasks = store.tasks.filter(task => !task.completed);

            if (incompletedTasks.length) {
              await context.sendActivity([
                `You have ${ incompletedTasks.length } tasks to work on:`,
                '',
                ...incompletedTasks.map(task => `- ${ task.text }`)
              ].join('\n'));
            } else {
              await context.sendActivity('Your to-do list is empty, let\'s add something.');
            }

            break;
        }
      }

      await next();
    });

    this.onMessage(async (context, next) => {
      const { activity } = context;

      if (/^((i\sneed\sto)|(add))\s/iu.test(activity.text)) {
        const text = activity.text.replace(/^((i\sneed\sto)|(add))\s/iu, '').replace(/\sto\s((my|the)\s)?list\.?$/iu, '').trim();
        const [firstChar, ...otherChars] = text.replace(/\.$/, '');
        const cleanText = [firstChar.toUpperCase(), ...otherChars].join('');

        await sendReduxEvent(context, {
          payload: {
            id: `t-${ random().toString(36).substr(2, 5) }`,
            text: cleanText
          },
          type: 'ADD_TASK'
        });

        await context.sendActivity(`Okay, adding "${ cleanText }" to your list.`);
      } else if (/^mark\s/iu.test(activity.text)) {
        const text = activity.text.substr(5).replace(/\sas\s(in)?((completed?)|(finish(ed)?))\.?$/iu, '').trim();
        const completed = !/((incompleted?)|(unfinish(ed)?))\.?$/iu.test(activity.text);

        if (completed) {
          await sendReduxEvent(context, {
            payload: { text },
            type: 'MARK_TASK_AS_COMPLETED'
          });

          await context.sendActivity(`Marking "${ text }" as completed.`);
        } else {
          await sendReduxEvent(context, {
            payload: { text },
            type: 'MARK_TASK_AS_INCOMPLETED'
          });

          await context.sendActivity(`Marking "${ text }" as incomplete.`);
        }
      } else if (/^(delete|remove)\s/iu.test(activity.text)) {
        const text = activity.text.substr(7).replace(/\sfrom\s((my|the)\s)?list\.?$/iu, '').trim();

        await sendReduxEvent(context, {
          payload: { text },
          type: 'DELETE_TASK'
        });

        await context.sendActivity(`Deleting "${ text }" from your list.`);
      } else if (/^(show|what).*?(lists?|tasks?)[\.\?]?$/iu.test(activity.text)) {
        await context.sendActivity({
          attachments: [{
            contentType: 'x-todobot-tasks'
          }],
          text: 'Here is your list.',
          type: 'message'
        });

        await sendReduxEvent(context, { type: 'SHOW_TASK_LIST' });
      } else if (/^help(\s|$)/iu.test(activity.text)) {
        await sendHelp(context);
      } else {
        await context.sendActivity(`Sorry, I don't know what you said.`);
      }

      await next();
    });
  }
}
