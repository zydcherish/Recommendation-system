<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-card">
        <h2>个人信息</h2>
        
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="profile-form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="form.username" 
              :disabled="!isEditing"
              placeholder="请输入用户名"
            />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input 
              v-model="form.email" 
              :disabled="!isEditing"
              placeholder="请输入邮箱"
            />
          </el-form-item>
          
          <el-form-item label="手机号码" prop="phone">
            <el-input 
              v-model="form.phone" 
              :disabled="!isEditing"
              placeholder="请输入手机号码"
            />
          </el-form-item>

          <el-form-item>
            <template v-if="!isEditing">
              <el-button type="primary" @click="handleEdit">编辑信息</el-button>
              <el-button @click="handleChangePassword">修改密码</el-button>
            </template>
            <template v-else>
              <el-button type="primary" @click="handleSave">保存</el-button>
              <el-button @click="handleCancel">取消</el-button>
            </template>
          </el-form-item>
        </el-form>
      </div>

      <!-- 修改密码对话框 -->
      <el-dialog
        v-model="passwordDialogVisible"
        title="修改密码"
        width="500px"
      >
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              show-password
              placeholder="请输入原密码"
            />
          </el-form-item>
          
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              show-password
              placeholder="请输入新密码"
            />
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入新密码"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="passwordDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handlePasswordChange">
              确认修改
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { getUserInfo, updateUserInfo, changePassword } from '@/api/auth'

const userStore = useUserStore()
const formRef = ref(null)
const passwordFormRef = ref(null)
const isEditing = ref(false)
const passwordDialogVisible = ref(false)

// 表单数据
const form = reactive({
  username: '',
  email: '',
  phone: ''
})

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 密码验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo()
    if (res.code === 200 && res.data) {
      Object.assign(form, res.data)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 编辑信息
const handleEdit = () => {
  isEditing.value = true
}

// 取消编辑
const handleCancel = () => {
  isEditing.value = false
  fetchUserInfo() // 重新获取用户信息
}

// 保存信息
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const res = await updateUserInfo(form)
    
    if (res.code === 200) {
      ElMessage.success('保存成功')
      isEditing.value = false
      await fetchUserInfo() // 重新获取用户信息
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败')
  }
}

// 打开修改密码对话框
const handleChangePassword = () => {
  passwordDialogVisible.value = true
  // 重置表单
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 修改密码
const handlePasswordChange = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    const res = await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
      // 清空表单
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error(error.message || '修改密码失败')
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  padding: 40px 0;
  background-color: var(--background-color);

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .profile-card {
    background: #fff;
    border-radius: 8px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 24px;
      margin-bottom: 32px;
      color: var(--text-color);
      display: flex;
      align-items: center;
      
      &::before {
        content: '';
        width: 4px;
        height: 20px;
        background-color: var(--primary-color);
        margin-right: 8px;
        border-radius: 2px;
      }
    }
  }

  .profile-form {
    max-width: 500px;
    margin: 0 auto;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 20px 0;

    .profile-card {
      padding: 20px;
    }
  }
}
</style> 