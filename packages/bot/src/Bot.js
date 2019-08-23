import { ActivityHandler } from 'botbuilder';
import random from 'math-random';

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
      await context.sendActivity('Hello, William!\n\nYour to-do list is empty, let\'s add something.');
      await next();
    });

    this.onMessage(async (context, next) => {
      const { activity } = context;

      if (/^((i\sneed\sto)|(add))\s/iu.test(activity.text)) {
        const text = activity.text.replace(/^((i\sneed\sto)|(add))\s/iu, '').replace(/\sto\s((my|the)\s)?list\.?$/iu, '').trim();
        const [firstChar, ...otherChars] = text;
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
        const text = activity.text.substr(7).replace(/\sfrom\s(my\s)?list\.?$/iu, '').trim();

        await sendReduxEvent(context, {
          payload: { text },
          type: 'DELETE_TASK'
        });

        await context.sendActivity(`Deleting "${ text }" from your list.`);
      } else if (/^(show|what).*?(lists?|tasks?)[\.\?]?$/iu.test(activity.text)) {
        await sendReduxEvent(context, { type: 'SHOW_TASK_LIST' });

        await context.sendActivity('Here is your tasks.');
      } else {
        await context.sendActivity(`Sorry, I don't know what you said.`);
      }

      await next();
    });
  }
}
