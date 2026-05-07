import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'
import { 
  UserCircleIcon, 
  TrashIcon, 
  UserPlusIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import * as store from '../utils/store'
import type { UserInfo } from '../types'

const AccountPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('')
  const [accounts, setAccounts] = useState<UserInfo[]>([])
  const [activeId, setActiveId] = useState<number>(0)

  useEffect(() => {
    const allAccounts = store.getAccounts()
    setAccounts(allAccounts)
    
    const { id } = router.query
    if (id !== undefined) {
      setActiveId(Number(id))
    }
  }, [router.query])

  const handleSwitch = (index: number) => {
    localStorage.lastuser = index
    router.push({
      pathname: '/email',
      query: { id: index }
    })
  }

  const handleDelete = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(t('Are you sure you want to remove this account?'))) {
      store.removeAccount(index)
      const updated = store.getAccounts()
      setAccounts(updated)
      if (updated.length === 0) {
        router.push('/login')
      } else {
        router.push({ pathname: '/account', query: { id: 0 } })
      }
    }
  }

  return (
    <Layout
      title={t('nav.account')}
      className="max-w-xl mx-auto p-4"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('nav.account')}</h2>
        <button
          onClick={() => router.push('/login')}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors shadow-sm"
        >
          <UserPlusIcon className="w-4 h-4 mr-1.5" />
          {t('Add')}
        </button>
      </div>

      {/* Account List */}
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account, index) => {
          const isActive = activeId === index
          return (
            <div
              key={index}
              onClick={() => handleSwitch(index)}
              className={`group relative flex flex-col p-4 transition-all border rounded-2xl cursor-pointer ${
                isActive 
                  ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-900/20 ring-1 ring-sky-500' 
                  : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Top Row: User Info */}
              <div className="flex items-start space-x-3">
                <div className={`shrink-0 p-2 rounded-xl ${isActive ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  <UserCircleIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-100 break-all text-base">
                    {account.username}@duck.com
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 break-all mt-0.5">
                    {account.remark || 'DuckDuckGo User'}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Actions & Status (Mobile Optimized) */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center">
                  {isActive ? (
                    <span className="flex items-center text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      <CheckBadgeIcon className="w-3.5 h-3.5 mr-1" />
                      {t('Active')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      {t('Click to switch')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDelete(index, e)}
                    className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    title={t('Delete')}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {accounts.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <UserCircleIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">{t('No accounts found')}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
    },
  }
}

export default AccountPage