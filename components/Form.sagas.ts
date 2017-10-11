// import { Action } from 'redux'
// import { Query } from './Form.container'
// import gql from 'graphql-tag'
// import { takeEvery, put } from 'redux-saga/effects'

// declare global {
//   interface FormUpdateAction extends Action {
//     payload: {
//       fieldName: string
//       value: string
//     }
//   }
// }

// function updateForm(context: ApplicationSagaContext) {
//   return function*(action: FormUpdateAction) {

//     const { apolloClient } = context
//     const { fieldName, value } = action.payload
//     const profileQueryResult: any = apolloClient.readQuery<{ profile: UserProfile }>({
//       query: Query
//     })
//     console.log(profileQueryResult)
//     try {
//       // yield apolloClient.mutate({
//       //   mutation: gql(`
//       //     mutation($record: ProfileInputType!) {
//       //       updateProfile(record: $record) {
//       //         record {
//       //           firstName
//       //           lastName
//       //           _id
//       //         }
//       //       }
//       //     }
//       //   `),
//       //   variables: {
//       //     record: {
//       //       firstName: value,
//       //       lastName: value
//       //     }
//       //   }
//       // })
//       profileQueryResult.profile[fieldName] = value
//       apolloClient.writeQuery({
//         query: Query,
//         data: {
//           ...profileQueryResult
//         }
//       })

//       yield put({ type: 'form/updated' })
//     } catch (e) {
//       console.error(e)
//     }
//   }

// }

// export default function* initialFormSaga(context: ApplicationSagaContext) {
//   console.log('Form Sagas start..')
//   yield takeEvery('form/update', updateForm(context))
// }
