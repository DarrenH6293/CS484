'use client'

import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { signIn } from 'next-auth/react';
import Alert from '@mui/material/Alert';

export default function Signup() {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({});
  const [error, setError] = useState(false);

  function handleSignupButton() {
    setOpen(true);
    setFormState({});
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSignup(event) {
    event.preventDefault();
    let valid = event.currentTarget.reportValidity();
    const data = new FormData(event.currentTarget);
    valid = valid && data.get('password') == data.get('passwordConfirmation');
    if (valid) {
      const signUpData = {};
      signUpData['email'] = data.get('email');
      signUpData['password'] = data.get('password');
      signUpData['displayName'] = data.get('displayName');
      signUpData['phone'] = data.get('phone');
      signUpData['role'] = data.get('role');
      // submit form
      fetch("/api/users", {
        method: 'post',
        body: JSON.stringify(signUpData)
      }).then((res) => {
        if (res.ok) {
          signIn("normal", { ...signUpData, redirect: false }).then((result) => {
            if (!result.error) {
              setOpen(false);
              setError(false);
            } else {
              setError(true);
            }
          });
        } else {
          setError(true);
          res.json().then((j) => console.log('error:' + j));
        }
      })
    } else {
      setFormState({ ...formState, passwordConfirmation: { error: true, message: "You're passwords don't match." } })
    }
    return false;
  }

  function validate(input) {
    const name = input.name;
    const valid = input.reportValidity();
    setFormState({ ...formState, [name]: { error: valid } });
  }

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleSignupButton}>Sign-Up</Button>
      {open && <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sign-Up</DialogTitle>
        <form onSubmit={handleSignup}>
          <DialogContent>
            <DialogContentText>
              To sign-up, please fill in your email and create a password.
            </DialogContentText>
            {error ? (
              <Alert severity="error">There was an issue signing up, please adjust email and password and try again.</Alert>
            ) : null}
            <TextField
              autoFocus
              margin="dense"
              id="email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              required
              error={formState.email?.error}
            />
            <TextField
              autoFocus
              margin="dense"
              id="displayName"
              name="displayName"
              label="Display Name"
              type="displayName"
              fullWidth
              variant="standard"
              required
              error={formState.displayName?.error}
            />
            <TextField
              autoFocus
              margin="dense"
              id="phone"
              name="phone"
              label="Phone"
              type="phone"
              fullWidth
              variant="standard"
              required
              error={formState.phone?.error}
            />
            <TextField
              autoFocus
              margin="dense"
              id="role"
              name="role"
              label="Role"
              type="role"
              fullWidth
              variant="standard"
              required
              error={formState.role?.error}
            />
            <TextField
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              required
              fullWidth
              variant='standard' />
            <TextField
              margin="dense"
              name="passwordConfirmation"
              id="passwordConfirmation"
              label="Password Confirmation"
              type="password"
              required
              fullWidth
              error={formState.passwordConfirmation?.error}
              helperText={formState.passwordConfirmation?.message}
              variant='standard' />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Sign-up</Button>
          </DialogActions>
        </form>
      </Dialog>}
    </>
  );
}