import * as React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class PageDocument extends Document {
  public props: {
    styleTags: any
  }
  public static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage((App) => (props) => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()

    return { ...page, styleTags }
  }

  public render() {
    return (
      <html>
        <Head>
          <meta charSet='utf-8' className='next-head' />
          <meta id='vp' name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' /> {/* tslint:disable-line */}
          <link rel='stylesheet' href='/static/fonts/DBHeaventRounded/stylesheet.css' />
          <link rel='stylesheet' href='/static/fonts/Lanna/stylesheet.css' />
          {this.props.styleTags}
        </Head>
        <body>
          <div className='root'>
            <Main />
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}
