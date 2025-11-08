<script setup lang="ts">
import { ref, computed } from 'vue'

// 表单数据
const idCard = ref('')
const phone = ref('')

// 验证错误信息
const idCardError = ref('')
const phoneError = ref('')

// 身份证号验证函数
const validateIdCard = (value: string): string => {
  if (!value) {
    return '请输入身份证号'
  }
  
  // 18位身份证号验证
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
  
  if (!idCardRegex.test(value)) {
    return '身份证号格式不正确（应为18位）'
  }
  
  // 校验码验证（简单版本）
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(value[i]) * weights[i]
  }
  
  const checkCode = checkCodes[sum % 11]
  if (value[17].toUpperCase() !== checkCode) {
    return '身份证号校验码不正确'
  }
  
  return ''
}

// 手机号验证函数
const validatePhone = (value: string): string => {
  if (!value) {
    return '请输入手机号'
  }
  
  // 11位手机号，以1开头
  const phoneRegex = /^1[3-9]\d{9}$/
  
  if (!phoneRegex.test(value)) {
    return '手机号格式不正确（应为11位，以1开头）'
  }
  
  return ''
}

// 实时验证身份证号
const handleIdCardInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  idCard.value = target.value
  idCardError.value = validateIdCard(idCard.value)
}

// 实时验证手机号
const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  phone.value = target.value
  phoneError.value = validatePhone(phone.value)
}

// 表单是否有效
const isFormValid = computed(() => {
  return !idCardError.value && !phoneError.value && idCard.value && phone.value
})

// 提交表单
const handleSubmit = (event: Event) => {
  event.preventDefault()
  
  // 最终验证
  idCardError.value = validateIdCard(idCard.value)
  phoneError.value = validatePhone(phone.value)
  
  if (isFormValid.value) {
    alert('表单验证通过！\n身份证号：' + idCard.value + '\n手机号：' + phone.value)
    // 这里可以添加提交逻辑
  } else {
    alert('请检查表单输入')
  }
}

// 重置表单
const handleReset = () => {
  idCard.value = ''
  phone.value = ''
  idCardError.value = ''
  phoneError.value = ''
}
</script>

<template>
  <div class="form-container">
    <h2>身份信息表单</h2>
    <form @submit="handleSubmit" @reset="handleReset" class="validation-form">
      <div class="form-group">
        <label for="idCard">身份证号：</label>
        <input
          id="idCard"
          v-model="idCard"
          type="text"
          placeholder="请输入18位身份证号"
          maxlength="18"
          @input="handleIdCardInput"
          @blur="idCardError = validateIdCard(idCard)"
          :class="{ 'error': idCardError }"
        />
        <span v-if="idCardError" class="error-message">{{ idCardError }}</span>
        <span v-else-if="idCard && !idCardError" class="success-message">✓ 格式正确</span>
      </div>

      <div class="form-group">
        <label for="phone">手机号：</label>
        <input
          id="phone"
          v-model="phone"
          type="text"
          placeholder="请输入11位手机号"
          maxlength="11"
          @input="handlePhoneInput"
          @blur="phoneError = validatePhone(phone)"
          :class="{ 'error': phoneError }"
        />
        <span v-if="phoneError" class="error-message">{{ phoneError }}</span>
        <span v-else-if="phone && !phoneError" class="success-message">✓ 格式正确</span>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="!isFormValid" class="submit-btn">
          提交
        </button>
        <button type="reset" class="reset-btn">重置</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.validation-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #42b883;
}

input.error {
  border-color: #f56565;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #f56565;
  font-size: 12px;
  margin-top: 0.25rem;
}

.success-message {
  color: #42b883;
  font-size: 12px;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn,
.reset-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn {
  background-color: #42b883;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background-color: #35a372;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #333;
}

.reset-btn:hover {
  background-color: #e0e0e0;
}
</style>
