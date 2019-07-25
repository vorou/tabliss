import featherIcons from 'feather-icons';
import React, { FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Link } from './types';
import { Icon } from '../../../views/shared';

const displayUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
  } catch (e) {
    return url;
  }
};

const messages = defineMessages({
  shortcutHint: {
    id: 'plugins.links.shortcutHint',
    description: 'Hover hint text for links with a keyboard shortcut',
    defaultMessage: 'Press {number} or click to visit',
  },
  standardHint: {
    id: 'plugins.links.standardHint',
    description: 'Hover hint text for links without a keyboard shortcut',
    defaultMessage: 'Click to visit',
  },
});

type Props = Link & { number: number };

const Display: FC<Props> = ({ icon, name, number, url }) => {
  const intl = useIntl();
  const title =
    number < 10
      ? intl.formatMessage(messages.shortcutHint, {
          number: number,
        })
      : intl.formatMessage(messages.standardHint);

  return (
    <a href={url} rel="noopener noreferrer" title={title}>
      {icon && featherIcons.icons[icon] && (
        <Icon svg={featherIcons.icons[icon].toSvg()} />
      )}
      {name}
      {!name && !icon && displayUrl(url)}
    </a>
  );
};

export default Display;
