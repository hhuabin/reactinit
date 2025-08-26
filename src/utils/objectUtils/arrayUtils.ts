/* eslint-disable @typescript-eslint/no-explicit-any */

// 百分百准确的数组判断函数（无论对象有没有被篡改过方法）
const isArray = (val: any) => Array.isArray(val)
