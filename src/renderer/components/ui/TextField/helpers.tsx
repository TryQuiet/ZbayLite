import React, { FunctionComponent } from 'react'
import { TextField } from 'formik-material-ui'

interface FormikLinkedTextFieldProps {
  variant: "standard" | "filled" | "outlined", 
  transformer: number, 
  otherField, 
  precise, 
  [s: string]: any
}

export const formikLinkedTextField: FunctionComponent<FormikLinkedTextFieldProps> = ({ 
  variant,
  transformer,
  otherField,
  precise,
  ...props
 }) => {
  const decimalPlaces = precise || 4
  return (
    <TextField
      variant='outlined'
      {...props}
      inputProps={{
        onChange: ({ target: { value } }) => {
          props.form.setFieldValue(props.field.name, value)
          props.form.setFieldValue(otherField, (value * transformer).toFixed(decimalPlaces))
        }
      }}
    />
  )
}
