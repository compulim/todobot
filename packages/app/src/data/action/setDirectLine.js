const SET_DIRECT_LINE = 'SET_DIRECT_LINE';

export default function setDirectLine(directLine) {
  return {
    type: SET_DIRECT_LINE,
    payload: { directLine }
  };
}

export { SET_DIRECT_LINE }
