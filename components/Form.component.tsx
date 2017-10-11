// import * as React from 'react'
// import { withProps } from 'recompose'
// import { InputTextMultiline } from '../components/common/Input'

// const InputField = withProps<{ onChange: any, value: any}, { value: string, fieldName: string, onChange: (fieldName: string, value: string) => void }>(
//   (props) => ({
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//       props.onChange(props.fieldName, e.target.value)
//     },
//     value: props.value
//   })
// )(({ onChange, value }) => React.createElement('input', { value, onChange}))

// interface FormPropTypes {
//   loading: boolean;
//   onChange: (fieldName: string, value: string) => void
// }
// export default class Form extends React.Component<FormPropTypes, {}> {
//   public render() {
//     console.log('render form')
//     const {  onChange } = this.props
//     return (
//       <div>
//         {'firstName' + value.firstName}
//         <InputTextMultiline />
//         {<InputField value={value.firstName} fieldName={'firstName'} onChange={this.props.onChange} />}
//         {<InputField value={value.lastName} fieldName={'firstName'} onChange={this.props.onChange} />}
//       </div>
//     )
//   }
// }
