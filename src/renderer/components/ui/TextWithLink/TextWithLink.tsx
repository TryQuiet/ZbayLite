import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.colors.linkBlue
  }
}))

export interface TextWithLinkProps {
  text: string
  links: [
    {
      tag: string
      label: string
      action: () => void
    }
  ]
}

export const TextWithLink: React.FC<TextWithLinkProps> = ({ text, links }) => {
  const classes = useStyles({})

  const format = (action: () => void, label: string) => {
    return (
      <a
        href=''
        className={classes.link}
        onClick={e => {
          e.preventDefault()
          action()
        }}>
        {label}
      </a>
    )
  }

  var parts: (string | JSX.Element)[] = text.split(/(\s+)/);

  links.map(link => {
    for (var i = 1; i < parts.length; i++) {
      if(link.tag === parts[i]) {
        parts[i] = format(link.action, link.label)
      }
    }
  })

  return <div>{parts}</div>;
}

export default TextWithLink
