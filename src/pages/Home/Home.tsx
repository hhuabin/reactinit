import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Space, Toast } from 'antd-mobile'

import { baseRequest } from '@/api/axios'
import { baseRequest as fetchReq } from '@/api/fetch'
import home from './home.module.less'

import Loading from '@/components/Loading/Loading'

const Home: React.FC = () => {

    const navigate = useNavigate()

    const controller = useRef<AbortController>(new AbortController())

    const axiosRequest = () => {
        cancelRequest()
        const { signal } = controller.current
        baseRequest({
            cancelLoading: true,
            cancelLastRequest: true,
        }, {
            signal,
        })
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            Toast.show({
                content: error.data?.err_msg || "未知错误",
                duration: 3000,
            })
        })
    }

    const fetchRequest = () => {
        fetchReq({
            cancelLastRequest: true,
        })
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        })
    }

    const cancelRequest = () => {
        controller.current.abort()
        controller.current = new AbortController()
    }

    const goToSvgIcon = () => {
        navigate('/svgIcon')
    }

    return (
        <>
            <div className={home.home}>
                <Loading></Loading>
                <Space wrap>
                    <Button color='primary' fill='solid'>
                        Solid
                    </Button>
                    <Button color='primary' fill='outline'>
                        Outline
                    </Button>
                    <Button color='primary' fill='none'>
                        None
                    </Button>
                    <Button color='primary' fill='outline' onClick={() => axiosRequest()}>
                        Request
                    </Button>
                    <Button color='primary' fill='outline' onClick={() => fetchRequest()}>
                        fetchRequest
                    </Button>
                    <Button color='primary' fill='outline' onClick={() => goToSvgIcon()}>
                        goToSvgIcon
                    </Button>
                </Space>
            </div>
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet our leadership</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">Libero fames augue nisl porttitor nisi, quis. Id ac elit odio vitae elementum enim vitae ullamcorper suspendisse.</p>
                    </div>
                    <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                        <li>
                            <div className="flex items-center gap-x-6">
                                <img className="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                <div>
                                    <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">Leslie Alexander</h3>
                                    <p className="text-sm font-semibold leading-6 text-indigo-600">Co-Founder / CEO</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Home
