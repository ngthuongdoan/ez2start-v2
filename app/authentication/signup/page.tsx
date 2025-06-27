'use client';

import { Surface } from '@/components';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import {
  Button,
  Center,
  Flex,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  TextProps,
  Title
} from '@mantine/core';
import Link from 'next/link';
import classes from './page.module.css';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useSignup } from '@/hooks/auth/useSignup';
const LINK_PROPS: TextProps = {
  className: classes.link,
};
function Page() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: '', password: '', confirmPassword: '', firstName: '', lastName: ''
    },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value && value?.length < 6
          ? 'Password must include at least 6 characters'
          : null,
      confirmPassword: (value, values) =>
        value !== values.password
          ? 'Passwords do not match'
          : null,
      firstName: (value) => (value ? null : 'First name is required'),
      lastName: (value) => (value ? null : 'Last name is required'),
    },
  });
  const { handleSubmit, isPending } = useSignup();
  return (
    <>
      <>
        <title>Sign up | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Title ta="center">Welcome!</Title>
      <Text ta="center">Create your account to continue</Text>

      <Surface component={Paper} className={classes.card}>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'md' }}>
            <TextInput
              label="First name"
              placeholder="John"
              required
              classNames={{ label: classes.label }}
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Last name"
              placeholder="Doe"
              required
              classNames={{ label: classes.label }}
              {...form.getInputProps('lastName')}
            />
          </Flex>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            mt="md"
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
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            required
            mt="md"
            classNames={{ label: classes.label }}
            {...form.getInputProps('confirmPassword')}
          />
          <Button
            fullWidth
            mt="xl"
            type='submit'
            loading={isPending}
            disabled={isPending}
          >
            Create account
          </Button>
          <Center mt="md">
            <Text
              size="sm"
              component={Link}
              href={PATH_AUTH.signin}
              {...LINK_PROPS}
            >
              Already have an account? Sign in
            </Text>
          </Center>
        </form>
      </Surface>
    </>
  );
}

export default Page;
