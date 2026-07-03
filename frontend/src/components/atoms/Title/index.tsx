import Typography, { TypographyProps } from '@mui/material/Typography';

export default function Title({ children, ...props }: TypographyProps) {
  return (
    <Typography variant="h5" component="h1" gutterBottom {...props}>
      {children}
    </Typography>
  );
}
