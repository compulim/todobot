import { css } from 'glamor';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactWebChat, { createCognitiveServicesSpeechServicesPonyfillFactory, createDirectLine, createStore } from 'botframework-webchat';
import updateIn from 'simple-update-in';

import fetchDirectLineToken from './util/fetchDirectLineToken';
import fetchSpeechServicesRegion from './util/fetchSpeechServicesRegion';
import fetchSpeechServicesToken from './util/fetchSpeechServicesToken';
import receiveActivity from './data/action/receiveActivity';
import setDirectLine from './data/action/setDirectLine';

const WEB_CHAT_BOX = css({
  fontSize: 20,
  height: 'calc(100% - 20px)',
  margin: 10,
  width: 420,

  '&:not(.centered)': {
    right: 0
  },

  '& > *': {
    borderRadius: 5,
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    overflow: 'hidden'
  }
});

const WEB_CHAT_STYLE_OPTIONS = {
  backgroundColor: '#F7F7F7',
  bubbleBorderRadius: 5,
  bubbleFromUserBorderRadius: 5,
  bubbleFromUserNubOffset: 10,
  bubbleFromUserNubSize: 15,
  bubbleNubOffset: 10,
  bubbleNubSize: 10,
  sendBoxHeight: 50
};

export default function WebChat() {
  const dispatch = useDispatch();
  const { directLine, taskListVisibility, tasks } = useSelector(({ directLine, taskListVisibility, tasks }) => ({ directLine, taskListVisibility, tasks }));
  const [webSpeechPonyfillFactory, setWebSpeechPonyfillFactory] = useState();
  const handleIncomingActivity = useCallback(activity => dispatch(receiveActivity(activity)), [dispatch]);
  const middleware = useRef(() => next => action => next(action));

  useEffect(() => {
    middleware.current = () => next => action => {
      if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
        handleIncomingActivity(action.payload.activity);
      } else if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
        action = updateIn(
          action,
          ['payload', 'activity', 'channelData', 'reduxStore'],
          () => ({ tasks, taskListVisibility })
        );
      }

      return next(action);
    };

    return () => {};
  }, [handleIncomingActivity, tasks]);

  const [webChatStore] = useState(createStore({}, store => next => action => middleware.current(store)(next)(action)));

  useEffect(() => {
    (async function () {
      const directLineToken = await fetchDirectLineToken();
      const speechServiceRegion = await fetchSpeechServicesRegion();
      const webSpeechPonyfillFactory = await createCognitiveServicesSpeechServicesPonyfillFactory({
        authorizationToken: fetchSpeechServicesToken,
        region: speechServiceRegion
      });

      dispatch(setDirectLine(createDirectLine({ token: directLineToken })));
      setWebSpeechPonyfillFactory(() => webSpeechPonyfillFactory);
    })().catch(console.error.bind(console));

    return () => {};
  }, [dispatch]);

  React.useLayoutEffect(() => {
    const sendBox = document.querySelector('[data-id="webchat-sendbox-input"]');

    sendBox && sendBox.focus();
  }, [directLine, webSpeechPonyfillFactory]);

  return (
    !!(directLine && webSpeechPonyfillFactory) &&
      <div className={classNames(WEB_CHAT_BOX + '', { centered: !taskListVisibility })}>
        <ReactWebChat
          directLine={directLine}
          store={webChatStore}
          styleOptions={WEB_CHAT_STYLE_OPTIONS}
          webSpeechPonyfillFactory={webSpeechPonyfillFactory}
        />
      </div>
  );
}
