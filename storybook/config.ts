import { configure } from '@storybook/react'

function loadStories() {
  require('../components/Reaction/stories')
  require('../components/UIThread/stories')
}

configure(loadStories, module)