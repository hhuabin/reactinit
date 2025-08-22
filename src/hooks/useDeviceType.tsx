import { useState, useEffect } from 'react'

type DeviceType = 'mobile' | 'pad' | 'desktop' | 'unknown'

/**
 * @description 获取设备类型
 * @returns { DeviceType } 设备类型
 */
const getDeviceType = (): DeviceType => {
    if (typeof navigator === 'undefined') return 'unknown'
    const ua = navigator.userAgent.toLowerCase()
    if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(ua)) {
        return 'mobile'
    } else if (/ipad|android(?!.*mobile)|tablet/.test(ua)) {
        return 'pad'
    } else if (/mac|windows|linux|x11/.test(ua)) {
        return 'desktop'
    }
    return 'unknown'
}

/**
 * 
 * @returns 
 */
const useDeviceType = () => {

    const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType)

    useEffect(() => {
        const handleResize = () => {
            let newDeviceType = getDeviceType()
            // 可选：通过分辨率修正
            if (window.innerWidth < 768 && deviceType === 'desktop') {
                newDeviceType = 'mobile'
            }
            setDeviceType(newDeviceType)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return {
        deviceType,
        isMobile: deviceType === 'mobile',
    }
}

export default useDeviceType
