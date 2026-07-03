import MuiTextField from '@mui/material/TextField';
import type { ComponentProps, ReactNode } from 'react';

type FormFieldProps = ComponentProps<typeof MuiTextField> & {
  label: string;
  children?: ReactNode;
};

export default function FormField({ label, children, ...props }: FormFieldProps) {
  return (
    <MuiTextField label={label} fullWidth margin="normal" {...props}>
      {children}
    </MuiTextField>
  );
}
