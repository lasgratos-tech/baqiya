import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function BigButton(props: Props) {
  return (
    <button
      {...props}
      style={{
        width: '100%',
        padding: 16,
        fontSize: 18,
        marginTop: 12,
        cursor: 'pointer'
      }}
    />
  );
}
