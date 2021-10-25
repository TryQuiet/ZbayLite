import React from 'react'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'
import Typography from '@material-ui/core/Typography'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'

export type TextInputProps = TextFieldProps & {
  errors: DeepMap<FieldValues, FieldError>
  classes: string
}

export const TextInput: React.FC<TextInputProps> = ({ errors, defaultValue, classes, name = '', ...props }) => {
  const hasError = Boolean(errors?.[name])

  return (
    <>
      <TextField
        error={hasError}
        defaultValue={defaultValue}
        name={name}
        className={classes}
        variant={'outlined'}
        {...props}
      />

      <Typography variant='body2' color='error'>
        {errors?.[name]?.message || ''}
      </ Typography>
    </>
  )
}
