/* eslint-disable @typescript-eslint/no-explicit-any */

type Task<T extends any[]> = () => Promise<T[number]>

type TaskResult<T> =
  | { status: 'fulfilled'; value: T }         // fulfilled：成功返回
  | { status: 'rejected'; reason: any };      // rejected：失败返回

/**
 * @description 任务并发控制函数，任务数控制在 limit 以内，参考 Promise.all() 使用
 * @param { Task<T>[] } tasks Promise 任务列表
 * @param { number } limit 并发任务数量
 * @returns 全部任务成功时按任务顺序返回所有结果，否则返回第一个失败的错误
 * 该情况 .then() 成功 / 失败状态和 .catch() 都可能会执行
 */
const runTasksWithLimitFailFast = <T extends any[]>(tasks: Task<T>[], limit: number): Promise<T> => (
    new Promise((resolve, reject) => {
        const results: T = [] as unknown as T
        let currentIndex = 0
        let running = 0
        let finished = 0
        let aborted = false // 控制调度中止

        const run = () => {
            if (finished === tasks.length) {
                resolve(results)
                return
            }

            while (running < limit && currentIndex < tasks.length) {
                const i = currentIndex++
                running++

                tasks[i]()
                .then(result => {
                    // 按顺序收集正确结果
                    results[i] = result
                })
                .catch(error => {
                    // 遇到错误则停止执行
                    aborted = true
                    // 收集错误结果
                    // reject(`第${i+1}个任务执行出错，已停止执行，错误信息为：${error}，请检查代码`)
                    reject(error)
                })
                .finally(() => {
                    running--
                    finished++
                    if (!aborted) {
                        run()
                    }
                })
            }
        }

        run()
    })
)

/**
 * @description 任务并发控制函数，任务数控制在 limit 以内，参考 Promise.allSettled() 使用
 * @param { Task<T>[] } tasks Promise 任务列表
 * @param { number } limit 并发任务数量
 * @returns 无论成功失败，全部执行完成后按任务顺序返回状态和结果
 * 该情况只有 .then() 成功状态会执行，故而给予了 status 去判断成功 / 失败状态
 */
const runTasksWithLimitSettled = <T extends any[]>(tasks: Task<T>[], limit: number): Promise<TaskResult<keyof T>[]> => {
    return new Promise((resolve, reject) => {
        const results: TaskResult<keyof T>[] = new Array(tasks.length)
        let currentIndex = 0
        let running = 0
        let finished = 0

        const run = () => {
            if (finished === tasks.length) {
                resolve(results)
                return
            }

            while (running < limit && currentIndex < tasks.length) {
                const i = currentIndex++
                running++

                tasks[i]()
                .then(result => {
                    // 按顺序收集正确结果
                    results[i] = {
                        status: 'fulfilled',
                        value: result as keyof T,
                    }
                })
                .catch(error => {
                    // 按顺序收集错误结果
                    results[i] = {
                        status: 'rejected',
                        reason: error,
                    }
                })
                .finally(() => {
                    running--
                    finished++
                    run()
                })
            }
        }

        run()
    })
}

/* const sleep = (id: number, ms: number) => {
    return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            console.log(`Task ${id} done`)
            resolve('任务失败')
        }, ms)
    })
}

const tasks = [
    () => sleep(1, 1000),
    () => sleep(2, 500),
    () => sleep(3, 300),
    () => sleep(4, 700),
    () => sleep(5, 400),
]

runTasksWithLimitFailFast<[string]>(tasks, 2)
.then(results => console.log(results[0]))
.catch(err => console.log(err))

runTasksWithLimitSettled<[string]>(tasks, 2)
.then(results => {
    if (results[0].status === 'fulfilled') {
        console.log(results[0].value)
    }
}) */
