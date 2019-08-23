import { css } from 'glamor';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import ReactWebChat, { createCognitiveServicesSpeechServicesPonyfillFactory, createDirectLine, createStore } from 'botframework-webchat';

import fetchDirectLineToken from './util/fetchDirectLineToken';
import fetchSpeechServicesRegion from './util/fetchSpeechServicesRegion';
import fetchSpeechServicesToken from './util/fetchSpeechServicesToken';

const WEB_CHAT_BOX = css({
  boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
  height: 'calc(100% - 20px)',
  margin: 10,
  position: 'fixed',
  top: 0,
  width: 320,

  '&.centered': {
    marginLeft: '50%',
    left: -160,
  },

  '&:not(.centered)': {
    right: 0
  }
});

const WEB_CHAT_STYLE_OPTIONS = {
  bubbleNubSize: 5
};

export default function WebChat() {
  const dispatch = useDispatch();
  const taskListVisibility = useSelector(({ taskListVisibility }) => taskListVisibility);
  const [directLine, setDirectLine] = useState();
  const [webSpeechPonyfillFactory, setWebSpeechPonyfillFactory] = useState();
  const handleIncomingActivity = useCallback(activity => {
    if (activity.type === 'event' && activity.name === 'redux action') {
      dispatch(activity.value);
    }
  }, [dispatch]);
  const [webChatStore] = useState(createStore({}, () => next => action => {
    const { payload, type } = action;

    if (type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      handleIncomingActivity(payload.activity);
    }

    return next(action);
  }));

  useEffect(() => {
    (async function () {
      const directLineToken = await fetchDirectLineToken();
      const speechServiceRegion = await fetchSpeechServicesRegion();
      const webSpeechPonyfillFactory = await createCognitiveServicesSpeechServicesPonyfillFactory({
        authorizationToken: fetchSpeechServicesToken,
        region: speechServiceRegion
      });

      setDirectLine(() => createDirectLine({ token: directLineToken }));
      setWebSpeechPonyfillFactory(() => webSpeechPonyfillFactory);
    })().catch(console.error.bind(console));

    return () => {};
  }, [setDirectLine]);

  return (
    !!directLine &&
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
