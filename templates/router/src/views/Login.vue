<script setup lang="ts">
import { reactive } from 'vue'

import { useBEM } from '@vexip-ui/bem-helper'

interface Model {
  username: string,
  password: string
}

const nh = useBEM('login')
const model = reactive({} as Model)

const providedProps = {
  button: {
    size: 'large'
  },
  input: {
    size: 'large',
    clearable: true
  }
}
</script>

<template>
  <Card :class="nh.b()">
    <Row :class="nh.be('sign')" justify="center" align="middle">
      <Linker to="https://www.vexipui.com/">
        <img src="/vexip-ui.svg" :class="nh.be('logo')" alt="Vexip UI Logo" />
      </Linker>
      <H1 style="margin: 0">
        Vexip UI
      </H1>
    </Row>
    <ConfigProvider :props="providedProps">
      <Form :class="nh.be('form')" :model="model" hide-label>
        <FormItem prop="username">
          <Input placeholder="Please input username" :prefix="IUser"></Input>
        </FormItem>
        <FormItem prop="password">
          <Input placeholder="Please input password" type="password" :prefix="ILock"></Input>
        </FormItem>
        <FormItem action>
          <Button type="success">
            Sign In
          </Button>
          <Button type="warning">
            Sign Up
          </Button>
        </FormItem>
      </Form>
    </ConfigProvider>
    <div :class="nh.be('tip')">
      <Divider> Click on the Vexip UI logo to learn more </Divider>
    </div>
  </Card>
</template>

<style lang="scss">
.login {
  max-width: 480px;
  padding: 10px;

  &__sign {
    user-select: none;
  }

  &__logo {
    height: 6em;
    padding: 1em;
    will-change: filter;
  }

  &__form {
    padding: 20px;
  }

  &__tip {
    padding: 0 20px;
  }
}
</style>
