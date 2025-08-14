/**
 * 待开发
 * 兼容多列选择与级联选择
 */
import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

import useTouch from './useTouch'
import styles from './Picker.module.less'

import type { PickerProps } from './Picker.d'

const DEFAULT_DURATION = 200         // 默认动画时长
const INERTIAL_SLIDE_TIME = 300      // 惯性滚动判定时间，在该时间范围内为惯性滚动
const INERTIAL_SLIDE_DISTANCE = 15   // 惯性滚动判定距离
const INERTIAL_SLIDE_DURATION = 1000 // 惯性滚动动画时长
const COLUMN_HEIGHT = 44             // 列高

// 获取中间的数字
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

/**
 * Picker 选择器
 * 原理：通过 touch 事件，记录触摸点位移，根据位移计算滚动距离
 *      使用 animation 改变CSS属性 transform: translateY，实现滚动
 *      实时滚动动画时长为0ms，一般滚动动画时长为 200ms，惯性滚动动画时长为 1000ms
 *      动画使用 Web Animation API，相对于 style 动态改变样式性能更好
 * 功能：
 * 1. 惯性滚动，inertialScrolling()
 * 2. 滚动在较近的一项，updateValueByIndex()
 */
const Picker: React.FC<PickerProps> = (props) => {

    const {
        visible = true,
        columns = [],
        defaultIndex = 0,
        title = '',
        cancelText = '取消',
        confirmText = '确定',
        primaryColor = '#1989fa',
        visibleOptionNum = 6,
    } = props

    const onClickMask = () => {
        onCancel()
    }

    const onCancel = () => {
        props.onCancel?.()
    }

    const onConfirm = () => {
        /* const selectIndex = currentIndex()
        const selectOption = columns[currentIndex()]
        const selectValue = typeof selectOption === 'string' ? selectOption.toString() : selectOption.value
        lastIndex.current = selectIndex
        props.onConfirm?.({ selectIndex, selectOption, selectValue }) */
    }

    return createPortal(
        <div
            className={styles['picker-popup'] + ' ' + (visible ? '' : styles['picker-popup-hidden'])}
            style={{ '--primary-color': primaryColor } as React.CSSProperties}
        >
            <div role='button' className={styles['overlay'] + ' ' + (visible ? '' : styles['overlay-hidden'])}
                onClick={() => onClickMask()}
            ></div>

            <div className={styles['popup-body'] + ' ' + (visible ? '' : styles['popup-hidden'])}>
                <div className={styles['picker-header']}>
                    <button
                        type='button'
                        className={styles['picker-header-cancel-button']}
                        onClick={() => onCancel()}
                    >
                        { cancelText || '取消' }
                    </button>
                    <div className={styles['picker-header-title']}>{ title || '' }</div>
                    <button
                        type='button'
                        className={styles['picker-header-confirm-button']}
                        onClick={() => onConfirm()}
                    >
                        { confirmText || '确定' }
                    </button>
                </div>
                <div
                    className={styles['picker-body']}
                    style={{ height: (+visibleOptionNum * COLUMN_HEIGHT) + 'px' }}
                >
                    {/* <div
                        className={styles['picker-column']}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <ul
                            ref={wrapperElementRef}
                            className={styles['picker-column-wrapper']}
                        >
                            {columns.map((item, index) => (
                                <li
                                    role='button'
                                    tabIndex={index}
                                    className={styles['picker-column-item']}
                                    key={index}
                                    onClick={() => onClickOption(index)}
                                    style={{ color: ((index == currentIndex() && !isInertialScrolling) ? 'var(--primary-color)' : '') }}
                                >
                                    <div className={styles['line-ellipsis']}>
                                        { typeof item === 'string' ? item.toString() : item.label }
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                    <div
                        className={styles['picker-mask']}
                        style={{ backgroundSize: '100% ' + ((+visibleOptionNum - 1) * COLUMN_HEIGHT / 2) + 'px' }}
                    ></div>
                    <div className={styles['picker-frame']}></div>
                </div>
            </div>
        </div>,
        document.body,
    )
}

export default Picker
