
// import { graphql, compose, withApollo } from 'react-apollo'
// import { connect } from 'react-redux'
// import FormComponent from './Form.component'

// import gql from 'graphql-tag';

// export const Query = gql(`
//   query {
//     profile {
//       _id
//       firstName
//       lastName
//     }
//   }
// `)

// export default compose(
//   connect((state) => {
//     console.log(state.global.loading)
//     return {
//       loading: state.global.loading,
//       // value: {firstName: 'ja', lastName: 'ji'}
//     }
//   }, (dispatch) => ({
//     onChange: (fieldName: string, value: string) => {
//       dispatch({ type: 'form/update', payload: { fieldName, value } })
//     }
//   })),
//   withApollo,
//   graphql<{ profile: UserProfile }, { client: ApplicationApolloClient }>(Query, {
//     options: {
//       fetchPolicy: 'cache-and-network'
//     },
//     props: ({ data, ownProps }) => {

//       if (data.profile) {
//         // There is an apollo bug
//         // data from writeQuery outside HOC wont update
//         // this workaround will be just for temporary
//         return ({
//           value: (ownProps.client.readQuery({query: Query}) as any).profile
//         })
//       }
//       return ({ value: data.profile || { firstName: '', lastName: '' } })
//     }
//   }),
// )(FormComponent)
