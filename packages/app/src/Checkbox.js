import { css } from 'glamor';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import classNames from 'classnames';
import React, { useCallback } from 'react';

const HIT_SIZE = 60;
const SIZE = 24;

const ROOT_CSS = css({
  height: HIT_SIZE,
  position: 'relative',
  width: HIT_SIZE,

  '&.disabled': {
    opacity: .3
  },

  '& > *': {
    left: 0,
    position: 'absolute',
    top: 0
  },

  '& > .icon': {
    backgroundColor: 'White',
    fontSize: SIZE,
    left: `calc((100% - ${SIZE}px) / 2)`,
    top: `calc((100% - ${SIZE}px) / 2)`
  },

  '& > input': {
    backgroundColor: 'Red',
    height: HIT_SIZE,
    margin: 0,
    opacity: 0,
    padding: 0,
    width: HIT_SIZE
  }
});

export default function Checkbox({
  checked,
  disabled,
  onChange
}) {
  const handleChange = useCallback(({ target: { checked } }) => onChange(checked), [onChange]);

  return (
    <span className={classNames(ROOT_CSS + '', { disabled })}>
      <Icon className="icon" iconName={checked ? 'CheckboxComposite' : 'Checkbox'} />
      <input
        checked={checked || false}
        disabled={disabled}
        onChange={handleChange}
        type="checkbox"
      />
    </span>
  );
}
