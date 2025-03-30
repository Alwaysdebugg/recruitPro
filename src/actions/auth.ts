'use server'

import { z } from 'zod'
import { action } from '@/lib/safe-action'
import { ActionResponse } from '@/types/actions'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const loginAction = action(loginSchema, async ({ email, password }): Promise<ActionResponse> => {
  try {
    // 这里实现您的登录逻辑
    // 例如: 调用数据库或认证服务
    const user = await authenticateUser(email, password)
    
    if (!user) {
      return {
        success: false,
        error: '邮箱或密码错误'
      }
    }

    return {
      success: true,
      data: { user }
    }
  } catch (error) {
    return {
      success: false,
      error: '登录过程中发生错误'
    }
  }
}) 