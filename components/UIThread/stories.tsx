import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Layout from '../Layout'
import CommentContainer, { Component as CommentComponent } from './components/UIComment'

storiesOf("UIThread/UIComment", module)
  .addDecorator(story => (
    <Layout>
      <div>
        {story()}
      </div>
    </Layout>
  ))
  .add("container", () => (
    <CommentContainer commentConnection={{ pageInfo: { hasPreviousPage: false }, edges: [] }} _id=" " isLoggedIn user={{ _id: "1", profilePicture: null, name: "test" }} message="test message\ntest message line 2" onReply={action('reply')} />
  ))
  .add("withoutData", () => (
    <CommentComponent _id=" " message="A" />
  ))
  .add("withData", () => (
    <CommentComponent _id=" " isLoggedIn user={{ _id: "1", profilePicture: null, name: "test" }} message="test message\ntest message line 2" />
  ))
  .add("long time ago", () => (
    <CommentComponent _id=" " isLoggedIn user={{ _id: "1", profilePicture: null, name: "test" }} message="test message\ntest message line 2" createdAt={"2017-04-27T07:28:33.657Z"} />
  ))
  .add("multiple comment", () => (
    <div>
      <CommentComponent _id="1" isLoggedIn user={{ _id: "1", profilePicture: null, name: "test" }} message="test message\ntest message line 2" createdAt={"2017-04-27T07:28:33.657Z"} />
      <CommentComponent _id="2" isLoggedIn user={{ _id: "1", profilePicture: null, name: "test" }} message="test message\ntest message line 2" createdAt={"2017-04-27T07:28:33.657Z"} />
      <CommentComponent _id="3" isLoggedIn user={{ _id: "1", profilePicture: null, name: "test" }} message="test message\ntest message line 2" createdAt={"2017-04-27T07:28:33.657Z"} />
    </div>
  ))
  .add("multi comment with reply", () => (
    <div>
      <CommentComponent _id="1" isLoggedIn user={{ _id: "1", profilePicture: null, name: "test" }} message="first" />
      <CommentComponent
        _id="1"
        isLoggedIn
        user={{ _id: "1", profilePicture: null, name: "test" }}
        message="test message\ntest message line 2"
        createdAt={"2017-04-27T07:28:33.657Z"}
        comments={[
          {
            _id: "1",
            user: { _id: "1", profilePicture: null, name: "mr.b" },
            message: "reply test 1\n line 2",
            createdAt: ""
          },
          {
            _id: "2",
            user: { _id: "1", profilePicture: null, name: "mr.c" },
            message: "reply test 1\n line 2",
            createdAt: ""
          }
        ]}
      />
      <CommentComponent _id="1" isLoggedIn user={{ _id: "1", profilePicture: null, name: "test" }} message="second" />
    </div>
  ))
  .add("with reply box", () => (
    <CommentComponent
      _id="1"
      isLoggedIn
      user={{ _id: "1", profilePicture: null, name: "test" }}
      message="test message\ntest message line 2"
      createdAt={"2017-04-27T07:28:33.657Z"}
      onReply={action('reply')}
      showReplyInput
      replyMessage="test message reply"
    />
  ))
  .add("with reply and reply box", () => (
    <div>
      <CommentComponent
        _id="1"
        isLoggedIn
        user={{ _id: "1", profilePicture: null, name: "test" }}
        message="test message\ntest message line 2"
        createdAt={"2017-04-27T07:28:33.657Z"}
        comments={[{
          _id: "2",
          user: { _id: "1", profilePicture: null, name: "mr.b" },
          message: "reply test 1\n line 2",
          createdAt: (new Date()).toISOString()
        }]}
        onReply={action('reply')}
      />
      <CommentComponent
        _id="2"
        isLoggedIn
        user={{ _id: "1", profilePicture: null, name: "test" }}
        message="test message\ntest message line 2"
        createdAt={"2017-04-27T07:28:33.657Z"}
        comments={[{
          _id: "1",
          user: { _id: "1", profilePicture: null, name: "mr.b" },
          message: "reply test 1\n line 2",
          createdAt: (new Date()).toISOString()
        }]}
        showReplyInput
        replyMessage="test message reply"
        onReply={action('reply')}
      />
      <CommentComponent
        _id="3"
        isLoggedIn
        user={{ _id: "1", profilePicture: null, name: "test" }}
        message="test message\ntest message line 2"
        createdAt={"2017-04-27T07:28:33.657Z"}
        comments={[{
          _id: "4",
          user: { _id: "1", profilePicture: null, name: "mr.b" },
          message: "reply test 1\n line 2",
          createdAt: ""
        }]}
      />
    </div>
  ))
