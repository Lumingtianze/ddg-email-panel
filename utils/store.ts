import { UserInfo } from '../types'

// 统一获取所有账户的逻辑，增加空值处理
export function getAllAccount(): UserInfo[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('user')
  if (!data) return []
  try {
    const res = JSON.parse(data)
    return Array.isArray(res) ? res : []
  } catch (e) {
    return []
  }
}

// 别名方法，匹配 account.tsx 中的调用
export function getAccounts() {
  return getAllAccount()
}

export function getAccount(index: number): UserInfo | null {
  const all = getAllAccount()
  return all[index] || null
}

export function addAccount(userInfo: UserInfo) {
  const allUser = getAllAccount()
  allUser.push(userInfo)
  localStorage.setItem('user', JSON.stringify(allUser))
  return allUser.length - 1
}

// 增加了索引存在性检查，防止覆盖错误
export function editAccount(index: number, userInfo: Partial<UserInfo>) {
  const allUser = getAllAccount()
  if (!allUser[index]) {
    console.error('Account not found')
    return null
  }
  allUser[index] = { ...allUser[index], ...userInfo }
  localStorage.setItem('user', JSON.stringify(allUser))
  return allUser[index]
}

// 补全 account.tsx 需要的删除账户功能
export function removeAccount(index: number) {
  const allUser = getAllAccount()
  if (allUser[index]) {
    allUser.splice(index, 1)
    localStorage.setItem('user', JSON.stringify(allUser))
    return true
  }
  return false
}

export function clear() {
  if (typeof window !== 'undefined') {
    localStorage.clear()
  }
}