<template>
  <div class="config-settings-page">
    <ElCard shadow="never">
      <template #header>
        <div class="card-header">
          <span>系统配置</span>
        </div>
      </template>

      <ElForm ref="formRef" :model="formData" :rules="rules" label-width="150px">
        <ElDivider content-position="left">微信配置</ElDivider>
        <ElFormItem label="微信AppID" prop="wechatAppid">
          <ElInput v-model="formData.wechatAppid" placeholder="请输入微信小程序AppID" />
        </ElFormItem>
        <ElFormItem label="微信Secret" prop="wechatSecret">
          <ElInput
            v-model="formData.wechatSecret"
            type="password"
            placeholder="请输入微信小程序Secret"
            show-password
          />
        </ElFormItem>
        <ElFormItem label="微信Token" prop="wechatToken">
          <ElInput v-model="formData.wechatToken" placeholder="请输入微信Token" />
        </ElFormItem>

        <ElDivider content-position="left">七牛云存储配置</ElDivider>
        <ElFormItem label="AccessKey" prop="qiniuAccessKey">
          <ElInput
            v-model="formData.qiniuAccessKey"
            type="password"
            placeholder="请输入七牛AccessKey"
            show-password
          />
        </ElFormItem>
        <ElFormItem label="SecretKey" prop="qiniuSecretKey">
          <ElInput
            v-model="formData.qiniuSecretKey"
            type="password"
            placeholder="请输入七牛SecretKey"
            show-password
          />
        </ElFormItem>
        <ElFormItem label="Bucket" prop="qiniuBucket">
          <ElInput v-model="formData.qiniuBucket" placeholder="请输入七牛Bucket" />
        </ElFormItem>
        <ElFormItem label="域名" prop="qiniuDomain">
          <ElInput v-model="formData.qiniuDomain" placeholder="请输入七牛域名" />
        </ElFormItem>

        <ElFormItem>
          <ElButton type="primary" @click="handleSubmit">保存配置</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { fetchGetConfig, fetchUpdateConfig } from '@/api/config'

  defineOptions({ name: 'ConfigSettings' })

  const formRef = ref<FormInstance>()

  const formData = reactive({
    wechatAppid: '',
    wechatSecret: '',
    wechatToken: '',
    qiniuAccessKey: '',
    qiniuSecretKey: '',
    qiniuBucket: '',
    qiniuDomain: ''
  })

  const rules: FormRules = {
    wechatAppid: [{ required: false, message: '请输入微信AppID', trigger: 'blur' }],
    qiniuDomain: [{ required: false, message: '请输入七牛Domain', trigger: 'blur' }]
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      await fetchUpdateConfig(formData)
      ElMessage.success('保存成功')
    } catch (error) {
      console.error('保存配置失败:', error)
    }
  }

  const handleReset = () => {
    loadConfig()
  }

  const loadConfig = async () => {
    try {
      const data = await fetchGetConfig()
      Object.assign(formData, data)
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }

  onMounted(() => {
    loadConfig()
  })
</script>

<style scoped lang="scss">
  .config-settings-page {
    padding: 0;

    .card-header {
      font-weight: bold;
      font-size: 16px;
    }
  }
</style>
