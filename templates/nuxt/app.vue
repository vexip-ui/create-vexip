<script setup lang="ts">
import { reactive } from 'vue'

import type { PropsOptions } from 'vexip-ui'

interface Model {
  username: string,
  password: string
}

const model = reactive({} as Model)

const providedProps: PropsOptions = {
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
  <VCard class="login">
    <VRow class="login__sign" justify="center" align="middle">
      <VLinker to="https://www.vexipui.com/">
        <img src="/vexip-ui.svg" class="login__logo" alt="Vexip UI Logo" />
      </VLinker>
      <VH1 style="margin: 0">
        Vexip UI
      </VH1>
    </VRow>
    <VConfigProvider :props="providedProps">
      <VForm class="login__form" :model="model" hide-label>
        <VFormItem prop="username">
          <VInput placeholder="Please input username" :prefix="IUser"></VInput>
        </VFormItem>
        <VFormItem prop="password">
          <VInput placeholder="Please input password" type="password" :prefix="ILock"></VInput>
        </VFormItem>
        <VFormItem action>
          <VButton type="success">
            Sign In
          </VButton>
          <VButton type="warning">
            Sign Up
          </VButton>
        </VFormItem>
      </VForm>
    </VConfigProvider>
    <div class="login__tip">
      <VDivider> Click on the Vexip UI logo to learn more </VDivider>
    </div>
  </VCard>
</template>

<style lang="scss">
@import '~/assets/style/index.scss';

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
