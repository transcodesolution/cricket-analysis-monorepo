'use client';

import {
  Box,
  Button,
  Center,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './page.module.scss';
import { nextServerSignIn } from '@/libs/web-apis/src';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import Surface from '@/libs/custom/surface';


export default function Page() {
  const router = useRouter();

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value?.length < 8 ? 'Password must include at least 8 characters' : null,
    },
  });

  const handleSignInFormSubmit = form.onSubmit(async ({ email, password }) => {
    try {
      await nextServerSignIn({
        email,
        password,
      });
      router.push('/dashboard');

    } catch (error: any) {
      showNotification({
        message: error?.message || 'Login failed',
        color: 'red',
      });
    }
  });

  return (
    <>
      <title>Sign in | Cricket Analysis</title>
      <meta name="description" content="Cricket Analysis" />
      <Center h="100vh">
        <Box>
          <Title ta="center">Welcome back!</Title>
          <Surface component={Paper} className={classes.card}>
            <form onSubmit={handleSignInFormSubmit} onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSignInFormSubmit();
              }
            }}>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                classNames={{ label: classes.label }}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                classNames={{ label: classes.label }}
                {...form.getInputProps('password')}
              />
              <Button fullWidth mt="xl" type="submit" loading={form.submitting} disabled={form.submitting}>
                Sign in
              </Button>
            </form>
          </Surface>
        </Box>
      </Center>
    </>
  );
};
