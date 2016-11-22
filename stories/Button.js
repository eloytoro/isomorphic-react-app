import React from 'react';
import Button from 'components/Button';
import { storiesOf } from '@kadira/storybook';


storiesOf('Button')
  .add('simple', () => (
    <Button>Click Me!</Button>
  ));
