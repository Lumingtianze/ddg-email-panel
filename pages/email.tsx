import type { GetStaticProps, NextPage } from 'next'
import type { UserInfo } from '../types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { atom, useAtom } from 'jotai'
import { 
  DocumentDuplicateIcon, 
  SparklesIcon, 
  CheckIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid'
import { CgSpinner } from 'react-icons/cg'
import Layout from '../components/Layout/Layout'
import * as store from '../utils/store'
import generateAddresses from '../utils/generateAddresses'

const userIdAtom = atom<number | null>(null)
const userInfoAtom = atom<UserInfo | null>(null)
const loadingAtom = atom<boolean>(true)

const Loading = () => {
  return (
    <Layout
      title={`Loading`}
      className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
    >
      <CgSpinner className="w-10 h-10 text-sky-600 animate-spin" />
    </Layout>
  )
}

const CopyBtn = ({ text, disabled = false }: { text: string; disabled?: boolean }) => {
  const { t } = useTranslation('')
  const [status, setStatus] = useState<boolean>(true)
  
  const handleCopy = () => {
    setStatus(false)
    navigator.clipboard.writeText(text)
    toast.success(t('Copied'))
    setTimeout(() => setStatus(true), 2000)
  }

  return (
    <button
      className="flex items-center justify-center shrink-0 h-10 px-3 md:px-4 text-sm font-medium text-white transition-all rounded-lg shadow-sm bg-sky-600 hover:bg-sky-500 active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed dark:bg-sky-700 dark:hover:bg-sky-600"
      disabled={!status || disabled}
      onClick={handleCopy}
      title={t('Copy')}
    >
      {status ? (
        <DocumentDuplicateIcon className="w-4 h-4 md:mr-2" />
      ) : (
        <CheckIcon className="w-4 h-4 md:mr-2" />
      )}
      <span className="hidden md:inline">{status ? t('Copy') : t('Copied')}</span>
    </button>
  )
}

const Email = () => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)
  const [userId] = useAtom(userIdAtom)
  const [generateBtnStatus, setGenerateBtnStatus] = useState<boolean>(false)
  const { t } = useTranslation('')

  const generateAddressesHandle = () => {
    setGenerateBtnStatus(true)
    generateAddresses(userInfo?.access_token || '')
      .then((res) => {
        const result = store.editAccount(userId || 0, { nextAlias: res.address })
        if (result) setUserInfo(result)
      })
      .catch((res) => toast.error(res?.message || 'Error'))
      .finally(() => setGenerateBtnStatus(false))
  }

  if (userInfo) {
    return (
      <Layout title={t('myemail')} className="flex flex-col min-h-[calc(100vh_-_120px)] items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-5">
          {/* Main Card */}
          <div className="p-4 md:p-5 bg-white border border-slate-200 shadow-sm rounded-2xl dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center mb-3 space-x-2 text-slate-400">
              <EnvelopeIcon className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest">{t('Main Duck Address')}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg md:text-xl font-bold break-all text-slate-800 dark:text-slate-100">
                {userInfo.username}@duck.com
              </p>
              <CopyBtn text={`${userInfo.username}@duck.com`} />
            </div>
          </div>

          {/* Private Card */}
          <div className="p-4 md:p-5 bg-white border border-slate-200 shadow-sm rounded-2xl dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center mb-3 space-x-2 text-slate-400">
              <ShieldCheckIcon className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest">{t('Private Duck Address')}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                {userInfo?.nextAlias === '' ? (
                  <div className="w-full h-6 bg-slate-100 rounded-md animate-pulse dark:bg-slate-700" />
                ) : (
                  <p className="text-lg md:text-xl font-bold break-all text-sky-600 dark:text-sky-400">
                    {userInfo?.nextAlias}@duck.com
                  </p>
                )}
              </div>
              <CopyBtn disabled={userInfo?.nextAlias === ''} text={`${userInfo.nextAlias}@duck.com`} />
            </div>
          </div>

          {/* 重构后的生成按钮 */}
          <button
            className="flex items-center justify-center w-full py-3.5 md:py-4 px-4 transition-all bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-sky-200 dark:shadow-none active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed group"
            disabled={generateBtnStatus}
            onClick={generateAddressesHandle}
          >
            {generateBtnStatus ? (
              <CgSpinner className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <SparklesIcon className="w-5 h-5 mr-2 text-yellow-300 group-hover:rotate-12 transition-transform" />
            )}
            {/* [ 关键修复 ] 使用响应式字号 text-sm -> md:text-lg，并添加 whitespace-nowrap 防止由于窄屏意外换行 */}
            <span className="text-sm md:text-base lg:text-lg font-extrabold tracking-tight whitespace-nowrap">
              {t('Generate Private Duck Address')}
            </span>
          </button>

          {/* Hint Section */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            <div className="flex p-3 text-xs leading-relaxed border border-green-100 bg-green-50/50 text-green-700 rounded-xl dark:bg-green-900/10 dark:border-green-800/30">
              <span className="mr-2">💡</span>
              {t('For untrusted websites, Privacy Duck Addresses can hide your email identity')}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  return null
}

const EmailPage: NextPage = () => {
  const router = useRouter()
  const [, setUserId] = useAtom(userIdAtom)
  const [, setuserInfo] = useAtom(userInfoAtom)
  const [loading, setLoading] = useAtom(loadingAtom)

  useEffect(() => {
    const { id } = router.query
    const lastUser = localStorage.lastuser
    
    // 统一 ID 来源逻辑
    let currentId = id !== undefined ? Number(id) : (lastUser !== undefined ? Number(lastUser) : null)

    if (currentId === null && store.getAccounts().length > 0) {
      currentId = 0
    }

    const userInfo = currentId !== null ? store.getAccount(currentId) : null
    if (userInfo) {
      setUserId(currentId)
      setuserInfo(userInfo)
      setLoading(false)
      // 保持 URL 同步
      localStorage.lastuser = currentId
      if (id === undefined) {
        router.replace({ query: { id: currentId } }, undefined, { shallow: true })
      }
    } else if (store.getAccounts().length > 0) {
      router.push({ query: { id: 0 } })
    } else {
      router.push('/login')
    }
  }, [router.query, router, setLoading, setuserInfo, setUserId])

  if (loading) return <Loading />
  return <Email />
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
    },
  }
}

export default EmailPage