import * as React from 'react'
const hoistNonReactStatic = require('hoist-non-react-statics')

const th = require('../i18n/th-th.json')
const dictionary = {
  th
}

declare global {
  type UIi18nTranslator = (key: string, data?: { [dataName: string]: any }) => string
}
interface UIWithDictComponentPropTypes extends React.DOMAttributes<Element> {
  t: UIi18nTranslator
  local: string
}
export default function<P, O>(Component: React.ComponentClass<P & UIWithDictComponentPropTypes> | React.StatelessComponent<P & UIWithDictComponentPropTypes>) {
  // tslint:disable-next-line:class-name
  class withTranslate extends React.Component<{}, { lang: string }> {
    constructor(props) {
      super(props)
      this.state = {
        lang: 'th'
      }
      this.translate = this.translate.bind(this)
    }
    public translate(key, data = {}) {
      if (!data) {
        data = {}
      }
      if (!dictionary[this.state.lang][key]) {
        return key + (!Object.keys(data).length ? '' : JSON.stringify(data))
      }
      return Object.keys(data).reduce((result, keyWord) => {
        return result.replace(`$${keyWord}`, data[keyWord])
      }, dictionary[this.state.lang][key])
    }
    public render() {
      return React.createElement<UIWithDictComponentPropTypes>(Component, {
        local: this.state.lang,
        t: this.translate,
        ...this.props
      })
    }
  }

  return hoistNonReactStatic(withTranslate, Component) as React.ComponentClass<O>
}
