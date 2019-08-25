import { css } from 'glamor';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactWebChat, { createCognitiveServicesSpeechServicesPonyfillFactory, createDirectLine, createStore, createStyleSet } from 'botframework-webchat';
import updateIn from 'simple-update-in';

import attachmentMiddleware from './attachmentMiddleware';
import fetchDirectLineToken from './util/fetchDirectLineToken';
import fetchSpeechServicesRegion from './util/fetchSpeechServicesRegion';
import fetchSpeechServicesToken from './util/fetchSpeechServicesToken';
import receiveActivity from './data/action/receiveActivity';
import setDirectLine from './data/action/setDirectLine';

const WEB_CHAT_BOX = css({
  boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
  display: 'flex',
  width: '100%',

  '@media (min-width: 481px)': {
    height: 'calc(100% - 20px)',
    margin: 10,
    width: 320,

    // '& > *': {
    //   minWidth: 320
    // }
  },

  '& > *': {
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%'
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

const WEB_CHAT_STYLE_SET = {
  ...createStyleSet(WEB_CHAT_STYLE_OPTIONS),
  microphoneButton: {
    '&.dictating > button': {
      '&:active, &:focus, &:hover': {
        '& svg': {
          fill: '#F33'
        }
      }
    }
  }
};

export default function WebChat() {
  const dispatch = useDispatch();
  const { directLine, tasks } = useSelector(({ directLine, tasks }) => ({ directLine, tasks }));
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
          () => ({ tasks })
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
      <div className={WEB_CHAT_BOX}>
        <ReactWebChat
          attachmentMiddleware={attachmentMiddleware}
          directLine={directLine}
          store={webChatStore}
          // styleOptions={WEB_CHAT_STYLE_OPTIONS}
          styleSet={WEB_CHAT_STYLE_SET}
          webSpeechPonyfillFactory={webSpeechPonyfillFactory}
        />
      </div>
  );
}
