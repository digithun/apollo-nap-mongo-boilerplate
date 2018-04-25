import { configure } from '@storybook/react'

function loadStories() {
  require('../components/Reaction/stories')
}

configure(loadStories, module)