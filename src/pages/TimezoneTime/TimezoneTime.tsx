import { useEffect, useState } from 'react'

import createAnimation from '@/utils/functionUtils/requestAnimationFrame'
import { getDateStrByTimeAndCurrentOffset } from '@/utils/stringUtils/dateUtils'

const TimezoneTime: React.FC = () => {

    const [timezone, setTimezone] = useState({
        '夏威夷时间': '1970-01-01 00:00:00',         // 西十二区
        '阿拉斯加时间': '1970-01-01 00:00:00',       // 西十一区
        '复活节岛时间': '1970-01-01 00:00:00',       // 西六区
        '美国时间': '1970-01-01 00:00:00',           // 西五区
        '伦敦时间': '1970-01-01 00:00:00',           // 中时区
        '柏林时间': '1970-01-01 00:00:00',           // 东一区
        '雅典时间': '1970-01-01 00:00:00',           // 东二区
        '莫斯科时间': '1970-01-01 00:00:00',         // 东三区
        '曼谷时间': '1970-01-01 00:00:00',           // 东七区
        '北京时间': '1970-01-01 00:00:00',           // 东八区
        '日本时间': '1970-01-01 00:00:00',           // 东九区
        '圣诞岛时间': '1970-01-01 00:00:00',         // 东十四区
    })

    useEffect(() => {
        // getTimezoneTime()
        const animation = createAnimation(getTimezoneTime, Number.MAX_VALUE, 200)
        animation.start()

        return () => {
            animation.stop()
        }
    }, [])

    const getTimezoneTime = () => {
        const Hawaii = getDateStrByTimeAndCurrentOffset(Date.now(), 720, 'YYYY-MM-DD hh:mm:ss:mss')
        const Alaska = getDateStrByTimeAndCurrentOffset(Date.now(), 660, 'YYYY-MM-DD hh:mm:ss:mss')
        const EasterIsland = getDateStrByTimeAndCurrentOffset(Date.now(), 360, 'YYYY-MM-DD hh:mm:ss:mss')
        const NewYork = getDateStrByTimeAndCurrentOffset(Date.now(), 300, 'YYYY-MM-DD hh:mm:ss:mss')
        const London = getDateStrByTimeAndCurrentOffset(Date.now(), 0, 'YYYY-MM-DD hh:mm:ss:mss')
        const Berlin = getDateStrByTimeAndCurrentOffset(Date.now(), -60, 'YYYY-MM-DD hh:mm:ss:mss')
        const Athens = getDateStrByTimeAndCurrentOffset(Date.now(), -120, 'YYYY-MM-DD hh:mm:ss:mss')
        const Moscow = getDateStrByTimeAndCurrentOffset(Date.now(), -180, 'YYYY-MM-DD hh:mm:ss:mss')
        const Bangkok = getDateStrByTimeAndCurrentOffset(Date.now(), -420, 'YYYY-MM-DD hh:mm:ss:mss')
        const Beijing = getDateStrByTimeAndCurrentOffset(Date.now(), -480, 'YYYY-MM-DD hh:mm:ss:mss')
        const Japan = getDateStrByTimeAndCurrentOffset(Date.now(), -540, 'YYYY-MM-DD hh:mm:ss:mss')
        const ChristmasIsland = getDateStrByTimeAndCurrentOffset(Date.now(), -840, 'YYYY-MM-DD hh:mm:ss:mss')

        setTimezone((prev) => ({
            ...prev,
            '夏威夷时间': Hawaii,
            '阿拉斯加时间': Alaska,
            '复活节岛时间': EasterIsland,
            '美国时间': NewYork,
            '伦敦时间': London,
            '柏林时间': Berlin,
            '雅典时间': Athens,
            '莫斯科时间': Moscow,
            '曼谷时间': Bangkok,
            '北京时间': Beijing,
            '日本时间': Japan,
            '圣诞岛时间': ChristmasIsland,
        }))
    }

    return (
        <div className='relative w-full min-h-screen p-2 box-border text-[var(--color-text)] text-[18px] leading-[32px]'>
            <ul className='absolute top-1/2 left-1/2 px-32 py-16 rounded-lg translate-y-[-50%] translate-x-[-50%] [box-shadow:var(--box-shadow)]'>
                {
                    Object.keys(timezone).map((key) => (
                        <li className='flex even:text-[var(--primary-color)]' key={key}>
                            <div className='w-[150px] text-right'>{ key + '：' }</div>
                            <div className=''>{ timezone[key as keyof typeof timezone] }</div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default TimezoneTime
